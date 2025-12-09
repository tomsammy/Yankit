import { useState, useEffect, useCallback } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING, BASE_EARNING, PER_KM_RATE } from '@/config/constants';

    export const useYankitNowForm = (userId) => {
      const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departureDate: null,
        numberOfBags: '1',
        availableWeight: MAX_BAGGAGE_WEIGHT_PER_BAG.toString(), 
        termsAccepted: false,
      });
      const [errors, setErrors] = useState({});
      const [isLoading, setIsLoading] = useState(false);
      const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
      const [isCalculatingEarnings, setIsCalculatingEarnings] = useState(false);
      const [estimatedDistance, setEstimatedDistance] = useState(null);
      const [estimatedEarnings, setEstimatedEarnings] = useState(null);
      const { toast } = useToast();

      const isCalculationPending = isCalculatingDistance || isCalculatingEarnings;

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      };

      const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, departureDate: date }));
        if (errors.departureDate) {
          setErrors(prev => ({ ...prev, departureDate: null }));
        }
      };

      const handleAirportChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      };
      
      const handleNumberOfBagsChange = (value) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1) {
          setFormData(prev => ({ ...prev, numberOfBags: '1' }));
        } else if (numValue > MAX_BAGS_PER_LISTING) {
          setFormData(prev => ({ ...prev, numberOfBags: MAX_BAGS_PER_LISTING.toString() }));
          toast({
            variant: "default",
            title: "Max Bags Reached",
            description: `You can list a maximum of ${MAX_BAGS_PER_LISTING} bags.`,
          });
        } else {
          setFormData(prev => ({ ...prev, numberOfBags: value }));
        }
        if (errors.numberOfBags) {
            setErrors(prev => ({ ...prev, numberOfBags: null }));
        }
      };

      const validateForm = () => {
        const newErrors = {};
        if (!formData.origin) newErrors.origin = 'Origin airport is required.';
        if (!formData.destination) newErrors.destination = 'Destination airport is required.';
        if (formData.origin && formData.destination && formData.origin === formData.destination) {
          newErrors.origin = 'Origin and destination cannot be the same.';
          newErrors.destination = 'Origin and destination cannot be the same.';
        }
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required.';
        if (!formData.numberOfBags || parseInt(formData.numberOfBags, 10) < 1) newErrors.numberOfBags = 'Number of bags must be at least 1.';
        if (parseInt(formData.numberOfBags, 10) > MAX_BAGS_PER_LISTING) newErrors.numberOfBags = `Maximum ${MAX_BAGS_PER_LISTING} bags allowed.`;
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions.';
        
        if (estimatedEarnings === null && formData.origin && formData.destination && formData.numberOfBags) {
            newErrors.confirmation = 'Please wait for earnings calculation to complete before submitting.';
        } else if (estimatedEarnings !== null && parseFloat(estimatedEarnings) <=0 && formData.origin && formData.destination && formData.numberOfBags) {
            newErrors.confirmation = 'Calculated earnings are too low. Please check your route or contact support.';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const resetForm = () => {
        setFormData({
          origin: '',
          destination: '',
          departureDate: null,
          numberOfBags: '1',
          availableWeight: MAX_BAGGAGE_WEIGHT_PER_BAG.toString(),
          termsAccepted: false,
        });
        setErrors({});
        setEstimatedDistance(null);
        setEstimatedEarnings(null);
        setIsLoading(false);
      };

      const fetchDistanceAndEarnings = useCallback(async () => {
        if (formData.origin && formData.destination && formData.numberOfBags) {
          setIsCalculatingDistance(true);
          setIsCalculatingEarnings(true);
          setEstimatedDistance(null);
          setEstimatedEarnings(null);
          setErrors(prev => ({ ...prev, confirmation: null })); 

          try {
            const { data: routeData, error: routeError } = await supabase
              .from('flight_routes_data')
              .select('distance_km, base_cost_per_km, service_fee_percentage')
              .eq('origin_iata', formData.origin)
              .eq('destination_iata', formData.destination)
              .single();

            if (routeError || !routeData) {
              let msg = 'Route data not found for this selection. Ensure it is a valid direct route.';
              if(routeError && routeError.code !== 'PGRST116') msg = routeError.message;
              
              toast({ variant: 'destructive', title: 'Calculation Error', description: msg });
              setEstimatedDistance(0); 
              setEstimatedEarnings(0); 
              setIsCalculatingDistance(false);
              setIsCalculatingEarnings(false);
              setErrors(prev => ({ ...prev, confirmation: msg }));
              return;
            }
            
            const distance = parseFloat(routeData.distance_km);
            setEstimatedDistance(distance);
            setIsCalculatingDistance(false);

            const numBags = parseInt(formData.numberOfBags, 10) || 1;
            const earnings = (BASE_EARNING + (distance * PER_KM_RATE)) * numBags;
            
            setEstimatedEarnings(parseFloat(earnings.toFixed(2)));
            setIsCalculatingEarnings(false);
            
             if (parseFloat(earnings.toFixed(2)) <= 0) {
                setErrors(prev => ({ ...prev, confirmation: 'Calculated earnings are too low for this route. Please select a different route or contact support if you believe this is an error.' }));
            } else {
                setErrors(prev => ({ ...prev, confirmation: null }));
            }


          } catch (error) {
            console.error('Error fetching distance/earnings:', error);
            toast({ variant: 'destructive', title: 'Calculation Error', description: error.message });
            setEstimatedDistance(0);
            setEstimatedEarnings(0);
            setIsCalculatingDistance(false);
            setIsCalculatingEarnings(false);
            setErrors(prev => ({ ...prev, confirmation: 'Failed to calculate earnings. Please try again.' }));
          }
        } else {
          setEstimatedDistance(null);
          setEstimatedEarnings(null);
          setIsCalculatingDistance(false);
          setIsCalculatingEarnings(false);
        }
      }, [formData.origin, formData.destination, formData.numberOfBags, toast]);

      useEffect(() => {
        const timer = setTimeout(() => {
          fetchDistanceAndEarnings();
        }, 500); 
        return () => clearTimeout(timer);
      }, [fetchDistanceAndEarnings]);
      
      useEffect(() => {
        if (!userId) {
          setIsLoading(false);
        }
      }, [userId]);

      return {
        formData,
        errors,
        isLoading,
        isCalculatingDistance,
        isCalculatingEarnings,
        estimatedDistance,
        estimatedEarnings,
        handleInputChange,
        handleDateChange,
        handleAirportChange,
        handleNumberOfBagsChange,
        validateForm,
        resetForm,
        isCalculationPending,
      };
    };