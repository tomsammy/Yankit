import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PaymentCancelledPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Cancelled | Yankit</title>
      </Helmet>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-lg shadow-2xl text-center">
            <CardHeader className="items-center p-6">
              <XCircle className="h-16 w-16 text-amber-500 mb-4" />
              <CardTitle className="text-3xl font-extrabold text-foreground">
                Payment Cancelled
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Your payment was not completed. Your shipment has been saved but
                is not yet active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                You can complete your payment at any time from your dashboard.
                If you faced any issues, please feel free to try again or
                contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link to="/my-shipments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to My Shipments
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/support">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentCancelledPage;
