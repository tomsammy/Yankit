import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import {
  MAX_BAGGAGE_WEIGHT_PER_BAG,
  MAX_BAGS_PER_LISTING,
  BASE_EARNING,
  PER_KM_RATE,
} from "@/data/constants";
import { haversineDistance, getCoords } from "@/lib/distanceUtils";
import { YANKIT_SERVICE_FEE_PERCENTAGE } from "../../data/constants";
import { notifyNewActivityCTA } from "@/lib/notify";
import { parseISO } from "date-fns";

export const useYankABagForm = (userId) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    origin: null,
    destination: null,
    departureDate: null,
    numberOfBags: "1",
    bagHandlingAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(null);
  const [estimatedEarnings, setEstimatedEarnings] = useState(null);
  const [matchingShipments, setMatchingShipments] = useState([]);
  const [yankingId, setYankingId] = useState(null);
  const [isFetchingMatches, setIsFetchingMatches] = useState(false);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  useEffect(() => {
    if (location.state?.searchCriteria) {
      const { origin, destination, date, bags } = location.state.searchCriteria;
      if (origin) setFormData((p) => ({ ...p, origin }));
      if (destination) setFormData((p) => ({ ...p, destination }));
      if (date) setFormData((p) => ({ ...p, departureDate: parseISO(date) }));
      if (bags) setFormData((p) => ({ ...p, numberOfBags: bags.toString() }));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleNumberOfBagsChange = (value) => {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1) {
      setFormData((p) => ({ ...p, numberOfBags: "1" }));
    } else if (n > MAX_BAGS_PER_LISTING) {
      setFormData((p) => ({
        ...p,
        numberOfBags: MAX_BAGS_PER_LISTING.toString(),
      }));
      toast({
        title: "Max Bags Reached",
        description: `Maximum ${MAX_BAGS_PER_LISTING} bags allowed.`,
      });
    } else {
      setFormData((p) => ({ ...p, numberOfBags: value }));
    }
  };

  const validateForm = () => {
    const e = {};

    if (!formData.origin) e.origin = "Origin airport is required.";
    if (!formData.destination)
      e.destination = "Destination airport is required.";

    if (
      formData.origin &&
      formData.destination &&
      formData.origin.value === formData.destination.value
    ) {
      e.origin = e.destination = "Origin and destination cannot be the same.";
    }

    if (!formData.departureDate)
      e.departureDate = "Departure date is required.";
    if (!formData.bagHandlingAccepted)
      e.bagHandlingAccepted = "You must accept the bag handling agreement.";
    if (isCalculating)
      e.confirmation = "Please wait for calculation to finish.";

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
    const grossEarning = (BASE_EARNING + distance * PER_KM_RATE) * bags;
    const netEarning =
      grossEarning - grossEarning * YANKIT_SERVICE_FEE_PERCENTAGE;

    setEstimatedDistance(distance);
    setEstimatedEarnings(Number(netEarning.toFixed(2)));
    setIsCalculating(false);
  }, [formData.origin, formData.destination, formData.numberOfBags]);

  useEffect(() => {
    const t = setTimeout(fetchDistanceAndEarnings, 500);
    return () => clearTimeout(t);
  }, [fetchDistanceAndEarnings]);

  const fetchMatchingShipments = useCallback(async () => {
    if (!yankingId || !userId) return;

    setIsFetchingMatches(true);

    const matchDate = new Date(formData.departureDate)
      .toISOString()
      .split("T")[0];

    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("origin", formData.origin.label)
      .eq("destination", formData.destination.label)
      .eq("departure_date", matchDate)
      .eq("status", "open")
      .is("traveler_user_id", null)
      .neq("shipper_user_id", userId)
      .lte(
        "agreed_weight_kg",
        parseInt(formData.numberOfBags, 10) * MAX_BAGGAGE_WEIGHT_PER_BAG,
      )
      .lte("number_of_bags", parseInt(formData.numberOfBags, 10));

    if (!error) setMatchingShipments(data || []);
    setIsFetchingMatches(false);
  }, [yankingId, userId, formData]);

  useEffect(() => {
    fetchMatchingShipments();
  }, [fetchMatchingShipments]);

  const submitYanking = async () => {
    if (!userId) return null;
    if (!validateForm()) return null;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("yankings")
        .insert({
          yanker_user_id: userId,
          origin: formData.origin.label,
          destination: formData.destination.label,
          departure_date: new Date(formData.departureDate)
            .toISOString()
            .split("T")[0],
          number_of_bags: parseInt(formData.numberOfBags, 10),
          available_space_kg:
            parseInt(formData.numberOfBags, 10) * MAX_BAGGAGE_WEIGHT_PER_BAG,
          estimated_distance_km: estimatedDistance,
          estimated_earnings: estimatedEarnings,
          bag_handling_accepted: true,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      setYankingId(data.id);

      const { data: users } = await supabase
        .from("profiles")
        .select("email")
        .not("email", "is", null);

      if (users?.length) {
        await notifyNewActivityCTA({
          to: users.map((u) => u.email),
        });
      }

      toast({ title: "Success", description: "Yanking listed successfully." });
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create yanking.",
        variant: "destructive",
      });
      return null;
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
    matchingShipments,
    isFetchingMatches,
    handleInputChange,
    handleDateChange,
    handleAirportChange,
    handleNumberOfBagsChange,
    submitYanking,
  };
};
