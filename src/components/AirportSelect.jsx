import React, { useState, useMemo, useEffect } from "react";
    import { Check, ChevronsUpDown, MapPin, Loader2 } from "lucide-react";
    import { cn } from "@/lib/utils";
    import { Button } from "@/components/ui/button";
    import {
      Command,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList,
    } from "@/components/ui/command";
    import {
      Popover,
      PopoverContent,
      PopoverTrigger,
    } from "@/components/ui/popover";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { supabase } from "@/lib/supabaseClient";
    import { globalAirportsList } from '@/lib/airportData.js';

    const getSortedAirports = (airports) => airports.sort((a, b) => a.label.localeCompare(b.label));

    const allUniqueYankitAirports = getSortedAirports(
      Array.from(new Set(globalAirportsList.map(a => a.value)))
        .map(value => globalAirportsList.find(a => a.value === value))
        .filter(Boolean)
    );

    export function AirportSelect({ value, onChange, placeholder, disabled, type = "all" }) {
      const [open, setOpen] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");
      const [isLoading, setIsLoading] = useState(false);
      const [duffelAirports, setDuffelAirports] = useState([]);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchDuffelAirports = async () => {
          if (type !== 'flights') return;
          if (duffelAirports.length > 0) return; 

          setIsLoading(true);
          setError(null);
          try {
            const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('fetch-airports', {
                headers: { 'Duffel-Version': 'v1' }
            });
            
            if (edgeError) throw new Error(edgeError.message);
            if (edgeResponse.error) throw new Error(edgeResponse.error);

            const transformedAirports = edgeResponse.map(airport => ({
              value: airport.iata_code,
              label: `${airport.name} (${airport.iata_code})`,
              region: `${airport.city_name}, ${airport.country_iso_code}`
            }));
            
            setDuffelAirports(getSortedAirports(transformedAirports));
          } catch (e) {
            console.error("Failed to fetch Duffel airports:", e);
            setError("Could not load airport data.");
          } finally {
            setIsLoading(false);
          }
        };

        if (open) {
          fetchDuffelAirports();
        }
      }, [open, type, duffelAirports.length]);

      const availableAirports = useMemo(() => {
        if (type === 'flights') {
          return duffelAirports;
        }
        // For 'origin', 'destination', and 'all', we use the same comprehensive list.
        return allUniqueYankitAirports;
      }, [type, duffelAirports]);


      const filteredAirports = useMemo(() => {
        if (!searchTerm) return availableAirports;
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return availableAirports.filter(airport =>
          airport.label.toLowerCase().includes(lowercasedSearchTerm) ||
          airport.value.toLowerCase().includes(lowercasedSearchTerm)
        );
      }, [searchTerm, availableAirports]);

      const selectedAirportLabel = useMemo(() => {
        const selected = availableAirports.find(airport => airport.value === value?.value || airport.value === value);
        return selected ? selected.label : placeholder;
      }, [value, placeholder, availableAirports]);

      const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSearchTerm("");
        }
      };

      const handleSelect = (airport) => {
        onChange(airport);
        setOpen(false);
        setSearchTerm("");
      };

      return (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between text-muted-foreground hover:text-muted-foreground focus:ring-primary dark:bg-slate-700 dark:text-white truncate",
                !value && "text-muted-foreground/70"
              )}
              disabled={disabled}
            >
              <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50 text-primary" />
              <span className="truncate">
                {selectedAirportLabel || placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[calc(100vw-2rem)] max-w-[500px] sm:w-[350px] md:w-[450px] lg:w-[500px] p-0"
            side="bottom"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Type airport name or code..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                disabled={isLoading}
              />
              <CommandList>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading airports...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-sm text-destructive">{error}</div>
                ) : (
                  <CommandEmpty>
                    {searchTerm && filteredAirports.length === 0 ? "No airport found." : type === 'flights' && duffelAirports.length === 0 ? 'Click to load airports.' : "No airport found."}
                  </CommandEmpty>
                )}
                
                {!isLoading && !error && (
                  <ScrollArea className="h-72">
                    <CommandGroup>
                      {filteredAirports.map((airport) => (
                        <CommandItem
                          key={airport.value}
                          value={airport.label}
                          onSelect={() => handleSelect(airport)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (value?.value === airport.value || value === airport.value) ? "opacity-100 text-primary" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{airport.label}</span>
                            <span className="text-xs text-muted-foreground">{airport.region}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }