import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import TicketTracker from '@/components/bookings/TicketTracker';
    import { Plane, AlertCircle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';

    const FlightBookingCard = ({ booking, onBookingUpdate }) => {
      const { toast } = useToast();

      const handleCancelBooking = async () => {
        // Basic confirmation, can be enhanced with AlertDialog
        if (!window.confirm("Are you sure you want to cancel this booking? This action might be irreversible or subject to cancellation policies.")) {
            return;
        }

        try {
            const { data, error } = await supabase
                .from('flight_bookings')
                .update({ 
                    booking_status: 'cancelled', 
                    payment_status: booking.payment_status === 'payment_confirmed' ? 'refund_pending' : booking.payment_status, // Example logic
                    updated_at: new Date().toISOString() 
                })
                .eq('id', booking.id)
                .select()
                .single();

            if (error) throw error;

            toast({ title: "Booking Cancelled", description: `Booking ID ${booking.id} has been cancelled.` });
            if (onBookingUpdate) {
                onBookingUpdate(data); // Update local state if callback provided
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            toast({ variant: "destructive", title: "Cancellation Failed", description: error.message });
        }
      };
      
      const flight = booking.flight_details;

      return (
      <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 glassmorphism dark:bg-slate-800/60 dark:border-slate-700/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl md:text-2xl font-semibold text-primary dark:text-secondary">{flight.airline} - {flight.from} to {flight.to}</CardTitle>
              <CardDescription className="text-muted-foreground dark:text-slate-300">Booking ID: {booking.id}</CardDescription>
            </div>
            <Plane className="w-10 h-10 text-primary/70 dark:text-secondary/70" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground dark:text-slate-200"><strong>Departure:</strong> {new Date(flight.departureDate).toLocaleDateString()} at {flight.departureTime}</p>
          <p className="text-sm text-foreground dark:text-slate-200"><strong>Total Price:</strong> {booking.total_price_ssp} SSP</p>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Booked on: {new Date(booking.created_at).toLocaleDateString()}
          </p>
          <TicketTracker currentStatus={booking.booking_status} bookingTime={new Date(booking.created_at).getTime()} />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
            {booking.booking_status !== 'cancelled' && booking.booking_status !== 'ticket_issued' && (
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelBooking}
                    className="border-destructive/50 text-destructive hover:bg-destructive/10 dark:border-red-500/70 dark:text-red-500 dark:hover:bg-red-500/20 w-full sm:w-auto"
                >
                    <AlertCircle size={16} className="mr-2"/> Cancel Booking
                </Button>
            )}
            <Button asChild variant="default" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white w-full sm:w-auto">
                <Link to={`/tracking/flight/${booking.id}`}>View Details</Link>
            </Button>
        </CardFooter>
      </Card>
    );
    }

    export default FlightBookingCard;