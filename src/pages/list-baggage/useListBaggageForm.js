import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import {
  MAX_BAGGAGE_WEIGHT_PER_BAG,
  BASE_EARNING,
  PER_KM_RATE,
} from '@/config/constants';
import { haversineDistance, getCoords } from '@/lib/distanceUtils';
import { parseISO } from 'date-fns';
import { YANKIT_SERVICE_FEE_PERCENTAGE } from '../../config/constants';
import { notifyNewActivityCTA } from '@/lib/notify';

export const useListBaggageForm = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [estimatedCostPerBag, setEstimatedCostPerBag] = useState(null);

  const form = useForm({
    defaultValues: {
      origin: null,
      destination: null,
      departure_date: null,
      number_of_bags: '1',
      bag_weight_kg: `${MAX_BAGGAGE_WEIGHT_PER_BAG}`,
      bag_length_cm: '',
      bag_width_cm: '',
      bag_height_cm: '',
      recipient_name: '',
      recipient_contact: '',
      dangerous_goods_declaration: false,
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
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, setValue, navigate, location.pathname]);

  const calculateEstimates = useCallback(() => {
    if (!origin || !destination) {
      setEstimatedDistance(null);
      setEstimatedCostPerBag(null);
      return;
    }

    setIsCalculating(true);

    if (origin.value === destination.value) {
      setError('destination', {
        type: 'manual',
        message: 'Origin and destination airports cannot be the same.',
      });
      setIsCalculating(false);
      return;
    }

    const o = getCoords(origin.value);
    const d = getCoords(destination.value);

    if (o && d) {
      const distance = Math.round(haversineDistance(o, d));
      const grossCost = BASE_EARNING + distance * PER_KM_RATE;
      const netCost = grossCost + (grossCost * YANKIT_SERVICE_FEE_PERCENTAGE);
      setEstimatedDistance(distance);
      setEstimatedCostPerBag(Number(netCost.toFixed(2)));
      clearErrors('destination');
    } else {
      setEstimatedDistance(null);
      setEstimatedCostPerBag(null);
    }

    setIsCalculating(false);
  }, [origin, destination, setError, clearErrors]);

  useEffect(() => {
    const t = setTimeout(calculateEstimates, 500);
    return () => clearTimeout(t);
  }, [calculateEstimates]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!session?.user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in.',
        variant: 'destructive',
      });
      return;
    }

    if (!estimatedCostPerBag) {
      toast({
        title: 'Calculation Error',
        description: 'Unable to calculate earnings.',
        variant: 'destructive',
      });
      return;
    }

    if (!data.dangerous_goods_declaration) {
      toast({
        title: 'Declaration Required',
        description: 'You must confirm no dangerous goods.',
        variant: 'destructive',
      });
      return;
    }

    const bagWeight = Number(data.bag_weight_kg);
    const bags = parseInt(data.number_of_bags, 10);

    if (
      !Number.isFinite(bagWeight) ||
      bagWeight <= 0 ||
      bagWeight > MAX_BAGGAGE_WEIGHT_PER_BAG
    ) {
      toast({
        title: 'Validation Error',
        description: `Bag weight must be between 1 and ${MAX_BAGGAGE_WEIGHT_PER_BAG}kg.`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const totalAmount = estimatedCostPerBag * bags;

    try {
    const { data: created, error: insertError } = await supabase
    .from('shipments')
    .insert({
      shipper_user_id: session.user.id,
      origin: data.origin.label,
      destination: data.destination.label,
      departure_date: data.departure_date,
      agreed_weight_kg: bagWeight * bags,
      agreed_price: totalAmount,
      status: 'open',
      currency: 'USD',
      number_of_bags: bags,
      bag_weight_kg: bagWeight,
      bag_length_cm: Number(data.bag_length_cm),
      bag_width_cm: Number(data.bag_width_cm),
      bag_height_cm: Number(data.bag_height_cm),
      recipient_name: data.recipient_name,
      recipient_contact: data.recipient_contact,
      dangerous_goods_declaration: true,
    })
    .select('id')
    .single();
  
  if (insertError) throw insertError;
  
  const shipmentId = created.id;

  const { data: users } = await supabase
    .from('profiles')
    .select('email')
    .not('email', 'is', null);
  
  if (users?.length) {
    // Silently notify or handle warning
    notifyNewActivityCTA({
      to: users.map(u => u.email),
    }).catch(e => console.warn('Activity notification failed (silently bypassed):', e));
  }
    
  toast({
    title: 'Success',
    description: 'Baggage listed successfully! Awaiting a traveler match.',
    className: 'bg-green-500 dark:bg-green-600 text-white',
  });

  navigate(`/shipment-tracking/${shipmentId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: err.message || 'Unexpected error.',
        variant: 'destructive',
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
    estimatedCostPerBag,
    onSubmit,
  };
};
