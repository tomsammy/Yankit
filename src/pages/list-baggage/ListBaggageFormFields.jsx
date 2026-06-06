import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AirportSelect } from "@/components/AirportSelect";
import {
  CalendarPlus as CalendarIcon,
  PackagePlus,
  Info,
  Ruler,
  Weight,
  User,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  MAX_BAGGAGE_WEIGHT_PER_BAG,
  MAX_BAGS_PER_LISTING,
} from "@/data/constants";

const ListBaggageFormFields = React.memo(({ form, isLoading }) => {
  const {
    control,
    formState: { errors },
    watch,
  } = form;
  const numberOfBags = watch("number_of_bags");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="origin" className="font-semibold dark:text-slate-200">
            Origin Airport
          </Label>
          <Controller
            name="origin"
            control={control}
            rules={{ required: "Origin airport is required." }}
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
          {errors.origin && (
            <p className="text-xs text-red-500 mt-1">{errors.origin.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="destination"
            className="font-semibold dark:text-slate-200"
          >
            Destination Airport
          </Label>
          <Controller
            name="destination"
            control={control}
            rules={{ required: "Destination airport is required." }}
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
          {errors.destination && (
            <p className="text-xs text-red-500 mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label
          htmlFor="departure_date"
          className="font-semibold dark:text-slate-200"
        >
          Departure Date
        </Label>
        <Controller
          name="departure_date"
          control={control}
          rules={{ required: "Departure date is required." }}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date <
                      new Date(new Date().setDate(new Date().getDate() - 1)) ||
                    isLoading
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.departure_date && (
          <p className="text-xs text-red-500 mt-1">
            {errors.departure_date.message}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="number_of_bags"
          className="font-semibold dark:text-slate-200"
        >
          Number of Bags You Can Carry
        </Label>
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
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      {i + 1} Bag{i > 0 ? "s" : ""}
                    </SelectItem>
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
        {errors.number_of_bags && (
          <p className="text-xs text-red-500 mt-1">
            {errors.number_of_bags.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            htmlFor="bag_weight_kg"
            className="font-semibold dark:text-slate-200"
          >
            Weight Per Bag (kg)
          </Label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Controller
              name="bag_weight_kg"
              control={control}
              rules={{
                required: "Weight per bag is required.",
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0)
                    return "Enter a valid weight.";
                  if (n > MAX_BAGGAGE_WEIGHT_PER_BAG)
                    return `Max ${MAX_BAGGAGE_WEIGHT_PER_BAG}kg per bag.`;
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  inputMode="decimal"
                  placeholder={`e.g. ${MAX_BAGGAGE_WEIGHT_PER_BAG}`}
                  className="pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  disabled={isLoading}
                />
              )}
            />
          </div>
          {errors.bag_weight_kg && (
            <p className="text-xs text-red-500 mt-1">
              {errors.bag_weight_kg.message}
            </p>
          )}
        </div>

        <div>
          <Label className="font-semibold dark:text-slate-200">
            Dimensions Per Bag (cm)
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Controller
                name="bag_length_cm"
                control={control}
                rules={{
                  required: "Length is required.",
                  validate: (v) => {
                    const n = Number(v);
                    if (!Number.isFinite(n) || n <= 0) return "Invalid";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    inputMode="numeric"
                    placeholder="L"
                    className="pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <Controller
              name="bag_width_cm"
              control={control}
              rules={{
                required: "Width is required.",
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return "Invalid";
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="W"
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="bag_height_cm"
              control={control}
              rules={{
                required: "Height is required.",
                validate: (v) => {
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return "Invalid";
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="H"
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  disabled={isLoading}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-1">
            <div>
              {errors.bag_length_cm && (
                <p className="text-xs text-red-500">
                  {errors.bag_length_cm.message}
                </p>
              )}
            </div>
            <div>
              {errors.bag_width_cm && (
                <p className="text-xs text-red-500">
                  {errors.bag_width_cm.message}
                </p>
              )}
            </div>
            <div>
              {errors.bag_height_cm && (
                <p className="text-xs text-red-500">
                  {errors.bag_height_cm.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <p className="font-semibold dark:text-slate-200">Recipient Details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="recipient_name"
              className="font-semibold dark:text-slate-200"
            >
              Recipient Name
            </Label>
            <Controller
              name="recipient_name"
              control={control}
              rules={{ required: "Recipient name is required." }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Full name"
                  className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  disabled={isLoading}
                />
              )}
            />
            {errors.recipient_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.recipient_name.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="recipient_contact"
              className="font-semibold dark:text-slate-200"
            >
              Recipient Contact
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Controller
                name="recipient_contact"
                control={control}
                rules={{ required: "Recipient contact is required." }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Phone or WhatsApp"
                    className="pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                    disabled={isLoading}
                  />
                )}
              />
            </div>
            {errors.recipient_contact && (
              <p className="text-xs text-red-500 mt-1">
                {errors.recipient_contact.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 p-4 md:p-5 bg-muted/30 dark:bg-slate-800/40">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <p className="font-semibold dark:text-slate-200">
            Dangerous Goods Declaration
          </p>
        </div>

        <Controller
          name="dangerous_goods_declaration"
          control={control}
          rules={{
            validate: (v) => v === true || "You must confirm this declaration.",
          }}
          render={({ field }) => (
            <div className="flex items-start gap-3">
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <p className="text-sm dark:text-slate-200 ">
                  <a
                    href="/declaration.pdf"
                    className="text-blue-500 underline"
                    target="blank"
                  >
                    I confirm no prohibited or dangerous items are being sent.
                  </a>
                </p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  This includes explosives, flammables, batteries not permitted
                  by airline rules, weapons, illegal substances, and other
                  restricted goods.
                </p>
              </div>
            </div>
          )}
        />

        <div className="mt-10 w-full text-end">
          <p className="text-xs text-muted-foreground dark:text-slate-400">
            Store your bags at{" "}
            <a
              href="https://radicalstorage.com"
              target="blank"
              className="text-blue-500 underline"
            >
              radicalstorage.com
            </a>
          </p>
        </div>

        {errors.dangerous_goods_declaration && (
          <p className="text-xs text-red-500 mt-2">
            {errors.dangerous_goods_declaration.message}
          </p>
        )}
      </div>
    </div>
  );
});

ListBaggageFormFields.displayName = "ListBaggageFormFields";
export default ListBaggageFormFields;
