import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Briefcase } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';
import { MAX_BAGS_PER_LISTING } from '@/config/constants';
import { useToast } from '@/components/ui/use-toast';

const YankABagNowFormFields = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleAirportChange,
  handleNumberOfBagsChange,
  errors,
  isLoading,
}) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);
  const { toast } = useToast(); 

  const handleDateSelect = date => {
    handleDateChange(date);
    setIsDatePopoverOpen(false);
  };
  let dateButtonText = "Select Departure Date";
  if (formData.departureDate) {
    dateButtonText = format(formData.departureDate, "PPP");
  }
  return <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="origin" className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Origin Airport</Label>
              <AirportSelect value={formData.origin} onChange={value => handleAirportChange('origin', value)} placeholder="Select Origin Airport" disabled={isLoading} type="origin" />
              {errors.origin && <motion.p initial={{
          opacity: 0,
          y: -5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-xs text-red-500 mt-2">{errors.origin}</motion.p>}
            </div>
            <div>
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Destination Airport</Label>
              <AirportSelect value={formData.destination} onChange={value => handleAirportChange('destination', value)} placeholder="Select Destination Airport" disabled={isLoading} type="destination" />
              {errors.destination && <motion.p initial={{
          opacity: 0,
          y: -5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-xs text-red-500 mt-2">{errors.destination}</motion.p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="departureDate" className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Departure Date</Label>
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-slate-700 dark:text-white dark:border-slate-600", !formData.departureDate && "text-muted-foreground")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary dark:text-sky-400" />
                    {dateButtonText}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border shadow-lg">
                  <Calendar mode="single" selected={formData.departureDate} onSelect={handleDateSelect} disabled={date => date < new Date(new Date().setDate(new Date().getDate() - 1)) || isLoading} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.departureDate && <motion.p initial={{
          opacity: 0,
          y: -5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-xs text-red-500 mt-2">{errors.departureDate}</motion.p>}
            </div>
            
            <div>
              <Label htmlFor="numberOfBags" className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 block">Number of Bags to Yank ({MAX_BAGS_PER_LISTING} max)</Label>
              <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
                  <Input id="numberOfBags" name="numberOfBags" type="number" value={formData.numberOfBags} onChange={e => handleNumberOfBagsChange(e.target.value)} className="pl-10 border-input bg-background dark:bg-slate-700 dark:text-white dark:border-slate-600" disabled={isLoading} min="1" max={MAX_BAGS_PER_LISTING.toString()} placeholder="e.g., 1" />
              </div>
              {errors.numberOfBags && <motion.p initial={{
          opacity: 0,
          y: -5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-xs text-red-500 mt-2">{errors.numberOfBags}</motion.p>}
            </div>
          </div>

          <div className="flex items-start space-x-2 mt-6">
            <Checkbox id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onCheckedChange={checked => handleInputChange({
        target: {
          name: 'termsAccepted',
          type: 'checkbox',
          checked
        }
      })} disabled={isLoading} className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-slate-600 dark:data-[state=checked]:bg-sky-400 dark:data-[state=checked]:text-black" />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-slate-300">I agree to the Yankit <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline dark:text-sky-400" onClick={() => toast({ title: "Feature Not Implemented", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀", variant: "default" })}>terms and conditions</Button>, including baggage restrictions and service fees.</label>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                You must accept the terms to list your baggage yanking offer.
              </p>
              {errors.termsAccepted && <motion.p initial={{
          opacity: 0,
          y: -5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-xs text-red-500 mt-2">{errors.termsAccepted}</motion.p>}
            </div>
          </div>
        </div>;
};
YankABagNowFormFields.displayName = "YankABagNowFormFields";
export default YankABagNowFormFields;