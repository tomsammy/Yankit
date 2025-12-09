import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Repeat, PlusCircle, XCircle } from 'lucide-react';
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';

const MultiCityLegs = ({ legs, onLegChange, addLeg, removeLeg, isLoading, maxLegs }) => {
  const [openPopovers, setOpenPopovers] = useState(Array(legs.length).fill(false));
  const [calendarMonths, setCalendarMonths] = useState(Array(legs.length).fill(undefined));

  useEffect(() => {
    setCalendarMonths(legs.map((leg, index) => {
      if (index > 0 && legs[index - 1].departureDate) {
        return legs[index - 1].departureDate;
      }
      return new Date();
    }));
  }, [legs.length, legs]);

  const handleDateSelect = (index, date) => {
    onLegChange(index, 'departureDate', date);
    const newPopovers = [...openPopovers];
    newPopovers[index] = false;
    setOpenPopovers(newPopovers);

    if (index + 1 < legs.length) {
      const newMonths = [...calendarMonths];
      newMonths[index + 1] = date;
      setCalendarMonths(newMonths);
    }
  };

  const togglePopover = (index) => {
    setOpenPopovers(prev => prev.map((isOpen, i) => i === index ? !isOpen : false));
  };

  const handleSwapAirports = (index) => {
    const leg = legs[index];
    const tempOrigin = leg.origin;
    onLegChange(index, 'origin', leg.destination);
    onLegChange(index, 'destination', tempOrigin);
  };

  const handleMonthChange = (index, month) => {
    const newMonths = [...calendarMonths];
    newMonths[index] = month;
    setCalendarMonths(newMonths);
  };

  const today = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const toDate = addMonths(fromDate, 11);

  return (
    <div className="space-y-3">
      {legs.map((leg, index) => {
        const fromDateForPicker = index > 0 && legs[index - 1].departureDate ? legs[index - 1].departureDate : fromDate;
        return (
          <div key={index} className="md:flex md:flex-wrap md:items-center md:gap-2 space-y-3 md:space-y-0 mb-2 relative">
            <span className="absolute -left-4 top-2.5 text-xs font-bold text-primary hidden md:inline">{index + 1}</span>
            <div className="flex-grow min-w-[150px] md:flex-1">
              <AirportSelect value={leg.origin} onChange={(value) => onLegChange(index, 'origin', value)} placeholder={`Origin ${index + 1}`} disabled={isLoading} type="flights" />
            </div>
            <Button
              type="button" variant="ghost" size="icon"
              className="mx-auto md:mx-0 self-center text-primary hover:bg-primary/10 disabled:opacity-50"
              onClick={() => handleSwapAirports(index)}
              disabled={isLoading || !leg.origin || !leg.destination}
              aria-label="Swap origin and destination for this leg"
            ><Repeat className="h-5 w-5" />
            </Button>
            <div className="flex-grow min-w-[150px] md:flex-1">
              <AirportSelect value={leg.destination} onChange={(value) => onLegChange(index, 'destination', value)} placeholder={`Destination ${index + 1}`} disabled={isLoading} type="flights" />
            </div>
            <div className="flex-grow min-w-[130px] md:w-auto">
              <Popover open={openPopovers[index]} onOpenChange={() => togglePopover(index)}>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal text-foreground hover:text-foreground focus:ring-primary bg-white dark:bg-slate-700 dark:text-foreground", !leg.departureDate && "text-muted-foreground")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {leg.departureDate ? format(leg.departureDate, "dd MMM") : <span>Date {index + 1}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                  <Calendar
                    mode="single"
                    selected={leg.departureDate}
                    onSelect={(date) => handleDateSelect(index, date)}
                    disabled={isLoading}
                    initialFocus
                    month={calendarMonths[index]}
                    onMonthChange={(month) => handleMonthChange(index, month)}
                    fromDate={fromDateForPicker}
                    toDate={toDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {legs.length > 2 && (
              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 md:absolute md:-right-8 md:top-1/2 md:-translate-y-1/2" onClick={() => removeLeg(index)} disabled={isLoading}>
                <XCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
        )
      })}
      {legs.length < maxLegs && (
        <Button type="button" variant="outline" className="w-full md:w-auto mt-2 text-primary border-primary hover:bg-primary/10" onClick={addLeg} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Flight
        </Button>
      )}
    </div>
  );
};

export default MultiCityLegs;