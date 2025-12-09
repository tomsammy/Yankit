import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Plane, CalendarDays, Briefcase, ExternalLink, MapPin, RadioTower } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { format, parseISO } from 'date-fns';

    const FlightCard = ({ flight }) => {
      const { toast } = useToast();

      const handleBookFlight = () => {
        if (flight.deeplink) {
          toast({
            title: "Redirecting to provider",
            description: "You are being redirected to complete your booking securely.",
          });
          window.open(flight.deeplink, '_blank', 'noopener,noreferrer');
        } else {
          toast({
            variant: "destructive",
            title: "Booking Unavailable",
            description: "This flight cannot be booked automatically at the moment.",
          });
        }
      };

      const displayLayovers = flight.layovers && flight.layovers.length > 0
        ? flight.layovers.join(' → ')
        : 'None';

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden glassmorphism-alt dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/50">
            <CardHeader className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={flight.airlineLogoUrl} alt={`${flight.airline} logo`} className="h-8 w-8 rounded-sm bg-white p-0.5 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src='/img/default-airline.png'; }} />
                  <CardTitle className="text-lg font-semibold text-primary dark:text-secondary">{flight.airline}</CardTitle>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                  {flight.stops}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground dark:text-white">{flight.departureTime}</p>
                  <p className="text-muted-foreground dark:text-slate-400">{flight.from}</p>
                </div>
                <div className="flex items-center text-muted-foreground dark:text-slate-500">
                  <Plane size={18} className="mx-2" />
                  <span className="text-xs">{flight.duration}</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-foreground dark:text-white">{flight.arrivalTime}</p>
                  <p className="text-muted-foreground dark:text-slate-400">{flight.to}</p>
                </div>
              </div>
              { (flight.layovers && flight.layovers.length > 0) && (
                <div className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center">
                  <RadioTower size={14} className="mr-1 text-amber-500" />
                  <span>Layovers: {displayLayovers}</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center">
                <CalendarDays size={14} className="mr-1" />
                <span>{flight.departureDate ? format(parseISO(flight.departureDate), 'dd MMM yyyy') : 'N/A'}</span>
              </div>
              <div className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center">
                <Briefcase size={14} className="mr-1" />
                <span>Baggage info on provider site</span>
              </div>
               {flight.distance && (
                  <div className="text-xs text-muted-foreground dark:text-slate-400 flex items-center justify-center">
                    <MapPin size={14} className="mr-1 text-green-500" />
                    <span>Distance: {flight.distance?.toFixed(0)} km</span>
                  </div>
                )}
            </CardContent>
            <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xl font-bold text-primary dark:text-secondary">
                  {flight.currency} {flight.price ? flight.price?.toFixed(2) : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">Total price</p>
              </div>
              <Button
                onClick={handleBookFlight}
                disabled={!flight.deeplink}
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Book on Provider
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    FlightCard.displayName = 'FlightCard';
    export default FlightCard;