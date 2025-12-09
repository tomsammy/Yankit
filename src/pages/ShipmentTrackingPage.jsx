import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ArrowLeft, Package, User, MapPin } from 'lucide-react';
import useShipmentTracking from '@/hooks/useShipmentTracking';
import ShipmentTrackingTimeline from '@/components/shipments/ShipmentTrackingTimeline';

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
          <Link to="/my-shipments"><ArrowLeft className="mr-2 h-4 w-4" />Back to Shipments</Link>
        </Button>
    </div>
);

const ShipmentTrackingPage = () => {
    const { shipmentId } = useParams();
    const { shipment, trackingEvents, loading, error } = useShipmentTracking(shipmentId);

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
                        <Link to="/my-shipments">
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
                                <ShipmentTrackingTimeline events={trackingEvents} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-primary" />Shipment Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>Item:</strong> {shipment.item_description || "N/A"}</p>
                                <p><strong>Weight:</strong> {shipment.agreed_weight_kg} kg</p>
                                <p><strong>Price:</strong> ${shipment.agreed_price}</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Route</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>From:</strong> {shipment.listing?.origin || "N/A"}</p>
                                <p><strong>To:</strong> {shipment.listing?.destination || "N/A"}</p>
                                <p><strong>Est. Departure:</strong> {shipment.listing?.departure_date ? new Date(shipment.listing.departure_date).toLocaleDateString() : 'N/A'}</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="shadow-md bg-white dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Participants</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <p><strong>Sender:</strong> {shipment.sender_profile?.full_name || "N/A"}</p>
                                <p><strong>Traveler:</strong> {shipment.traveler_profile?.full_name || "N/A"}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default ShipmentTrackingPage;