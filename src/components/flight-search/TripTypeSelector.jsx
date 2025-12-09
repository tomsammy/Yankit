import React from 'react';
import { Button } from '@/components/ui/button';

const TripTypeSelector = ({ tripType, onTripTypeChange, isLoading }) => {
  const tripTypes = [
    { value: 'round-trip', label: 'Round Trip' },
    { value: 'one-way', label: 'One Way' },
    { value: 'multi-city', label: 'Multi-City' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
      {tripTypes.map(type => (
        <Button
          key={type.value}
          type="button"
          className={`rounded-full text-xs md:text-sm px-3 py-1 h-auto md:px-4 md:py-2 capitalize transition-colors duration-200 text-white 
            ${tripType === type.value 
              ? 'bg-blue-800 hover:bg-blue-700' 
              : 'bg-primary/30 hover:bg-primary/40' 
            }`}
          onClick={() => onTripTypeChange(type.value)}
          disabled={isLoading}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
};

export default TripTypeSelector;