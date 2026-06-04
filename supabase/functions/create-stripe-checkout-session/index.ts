// Supabase Edge Function: create-stripe-checkout-session
import Stripe from "https://esm.sh/stripe@14.25.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { shipmentId, successUrl, cancelUrl } = await req.json();
    if (!shipmentId) throw new Error("Missing shipmentId");

    // Retrieve shipment details from Supabase to construct pricing dynamically
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", shipmentId)
      .single();

    if (shipmentError || !shipment) {
      throw new Error("Shipment details could not be found");
    }

    if (shipment.shipper_user_id !== user.id) {
      throw new Error("Unauthorized access to this shipment");
    }

    const amountInCents = Math.round(shipment.agreed_price * 100);
    const currency = (shipment.currency || "USD").toLowerCase();

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Yankit Shipment Delivery: ${shipment.origin} to ${shipment.destination}`,
              description: `Baggage space share of ${shipment.agreed_weight_kg}kg (${shipment.number_of_bags} bags)`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        shipmentId: shipment.id,
        shipperId: user.id,
      },
      payment_intent_data: {
        metadata: {
          shipmentId: shipment.id,
          shipperId: user.id,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
