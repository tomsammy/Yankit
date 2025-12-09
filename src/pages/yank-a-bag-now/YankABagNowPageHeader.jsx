import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const YankABagNowPageHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative text-center mb-12 md:mb-16 py-12 md:py-16 px-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 dark:from-slate-800 dark:via-primary dark:to-blue-900"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20100%20100%22%3E%3Cpath%20d=%22M0%200h100v100H0z%22%20fill=%22none%22/%3E%3Cpath%20d=%22M10%2010h80v80H10z%22%20stroke=%22%23fff%22%20stroke-width=%22.2%22%20fill=%22none%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20opacity=%22.1%22/%3E%3C/svg%3E')] opacity-50"></div>
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 150 }}
          className="inline-block p-4 bg-white/20 rounded-full mb-4"
        >
          <Briefcase className="h-10 w-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-vernaccia-bold text-white drop-shadow-lg">
          Yank a Bag
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-white/90 drop-shadow-sm">
          Got extra space in your luggage? List it on Yankit and earn money by carrying items for others.
        </p>
      </div>
    </motion.div>
  );
};

export default YankABagNowPageHeader;