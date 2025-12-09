import React from 'react';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';

const ListYourBagPageHeader = () => {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PackagePlus className="w-16 h-16 text-primary mx-auto mb-4" />
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 mb-4 leading-tight md:leading-snug">
        List Your Bag
      </h1>
      <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
        Create a listing for the bag you want to send. Travellers (Yankers) will be able to see your request and make offers to carry it for you.
      </p>
    </motion.div>
  );
};

export default ListYourBagPageHeader;