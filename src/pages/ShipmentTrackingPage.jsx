import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ArrowLeft, Package, MapPin, Luggage, ShieldCheck, CheckCircle, CreditCard } from 'lucide-react';
import useShipmentTracking from '@/hooks/useShipmentTracking';
import ListingTrackingTimeline from '@/components/listings/ListingTrackingTimeline';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading shipment details...</p>
    </div>
);

const ErrorState = ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive font-semibold">Could not load shipment details.</p>
        <p className="text-muted-foreground text-sm max-w-md">{error || "There was an error fetching the tracking information. Please try again later."}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/my-listings"><ArrowLeft className="mr-2 h-4 w-4" />Back to Shipments</Link>
        </Button>
    </div>
);

const ShipmentTrackingPage = () => {
    const { shipmentId } = useParams();
    const { shipment, trackingEvents, loading, error } = useShipmentTracking(shipmentId);
    const { session } = useAuth();
    const { toast } = useToast();
    const [confirmingDelivery, setConfirmingDelivery] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const handleEscrowPayment = async () => {
        try {
            setIsPaying(true);
            const { data, error: functionError } = await supabase.functions.invoke(
                'create-escrow-transaction',
                {
                    body: {
                        shipmentId,
                        successUrl: `${window.location.origin}/shipment-tracking/${shipmentId}?payment_success=true`,
                        cancelUrl: `${window.location.origin}/shipment-tracking/${shipmentId}?payment_cancelled=true`,
                    },
                }
            );

            if (functionError) throw functionError;
            if (data?.error) throw new Error(data.error);
            if (!data?.url) throw new Error('Escrow checkout URL missing');

            window.location.href = data.url;
        } catch (err) {
            console.error("Escrow payment initiation failed:", err);
            toast({
                title: 'Payment Error',
                description: err.message || 'Unable to start payment.',
                variant: 'destructive',
            });
            setIsPaying(false);
        }
    };

    const handleConfirmDelivery = async () => {
        if (!session?.access_token) return;
        setConfirmingDelivery(true);
        try {
            const { data, error: functionError } = await supabase.functions.invoke("confirm-delivery", {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                body: { shipmentId, action: "confirm" }
            });
            
            if (functionError) throw functionError;
            
            if (data.error && !data.url) throw new Error(data.error);

            if (data.url) {
                toast({
                    title: "Manual Verification Required",
                    description: data.error || "Redirecting you to Escrow.com to confirm receipt.",
                });
                window.open(data.url, "_blank");
                return;
            }

            toast({
                title: "Delivery Confirmed! 🎉",
                description: "Escrow funds have been successfully released.",
            });
            
            // Reload page to update tracking timeline and status
            window.location.reload();
        } catch (err) {
            console.error("Delivery confirmation failed:", err);
            toast({
                variant: "destructive",
                title: "Confirmation Failed",
                description: err.message || "Failed to confirm delivery. Please try again."
            });
        } finally {
            setConfirmingDelivery(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <LoadingState />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorState error={error} />
            </div>
        );
    }
    
    if (!shipment) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorState error="Shipment not found." />
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>Track Shipment - {shipmentId.slice(0, 8)}</title>
                <meta name="description" content={`Tracking information for shipment ${shipmentId}.`} />
            </Helmet>
            <motion.div
                className="container mx-auto px-4 py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <Button asChild variant="outline" size="sm">
                        <Link to="/my-listings">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to My Shipments
                        </Link>
                    </Button>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8">
                    Shipment Tracking
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="shadow-lg bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl">Tracking Details</CardTitle>
                                <CardDescription>Tracking ID: {shipment.id}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ListingTrackingTimeline events={trackingEvents} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        {!shipment.is_paid && shipment.traveler_user_id && shipment.shipper_user_id === session?.user?.id && (
                            <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-yellow-500">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center text-yellow-600 dark:text-yellow-400">
                                        <AlertTriangle className="mr-2 h-5 w-5 animate-pulse" />
                                        Traveler Matched - Escrow Payment Required
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-3">
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        A traveler has agreed to carry your bag! To secure this shipment, you must fund the Escrow.com transaction. The funds will be held securely until delivery.
                                    </p>
                                    <Button
                                        onClick={handleEscrowPayment}
                                        disabled={isPaying}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold py-4 shadow-md flex items-center justify-center gap-2"
                                    >
                                        {isPaying ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CreditCard className="h-4 w-4" />
                                        )}
                                        {isPaying ? "Redirecting..." : `Pay Escrow $${shipment.agreed_price.toFixed(2)}`}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {shipment.is_paid && (
                            <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm border-l-4 border-l-green-500">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center text-green-600 dark:text-green-400">
                                        <ShieldCheck className="mr-2 h-5 w-5" />
                                        Escrow Active
                                    </CardTitle>
                                </CardHeader>
                                    <CardContent className="text-sm space-y-2">
                                        <p className="text-muted-foreground text-xs leading-relaxed">
                                            Payment is held securely by Escrow.com and released to the traveler upon delivery confirmation.
                                        </p>
                                        <p className="text-xs pt-1">
                                            <strong>Escrow Status:</strong>{" "}
                                            {shipment.status === "delivered" || shipment.status === "completed" ? (
                                                <span className="text-green-500 font-semibold">Released to Traveler</span>
                                            ) : (
                                                <span className="text-blue-500 font-semibold">Held Securely</span>
                                            )}
                                        </p>
                                    </CardContent>
                            </Card>
                        )}

                        {shipment.shipper_user_id === session?.user?.id && 
                         ["in_transit", "delivery_pending"].includes(shipment.status) && (
                            <Button 
                                onClick={handleConfirmDelivery}
                                disabled={confirmingDelivery}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-md shadow-lg"
                            >
                                {confirmingDelivery ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                )}
                                Confirm Delivery
                            </Button>
                        )}

                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary" />Shipment Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>Number of Bags:</strong> {shipment.number_of_bags || 0}</p>
                                <p><strong>Weight:</strong> {shipment.agreed_weight_kg} kg</p>
                                <p><strong>Price:</strong> ${shipment.agreed_price}</p>
                                <p><strong>Payment Status:</strong> {shipment.is_paid ? 'Paid' : 'Not Paid'}</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Route</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>From:</strong> {shipment.origin || "N/A"}</p>
                                <p><strong>To:</strong> {shipment.destination || "N/A"}</p>
                                <p><strong>Est. Departure:</strong> {shipment.departure_date ? new Date(shipment.departure_date).toLocaleDateString() : 'N/A'}</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Luggage className="mr-2 h-5 w-5 text-primary" />Bag Details</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>Length:</strong> {shipment.bag_length_cm || "N/A"}cm</p>
                                <p><strong>Width:</strong> {shipment.bag_width_cm || "N/A"}cm</p>
                                <p><strong>Height:</strong> {shipment.bag_height_cm || "N/A"}cm</p>
                                <p><strong>Traveler:</strong> {shipment.traveler_user_id ? 'Matched' : "Not matched" || "N/A"}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default ShipmentTrackingPage;