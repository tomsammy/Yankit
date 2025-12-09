import React from 'react';
    import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

    const BookingsTabs = ({ activeTab, onTabChange }) => (
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-slate-200/80 dark:bg-slate-700/80 backdrop-blur-sm">
          <TabsTrigger value="flights" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-secondary">My Flights</TabsTrigger>
          <TabsTrigger value="offers" className="py-2.5 data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-600">Baggage Offers</TabsTrigger>
          <TabsTrigger value="sent" className="py-2.5 data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:data-[state=active]:bg-purple-600">Sent Items</TabsTrigger>
          <TabsTrigger value="carrying" className="py-2.5 data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-600">Carrying Items</TabsTrigger>
        </TabsList>
      </Tabs>
    );

    export default BookingsTabs;