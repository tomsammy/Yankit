import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import ShipmentList from './ShipmentList';
    import { Package, Send } from 'lucide-react';
    
    const MyShipmentsTabs = ({ sentShipments, carryingShipments, isLoadingSent, isLoadingCarrying }) => {
      return (
        <Tabs defaultValue="sent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:max-w-md mx-auto bg-slate-200 dark:bg-slate-700/50 shadow-inner">
            <TabsTrigger value="sent" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-600">
              <Send className="w-4 h-4 mr-2" /> Bags I've Sent
            </TabsTrigger>
            <TabsTrigger value="carrying" className="data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-blue-600">
              <Package className="w-4 h-4 mr-2" /> Bags I've Carried
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sent" className="mt-6">
            <ShipmentList 
              shipments={sentShipments} 
              type="sent" 
              isLoading={isLoadingSent}
            />
          </TabsContent>
          <TabsContent value="carrying" className="mt-6">
            <ShipmentList 
              shipments={carryingShipments} 
              type="carrying" 
              isLoading={isLoadingCarrying}
            />
          </TabsContent>
        </Tabs>
      );
    };

    export default MyShipmentsTabs;