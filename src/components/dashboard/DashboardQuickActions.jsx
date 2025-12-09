import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { PlusCircle, Plane, Box, List } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const actionItems = [
      {
        icon: PlusCircle,
        title: "Create Listing",
        description: "Offer your baggage space for others.",
        link: "/list-your-bag",
        color: "from-purple-500 to-indigo-500",
        action: () => {}
      },
      {
        icon: Plane,
        title: "Find Shipments",
        description: "Search for bags to carry on your flight.",
        link: "/yank-a-bag-now",
        color: "from-blue-500 to-sky-500",
        action: () => {}
      },
      {
        icon: Box,
        title: "My Shipments",
        description: "View and manage your sent/carried bags.",
        link: "/my-shipments",
        color: "from-green-500 to-teal-500",
        action: () => {}
      },
      {
        icon: List,
        title: "My Listings",
        description: "Manage your available baggage space listings.",
        link: "/my-listings",
        color: "from-yellow-500 to-orange-500",
        action: () => {}
      }
    ];

    const DashboardQuickActions = () => {
      const { toast } = useToast();

      const handleComingSoon = () => {
        toast({
          title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
      };

      return (
        <section className="mb-10">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Quick Actions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionItems.map((item, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="p-6 text-white flex flex-col items-start h-full">
                  <div className="mb-3 text-white">
                    <item.icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90 mb-4 flex-grow">{item.description}</p>
                  <Button asChild className="bg-white text-gray-800 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 w-full">
                    <Link to={item.link}>Go Now</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      );
    };

    export default DashboardQuickActions;