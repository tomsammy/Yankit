import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Repeat } from 'lucide-react';
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';

const AirportInputGroup = ({
  leg,
  onLegChange,
  returnDate,
  onReturnDateChange,
  tripType,
  isLoading,
  departurePopoverOpen,
  setDeparturePopoverOpen,
  returnPopoverOpen,
  setReturnPopoverOpen
}) => {
  const returnDateButtonRef = useRef(null);
  const [returnCalendarMonth, setReturnCalendarMonth] = useState(undefined);

  useEffect(() => {
    if (leg?.departureDate) {
      setReturnCalendarMonth(leg.departureDate);
    } else {
      setReturnCalendarMonth(new Date());
    }
  }, [leg?.departureDate]);

  const handleDepartureDateSelect = (date) => {
    onLegChange('departureDate', date);
    setDeparturePopoverOpen(false);
    if (tripType === 'round-trip' && returnDateButtonRef.current) {
      setTimeout(() => {
        setReturnPopoverOpen(true);
      }, 100);
    }
  };

  const handleReturnDateSelect = (date) => {
    onReturnDateChange(date);
    setReturnPopoverOpen(false);
  };

  const handleSwapAirports = () => {
    const tempOrigin = leg.origin;
    onLegChange('origin', leg.destination);
    onLegChange('destination', tempOrigin);
  };

  const today = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const toDate = addMonths(fromDate, 11);

  const isReturnCalendarDisabled = (d) => {
    if (tripType === 'one-way') return true;
    if (leg?.departureDate) {
      const departureDay = new Date(leg.departureDate);
      departureDay.setHours(0, 0, 0, 0);
      return d < departureDay;
    }
    return d < fromDate;
  };

  return (
    <div className="space-y-3">
      <div className="md:flex md:flex-wrap md:items-end md:gap-2 space-y-3 md:space-y-0">
        <div className="flex-grow min-w-[150px] md:flex-1">
          <AirportSelect
            value={leg?.origin || ""}
            onChange={(value) => onLegChange('origin', value)}
            placeholder="Origin"
            disabled={isLoading}
            type="flights"
          />
        </div>

        {tripType !== 'multi-city' && (
          <Button
            type="button" variant="ghost" size="icon"
            className="mx-auto md:mx-0 self-center text-primary hover:bg-primary/10 disabled:opacity-50"
            onClick={handleSwapAirports}
            disabled={isLoading || !leg?.origin || !leg?.destination}
            aria-label="Swap origin and destination"
          ><Repeat className="h-5 w-5" />
          </Button>
        )}

        <div className="flex-grow min-w-[150px] md:flex-1">
          <AirportSelect
            value={leg?.destination || ""}
            onChange={(value) => onLegChange('destination', value)}
            placeholder="Destination"
            disabled={isLoading}
            type="flights"
          />
        </div>

        <div className="flex-grow min-w-[130px] md:w-auto">
          <Popover open={departurePopoverOpen} onOpenChange={setDeparturePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant={"outline"}
                className={cn("w-full justify-start text-left font-normal text-foreground hover:text-foreground focus:ring-primary bg-white dark:bg-slate-700 dark:text-foreground", !leg?.departureDate && "text-muted-foreground", "md:rounded-r-none")}
                disabled={isLoading}
              ><CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {leg?.departureDate ? format(leg.departureDate, "dd MMM") : <span>Depart</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
              <Calendar
                mode="single"
                selected={leg?.departureDate}
                onSelect={handleDepartureDateSelect}
                disabled={isLoading}
                initialFocus
                fromDate={fromDate}
                toDate={toDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className={`flex-grow min-w-[130px] md:w-auto ${tripType === 'one-way' ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Popover open={returnPopoverOpen} onOpenChange={setReturnPopoverOpen}>
            <PopoverTrigger asChild>
              <Button ref={returnDateButtonRef} variant={"outline"} disabled={isLoading || tripType === 'one-way'}
                className={cn("w-full justify-start text-left font-normal text-foreground hover:text-foreground focus:ring-primary bg-white dark:bg-slate-700 dark:text-foreground", !returnDate && tripType === 'round-trip' && "text-muted-foreground", "md:rounded-l-none md:border-l-0")}
              ><CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {returnDate && tripType === 'round-trip' ? format(returnDate, "dd MMM") : <span>Return</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={handleReturnDateSelect}
                disabled={isReturnCalendarDisabled}
                initialFocus
                month={returnCalendarMonth}
                onMonthChange={setReturnCalendarMonth}
                fromDate={leg?.departureDate || fromDate}
                toDate={toDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AirportInputGroup;