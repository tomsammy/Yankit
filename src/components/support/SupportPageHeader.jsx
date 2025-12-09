import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

    const SupportPageHeader = () => {
      return (
        <motion.div 
          className="relative text-center py-20 md:py-32 px-4 bg-gradient-to-br from-primary via-blue-500 to-accent overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 -z-10">
            <img  
              alt="Abstract geometric background for support header" 
              className="w-full h-full object-cover opacity-20"
             src="https://images.unsplash.com/photo-1610459946348-d256a697227a" />
          </div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 15 }}
            className="inline-block p-5 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full shadow-xl mb-6"
          >
            <HelpCircle className="w-16 h-16 text-white" />
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold text-white mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="font-vernaccia-bold">Yankit</span> Support Center
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            We're here to help! Whether you have a question, need assistance, or want to provide feedback, find your answers or reach out to us.
          </motion.p>
        </motion.div>
      );
    };

    export default SupportPageHeader;