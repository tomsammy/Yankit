import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, SearchX } from 'lucide-react';

    const FlightResultsNoFlightsDisplay = ({ navigate }) => (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-md">
        <SearchX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground dark:text-white">No Flights Found</h3>
        <p className="text-muted-foreground dark:text-slate-400 mt-2">We couldn't find any flights matching your criteria. Try adjusting your search.</p>
        <Button onClick={() => navigate('/')} className="mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
          <ArrowLeft size={18} className="mr-2" /> Modify Search
        </Button>
      </motion.div>
    );

    export default FlightResultsNoFlightsDisplay;