import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListingsList from './ListingsList';
import { Package, Send } from 'lucide-react';

const MyListingsTab = ({
  shipments,
  yankings,
  isLoadingShipments,
  isLoadingYankings,
}) => {
  return (
    <Tabs defaultValue="shipments" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:max-w-md mx-auto bg-slate-200 dark:bg-slate-700/50 shadow-inner">
        <TabsTrigger value="shipments">
          <Send className="w-4 h-4 mr-2" />
          Shipments
        </TabsTrigger>

        <TabsTrigger value="yankings">
          <Package className="w-4 h-4 mr-2" />
          Yankings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shipments" className="mt-6">
        <ListingsList
          listings={shipments}
          type="shipments"
          isLoading={isLoadingShipments}
        />
      </TabsContent>

      <TabsContent value="yankings" className="mt-6">
        <ListingsList
          listings={yankings}
          type="yankings"
          isLoading={isLoadingYankings}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MyListingsTab;
