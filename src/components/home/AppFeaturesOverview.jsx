import React from 'react';
    import { motion } from 'framer-motion';
    import { PackageSearch, PackagePlus, MessageSquare, CreditCard, MapPin, Users } from 'lucide-react';

    const features = [
      {
        icon: <PackageSearch className="w-8 h-8 text-primary" />,
        title: "Effortless Search",
        description: "Quickly find travelers with available baggage space matching your destination and dates."
      },
      {
        icon: <PackagePlus className="w-8 h-8 text-primary" />,
        title: "Simple Listing",
        description: "Easily list your available baggage space and connect with potential shippers."
      },
      {
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        title: "In-App Messaging",
        description: "Securely communicate with other users to coordinate details and arrange handovers."
      },
      {
        icon: <CreditCard className="w-8 h-8 text-primary" />,
        title: "Secure Payments",
        description: "Integrated payment system for safe and reliable transactions between shippers and travelers."
      },
      {
        icon: <MapPin className="w-8 h-8 text-primary" />,
        title: "Shipment Tracking",
        description: "Stay updated on your shipment's progress with real-time tracking from pickup to delivery."
      },
      {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "User Profiles & Reviews",
        description: "Build trust within the community through detailed profiles and user feedback."
      }
    ];

    const AppFeaturesOverview = () => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100
          }
        }
      };

      return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground dark:text-white mb-3">
                Powerful Features, Seamless Experience
              </h2>
              <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
                <span className="font-vernaccia-bold">Yankit</span> is designed to make peer-to-peer shipping straightforward and secure.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800/70 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/10 dark:bg-blue-600/20 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground dark:text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      );
    };

    export default AppFeaturesOverview;