import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/customSupabaseClient';
import { haversineDistance, getCoords } from '@/lib/distanceUtils';
import { globalAirportsList } from '@/lib/airportData';
import { BASE_EARNING, PER_KM_RATE, YANKIT_SERVICE_FEE_PERCENTAGE, DEFAULT_CURRENCY } from '@/config/constants';

const useSendBaggageForm = () => {
    const { session } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedCost, setEstimatedCost] = useState({ price: 0, serviceFee: 0, totalCost: 0 });

    const form = useForm({
        defaultValues: {
            origin: null,
            destination: null,
            departure_date: null,
            number_of_bags: '',
            item_description: '',
            termsAccepted: false,
        },
    });

    const { watch } = form;
    const origin = watch('origin');
    const destination = watch('destination');
    const numberOfBags = watch('number_of_bags');

    const calculateCost = useCallback(() => {
        const numBags = parseInt(numberOfBags, 10);
        
        if (!origin || !destination || !numBags || numBags <= 0) {
            setEstimatedCost({ price: 0, serviceFee: 0, totalCost: 0 });
            return;
        }

        // Use getCoords to retrieve coordinates based on IATA code (value)
        const originCoords = getCoords(origin.value);
        const destinationCoords = getCoords(destination.value);

        if (originCoords && destinationCoords) {
            const distance = haversineDistance(originCoords, destinationCoords);
            const price = (BASE_EARNING + (distance * PER_KM_RATE)) * numBags;
            const serviceFee = price * YANKIT_SERVICE_FEE_PERCENTAGE;
            const totalCost = price + serviceFee;
            setEstimatedCost({ price, serviceFee, totalCost });
        } else {
            // If coordinates are missing, we can't calculate.
            setEstimatedCost({ price: 0, serviceFee: 0, totalCost: 0 });
        }
    }, [origin, destination, numberOfBags]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'origin' || name === 'destination' || name === 'number_of_bags') {
                calculateCost();
            }
        });
        calculateCost();
        
        return () => subscription.unsubscribe();
    }, [watch, calculateCost]);
    
    const onSubmit = async (data) => {
        if (!session?.user) {
            toast({
                title: "Authentication Error",
                description: "You must be logged in to proceed.",
                variant: "destructive",
            });
            return;
        }

        // Recalculate cost here to ensure data integrity and avoid NaN
        const numBags = parseInt(data.number_of_bags, 10);
        const originCoords = getCoords(data.origin?.value);
        const destinationCoords = getCoords(data.destination?.value);
        
        let finalPrice = 0;
        let finalTotalCost = 0;

        if (originCoords && destinationCoords && numBags > 0) {
             const distance = haversineDistance(originCoords, destinationCoords);
             finalPrice = (BASE_EARNING + (distance * PER_KM_RATE)) * numBags;
             const serviceFee = finalPrice * YANKIT_SERVICE_FEE_PERCENTAGE;
             finalTotalCost = finalPrice + serviceFee;
        }

        if (finalPrice <= 0 || isNaN(finalPrice)) {
             toast({
                title: "Route Unavailable",
                description: "We could not calculate a price for this route. Please check your airport selections.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const shipmentPayload = {
                shipper_user_id: session.user.id,
                origin: data.origin.label,
                destination: data.destination.label,
                departure_date: data.departure_date,
                agreed_weight_kg: 20 * numBags,
                item_description: `${numBags} bag(s). ${data.item_description}`,
                agreed_price: finalPrice, 
                currency: DEFAULT_CURRENCY,
                status: 'pending_payment',
                is_paid: false
            };

            const { data: newShipment, error: insertError } = await supabase
                .from('shipments')
                .insert(shipmentPayload)
                .select()
                .single();

            if (insertError) throw new Error(`Could not create shipment: ${insertError.message}`);

            const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-stripe-checkout-session-for-shipment', {
                body: { 
                    shipmentId: newShipment.id, 
                    totalCost: finalTotalCost, 
                    currency: newShipment.currency,
                    description: `Yankit Shipment from ${newShipment.origin} to ${newShipment.destination}`
                },
            });

            if (checkoutError || checkoutData.error) throw new Error(checkoutError?.message || checkoutData.error.message);

            const stripe = await getStripe();
            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: checkoutData.id });
            if (stripeError) throw new Error(`Stripe Error: ${stripeError.message}`);

        } catch (error) {
            console.error("Error creating shipment:", error);
            toast({
                title: "Operation Failed",
                description: error.message || 'An unexpected error occurred.',
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return {
        form,
        Controller,
        isLoading,
        onSubmit: form.handleSubmit(onSubmit),
        estimatedCost,
    };
};

export default useSendBaggageForm;