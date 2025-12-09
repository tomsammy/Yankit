import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { MapPin, CalendarDays, UserCircle } from 'lucide-react';

    const ShipmentItemCard = ({ item, type }) => (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism dark:bg-slate-800/50 dark:border-slate-700/50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold text-purple-600 dark:text-purple-400">{item.itemName || "Item Shipment"}</CardTitle>
              <span className={`px-2 py-1 text-xs rounded-full font-medium
                ${item.status === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' :
                  item.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                  item.status === 'Awaiting Pickup' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' :
                  item.status === 'Pending Confirmation' ? 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
                {item.status}
              </span>
            </div>
            <CardDescription className="text-sm text-muted-foreground dark:text-slate-400">Shipment ID: {item.id.slice(0,8)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center">
              <MapPin size={14} className="mr-2 text-muted-foreground dark:text-slate-500" /> 
              <span className="font-medium text-foreground dark:text-slate-200">{item.from} &rarr; {item.to}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={14} className="mr-2 text-muted-foreground dark:text-slate-500" /> 
              <span className="text-foreground dark:text-slate-200">Est. Date: {new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <UserCircle size={14} className="mr-2 text-muted-foreground dark:text-slate-500" /> 
              <span className="text-foreground dark:text-slate-200">
                {type === 'sent' ? `Traveler: ${item.traveler || 'TBC'}` : `Sender: ${item.sender || 'N/A'}`}
              </span>
            </div>
          </CardContent>
           <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="border-slate-400/50 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10">Track Package</Button>
            <Button variant="default" size="sm" className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white">Contact {type === 'sent' ? 'Traveler' : 'Sender'}</Button>
        </CardFooter>
        </Card>
    );

    export default ShipmentItemCard;