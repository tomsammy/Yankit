import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';

const SendABagPageHeader = () => {
  return (
    <>
      <Helmet>
        <title>Send a Bag - Yankit</title>
        <meta name="description" content="Request a trusted traveler to carry your items. Securely send your baggage with Yankit." />
        <meta property="og:title" content="Send a Bag - Yankit" />
        <meta property="og:description" content="Request a trusted traveler to carry your items. Securely send your baggage with Yankit." />
      </Helmet>
      <motion.div 
        className="text-center mb-8 py-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PackagePlus className="mx-auto h-16 w-16 mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          Send Your Bag, Stress-Free!
        </h1>
        <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
          Connect with trusted travelers heading your way.
        </p>
      </motion.div>
    </>
  );
};

export default SendABagPageHeader;