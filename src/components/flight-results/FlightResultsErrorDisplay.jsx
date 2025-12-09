import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, AlertTriangle } from 'lucide-react';

    const FlightResultsErrorDisplay = ({ error, navigate }) => (
      <div className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-background dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive mb-2">Search Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
            <ArrowLeft size={18} className="mr-2" /> Go Back to Search
          </Button>
        </motion.div>
      </div>
    );

    export default FlightResultsErrorDisplay;