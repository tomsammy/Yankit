import React from 'react';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';

    const DashboardDataErrorDisplay = ({ onRetry, onGoHome }) => (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          Could not load your dashboard data. This might be due to an incomplete profile or a network issue.
          Please try again, or if the problem persists, ensure your profile is fully set up.
        </p>
        <div className="flex space-x-4">
            <Button onClick={onRetry} className="bg-primary hover:bg-primary/90 text-white">
                Retry
            </Button>
            <Button onClick={onGoHome} variant="outline">
                Go to Homepage
            </Button>
        </div>
      </div>
    );
    DashboardDataErrorDisplay.displayName = "DashboardDataErrorDisplay";

    export default DashboardDataErrorDisplay;