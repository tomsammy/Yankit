import React from 'react';
    import { motion } from 'framer-motion';

    const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
      const spinnerSizeClasses = {
        sm: "w-8 h-8 border-2",
        md: "w-12 h-12 border-4",
        lg: "w-16 h-16 border-4",
      };

      const containerClasses = fullScreen 
        ? "flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800"
        : "flex items-center justify-center";

      return (
        <div className={containerClasses}>
          <motion.div
            className={`${spinnerSizeClasses[size]} border-primary dark:border-secondary border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    };

    export default LoadingSpinner;