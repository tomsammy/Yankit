import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Package, Send, Briefcase } from 'lucide-react';

    const DashboardStatsCards = ({ stats }) => {
      const navigate = useNavigate();

      const statItems = [
        { 
          title: "My Listings", 
          value: stats.listings, 
          description: "Active baggage offers", 
          icon: Briefcase, 
          actionText: "View Listings", 
          actionNav: () => navigate('/my-activity', { state: { defaultTab: 'myListings' } }) 
        },
        { 
          title: "Shipments Sent", 
          value: stats.shipmentsSent, 
          description: "Items you've sent", 
          icon: Send, 
          actionText: "View Sent Items", 
          actionNav: () => navigate('/dashboard', { state: { defaultTab: 'shipments' } }) 
        },
        { 
          title: "Shipments Carried", 
          value: stats.shipmentsCarried, 
          description: "Items you've carried", 
          icon: Package, 
          actionText: "View Carried Items", 
          actionNav: () => navigate('/dashboard', { state: { defaultTab: 'shipments' } }) 
        },
      ];

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statItems.map((item) => (
            <Card key={item.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism dark:bg-slate-800/60 dark:border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-primary dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{item.value}</div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700" onClick={item.actionNav}>
                  {item.actionText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    };

    export default DashboardStatsCards;