import React from 'react';
    import { motion } from 'framer-motion';
    import { PackageSearch } from 'lucide-react';

    const MyShipmentsHeader = () => {
      return (
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PackageSearch className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-3">
            My Shipments
          </h1>
          <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
            Review bags you have sent and bags you have carried for others. Reviews are an essential way to manage how you interact with the platform.
          </p>
        </motion.div>
      );
    };

    export default MyShipmentsHeader;