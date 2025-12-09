import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';

    const FlightPathTypeSelector = ({ flightPathType, onFlightPathTypeChange, isLoading }) => {
      const pathTypes = [
        { value: 'direct', label: 'Direct Flight' },
        { value: 'layover', label: 'With Layover(s)' },
      ];

      return (
        <div className="mb-3 md:mb-4">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">Flight Path</Label>
          <div className="flex flex-wrap gap-2">
            {pathTypes.map(type => (
              <Button
                key={type.value}
                type="button"
                variant={flightPathType === type.value ? 'secondary' : 'outline'}
                onClick={() => onFlightPathTypeChange(type.value)}
                className="rounded-md text-xs md:text-sm px-3 py-1.5 h-auto md:px-4 md:py-2 capitalize"
                disabled={isLoading}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      );
    };

    export default FlightPathTypeSelector;