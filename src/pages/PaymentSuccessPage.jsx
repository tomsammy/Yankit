import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, CheckCircle, AlertTriangle, Home } from "lucide-react";
import { motion } from "framer-motion";
import { notifyPaymentSuccess } from "@/lib/notify";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState("loading");
  const [shipmentId, setShipmentId] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("Missing payment session.");
      setStatus("error");
      return;
    }

    if (!session) return;

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "verify-stripe-payment-and-update-shipment",
          {
            body: { sessionId },
          },
        );

        if (error) throw error;
        if (!data?.paid) throw new Error("Payment not completed");

        setShipmentId(data.shipmentId);
        setStatus("success");

        await notifyPaymentSuccess({
          to: session.user.email,
        });
      } catch (err) {
        setError(err.message || "Payment verification failed.");
        setStatus("error");
      }
    };

    verify();
  }, [location.search, session]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">
            Verifying your payment…
          </p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CardHeader className="text-center items-center p-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-extrabold">
              Payment Successful
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Your shipment has been paid and is now active.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            {shipmentId && (
              <div className="text-sm text-muted-foreground">
                Shipment ID: <span className="font-medium">{shipmentId}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/my-listings">View My Shipments</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CardHeader className="text-center items-center p-6">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-3xl font-extrabold text-destructive">
            Payment Verification Failed
          </CardTitle>
          <CardDescription className="text-lg mt-2">{error}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild size="lg">
            <Link to="/support">Contact Support</Link>
          </Button>
        </CardContent>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Payment Status | Yankit</title>
      </Helmet>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <Card className="w-full max-w-2xl shadow-2xl">{renderContent()}</Card>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
