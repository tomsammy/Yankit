import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Info, Percent } from 'lucide-react';
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';
import { MAX_BAGGAGE_WEIGHT_PER_BAG, MAX_BAGS_PER_LISTING } from '@/config/constants';
import YankitNowEstimatedEarningsCard from '@/pages/yankit-a-bag-now/YankitNowEstimatedEarningsCard';
const YankitNowFormFields = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleAirportChange,
  handleNumberOfBagsChange,
  errors,
  isLoading,
  estimatedDistance,
  estimatedEarnings
}) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);
  const handleDateSelect = date => {
    handleDateChange(date);
    setIsDatePopoverOpen(false);
  };
  const shouldShowEarningsCard = formData.origin && formData.destination && formData.numberOfBags;
  let dateButtonText = "Select Date";
  if (formData.departureDate) {
    dateButtonText = format(formData.departureDate, "PPP");
  }
  return <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="origin" className="dark:text-slate-300">Origin Airport</Label>
              <AirportSelect value={formData.origin} onChange={value => handleAirportChange('origin', value)} placeholder="Select Origin Airport" disabled={isLoading} type="origin" />
              {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
            </div>
            <div>
              <Label htmlFor="destination" className="dark:text-slate-300">Destination Airport</Label>
              <AirportSelect value={formData.destination} onChange={value => handleAirportChange('destination', value)} placeholder="Select Destination Airport" disabled={isLoading} type="destination" />
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="departureDate" className="dark:text-slate-300">Departure Date</Label>
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !formData.departureDate && "text-muted-foreground")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {dateButtonText}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                  <Calendar mode="single" selected={formData.departureDate} onSelect={handleDateSelect} disabled={date => date < new Date(new Date().setDate(new Date().getDate() - 1)) || isLoading} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.departureDate && <p className="text-xs text-red-500 mt-1">{errors.departureDate}</p>}
            </div>
            
            <div>
              <Label htmlFor="numberOfBags" className="dark:text-slate-300">Number of Bags to Yankit ({MAX_BAGS_PER_LISTING} max)</Label>
              <Select onValueChange={handleNumberOfBagsChange} value={formData.numberOfBags ? formData.numberOfBags.toString() : ""} disabled={isLoading}>
                <SelectTrigger className="w-full dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue placeholder="Select number of bags" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
                <Info size={12} className="inline mr-1" />
                Maximum Weight Per Bag is {MAX_BAGGAGE_WEIGHT_PER_BAG}kg.
              </p>
              {errors.numberOfBags && <p className="text-xs text-red-500 mt-1">{errors.numberOfBags}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="availableWeight" className="dark:text-slate-300">Maximum Weight Per Bag (Fixed)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="availableWeight" name="availableWeight" type="text" value={`${MAX_BAGGAGE_WEIGHT_PER_BAG} kg`} readOnly className="pl-10 bg-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600 cursor-not-allowed" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
              <Info size={12} className="inline mr-1" />
              Each bag listed allows for up to {MAX_BAGGAGE_WEIGHT_PER_BAG}kg. This is a fixed standard for Yankit Now.
            </p>
          </div>

          {shouldShowEarningsCard && <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="mt-6 min-h-[100px]">
              <YankitNowEstimatedEarningsCard isLoading={isLoading} estimatedDistance={estimatedDistance} estimatedEarnings={estimatedEarnings} numberOfBags={formData.numberOfBags} />
            </motion.div>}

          <div className="items-top flex space-x-2 mt-4">
            <Checkbox id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onCheckedChange={checked => handleInputChange({
        target: {
          name: 'termsAccepted',
          type: 'checkbox',
          checked
        }
      })} disabled={isLoading} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
                I agree to the Yankit Now terms and conditions, including baggage restrictions and service fees.
              </label>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                You must accept the terms to list your baggage yanking offer.
              </p>
              {errors.termsAccepted && <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>}
            </div>
          </div>
        </div>;
};
YankitNowFormFields.displayName = "YankitNowFormFields";
export default YankitNowFormFields;