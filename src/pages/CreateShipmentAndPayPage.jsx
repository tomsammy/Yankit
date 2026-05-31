import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard,
  Loader2,
  Package,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getStripe } from "@/lib/stripe";

const STRIPE_SHIPMENT_PRICE_ID = "price_1S1fZKGdi1lKRwhj5miGgAUq";

const CreateShipmentAndPayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shipment, setShipment] = useState(location.state?.shipment || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shipment) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No shipment details found. Please create a shipment request first.",
      });
      navigate("/list-baggage");
    }
  }, [shipment, navigate, toast]);

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }

      const { data, error: functionError } = await supabase.functions.invoke(
        "create-stripe-checkout-session",
        {
          body: {
            priceId: STRIPE_SHIPMENT_PRICE_ID,
            shipmentId: shipment.id,
            successUrl: `${window.location.origin}/shipment-tracking/${shipment.id}?payment_success=true`,
            cancelUrl: `${window.location.origin}/create-shipment-and-pay?payment_cancel=true`,
          },
        },
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } else {
        throw new Error("Could not retrieve Stripe session ID.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError(
        err.message || "An unknown error occurred while initiating payment.",
      );
      toast({
        variant: "destructive",
        title: "Payment Error",
        description:
          err.message || "Failed to initiate payment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!shipment) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-purple-100 dark:from-slate-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg shadow-2xl glassmorphism-subtle border-primary/20 dark:border-secondary/20">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="text-3xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Secure Your Shipment
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              Your payment will be held securely by Yankit and only released to
              the Yanker after successful delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-background/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-lg flex items-center mb-4">
                <Package className="w-6 h-6 mr-3 text-primary" />
                Shipment Summary
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Route:</span>
                  <span className="font-medium text-foreground">
                    {shipment.origin} <ArrowRight className="inline w-4 h-4" />{" "}
                    {shipment.destination}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Item Description:</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {shipment.item_description}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Weight:</span>
                  <span className="font-medium text-foreground">
                    {shipment.agreed_weight_kg} kg
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-3 mt-3">
                  <span className="text-lg font-bold text-foreground">
                    Total Cost:
                  </span>
                  <span className="text-xl font-extrabold text-primary">
                    ${shipment.agreed_price.toFixed(2)} {shipment.currency}
                  </span>
                </div>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Payment Initiation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleProceedToPayment}
              disabled={isLoading}
              className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              {isLoading
                ? "Processing..."
                : `Pay $${shipment.agreed_price.toFixed(2)} Now`}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateShipmentAndPayPage;
