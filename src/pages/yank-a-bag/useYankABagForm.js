import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  MAX_BAGGAGE_WEIGHT_PER_BAG,
  MAX_BAGS_PER_LISTING,
  BASE_EARNING,
  PER_KM_RATE,
} from '@/config/constants';
import { haversineDistance, getCoords } from '@/lib/distanceUtils';

export const useYankABagForm = (userId) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    origin: null,
    destination: null,
    departureDate: null,
    numberOfBags: '1',
    bagHandlingAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [estimatedEarnings, setEstimatedEarnings] = useState(null);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleDateChange = (date) => {
    setFormData((p) => ({ ...p, departureDate: date }));
    if (errors.departureDate) setErrors((p) => ({ ...p, departureDate: null }));
  };

  const handleAirportChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleNumberOfBagsChange = (value) => {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1) {
      setFormData((p) => ({ ...p, numberOfBags: '1' }));
    } else if (n > MAX_BAGS_PER_LISTING) {
      setFormData((p) => ({ ...p, numberOfBags: MAX_BAGS_PER_LISTING.toString() }));
      toast({
        title: 'Max Bags Reached',
        description: `Maximum ${MAX_BAGS_PER_LISTING} bags allowed.`,
      });
    } else {
      setFormData((p) => ({ ...p, numberOfBags: value }));
    }
  };

  const validateForm = () => {
    const e = {};

    if (!formData.origin) e.origin = 'Origin airport is required.';
    if (!formData.destination) e.destination = 'Destination airport is required.';

    if (
      formData.origin &&
      formData.destination &&
      formData.origin.value === formData.destination.value
    ) {
      e.origin = e.destination = 'Origin and destination cannot be the same.';
    }

    if (!formData.departureDate) e.departureDate = 'Departure date is required.';
    if (!formData.bagHandlingAccepted)
      e.bagHandlingAccepted = 'You must accept the bag handling agreement.';
    if (isCalculating) e.confirmation = 'Please wait for calculation to finish.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fetchDistanceAndEarnings = useCallback(() => {
    if (!formData.origin?.value || !formData.destination?.value) return;

    setIsCalculating(true);

    const o = getCoords(formData.origin.value);
    const d = getCoords(formData.destination.value);

    if (!o || !d) {
      setIsCalculating(false);
      return;
    }

    const distance = Math.round(haversineDistance(o, d));
    const bags = parseInt(formData.numberOfBags, 10) || 1;
    const total = (BASE_EARNING + distance * PER_KM_RATE) * bags;

    setEstimatedDistance(distance);
    setEstimatedEarnings(Number(total.toFixed(2)));
    setIsCalculating(false);
  }, [formData.origin, formData.destination, formData.numberOfBags]);

  useEffect(() => {
    const t = setTimeout(fetchDistanceAndEarnings, 500);
    return () => clearTimeout(t);
  }, [fetchDistanceAndEarnings]);

  const submitYanking = async () => {
    if (!userId) return false;
    if (!validateForm()) return false;

    setIsSubmitting(true);

    try {
      await supabase.from('yankings').insert({
        yanker_user_id: userId,
        origin: formData.origin.label,
        destination: formData.destination.label,
        departure_date: formData.departureDate,
        number_of_bags: parseInt(formData.numberOfBags, 10),
        available_space_kg:
          parseInt(formData.numberOfBags, 10) * MAX_BAGGAGE_WEIGHT_PER_BAG,
        estimated_distance_km: estimatedDistance,
        estimated_earnings: estimatedEarnings,
        bag_handling_accepted: true,
        status: 'active',
      });

      toast({ title: 'Success', description: 'Yanking listed successfully.' });
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create yanking.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isCalculating,
    estimatedDistance,
    estimatedEarnings,
    handleInputChange,
    handleDateChange,
    handleAirportChange,
    handleNumberOfBagsChange,
    submitYanking,
  };
};
