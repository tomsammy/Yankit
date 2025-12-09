import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { format, isValid as isValidDate, parseISO } from 'date-fns';
    import { transformDuffelDataToFlights } from '@/components/flight-results/flightDataTransformer';

    const useFlightResultsLogic = (location, toast) => {
      const [searchCriteria, setSearchCriteria] = useState(null);
      const [flights, setFlights] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [pageError, setPageError] = useState(null);

      const fetchFlights = useCallback(async (criteria) => {
        setIsLoading(true);
        setPageError(null);
        setFlights([]);
        
        if (!criteria?.legs?.[0]?.origin || !criteria?.legs?.[0]?.destination) {
          const errorMsg = "Invalid search: Origin and destination are required.";
          setPageError(errorMsg);
          setIsLoading(false);
          return;
        }
        
        const body = {
          legs: criteria.legs.map(leg => ({
            origin: leg.origin.value,
            destination: leg.destination.value,
            departure_date: leg.departureDate && isValidDate(parseISO(leg.departureDate)) ? format(parseISO(leg.departureDate), 'yyyy-MM-dd') : null,
          })),
          passengers: [{ type: 'adult' }], // Simplified for now
          cabin_class: criteria.cabinClass,
        };

        try {
          const { data: offersData, error: edgeError } = await supabase.functions.invoke('fetch-flights', {
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (edgeError) {
            throw new Error(`Flight data fetch failed: ${edgeError.message}`);
          }
          if (offersData?.error) {
            throw new Error(`API Error from fetch-flights: ${offersData.error}`);
          }
          
          const fetchedFlights = Array.isArray(offersData.offers) ? offersData.offers : [];
          const transformed = fetchedFlights.map(offer => transformDuffelDataToFlights(offer, offersData));

          setFlights(transformed.sort((a, b) => a.price - b.price));

          if (transformed.length === 0) {
             toast({ title: "No Flights Found", description: "No flights matched your criteria for the selected route and date.", variant: "default" });
          }
        } catch (e) {
          setPageError(e.message || "Failed to fetch flights. Check console for details.");
          toast({ variant: "destructive", title: "Fetch Error", description: e.message || "Could not load flight data." });
        } finally {
          setIsLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        if (location.state?.tripType && location.state?.legs) {
          const criteriaToSet = JSON.parse(JSON.stringify(location.state));
          setSearchCriteria(criteriaToSet);
          fetchFlights(criteriaToSet);
        } else {
          setPageError("No search criteria provided. Please start a new search.");
        }
      }, [location.state, fetchFlights]);

      return { searchCriteria, flights, isLoading, pageError };
    };

    export default useFlightResultsLogic;