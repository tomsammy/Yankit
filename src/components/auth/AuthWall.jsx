import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const AuthWall = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
        <LogIn className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-bold">Action Required</AlertTitle>
        <AlertDescription className="text-foreground/80 dark:text-slate-300">
          <p className="mb-4">Please sign in or create an account to list your bag and connect with our community of travelers.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/signin">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link to="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default AuthWall;