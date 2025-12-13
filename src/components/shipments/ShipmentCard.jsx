import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, ArrowRight, Calendar, Weight, User, Package, DollarSign, CreditCard } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ShipmentCard = ({ shipment }) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const isShipper = session?.user?.id === shipment.shipper_user_id;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending_payment': return 'destructive';
      case 'awaiting_match': return 'secondary';
      case 'pending_acceptance': return 'secondary';
      case 'active': return 'default';
      case 'in_transit': return 'default';
      case 'delivered': return 'success';
      case 'completed': return 'success';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_payment': return 'Awaiting Payment';
      case 'awaiting_match': return 'Finding a Yanker';
      case 'pending_acceptance': return 'Pending Acceptance';
      case 'active': return 'Active';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handlePayment = () => {
    navigate(`/payment/shipment/${shipment.id}`);
  };

  const handleTracking = () => {
    navigate(`/shipment-tracking/${shipment.id}`);
  };

  const origin = shipment.origin || shipment.listing?.origin;
  const destination = shipment.destination || shipment.listing?.destination;
  const departureDate = shipment.departure_date || shipment.listing?.departure_date;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col glassmorphism-alt">
      <CardHeader className="p-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-primary dark:text-secondary flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Shipment Details
          </CardTitle>
          <Badge variant={getStatusBadgeVariant(shipment.status)}>
            {getStatusText(shipment.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex items-center justify-between text-base font-semibold">
          <div className="flex items-center">
            <Plane className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>{origin || 'N/A'}</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center">
            <span>{destination || 'N/A'}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          {departureDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Departs on: {format(parseISO(departureDate), 'PPP')}</span>
            </div>
          )}
          <div className="flex items-center">
            <Weight className="mr-2 h-4 w-4" />
            <span>Weight: {shipment.agreed_weight_kg} kg</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Price: {shipment.agreed_price} {shipment.currency}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>
              {isShipper ? `Yanker: ${shipment.traveler_profile?.full_name || 'Awaiting Match'}` : `Shipper: ${shipment.sender_profile?.full_name || 'N/A'}`}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-slate-50 dark:bg-slate-800/50">
        {isShipper && shipment.status === 'pending_payment' ? (
          <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </Button>
        ) : (
          <Button onClick={handleTracking} className="w-full">
            Track Shipment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShipmentCard;