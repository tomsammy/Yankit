import React from 'react';
    import { Label } from '@/components/ui/label';
    import { Calendar } from "@/components/ui/calendar";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Button } from '@/components/ui/button';
    import { AirportSelect } from '@/components/AirportSelect';
    import EstimatedEarningsCard from '@/pages/list-baggage/EstimatedEarningsCard';
    import { CalendarPlus as CalendarIcon, PackagePlus, Info } from 'lucide-react';
    import { format } from "date-fns";
    import { cn } from "@/lib/utils";
    import { MAX_BAGGAGE_WEIGHT_PER_BAG } from '@/config/constants';

    const ListBaggageFormFields = React.memo(({ formData, handleDateChange, handleAirportChange, handleNumberOfBagsChange, errors, isLoading, estimatedDistance, estimatedEarnings }) => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="origin" className="font-semibold dark:text-slate-200">Origin Airport</Label>
            <AirportSelect 
              value={formData.origin} 
              onChange={(value) => handleAirportChange('origin', value)} 
              placeholder="Select Origin Airport" 
              disabled={isLoading}
              type="origin"
            />
            {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
          </div>
          <div>
            <Label htmlFor="destination" className="font-semibold dark:text-slate-200">Destination Airport</Label>
            <AirportSelect 
              value={formData.destination} 
              onChange={(value) => handleAirportChange('destination', value)} 
              placeholder="Select Destination Airport" 
              disabled={isLoading}
              type="destination"
            />
            {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="departureDate" className="font-semibold dark:text-slate-200">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !formData.departureDate && "text-muted-foreground")}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                {formData.departureDate ? format(formData.departureDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
              <Calendar
                mode="single"
                selected={formData.departureDate}
                onSelect={handleDateChange}
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || isLoading }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.departureDate && <p className="text-xs text-red-500 mt-1">{errors.departureDate}</p>}
        </div>

        <div>
          <Label htmlFor="numberOfBags" className="font-semibold dark:text-slate-200">Number of Bags You Can Carry</Label>
           <div className="relative">
            <PackagePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select
              value={formData.numberOfBags}
              onValueChange={(value) => handleNumberOfBagsChange(value)}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600">
                <SelectValue placeholder="Select number of bags" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:text-white">
                <SelectItem value="1">1 Bag</SelectItem>
                <SelectItem value="2">2 Bags</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.numberOfBags && (
            <p className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
              <Info className="inline-block h-3 w-3 mr-1" />
              Maximum weight is {MAX_BAGGAGE_WEIGHT_PER_BAG}kg/bag.
            </p>
          )}
          {errors.numberOfBags && <p className="text-xs text-red-500 mt-1">{errors.numberOfBags}</p>}
        </div>
        
        <EstimatedEarningsCard 
          origin={formData.origin}
          destination={formData.destination}
          numberOfBags={formData.numberOfBags}
          estimatedDistance={estimatedDistance}
          estimatedEarnings={estimatedEarnings}
        />
      </div>
    ));
    ListBaggageFormFields.displayName = "ListBaggageFormFields";

    export default ListBaggageFormFields;