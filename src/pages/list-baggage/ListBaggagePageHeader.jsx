import React from 'react';
    import { motion } from 'framer-motion';
    import { Briefcase } from 'lucide-react';

    const ListBaggagePageHeader = React.memo(() => (
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 mb-4 leading-tight md:leading-snug">
          Yank a Bag
        </h1>
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
          Travelling soon? Earn money by offering your unused baggage allowance. Fill out the form below to connect with people who want to send their bags.
        </p>
      </motion.div>
    ));
    ListBaggagePageHeader.displayName = "ListBaggagePageHeader";

    export default ListBaggagePageHeader;