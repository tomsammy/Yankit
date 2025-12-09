import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Package, Info } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';
import { MAX_BAGS_PER_LISTING } from '@/config/constants';

const ListYourBagFormFields = ({
  formData,
  errors,
  isLoading,
  handleInputChange,
  handleDateChange,
  handleAirportChange,
  handleNumberOfBagsChange
}) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);
  
  const handleDateSelect = date => {
    handleDateChange(date);
    setIsDatePopoverOpen(false);
  };
  
  let dateButtonText = "Select Desired Date";
  if (formData.desiredDate) {
    dateButtonText = format(formData.desiredDate, "PPP");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="origin" className="dark:text-slate-300">From (Origin)</Label>
          <AirportSelect value={formData.origin} onChange={value => handleAirportChange('origin', value)} placeholder="Select Origin Airport" disabled={isLoading} />
          {errors.origin && <p className="text-xs text-red-500 mt-1">{errors.origin}</p>}
        </div>
        <div>
          <Label htmlFor="destination" className="dark:text-slate-300">To (Destination)</Label>
          <AirportSelect value={formData.destination} onChange={value => handleAirportChange('destination', value)} placeholder="Select Destination Airport" disabled={isLoading} />
          {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="desiredDate" className="dark:text-slate-300">Desired Send Date</Label>
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !formData.desiredDate && "text-muted-foreground")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {dateButtonText}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                    <Calendar mode="single" selected={formData.desiredDate} onSelect={handleDateSelect} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) || isLoading} initialFocus />
                </PopoverContent>
            </Popover>
            {errors.desiredDate && <p className="text-xs text-red-500 mt-1">{errors.desiredDate}</p>}
        </div>
        
        <div>
            <Label htmlFor="numberOfBags" className="dark:text-slate-300">Number of Bags ({MAX_BAGS_PER_LISTING} max)</Label>
            <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="numberOfBags" name="numberOfBags" type="number" value={formData.numberOfBags} onChange={e => handleNumberOfBagsChange(e.target.value)} className="pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600" disabled={isLoading} min="1" max={MAX_BAGS_PER_LISTING.toString()} placeholder="e.g., 1" />
            </div>
            {errors.numberOfBags && <p className="text-xs text-red-500 mt-1">{errors.numberOfBags}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="dark:text-slate-300">Bag Description (Optional)</Label>
        <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="e.g., Clothing and books. No prohibited items."
            className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
            disabled={isLoading}
            rows={3}
        />
        <p className="text-xs text-muted-foreground mt-2 dark:text-slate-400 flex items-center">
            <Info size={14} className="mr-1.5" />
            Do not include personal contact information here. All communication should be through Yankit.
        </p>
      </div>

      <div className="items-top flex space-x-2 mt-4">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleInputChange({ target: { name: 'termsAccepted', type: 'checkbox', checked } })}
          disabled={isLoading}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
            I confirm my bag contains no illegal or prohibited items and I agree to the Yankit terms of service.
          </label>
          {errors.termsAccepted && <p className="text-xs text-red-500 mt-1">{errors.termsAccepted}</p>}
        </div>
      </div>
    </div>
  );
};

export default ListYourBagFormFields;