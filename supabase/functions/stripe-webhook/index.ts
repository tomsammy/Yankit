// Supabase Edge Function: stripe-webhook
import Stripe from "https://esm.sh/stripe@14.25.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe Signature", { status: 400 });
  }

  try {
    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret!);
    } catch (err) {
      return new Response(`Webhook Signature verification failed: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const shipmentId = session.metadata?.shipmentId;

      if (shipmentId) {
        const paymentIntentId = session.payment_intent as string;
        const amount = session.amount_total / 100;
        const currency = session.currency;

        // 1. Update Shipment record in the database
        const { error: shipmentError } = await supabase
          .from("shipments")
          .update({
            is_paid: true,
            status: "awaiting_yanker",
            stripe_payment_intent_id: paymentIntentId,
          })
          .eq("id", shipmentId);

        if (shipmentError) throw shipmentError;

        // 2. Create or verify Escrow record
        const { data: existingEscrow } = await supabase
          .from("escrow_transactions")
          .select("*")
          .eq("shipment_id", shipmentId)
          .maybeSingle();

        if (!existingEscrow) {
          const { error: escrowError } = await supabase
            .from("escrow_transactions")
            .insert({
              shipment_id: shipmentId,
              amount: amount,
              currency: currency,
              stripe_payment_intent_id: paymentIntentId,
              status: "held",
            });

          if (escrowError) throw escrowError;
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
