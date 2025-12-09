import { useState, useEffect, useCallback } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { validateFlightSearchForm, buildAirportCodesForDistanceCalc } from '@/components/flight-search/utils/formUtils';

    const MAX_LEGS = 5;
    const initialLegState = { origin: "", destination: "", departureDate: null, layoverAirport: "" };

    const useFlightSearchFormLogic = (initialPrefillDestination) => {
      const { toast } = useToast();
      const [legs, setLegs] = useState([JSON.parse(JSON.stringify(initialLegState))]);
      const [tripType, setTripType] = useState('round-trip'); 
      const [returnDate, setReturnDate] = useState(null);
      const [passengers, setPassengers] = useState(1);
      const [cabinClass, setCabinClass] = useState('economy');
      const [flightPathType, setFlightPathType] = useState('direct'); 
      const [departurePopoverOpen, setDeparturePopoverOpen] = useState(false);
      const [returnPopoverOpen, setReturnPopoverOpen] = useState(false);
      const [isCalculatingPath, setIsCalculatingPath] = useState(false);

      useEffect(() => {
        if (initialPrefillDestination?.code) {
          setLegs(prev => {
            const newLegs = prev.map((leg, index) => 
              index === 0 ? { ...leg, destination: initialPrefillDestination.code } : leg
            );
            return newLegs.length > 0 ? newLegs : [{ ...JSON.parse(JSON.stringify(initialLegState)), destination: initialPrefillDestination.code }];
          });
        }
      }, [initialPrefillDestination]);
    
      const handleTripTypeChange = useCallback((type) => {
        setTripType(type);
        const currentFirstLeg = legs[0] ? JSON.parse(JSON.stringify(legs[0])) : JSON.parse(JSON.stringify(initialLegState));
        let newLayover = flightPathType === 'layover' && type !== 'multi-city' ? currentFirstLeg.layoverAirport : "";
        
        if (type === 'one-way' || type === 'round-trip') {
          if (type === 'one-way') setReturnDate(null);
          setLegs([{...currentFirstLeg, layoverAirport: newLayover}]);
        } else if (type === 'multi-city') {
          setReturnDate(null);
          setFlightPathType('direct'); 
          const updatedLegs = legs.length < 2 
            ? [JSON.parse(JSON.stringify(initialLegState)), JSON.parse(JSON.stringify(initialLegState))] 
            : legs.map(leg => JSON.parse(JSON.stringify(leg)));
          setLegs(updatedLegs.map(leg => ({...leg, layoverAirport: ""})));
        }
      }, [legs, flightPathType]);

      const handleFlightPathTypeChange = useCallback((type) => {
        setFlightPathType(type);
        if (type === 'direct' && tripType !== 'multi-city') {
          setLegs(prev => prev.map((leg, index) => index === 0 ? {...JSON.parse(JSON.stringify(leg)), layoverAirport: ""} : JSON.parse(JSON.stringify(leg))));
        }
      }, [tripType]);

      const handleLegChange = useCallback((index, field, value) => {
        setLegs(prev => prev.map((leg, i) => i === index ? { ...JSON.parse(JSON.stringify(leg)), [field]: value } : JSON.parse(JSON.stringify(leg))));
      }, []);

      const addLeg = useCallback(() => {
        if (legs.length < MAX_LEGS) setLegs(prev => [...prev, JSON.parse(JSON.stringify(initialLegState))]);
      }, [legs.length]);

      const removeLeg = useCallback((index) => {
        if (legs.length > (tripType === 'multi-city' ? 2 : 1) ) { 
          setLegs(prev => prev.filter((_, i) => i !== index));
        }
      }, [legs.length, tripType]);

      const handleDistanceCalculation = async () => {
        const airportCodes = buildAirportCodesForDistanceCalc(legs, tripType, flightPathType);
        if (airportCodes.length < 2) {
           toast({ variant: "destructive", title: "Invalid Path", description: "Not enough airports for distance calculation." });
           return null;
        }
        setIsCalculatingPath(true);
        toast({ title: "Calculating Path Details...", description: `Path: ${airportCodes.join(' → ')}`, duration: 2000 });
        
        try {
          const body = { airports: airportCodes };
          // Note: No JWT token is sent here. If calculate-flight-distance needs user context,
          // you'll need to fetch and send the token similar to useFlightResultsLogic.
          const { data: edgeData, error: edgeError } = await supabase.functions.invoke('calculate-flight-distance', {
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' } 
          });

          if (edgeError) throw new Error(edgeError.message || "Edge function invocation failed");

          if (edgeData?.error) {
             toast({ variant: "destructive", title: "Distance Error", description: edgeData.error });
             return null;
          } else if (edgeData) {
            toast({
              title: "Path Details Calculated",
              description: `Est. Distance: ${Number(edgeData.totalDistance || 0).toFixed(0)} km, Est. Price: ${Number(edgeData.totalPrice || 0).toFixed(2)} ${edgeData.priceUnit || 'AUD'}. Fetching flights...`,
              duration: 5000,
            });
            return edgeData;
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Distance Service Error", description: error.message || "Failed to calculate path details." });
          return null;
        } finally {
          setIsCalculatingPath(false);
        }
        return null;
      };

      const getSubmitPayload = () => {
        return { 
            legs: tripType === 'multi-city' ? legs : [{...(legs[0] || initialLegState), flightPathType}], 
            returnDate: tripType === 'round-trip' ? returnDate : null, 
            tripType, 
            passengers, 
            cabinClass,
            flightPathType: tripType !== 'multi-city' ? flightPathType : 'direct' 
        };
      };
      
      const validateForm = () => {
        return validateFlightSearchForm(legs, tripType, flightPathType, returnDate, toast);
      };

      return {
        legs, setLegs, tripType, handleTripTypeChange, returnDate, setReturnDate,
        passengers, setPassengers, cabinClass, setCabinClass, flightPathType, handleFlightPathTypeChange,
        departurePopoverOpen, setDeparturePopoverOpen, returnPopoverOpen, setReturnPopoverOpen,
        handleLegChange, addLeg, removeLeg, initialLegState: JSON.parse(JSON.stringify(initialLegState)),
        handleDistanceCalculation, isCalculatingPath, getSubmitPayload, validateForm
      };
    };

    export default useFlightSearchFormLogic;