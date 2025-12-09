import React from 'react';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';

    const AuthErrorDisplay = ({ onRetry, message, title = "Authentication Error" }) => (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background dark:bg-slate-900">
        <div className="p-8 bg-card dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-4">{title}</h1>
          <p className="text-muted-foreground dark:text-slate-300 mb-6">
            {message || "We encountered an issue connecting to the authentication service. Please check your internet connection and try again."}
          </p>
          <Button 
            onClick={onRetry} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-secondary dark:hover:bg-secondary/90 dark:text-secondary-foreground"
            aria-label="Retry authentication"
          >
            Retry
          </Button>
        </div>
      </div>
    );
    AuthErrorDisplay.displayName = "AuthErrorDisplay";

    export default AuthErrorDisplay;