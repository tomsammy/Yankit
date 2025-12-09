import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Calendar } from "@/components/ui/calendar";
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Calendar as CalendarIcon, Search, Loader2, Package, Send } from 'lucide-react';
    import { format, parseISO } from "date-fns";
    import { cn } from "@/lib/utils";
    import { AirportSelect } from '@/components/AirportSelect';

    const BaggageSearchForm = ({ onSearch, isLoading, initialCriteria, pageType = "send-a-bag" }) => {
      const [origin, setOrigin] = useState(initialCriteria?.origin || "");
      const [destination, setDestination] = useState(initialCriteria?.destination || "");
      const [travelDate, setTravelDate] = useState(initialCriteria?.travelDate ? parseISO(initialCriteria.travelDate) : null);
      const [numberOfBags, setNumberOfBags] = useState(initialCriteria?.numberOfBags || '');
      const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

      useEffect(() => {
        if (initialCriteria) {
          setOrigin(initialCriteria.origin || "");
          setDestination(initialCriteria.destination || "");
          if (initialCriteria.travelDate) {
            setTravelDate(parseISO(initialCriteria.travelDate));
          } else {
            setTravelDate(null);
          }
          setNumberOfBags(initialCriteria.numberOfBags || "");
        }
      }, [initialCriteria]);

      const handleDateSelect = (date) => {
        setTravelDate(date);
        setIsDatePopoverOpen(false);
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ 
            origin, 
            destination, 
            travelDate: travelDate ? format(travelDate, "yyyy-MM-dd") : null, 
            numberOfBags
        });
      };

      const title = pageType === "send-a-bag" ? "Find a Yanker for Your Bag" : "Search Listings";
      const buttonText = pageType === "send-a-bag" ? "Search for Yankers" : "Search Available Space";
      const Icon = pageType === "send-a-bag" ? Send : Search;

      let dateButtonText = "Any Date";
      if (travelDate) {
        dateButtonText = format(travelDate, "PPP");
      }

      return (
        <Card className="max-w-3xl mx-auto mb-12 shadow-xl glassmorphism border-none dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-foreground dark:text-white">
              <Icon size={20} className="mr-3 text-primary"/>
              {title}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchOrigin" className="dark:text-slate-300">From (Origin)</Label>
                  <AirportSelect value={origin} onChange={setOrigin} placeholder="Any Origin" disabled={isLoading}/>
                </div>
                <div>
                  <Label htmlFor="searchDestination" className="dark:text-slate-300">To (Destination)</Label>
                  <AirportSelect value={destination} onChange={setDestination} placeholder="Any Destination" disabled={isLoading}/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchTravelDate" className="dark:text-slate-300">Travel Date</Label>
                  <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal dark:bg-slate-700 dark:text-white", !travelDate && "text-muted-foreground")}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {dateButtonText}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background dark:bg-slate-800 border-border">
                      <Calendar 
                        mode="single" 
                        selected={travelDate} 
                        onSelect={handleDateSelect} 
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) || isLoading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="searchNumberOfBags" className="dark:text-slate-300">Number of Bags to Send</Label>
                  <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="searchNumberOfBags" 
                        type="number" 
                        placeholder="e.g., 1 or 2" 
                        value={numberOfBags} 
                        onChange={(e) => setNumberOfBags(e.target.value)} 
                        className="pl-10 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                        disabled={isLoading} 
                        min="1"
                        max="2"
                      />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-3" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Icon className="mr-2 h-5 w-5" />}
                {isLoading ? "Searching..." : buttonText}
              </Button>
            </CardFooter>
          </form>
        </Card>
      );
    };

    export default BaggageSearchForm;