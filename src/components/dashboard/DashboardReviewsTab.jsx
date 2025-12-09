import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import UserReviewsList from '@/components/reviews/UserReviewsList';

    const DashboardReviewsTab = ({ userId }) => {
      return (
        <Card className="shadow-lg glassmorphism dark:bg-slate-800/60 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">Reviews About You</CardTitle>
            <CardDescription className="text-sm text-muted-foreground dark:text-slate-400">See what other users are saying about their transactions with you.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserReviewsList userId={userId} />
          </CardContent>
        </Card>
      );
    };

    export default DashboardReviewsTab;