import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TrendingUp } from 'lucide-react';

    const EstimatedEarningsCard = React.memo(({ origin, destination, numberOfBags, estimatedDistance, estimatedEarnings }) => {
      const showCalculating = (origin && destination) && (estimatedDistance === null || estimatedEarnings === null);
      const canDisplay = origin && destination && estimatedDistance !== null && estimatedEarnings !== null;
      const isValidNumberOfBags = numberOfBags && parseInt(numberOfBags, 10) > 0;

      return (
        <Card className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 p-4 rounded-lg shadow min-h-[120px] flex flex-col justify-center">
          <CardHeader className="p-0 pb-2">
             <CardTitle className="text-md font-semibold text-primary dark:text-sky-300 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Estimated Earnings & Distance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground dark:text-slate-400">Flight Distance:</span>
              <span className="font-medium text-foreground dark:text-white">
                {canDisplay ? `${estimatedDistance} km` : (showCalculating ? 'Calculating...' : 'Select airports')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground dark:text-slate-400">Potential Earnings (per bag):</span>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                {canDisplay ? `A${estimatedEarnings.toFixed(2)}` : (showCalculating ? 'Calculating...' : 'Select airports')}
              </span>
            </div>
             {canDisplay && isValidNumberOfBags && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-300 dark:border-slate-600 mt-1">
                  <span className="text-muted-foreground dark:text-slate-400 font-semibold">Total Potential Earnings:</span>
                  <span className="font-extrabold text-green-600 dark:text-green-300 text-xl">
                      A{(estimatedEarnings * parseInt(numberOfBags, 10)).toFixed(2)}
                  </span>
              </div>
            )}
          </CardContent>
        </Card>
      );
    });
    EstimatedEarningsCard.displayName = "EstimatedEarningsCard";

    export default EstimatedEarningsCard;