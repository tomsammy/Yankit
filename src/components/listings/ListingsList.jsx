import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import ListingCard from './ListingCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ListingsList = ({ listings, type, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">
          Loading {type === 'shipments' ? 'shipments' : 'yankings'}...
        </p>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    const isShipments = type === 'shipments';

    return (
      <Card className="text-center p-8 shadow-lg glassmorphism border-none dark:bg-slate-800/40">
        <Package size={48} className="mx-auto mb-4 text-primary" />

        <CardTitle className="text-xl font-semibold">
          {isShipments ? 'No Shipments Yet' : 'No Yankings Yet'}
        </CardTitle>

        <CardDescription className="text-muted-foreground mt-2 mb-4">
          {isShipments
            ? "You haven't created any shipments yet."
            : "You aren't carrying any shipments yet."}
        </CardDescription>

        <Link to={isShipments ? '/list-baggage' : '/yank-a-bag'}>
          <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
            {isShipments ? 'Create Shipment' : 'Find a Shipment'}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          type = {type}
        />
      ))}
    </div>
  );
};

export default ListingsList;
