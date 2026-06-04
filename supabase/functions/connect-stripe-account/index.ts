// Supabase Edge Function: connect-stripe-account
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
    // 1. Authenticate user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error("Unauthorized user access");
    }

    const { action } = await req.json();
    const userId = user.id;

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User profile not found");
    }

    if (action === "create-onboarding-link") {
      let stripeAccountId = profile.stripe_connect_id;

      // If the user doesn't have a connected Stripe account yet, create one
      if (!stripeAccountId) {
        const account = await stripe.accounts.create({
          type: "express",
          country: profile.country === "Australia" ? "AU" : "US", // Fallback to US if unspecified
          email: user.email,
          capabilities: {
            transfers: { requested: true },
          },
          business_type: "individual",
          individual: {
            email: user.email,
            first_name: profile.first_name || undefined,
            last_name: profile.surname || undefined,
          },
        });

        stripeAccountId = account.id;

        // Update profile with Stripe Connect account ID
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            stripe_connect_id: stripeAccountId,
            stripe_connect_status: "pending_onboarding",
          })
          .eq("id", userId);

        if (updateError) throw updateError;
      }

      // Generate account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${req.headers.get("origin")}/dashboard?stripe_onboarding=failed`,
        return_url: `${req.headers.get("origin")}/dashboard?stripe_onboarding=success`,
        type: "account_onboarding",
      });

      return new Response(JSON.stringify({ url: accountLink.url }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } 
    
    if (action === "verify-account") {
      const stripeAccountId = profile.stripe_connect_id;
      if (!stripeAccountId) {
        return new Response(JSON.stringify({ connected: false, status: "unconnected" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Retrieve account status from Stripe
      const account = await stripe.accounts.retrieve(stripeAccountId);
      const isDetailsSubmitted = account.details_submitted;

      const newStatus = isDetailsSubmitted ? "connected" : "pending_onboarding";

      if (profile.stripe_connect_status !== newStatus) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ stripe_connect_status: newStatus })
          .eq("id", userId);

        if (updateError) throw updateError;
      }

      return new Response(JSON.stringify({ connected: isDetailsSubmitted, status: newStatus }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid request action specified");
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
