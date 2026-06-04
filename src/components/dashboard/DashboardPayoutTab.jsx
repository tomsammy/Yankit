import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { CreditCard, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const DashboardPayoutTab = ({ session }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [onboardingUrlLoading, setOnboardingUrlLoading] = useState(false);
  const [connectStatus, setConnectStatus] = useState("unconnected"); // unconnected, pending_onboarding, connected
  const [connectId, setConnectId] = useState("");

  const checkConnectStatus = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("connect-stripe-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { action: "verify-account" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setConnectStatus(data.status || "unconnected");
      
      // Fetch profile directly to read the stripe_connect_id for visual display
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_connect_id")
        .eq("id", session.user.id)
        .single();
        
      if (profile?.stripe_connect_id) {
        setConnectId(profile.stripe_connect_id);
      }
    } catch (err) {
      console.error("Error verifying Stripe account connection:", err);
      toast({
        variant: "destructive",
        title: "Connection Check Failed",
        description: err.message || "Failed to retrieve your Stripe account status.",
      });
    } finally {
      setLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    checkConnectStatus();
  }, [checkConnectStatus]);

  const handleConnectStripe = async () => {
    if (!session?.access_token) return;
    setOnboardingUrlLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("connect-stripe-account", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { action: "create-onboarding-link" },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (data.url) {
        toast({
          title: "Redirecting...",
          description: "Moving you to Stripe onboarding portal.",
        });
        window.location.href = data.url;
      } else {
        throw new Error("Stripe onboarding link generation returned empty.");
      }
    } catch (err) {
      console.error("Stripe Connection Initiation failed:", err);
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message || "Could not generate onboarding portal url.",
      });
    } finally {
      setOnboardingUrlLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (connectStatus) {
      case "connected":
        return (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800 text-sm font-semibold w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span>Fully Connected</span>
          </div>
        );
      case "pending_onboarding":
        return (
          <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-800 text-sm font-semibold w-fit">
            <AlertCircle className="w-4 h-4" />
            <span>Onboarding Incomplete</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800 text-sm font-semibold w-fit">
            <AlertCircle className="w-4 h-4" />
            <span>Disconnected</span>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-background/80 dark:bg-slate-900/80 shadow-xl border-none">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="w-8 h-8 text-primary dark:text-purple-400" />
            <div>
              <CardTitle className="text-2xl font-bold">Stripe Payout Integration</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-400">
                Onboard and configure your bank account link to receive payouts for completed yankings.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Verification State</span>
              {getStatusDisplay()}
            </div>

            {connectId && (
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-700/50">
                <span className="font-medium text-muted-foreground">Connected Stripe Account</span>
                <code className="bg-muted px-2 py-1 rounded text-xs text-foreground font-mono">{connectId}</code>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground dark:text-slate-400 space-y-3">
            <h4 className="font-semibold text-foreground dark:text-white flex items-center">
              <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
              Yankit Escrow & Payout Policy
            </h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Payouts are safely processed directly using Stripe Connect Express.</li>
              <li>When a shipment is paid for by the Shipper, funds are held securely in the Yankit platform escrow.</li>
              <li>Upon delivery, the shipper confirms receipt. This triggers a <strong>24-hour verification holdback</strong> for fraud protection.</li>
              <li>After 24 hours have elapsed, the payout is automatically deposited into your linked balance/bank account.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            {connectStatus === "connected" ? (
              <Button
                onClick={handleConnectStripe}
                disabled={onboardingUrlLoading}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-md shadow-lg"
              >
                {onboardingUrlLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Manage Stripe Connect Account
              </Button>
            ) : (
              <Button
                onClick={handleConnectStripe}
                disabled={onboardingUrlLoading}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2 px-6 rounded-md shadow-lg"
              >
                {onboardingUrlLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {connectStatus === "pending_onboarding" ? "Complete Stripe Setup" : "Connect Stripe Account"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardPayoutTab;
