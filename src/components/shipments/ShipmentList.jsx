import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import ShipmentCard from './ShipmentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ShipmentList = ({ shipments, type, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-10 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground dark:text-slate-300 mt-4">Loading shipments...</p>
    </div>;
  }
  if (!shipments || shipments.length === 0) {
    return (
      <Card className="text-center p-8 shadow-lg glassmorphism border-none dark:bg-slate-800/40">
        <Package size={48} className="mx-auto mb-4 text-primary" />
        <CardTitle className="text-xl font-semibold text-foreground dark:text-white">
          {type === 'sent' ? "No Sent Bags" : "Not Carrying Any Bags"}
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-slate-300 mt-2 mb-4">
          {type === 'sent' ? "You haven't sent any bags yet." : "You are not currently carrying any bags for others."}
        </CardDescription>
        <Link to={type === 'sent' ? "/list-baggage" : "/yank-a-bag"}>
          <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
            {type === 'sent' ? "Send a Bag" : "List Your Bag"}
          </Button>
        </Link>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {shipments.map(shipment => (
        <ShipmentCard 
          key={shipment.id} 
          shipment={shipment} 
        />
      ))}
    </div>
  );
};

export default ShipmentList;