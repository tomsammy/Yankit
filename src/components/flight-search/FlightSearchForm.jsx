import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import TripTypeSelector from '@/components/flight-search/TripTypeSelector';
import AirportInputGroup from '@/components/flight-search/AirportInputGroup';
import MultiCityLegs from '@/components/flight-search/MultiCityLegs';
import PassengerCabinSelect from '@/components/flight-search/PassengerCabinSelect';
import useFlightSearchFormLogic from '@/components/flight-search/hooks/useFlightSearchFormLogic';

const FlightSearchForm = ({ prefillDestination }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formLogic = useFlightSearchFormLogic(prefillDestination);
  const {
    legs,
    tripType,
    returnDate,
    passengers,
    cabinClass,
    initialLegState,
    handleTripTypeChange,
    handleLegChange,
    setReturnDate,
    departurePopoverOpen,
    setDeparturePopoverOpen,
    returnPopoverOpen,
    setReturnPopoverOpen,
    addLeg,
    removeLeg,
    setPassengers,
    setCabinClass,
    handleDistanceCalculation,
    isCalculatingPath,
    getSubmitPayload,
    validateForm
  } = formLogic;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const distanceData = await handleDistanceCalculation();

    const navigationState = getSubmitPayload();
    navigationState.distanceData = distanceData;

    setIsSubmitting(false);
    navigate('/flight-results', { state: navigationState });
  };

  const isFormLoading = isSubmitting || isCalculatingPath;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <Card className="w-full shadow-2xl bg-primary/20 dark:bg-slate-800 border-none p-0 md:p-2">
        <CardContent className="p-3 md:p-4">
          <TripTypeSelector
            tripType={tripType}
            onTripTypeChange={handleTripTypeChange}
            isLoading={isFormLoading}
          />
          <form onSubmit={handleSubmit} className="space-y-3">
            {tripType !== 'multi-city' ? (
              <AirportInputGroup
                leg={legs[0] || initialLegState}
                onLegChange={(field, value) => handleLegChange(0, field, value)}
                returnDate={returnDate}
                onReturnDateChange={setReturnDate}
                tripType={tripType}
                isLoading={isFormLoading}
                departurePopoverOpen={departurePopoverOpen}
                setDeparturePopoverOpen={setDeparturePopoverOpen}
                returnPopoverOpen={returnPopoverOpen}
                setReturnPopoverOpen={setReturnPopoverOpen}
              />
            ) : (
              <MultiCityLegs
                legs={legs}
                onLegChange={handleLegChange}
                addLeg={addLeg}
                removeLeg={removeLeg}
                isLoading={isFormLoading}
                maxLegs={5}
              />
            )}

            <div className="pt-2 md:flex md:flex-wrap md:items-end md:gap-2 space-y-3 md:space-y-0">
              <PassengerCabinSelect
                passengers={passengers}
                onPassengersChange={setPassengers}
                cabinClass={cabinClass}
                onCabinClassChange={setCabinClass}
                isLoading={isFormLoading}
              />
              <Button type="submit" className="w-full md:w-auto text-lg py-3 md:px-6 bg-blue-800 text-white hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2" disabled={isFormLoading}>
                {isFormLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plane size={20} />}
                <span>{isFormLoading ? 'Processing...' : 'Search Flights'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightSearchForm;