import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState('loading');
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No payment session found. Please go to your dashboard to see your shipment status.');
      setStatus('error');
      return;
    }

    if (!session) {
      setStatus('loading');
      return;
    }

    const verifyAndUpdateShipment = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-stripe-payment-and-update-shipment', {
          body: { session_id: sessionId, user_id: session.user.id },
        });
        
        if (error || data.error) throw new Error(error?.message || data.error);

        setShipmentDetails(data.shipment);
        setStatus('success');
      } catch (err) {
        console.error('Verification failed:', err);
        setError(err.message || 'An error occurred while verifying your payment. Please contact support.');
        setStatus('error');
      }
    };

    verifyAndUpdateShipment();
  }, [location.search, session, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Verifying your payment, please wait...</p>
          </div>
        );
      case 'success':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader className="text-center items-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <CardTitle className="text-3xl font-extrabold text-foreground">Payment Successful!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Your shipment is confirmed and we're ready to find a traveler for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              {shipmentDetails && (
                <Card className="bg-slate-50 dark:bg-slate-800/50 p-6 text-left">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Shipment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>From:</strong> {shipmentDetails.origin}</p>
                    <p><strong>To:</strong> {shipmentDetails.destination}</p>
                    <p><strong>Status:</strong> <span className="font-semibold text-primary">{shipmentDetails.status.replace('_', ' ')}</span></p>
                    <p><strong>Shipment ID:</strong> {shipmentDetails.id}</p>
                  </div>
                </Card>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/my-shipments">View My Shipments</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/"><Home className="mr-2 h-4 w-4" /> Go to Homepage</Link>
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader className="text-center items-center p-6">
              <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
              <CardTitle className="text-3xl font-extrabold text-destructive">Payment Verification Failed</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg">
                <Link to="/support">Contact Support</Link>
              </Button>
            </CardContent>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment Status | Yankit</title>
      </Helmet>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          {renderContent()}
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccessPage;