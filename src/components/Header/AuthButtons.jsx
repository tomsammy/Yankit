import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const AuthButtons = ({ onLinkClick = () => {} }) => {  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Sign Out Error',
        description: error.message || 'An unexpected error occurred during sign out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {session ? (
        <>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button asChild variant="secondary" onClick={onLinkClick}>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button variant="gradient" onClick={() => { handleSignOut(); onLinkClick(); }}>
              Sign Out
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button asChild variant="ghost" onClick={onLinkClick}>
              <Link to="/signin">Sign In</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button asChild onClick={onLinkClick}>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

AuthButtons.displayName = "AuthButtons";

export default AuthButtons;