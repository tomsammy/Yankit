import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Briefcase, LogIn } from 'lucide-react';

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 }
    };

    const UserAuthGuard = ({ onSignIn }) => (
      <motion.div
        initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.5 }}
        className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="p-4 bg-gradient-to-r from-primary to-secondary rounded-full shadow-xl mb-6"
        >
          <Briefcase className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-3">Access Your Dashboard</h2>
        <p className="text-lg text-muted-foreground dark:text-slate-300 max-w-md mb-8">
          Please sign in to manage your flights, baggage offers, and shipments.
        </p>
        <Button
          onClick={onSignIn}
          className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white dark:from-secondary dark:to-orange-400 py-3 px-6 text-lg"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In
        </Button>
      </motion.div>
    );

    export default UserAuthGuard;