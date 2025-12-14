import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Briefcase, ShieldCheck } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AirportSelect } from '@/components/AirportSelect';
import { MAX_BAGS_PER_LISTING } from '@/config/constants';

const YankABagFormFields = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleAirportChange,
  handleNumberOfBagsChange,
  errors,
  isLoading,
}) => {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);

  const handleDateSelect = (date) => {
    handleDateChange(date);
    setIsDatePopoverOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Origin Airport</Label>
          <AirportSelect
            value={formData.origin}
            onChange={(v) => handleAirportChange('origin', v)}
            type="origin"
            disabled={isLoading}
          />
          {errors.origin && <motion.p className="text-xs text-red-500 mt-2">{errors.origin}</motion.p>}
        </div>

        <div>
          <Label>Destination Airport</Label>
          <AirportSelect
            value={formData.destination}
            onChange={(v) => handleAirportChange('destination', v)}
            type="destination"
            disabled={isLoading}
          />
          {errors.destination && <motion.p className="text-xs text-red-500 mt-2">{errors.destination}</motion.p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Departure Date</Label>
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start", !formData.departureDate && "text-muted-foreground")}
                disabled={isLoading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.departureDate ? format(formData.departureDate, "PPP") : "Select Departure Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={formData.departureDate}
                onSelect={handleDateSelect}
                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
              />
            </PopoverContent>
          </Popover>
          {errors.departureDate && <motion.p className="text-xs text-red-500 mt-2">{errors.departureDate}</motion.p>}
        </div>

        <div>
          <Label>Number of Bags</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              type="number"
              min={1}
              max={MAX_BAGS_PER_LISTING}
              value={formData.numberOfBags}
              onChange={(e) => handleNumberOfBagsChange(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {errors.numberOfBags && <motion.p className="text-xs text-red-500 mt-2">{errors.numberOfBags}</motion.p>}
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <Label>Bag Handling Agreement</Label>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={formData.bagHandlingAccepted}
            onCheckedChange={(v) =>
              handleInputChange({
                target: {
                  name: 'bagHandlingAccepted',
                  type: 'checkbox',
                  checked: v === true,
                },
              })
            }
            disabled={isLoading}
          />
          <p className="text-sm">
            I confirm that I will not open, tamper with, or alter the bag and will deliver it as received.
          </p>
        </div>

        {errors.bagHandlingAccepted && (
          <motion.p className="text-xs text-red-500">{errors.bagHandlingAccepted}</motion.p>
        )}
      </div>
    </div>
  );
};

export default YankABagFormFields;