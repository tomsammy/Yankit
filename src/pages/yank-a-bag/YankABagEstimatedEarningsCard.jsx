import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, Route, Loader2, AlertCircle, Info } from 'lucide-react';
import { DEFAULT_CURRENCY } from '@/config/constants';

const YankABagNowEstimatedEarningsCard = ({ isLoading, estimatedDistance, estimatedEarnings, numberOfBags }) => {
  const numBags = parseInt(numberOfBags, 10) || 1;
  const currencySymbol = DEFAULT_CURRENCY === 'USD' ? '$' : DEFAULT_CURRENCY;

  let title = "Estimated Earnings";
  let description = "Potential earnings for your Yank a Bag Now offer.";
  let content;

  const isValidNumber = (val) => typeof val === 'number' && !isNaN(val);

  if (isLoading) {
    title = "Calculating Earnings...";
    description = "Please wait while we estimate your potential earnings.";
    content = (
      <div className="flex flex-col items-center justify-center h-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-sky-400 mb-2" />
        <p className="text-sm text-muted-foreground dark:text-slate-400">Crunching numbers...</p>
      </div>
    );
  } else if (!isValidNumber(estimatedEarnings) || !isValidNumber(estimatedDistance)) {
     title = "Enter Details to Estimate";
     description = "Select origin, destination, and number of bags to see potential earnings.";
     content = (
      <div className="flex flex-col items-center justify-center h-24 text-center">
        <Info className="h-8 w-8 text-blue-500 dark:text-sky-400 mb-2" />
        <p className="text-sm text-muted-foreground dark:text-slate-400">Fill in the form fields above.</p>
      </div>
    );
  } else if (estimatedEarnings <= 0 && estimatedDistance === 0) {
    title = "Invalid Route or No Data";
    description = "Could not calculate earnings. This might be due to an invalid route or missing distance data.";
    content = (
      <div className="flex flex-col items-center justify-center h-24 text-center">
        <AlertCircle className="h-8 w-8 text-destructive dark:text-red-400 mb-2" />
        <p className="text-sm text-destructive dark:text-red-300">Please check your airport selections or try a different route.</p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border dark:border-slate-700">
          <div className="flex items-center">
            <Route className="h-5 w-5 text-blue-500 dark:text-sky-400 mr-2" />
            <span className="text-sm text-muted-foreground dark:text-slate-400">Est. Distance:</span>
          </div>
          <span className="text-sm font-semibold text-blue-600 dark:text-sky-300">
            {isValidNumber(estimatedDistance) ? `${estimatedDistance.toLocaleString()} km` : "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border dark:border-slate-700">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <span className="text-sm text-muted-foreground dark:text-slate-400">Earnings per Bag:</span>
          </div>
          <span className="text-sm font-semibold text-green-600 dark:text-green-300">
            {currencySymbol}{(estimatedEarnings / numBags).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-primary dark:text-sky-400 mr-2" />
            <span className="text-lg font-semibold text-muted-foreground dark:text-slate-300">Total Est. Earnings:</span>
          </div>
          <span className="text-xl font-bold text-primary dark:text-sky-200">
            {currencySymbol}{isValidNumber(estimatedEarnings) ? estimatedEarnings.toFixed(2) : "0.00"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground dark:text-slate-400 mt-3 text-center">
         Includes 20% platform fee. This is an estimate. Actual earnings may vary. Service fees apply.
        </p>
      </>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 shadow-md border-none transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center text-primary dark:text-sky-300">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <DollarSign className="h-5 w-5 mr-2" />}
          {title}
        </CardTitle>
        <CardDescription className="text-xs dark:text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
YankABagNowEstimatedEarningsCard.displayName = "YankABagNowEstimatedEarningsCard";
export default YankABagNowEstimatedEarningsCard;