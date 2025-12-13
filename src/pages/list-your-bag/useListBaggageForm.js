import { useForm } from 'react-hook-form';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/AuthContext';
    import { useState, useEffect, useCallback } from 'react';
    import { MAX_BAGGAGE_WEIGHT_PER_BAG, BASE_EARNING, PER_KM_RATE } from '@/config/constants';
    import { haversineDistance, getCoords } from '@/lib/distanceUtils';
    import { parseISO } from 'date-fns';

    export const useListBaggageForm = () => {
        const { session } = useAuth();
        const navigate = useNavigate();
        const location = useLocation();
        const { toast } = useToast();
        const [isCalculating, setIsCalculating] = useState(false);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [estimatedDistance, setEstimatedDistance] = useState(null);
        const [estimatedEarningsPerBag, setEstimatedEarningsPerBag] = useState(null);

        const form = useForm({
            defaultValues: {
                origin: null,
                destination: null,
                departure_date: null,
                number_of_bags: '1',
            },
        });

        const { watch, setError, clearErrors, setValue } = form;
        const origin = watch('origin');
        const destination = watch('destination');
        
        useEffect(() => {
            if (location.state?.searchCriteria) {
                const { origin, destination, date, bags } = location.state.searchCriteria;
                if (origin) setValue('origin', origin);
                if (destination) setValue('destination', destination);
                if (date) setValue('departure_date', parseISO(date));
                if (bags) setValue('number_of_bags', bags.toString());
                // Clear state to prevent re-populating on navigation
                navigate(location.pathname, { replace: true, state: {} });
            }
        }, [location.state, setValue, navigate, location.pathname]);

        const calculateEstimates = useCallback(() => {
            if (origin && destination) {
                setIsCalculating(true);
                setEstimatedDistance(null);
                setEstimatedEarningsPerBag(null);
                
                if (origin?.value === destination?.value) {
                    setError("destination", { type: "manual", message: "Origin and destination airports cannot be the same." });
                    setIsCalculating(false);
                    return;
                }

                const originCoords = getCoords(origin.value);
                const destCoords = getCoords(destination.value);

                if (originCoords && destCoords) {
                    const distance = Math.round(haversineDistance(originCoords, destCoords));
                    const earnings = BASE_EARNING + (distance * PER_KM_RATE);
                    setEstimatedDistance(distance);
                    setEstimatedEarningsPerBag(earnings);
                    clearErrors("destination");
                } else {
                    setEstimatedDistance(null);
                    setEstimatedEarningsPerBag(null);
                }
                setIsCalculating(false);
            } else {
                setEstimatedDistance(null);
                setEstimatedEarningsPerBag(null);
            }
        }, [origin, destination, setError, clearErrors]);
        
        useEffect(() => {
            const debounceTimer = setTimeout(() => {
                calculateEstimates();
            }, 500); 
            
            return () => clearTimeout(debounceTimer);
        }, [origin, destination, calculateEstimates]);

        const onSubmit = form.handleSubmit(async (data) => {
            if (!session?.user) {
                toast({
                    title: "Authentication Error",
                    description: "You must be logged in to list your baggage.",
                    variant: "destructive",
                });
                return;
            }
            
            if (data.origin?.value === data.destination?.value) {
                 toast({
                    title: "Validation Error",
                    description: "Origin and destination cannot be the same.",
                    variant: "destructive",
                });
                return;
            }

            if (estimatedEarningsPerBag === null) {
                toast({
                    title: "Calculation Error",
                    description: "Could not calculate earnings. Please check the selected airports.",
                    variant: "destructive",
                });
                return;
            }

            setIsSubmitting(true);

            try {
                const totalEarnings = estimatedEarningsPerBag * parseInt(data.number_of_bags, 10);
                
                const { error } = await supabase.from('listings').insert({
                    user_id: session.user.id,
                    origin: data.origin.label,
                    destination: data.destination.label,
                    departure_date: data.departure_date,
                    available_space_kg: MAX_BAGGAGE_WEIGHT_PER_BAG * parseInt(data.number_of_bags, 10),
                    number_of_bags: parseInt(data.number_of_bags, 10),
                    total_potential_earnings: totalEarnings,
                    status: 'active',
                    listing_type: 'yanking',
                });

                if (error) {
                    throw error;
                }

                toast({
                    title: "Success!",
                    description: "Your baggage space has been listed.",
                });
                navigate('/my-listings', { state: { activeTab: 'yanking' } });
            } catch (error) {
                console.error("Error creating listing:", error);
                toast({
                    title: "Error Creating Listing",
                    description: error.message || 'An unexpected error occurred.',
                    variant: "destructive",
                });
            } finally {
                setIsSubmitting(false);
            }
        });
        
        return {
            form,
            isCalculating,
            isSubmitting,
            estimatedDistance,
            estimatedEarningsPerBag,
            onSubmit,
        };
    };