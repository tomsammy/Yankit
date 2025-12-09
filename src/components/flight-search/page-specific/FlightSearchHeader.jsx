import React from 'react';
import { motion } from 'framer-motion';

const FlightSearchHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center"
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-600">
        Your Journey Begins Here
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-white drop-shadow-md max-w-2xl mx-auto">
        Discover and book affordable flights tailored to your needs.
      </p>
    </motion.div>
  );
};

export default FlightSearchHeader;