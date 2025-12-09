import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Users, Briefcase } from 'lucide-react';

    const PassengerCabinSelect = ({ passengers, onPassengersChange, cabinClass, onCabinClassChange, isLoading }) => {
      return (
        <>
          <div className="flex-grow min-w-[150px] md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal text-foreground hover:text-foreground focus:ring-primary bg-white dark:bg-slate-700 dark:text-foreground" disabled={isLoading}>
                  <Users className="mr-2 h-4 w-4 text-primary" />
                  {passengers} Passenger{passengers > 1 ? 's' : ''}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2 bg-background dark:bg-slate-800 border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adults</span>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPassengersChange(p => Math.max(1, p - 1))} disabled={isLoading}><Users className="h-4 w-4 opacity-50" /></Button>
                    <span className="w-8 text-center">{passengers}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPassengersChange(p => Math.min(9, p + 1))} disabled={isLoading}><Users className="h-4 w-4 opacity-50" /></Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-grow min-w-[150px] md:w-auto">
            <Select value={cabinClass} onValueChange={onCabinClassChange} disabled={isLoading}>
              <SelectTrigger className="w-full text-foreground hover:text-foreground focus:ring-primary bg-white dark:bg-slate-700 dark:text-foreground">
                <Briefcase className="mr-2 h-4 w-4 text-primary" />
                <SelectValue placeholder="Cabin Class" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-slate-800 border-border">
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium_economy">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    };

    export default PassengerCabinSelect;