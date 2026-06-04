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

    const { shipmentId } = await req.json();
    if (!shipmentId) throw new Error("Missing shipmentId");

    // Fetch the shipment details to verify user is the shipper
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("id", shipmentId)
      .single();

    if (shipmentError || !shipment) {
      throw new Error("Shipment details could not be found");
    }

    if (shipment.shipper_user_id !== user.id) {
      throw new Error("Only the shipper of this package can confirm delivery");
    }

    if (shipment.status !== "in_transit" && shipment.status !== "delivery_pending") {
      throw new Error("This shipment cannot be marked as delivered at this time");
    }

    // 1. Update Shipment status
    const { error: updateShipmentError } = await supabase
      .from("shipments")
      .update({ status: "delivered" })
      .eq("id", shipmentId);

    if (updateShipmentError) throw updateShipmentError;

    // 2. Fetch traveler/yanker connected account status
    const yankerId = shipment.traveler_user_id;

    // 3. Mark Escrow held transaction as released with a 24-hour holdback
    const payoutAvailableAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: updateEscrowError } = await supabase
      .from("escrow_transactions")
      .update({
        yanker_id: yankerId,
        status: "released",
        released_at: new Date().toISOString(),
        payout_available_at: payoutAvailableAt,
      })
      .eq("shipment_id", shipmentId);

    if (updateEscrowError) throw updateEscrowError;

    return new Response(JSON.stringify({ success: true, message: "Delivery confirmed. Funds held for 24-hour verification." }), {
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
