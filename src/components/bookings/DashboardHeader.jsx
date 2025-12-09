import React from 'react';
    import { motion } from 'framer-motion';
    import { Briefcase, LayoutDashboard } from 'lucide-react';

    const DashboardHeader = ({ title = "My Dashboard", subtitle = "Manage your activities all in one place."}) => (
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-block p-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg mx-auto mb-4"
        >
          <LayoutDashboard className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary mb-3">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-xl mx-auto">
          {subtitle}
        </p>
      </motion.div>
    );

    export default DashboardHeader;