import React from 'react';
    import { Loader2 } from 'lucide-react';

    const FlightResultsLoadingDisplay = () => (
      <div className="flex flex-col justify-center items-center py-10 min-h-[300px]">
        <Loader2 className="h-16 w-16 text-primary dark:text-secondary animate-spin mb-4" />
        <p className="text-lg font-semibold text-muted-foreground">Searching for flights...</p>
        <p className="text-sm text-muted-foreground">This may take a moment.</p>
      </div>
    );

    export default FlightResultsLoadingDisplay;