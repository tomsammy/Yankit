// Supabase Edge Function: create-escrow-transaction
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ESCROW_EMAIL = Deno.env.get("ESCROW_EMAIL")!;
const ESCROW_API_KEY = Deno.env.get("ESCROW_API_KEY")!;
const ESCROW_API_URL = Deno.env.get("ESCROW_API_URL") || "https://api.escrow-sandbox.com/2017-09-01";

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

    // 1. Fetch shipment, shipper, and traveler profiles
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select(`
        *,
        shipper:shipper_user_id(email, full_name),
        traveler:traveler_user_id(email, full_name)
      `)
      .eq("id", shipmentId)
      .single();

    if (shipmentError || !shipment) {
      throw new Error("Shipment details could not be found");
    }

    if (shipment.shipper_user_id !== user.id) {
      throw new Error("Unauthorized access to this shipment");
    }

    if (!shipment.traveler_user_id) {
      throw new Error("A yanker must be matched before payment can be initiated");
    }

    const shipperEmail = shipment.shipper.email;
    const travelerEmail = shipment.traveler.email;

    // Platform commission is 20%
    const grossPrice = Number(shipment.agreed_price);
    const platformCommission = Math.round(grossPrice * 0.20 * 100) / 100;
    const travelerEarnings = Math.round((grossPrice - platformCommission) * 100) / 100;

    // Basic Auth header for Escrow.com API
    const authString = btoa(`${ESCROW_EMAIL}:${ESCROW_API_KEY}`);
    const escrowHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${authString}`
    };

    // 2. Call Escrow.com to create transaction
    const transactionPayload = {
      parties: [
        {
          role: "buyer",
          customer: shipperEmail
        },
        {
          role: "seller",
          customer: travelerEmail
        },
        {
          role: "broker",
          customer: ESCROW_EMAIL
        }
      ],
      currency: (shipment.currency || "USD").toLowerCase(),
      description: `Yankit baggage sharing from ${shipment.origin} to ${shipment.destination}`,
      items: [
        {
          title: `Delivery: ${shipment.origin} to ${shipment.destination}`,
          description: `Baggage space sharing of ${shipment.agreed_weight_kg}kg (${shipment.number_of_bags} bags)`,
          type: "general_merchandise",
          inspection_period: 86400, // 24 hours in seconds
          quantity: 1,
          schedule: [
            {
              amount: grossPrice,
              payer_customer: shipperEmail,
              beneficiary_customer: travelerEmail,
              broker_commission: platformCommission
            }
          ]
        }
      ]
    };

    console.log("Creating Escrow.com transaction payload:", JSON.stringify(transactionPayload));
    const createTxResponse = await fetch(`${ESCROW_API_URL}/transaction`, {
      method: "POST",
      headers: escrowHeaders,
      body: JSON.stringify(transactionPayload)
    });

    if (!createTxResponse.ok) {
      const errorText = await createTxResponse.text();
      throw new Error(`Failed to create Escrow.com transaction: ${errorText}`);
    }

    const txData = await createTxResponse.json();
    const escrowTxId = txData.id;

    // 3. Get the Checkout Link (landing_page URL) for Card payment
    const paymentMethodsResponse = await fetch(`${ESCROW_API_URL}/transaction/${escrowTxId}/payment_methods/credit_card`, {
      method: "POST",
      headers: escrowHeaders,
      body: JSON.stringify({
        return_url: successUrl
      })
    });

    let checkoutUrl = `https://www.escrow.com/checkout/${escrowTxId}`;
    if (paymentMethodsResponse.ok) {
      const pmData = await paymentMethodsResponse.json();
      if (pmData.landing_page) {
        checkoutUrl = pmData.landing_page;
      }
    }

    // 4. Save the transaction inside Supabase
    // Delete any existing escrow transactions for this shipment first to avoid unique constraints
    await supabase.from("escrow_transactions").delete().eq("shipment_id", shipmentId);

    const { error: insertError } = await supabase
      .from("escrow_transactions")
      .insert({
        shipment_id: shipmentId,
        yanker_id: shipment.traveler_user_id,
        amount: grossPrice,
        currency: shipment.currency || "USD",
        escrow_transaction_id: String(escrowTxId),
        status: "created"
      });

    if (insertError) throw insertError;

    // 5. Update shipment status to pending_payment
    await supabase
      .from("shipments")
      .update({ status: "pending_payment" })
      .eq("id", shipmentId);

    return new Response(JSON.stringify({ url: checkoutUrl, transactionId: escrowTxId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating escrow transaction:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
