// Supabase Edge Function: payout-cron
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

Deno.serve(async (req) => {
  // Optional security: Validate API key or custom schedule auth header
  const authHeader = req.headers.get("Authorization");
  const expectedToken = Deno.env.get("CRON_SECRET_TOKEN");
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response("Unauthorized cron execution request", { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    // 1. Find released escrows past their 24-hour holdback duration
    const { data: escrows, error: queryError } = await supabase
      .from("escrow_transactions")
      .select(`
        *,
        yanker:profiles!yanker_id(stripe_connect_id, stripe_connect_status)
      `)
      .eq("status", "released")
      .lte("payout_available_at", now)
      .is("stripe_transfer_id", null);

    if (queryError) throw queryError;

    const results = [];

    // 2. Loop and process Stripe Connect transfers
    for (const tx of escrows || []) {
      const stripeConnectId = tx.yanker?.stripe_connect_id;

      if (!stripeConnectId || tx.yanker?.stripe_connect_status !== "connected") {
        console.warn(`Yanker profile for transaction ${tx.id} does not have a verified Stripe Connect account linked.`);
        continue;
      }

      try {
        const amountCents = Math.round(tx.amount * 100);

        // Perform the Stripe transfer to the Yanker's connected Express account
        const transfer = await stripe.transfers.create({
          amount: amountCents,
          currency: tx.currency.toLowerCase(),
          destination: stripeConnectId,
          description: `Yankit completed payout for Shipment ${tx.shipment_id}`,
        });

        // 3. Mark escrow transaction status as completed
        const { error: updateError } = await supabase
          .from("escrow_transactions")
          .update({
            status: "completed",
            stripe_transfer_id: transfer.id,
          })
          .eq("id", tx.id);

        if (updateError) throw updateError;

        results.push({ txId: tx.id, status: "transferred", transferId: transfer.id });
      } catch (transferErr) {
        console.error(`Failed to process Stripe Transfer for escrow transaction ${tx.id}:`, transferErr);
        results.push({ txId: tx.id, status: "failed", error: transferErr.message });
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
