import React from 'react';
    import { Controller } from 'react-hook-form';
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
    import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING } from '@/config/constants';

    const ListBaggageFormFields = React.memo(({ form, isLoading, estimatedDistance, estimatedEarnings, numberOfBags }) => {
        const { control, formState: { errors } } = form;

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="origin" className="font-semibold dark:text-slate-200">Origin Airport</Label>
                <Controller
                  name="origin"
                  control={control}
                  rules={{ required: 'Origin airport is required.' }}
                  render={({ field }) => (
                     <AirportSelect 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="Select Origin Airport" 
                      disabled={isLoading}
                      type="origin"
                    />
                  )}
                />
                {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin.message}</p>}
              </div>
              <div>
                <Label htmlFor="destination" className="font-semibold dark:text-slate-200">Destination Airport</Label>
                 <Controller
                  name="destination"
                  control={control}
                  rules={{ required: 'Destination airport is required.' }}
                  render={({ field }) => (
                     <AirportSelect 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="Select Destination Airport" 
                      disabled={isLoading}
                      type="destination"
                    />
                  )}
                />
                {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="departure_date" className="font-semibold dark:text-slate-200">Departure Date</Label>
               <Controller
                name="departure_date"
                control={control}
                rules={{ required: "Departure date is required." }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !field.value && "text-muted-foreground")}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || isLoading }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.departure_date && <p className="text-xs text-red-500 mt-1">{errors.departure_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="number_of_bags" className="font-semibold dark:text-slate-200">Number of Bags You Can Carry</Label>
               <div className="relative">
                <PackagePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Controller
                    name="number_of_bags"
                    control={control}
                    rules={{ required: "Number of bags is required." }}
                    render={({ field }) => (
                       <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600">
                            <SelectValue placeholder="Select number of bags" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-slate-800 dark:text-white">
                            {[...Array(MAX_BAGS_PER_LISTING)].map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1} Bag{i > 0 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    )}
                 />
              </div>
              {numberOfBags && (
                <p className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
                  <Info className="inline-block h-3 w-3 mr-1" />
                  Maximum weight is {MAX_BAGGAGE_WEIGHT_PER_BAG}kg/bag.
                </p>
              )}
              {errors.number_of_bags && <p className="text-xs text-red-500 mt-1">{errors.number_of_bags.message}</p>}
            </div>
            
            <EstimatedEarningsCard 
              origin={form.getValues('origin')?.value}
              destination={form.getValues('destination')?.value}
              numberOfBags={numberOfBags}
              estimatedDistance={estimatedDistance}
              estimatedEarnings={estimatedEarnings}
            />
          </div>
        );
    });
    ListBaggageFormFields.displayName = "ListBaggageFormFields";

    export default ListBaggageFormFields;