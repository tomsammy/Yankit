import React from 'react';
    import FlightCard from '@/components/flight-results/FlightCard';

    const FlightResultsListDisplay = ({ flights, onBook, bookingFlightId }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBook={onBook} isLoading={bookingFlightId === flight.id} />
        ))}
      </div>
    );

    export default FlightResultsListDisplay;