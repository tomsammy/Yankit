import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plane,
  ArrowRight,
  Calendar,
  Weight,
  Package,
  DollarSign,
  CreditCard,
  UserCheck,
  UserX,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ListingCard = ({ listing, type }) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  const isShipper = session?.user?.id === listing.shipper_user_id;
  const isMatched = Boolean(listing.traveler_user_id);

  const {
    id,
    origin,
    destination,
    departure_date,
    agreed_weight_kg,
    agreed_price,
    currency,
    status,
  } = listing;

  const handleEscrowPayment = async () => {
    if (!isShipper || listing.is_paid || !listing.traveler_user_id) return;

    try {
      setIsPaying(true);

      const { data, error } = await supabase.functions.invoke(
        'create-escrow-transaction',
        {
          body: {
            shipmentId: id,
            successUrl: `${window.location.origin}/shipment-tracking/${id}?payment_success=true`,
            cancelUrl: `${window.location.origin}/payment-cancelled`,
          },
        }
      );

      if (error) throw error;
      if (!data?.url) throw new Error('Escrow checkout URL missing');

      window.location.href = data.url;
    } catch (err) {
      toast({
        title: 'Payment Error',
        description: err.message || 'Unable to start payment.',
        variant: 'destructive',
      });
      setIsPaying(false);
    }
  };

  const getStatusBadgeVariant = (listing) => {
    const { status, traveler_user_id, is_paid } = listing;
    if (!is_paid && traveler_user_id) {
      return 'destructive';
    }
    if (status === 'open' && !traveler_user_id) {
      return 'secondary';
    }
    switch (status) {
      case 'pending_payment':
        return 'destructive';
      case 'awaiting_match':
      case 'pending_acceptance':
        return 'secondary';
      case 'active':
      case 'in_transit':
        return 'default';
      case 'delivered':
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (listing) => {
    const { status, traveler_user_id, is_paid } = listing;
    if (!is_paid && traveler_user_id) {
      return 'Awaiting Payment';
    }
    if (status === 'open' && !traveler_user_id) {
      return 'Looking for Traveler';
    }
    switch (status) {
      case 'pending_payment':
        return 'Awaiting Payment';
      case 'awaiting_match':
        return 'Looking for Traveler';
      case 'pending_acceptance':
        return 'Awaiting Traveler Acceptance';
      case 'active':
        return 'Active';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow flex flex-col glassmorphism-alt">
      <CardHeader className="p-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex items-center">
            <Package className="mr-2 h-5 w-5" />
            {type === 'yankings' ? 'Yanking' : 'Shipment'}
          </CardTitle>
          <Badge variant={getStatusBadgeVariant(listing)}>
            {getStatusText(listing)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex items-center justify-between font-semibold">
          <div className="flex items-center">
            <Plane className="mr-2 h-5 w-5 text-muted-foreground" />
            {origin || 'N/A'}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div>{destination || 'N/A'}</div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          {departure_date && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {format(parseISO(departure_date), 'PPP')}
            </div>
          )}

          <div className="flex items-center">
            <Weight className="mr-2 h-4 w-4" />
            {agreed_weight_kg} kg
          </div>

          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            {agreed_price.toFixed(2)} {currency}
          </div>

          {type === 'shipments' && (
            <div className="flex items-center">
              {isMatched ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                  Yanker Matched
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4 text-muted-foreground" />
                  Yanker Not Matched
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50">
        {isShipper && !listing.is_paid && listing.traveler_user_id ? (
          <Button
            onClick={handleEscrowPayment}
            disabled={isPaying}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isPaying ? 'Redirecting…' : 'Pay Now'}
          </Button>
        ) : (
          <Button
            onClick={() => navigate(`/shipment-tracking/${id}`)}
            className="w-full"
          >
            Track Shipment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
