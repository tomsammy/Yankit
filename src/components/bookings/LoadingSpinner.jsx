import React from 'react';
    import { motion } from 'framer-motion';

    const LoadingSpinner = () => (
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );

    export default LoadingSpinner;