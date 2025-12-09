import React from 'react';

    export const validateFlightSearchForm = (legs, tripType, flightPathType, returnDate, toast) => {
      if (tripType === 'multi-city') {
        for (const leg of legs) {
          if (!leg.origin || !leg.destination || !leg.departureDate) {
            toast({ variant: "destructive", title: "Missing Info", description: "Fill all origin, destination, and date fields for each city." });
            return false;
          }
        }
      } else {
        const currentLeg = legs[0];
        if (!currentLeg?.origin || !currentLeg?.destination || !currentLeg?.departureDate) {
          toast({ variant: "destructive", title: "Missing Info", description: "Fill origin, destination, and departure date." });
          return false;
        }
        if (flightPathType === 'layover' && !currentLeg.layoverAirport) {
          toast({ variant: "destructive", title: "Missing Info", description: "Select a layover city or choose 'Direct Flight'." });
          return false;
        }
        if (tripType === 'round-trip' && !returnDate) {
          toast({ variant: "destructive", title: "Missing Info", description: "Select a return date for round trips." });
          return false;
        }
      }
      return true;
    };

    export const buildAirportCodesForDistanceCalc = (legs, tripType, flightPathType) => {
      if (tripType === 'multi-city') {
        if (!legs[0]?.origin) return [];
        return [legs[0].origin, ...legs.map(leg => leg.destination)].filter(Boolean);
      } 
      const currentLeg = legs[0];
      if (!currentLeg) return [];
      return (flightPathType === 'layover' && currentLeg.layoverAirport)
        ? [currentLeg.origin, currentLeg.layoverAirport, currentLeg.destination].filter(Boolean)
        : [currentLeg.origin, currentLeg.destination].filter(Boolean);
    };