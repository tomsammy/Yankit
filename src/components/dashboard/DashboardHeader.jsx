import React from 'react';
    import { Button } from '@/components/ui/button';
    import { LogOut } from 'lucide-react';

    const DashboardHeader = ({ profile, onSignOut }) => {
      const getFirstName = (fullName) => {
        if (!fullName) return null;
        return fullName.split(' ')[0];
      };
      
      const displayName = profile?.first_name || getFirstName(profile?.full_name) || profile?.email || 'User';

      return (
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                Welcome back, <span className="text-primary dark:text-purple-400">{displayName}</span>!
              </h1>
              <p className="text-muted-foreground dark:text-slate-300 mt-1">Here's your <span className="font-vernaccia-bold">Yankit</span> activity overview.</p>
            </div>
            <Button onClick={onSignOut} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white">
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>
        </header>
      );
    };

    export default DashboardHeader;