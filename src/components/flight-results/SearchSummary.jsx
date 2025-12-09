import React from 'react';
    import { Plane, CalendarDays, Users, Briefcase } from 'lucide-react';
    import { format } from 'date-fns';

    const SearchSummary = ({ criteria }) => {
      if (!criteria) return null;
      const { legs, tripType, passengers, cabinClass, returnDate } = criteria;
      const mainLeg = legs[0];
      let summaryText = `${mainLeg.origin} to ${mainLeg.destination}`;
      if (tripType === 'round-trip' && returnDate) summaryText += ` (Round Trip)`;
      else if (tripType === 'one-way') summaryText += ` (One Way)`;
      else if (tripType === 'multi-city') summaryText = `Multi-City Trip (${legs.length} legs)`;

      return (
        <div className="mb-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md">
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-3">Your Search:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center">
              <Plane size={16} className="mr-2 text-primary dark:text-secondary" /> 
              <span className="text-muted-foreground dark:text-slate-300">{summaryText}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={16} className="mr-2 text-primary dark:text-secondary" /> 
              <span className="text-muted-foreground dark:text-slate-300">
                {format(new Date(mainLeg.departureDate), 'dd MMM')}
                {tripType === 'round-trip' && returnDate && ` - ${format(new Date(returnDate), 'dd MMM')}`}
              </span>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-primary dark:text-secondary" /> 
              <span className="text-muted-foreground dark:text-slate-300">{passengers} Passenger(s)</span>
            </div>
            <div className="flex items-center">
              <Briefcase size={16} className="mr-2 text-primary dark:text-secondary" /> 
              <span className="text-muted-foreground dark:text-slate-300 capitalize">{cabinClass.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      );
    };
    SearchSummary.displayName = 'SearchSummary';
    export default SearchSummary;