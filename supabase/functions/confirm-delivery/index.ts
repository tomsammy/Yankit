// Supabase Edge Function: confirm-delivery
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

    const { shipmentId, action } = await req.json(); // action can be "ship" or "confirm"
    if (!shipmentId) throw new Error("Missing shipmentId");

    // 1. Fetch shipment and associated escrow details
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select(`
        *,
        escrow:escrow_transactions(*)
      `)
      .eq("id", shipmentId)
      .single();

    if (shipmentError || !shipment) {
      throw new Error("Shipment details could not be found");
    }

    const escrowRecord = shipment.escrow?.[0];
    if (!escrowRecord || !escrowRecord.escrow_transaction_id) {
      throw new Error("No active Escrow.com transaction found for this shipment");
    }

    const escrowTxId = escrowRecord.escrow_transaction_id;
    const authString = btoa(`${ESCROW_EMAIL}:${ESCROW_API_KEY}`);
    const escrowHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${authString}`
    };

    if (action === "ship") {
      // TRAVELER MARKS AS IN TRANSIT
      if (shipment.traveler_user_id !== user.id) {
        throw new Error("Only the matched yanker can mark this item as in transit");
      }

      console.log(`Traveler marking Escrow.com transaction ${escrowTxId} as shipped...`);
      
      const shipResponse = await fetch(`${ESCROW_API_URL}/transaction/${escrowTxId}`, {
        method: "PATCH",
        headers: escrowHeaders,
        body: JSON.stringify({
          action: "ship",
          shipping_information: {
            tracking_information: {
              carrier: "Hand Carried",
              tracking_id: shipmentId.substring(0, 8)
            }
          }
        })
      });

      if (!shipResponse.ok) {
        const errText = await shipResponse.text();
        console.warn(`Escrow.com ship action failed (user may need to do this manually on portal): ${errText}`);
      }

      // Update local shipment status to In Transit
      const { error: updateShipmentError } = await supabase
        .from("shipments")
        .update({ status: "In Transit" })
        .eq("id", shipmentId);

      if (updateShipmentError) throw updateShipmentError;

      // Update escrow record status
      await supabase
        .from("escrow_transactions")
        .update({ status: "shipped" })
        .eq("id", escrowRecord.id);

      return new Response(JSON.stringify({ success: true, message: "Item marked as in transit and shipped in Escrow." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "confirm") {
      // SHIPPER CONFIRMS DELIVERY
      if (shipment.shipper_user_id !== user.id) {
        throw new Error("Only the shipper of this package can confirm delivery");
      }

      console.log(`Shipper confirming delivery for Escrow.com transaction ${escrowTxId}...`);

      // 1. Mark as received
      const receiveResponse = await fetch(`${ESCROW_API_URL}/transaction/${escrowTxId}`, {
        method: "PATCH",
        headers: escrowHeaders,
        body: JSON.stringify({ action: "receive" })
      });

      if (!receiveResponse.ok) {
        const errText = await receiveResponse.text();
        console.warn(`Escrow.com receive action failed: ${errText}`);
      }

      // 2. Mark as accepted
      const acceptResponse = await fetch(`${ESCROW_API_URL}/transaction/${escrowTxId}`, {
        method: "PATCH",
        headers: escrowHeaders,
        body: JSON.stringify({ action: "accept" })
      });

      if (!acceptResponse.ok) {
        const errText = await acceptResponse.text();
        console.warn(`Escrow.com accept action failed: ${errText}`);
        // Fallback info: Return web link for manual portal acceptance
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Failed to accept automatically. Please complete verification on Escrow.com.",
          url: `https://www.escrow.com/checkout/${escrowTxId}` 
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update shipment status to delivered
      const { error: updateShipmentError } = await supabase
        .from("shipments")
        .update({ status: "delivered" })
        .eq("id", shipmentId);

      if (updateShipmentError) throw updateShipmentError;

      // Update escrow record status
      await supabase
        .from("escrow_transactions")
        .update({ 
          status: "accepted",
          released_at: new Date().toISOString()
        })
        .eq("id", escrowRecord.id);

      return new Response(JSON.stringify({ success: true, message: "Delivery confirmed. Escrow funds released." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      throw new Error("Invalid action parameter");
    }
  } catch (err) {
    console.error("Error processing confirm-delivery action:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
