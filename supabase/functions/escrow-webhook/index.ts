// Supabase Edge Function: escrow-webhook
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ESCROW_EMAIL = Deno.env.get("ESCROW_EMAIL")!;
const ESCROW_API_KEY = Deno.env.get("ESCROW_API_KEY")!;
const ESCROW_API_URL = Deno.env.get("ESCROW_API_URL") || "https://api.escrow-sandbox.com/2017-09-01";

Deno.serve(async (req) => {
  try {
    const bodyText = await req.text();
    console.log("Escrow.com Webhook received raw body:", bodyText);

    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return new Response("Invalid JSON payload", { status: 400 });
    }

    const { transaction_id, event } = payload;
    if (!transaction_id) {
      return new Response("Missing transaction_id", { status: 400 });
    }

    // 1. Fetch current transaction details from Escrow.com to verify status (prevents spoofing)
    const authString = btoa(`${ESCROW_EMAIL}:${ESCROW_API_KEY}`);
    const escrowHeaders = {
      "Authorization": `Basic ${authString}`
    };

    console.log(`Fetching Escrow.com transaction details for ID: ${transaction_id}`);
    const response = await fetch(`${ESCROW_API_URL}/transaction/${transaction_id}`, {
      method: "GET",
      headers: escrowHeaders
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Escrow.com transaction details: ${response.statusText}`);
    }

    const txData = await response.json();
    console.log("Escrow.com transaction data verified:", JSON.stringify(txData));

    // Determine current status of transaction
    // Check if the transaction item schedule is secured
    const schedule = txData.items?.[0]?.schedule?.[0];
    const isSecured = schedule?.status?.secured === true;
    const isDisbursed = schedule?.status?.disbursed_to_beneficiary === true;
    
    // Check item level flags
    const itemStatus = txData.items?.[0]?.status || {};
    const isAccepted = itemStatus.accepted === true;
    const isReceived = itemStatus.received === true;
    const isShipped = itemStatus.shipped === true;

    // Map Escrow.com state to local database state
    let localStatus = "created";
    if (isDisbursed) {
      localStatus = "completed";
    } else if (isAccepted) {
      localStatus = "accepted";
    } else if (isReceived) {
      localStatus = "received";
    } else if (isShipped) {
      localStatus = "shipped";
    } else if (isSecured) {
      localStatus = "funded";
    }

    console.log(`Mapped status for Escrow.com transaction ${transaction_id}: ${localStatus}`);

    // 2. Query our database for the matching escrow transaction
    const { data: dbEscrow, error: dbError } = await supabase
      .from("escrow_transactions")
      .select("*")
      .eq("escrow_transaction_id", String(transaction_id))
      .maybeSingle();

    if (dbError) throw dbError;

    if (dbEscrow) {
      // 3. Update the Escrow transaction record
      const updatePayload: any = {
        status: localStatus,
      };

      if (localStatus === "accepted" || localStatus === "completed") {
        updatePayload.released_at = new Date().toISOString();
      }

      const { error: updateEscrowError } = await supabase
        .from("escrow_transactions")
        .update(updatePayload)
        .eq("id", dbEscrow.id);

      if (updateEscrowError) throw updateEscrowError;

      // 4. Update the corresponding shipment record
      const shipmentUpdate: any = {};
      if (localStatus === "funded") {
        shipmentUpdate.is_paid = true;
        // Keep status as 'awaiting_pickup' or similar if it's already there
      }

      if (localStatus === "completed" || localStatus === "accepted") {
        shipmentUpdate.status = "completed";
      }

      if (Object.keys(shipmentUpdate).length > 0) {
        const { error: updateShipmentError } = await supabase
          .from("shipments")
          .update(shipmentUpdate)
          .eq("id", dbEscrow.shipment_id);

        if (updateShipmentError) throw updateShipmentError;
      }
    } else {
      console.warn(`No local escrow record found matching Escrow.com transaction ID: ${transaction_id}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
