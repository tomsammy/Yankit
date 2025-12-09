import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { AirportSelect } from '@/components/AirportSelect';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { CalendarPlus as CalendarIcon, PackagePlus } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MAX_BAGS_PER_LISTING } from '@/config/constants';

const SendABagFormFields = ({ form }) => {
  const { control } = form;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold dark:text-slate-200">Origin Airport</FormLabel>
              <FormControl>
                <AirportSelect
                  type="origin"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Origin Airport"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold dark:text-slate-200">Destination Airport</FormLabel>
              <FormControl>
                <AirportSelect
                  type="destination"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Destination Airport"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="departure_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="font-semibold dark:text-slate-200">Desired Departure Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !field.value && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="number_of_bags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold dark:text-slate-200">Number of Bags to Send</FormLabel>
            <div className="relative">
                <PackagePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                    <SelectTrigger className="w-full pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <SelectValue placeholder="Select number of bags" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-slate-800 dark:text-white">
                    {[...Array(MAX_BAGS_PER_LISTING)].map((_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1} Bag{i > 0 ? 's' : ''}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="item_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold dark:text-slate-200">Description of Items</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 'Clothes and gifts for family. No prohibited items.'"
                className="resize-y min-h-[80px] dark:bg-slate-700 dark:text-white dark:border-slate-600"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SendABagFormFields;