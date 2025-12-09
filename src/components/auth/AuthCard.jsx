import React from 'react';
    import { Card } from '@/components/ui/card';

    const AuthCard = ({ children, className = "" }) => {
      return (
        <Card className={`w-full shadow-2xl glassmorphism border-slate-300/30 dark:border-slate-700/30 dark:bg-slate-800/50 backdrop-blur-lg ${className}`}>
          {children}
        </Card>
      );
    };

    export default AuthCard;