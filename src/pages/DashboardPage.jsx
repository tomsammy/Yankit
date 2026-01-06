import React, { useState, useEffect } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { User, Star, Settings, Briefcase, MessageSquare } from 'lucide-react';
    import { motion } from 'framer-motion';

    import DashboardHeader from '@/components/dashboard/DashboardHeader';
    import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
    import DashboardProfileTab from '@/components/dashboard/DashboardProfileTab';
    import DashboardReviewsTab from '@/components/dashboard/DashboardReviewsTab';
    import DashboardSettingsTab from '@/components/dashboard/DashboardSettingsTab';
    import UserAuthGuard from '@/components/auth/UserAuthGuard';
    import LoadingSpinner from '@/components/ui/LoadingSpinner'; 
    import { useAuth } from '@/contexts/AuthContext';
    import useDashboardLogic from '@/components/dashboard/hooks/useDashboardLogic';
    import AuthErrorDisplay from '@/components/auth/AuthErrorDisplay';
    import DashboardDataErrorDisplay from '@/components/dashboard/DashboardDataErrorDisplay';
    import MyListingsTab from '@/components/listings/MyListingsTab';

    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    };

    const DashboardPageComponent = () => {
      const { session, loading: authLoading, authError, signOut } = useAuth(); 
      const { 
        profile,
        loading: dataLoading,
        stats,
        error: dataError,
        handleProfileUpdate,
        shipments,
        yankings,
        isLoadingShipments,
        isLoadingYankings,
        fetchAllData
      } = useDashboardLogic(session);
            
      const navigate = useNavigate();
      const location = useLocation();

      const [activeTab, setActiveTab] = useState(location.state?.defaultTab || "profile");
      
      useEffect(() => {
        if (location.state?.defaultTab) {
            setActiveTab(location.state.defaultTab);
        }

      }, [location.state]);


      const isLoading = authLoading || (dataLoading && !profile);
      
      if (isLoading) { 
        return <LoadingSpinner fullScreen={true} />;
      }

      if (authError) {
        return <AuthErrorDisplay 
                  onRetry={() => window.location.reload()} 
                  message={authError.message || "Could not verify your session. Please check your internet connection and try again."}
                />;
      }
      
      if (!session) { 
         return <UserAuthGuard onSignIn={() => navigate('/signin', { state: { from: '/dashboard' }})} />;
      }
      
      if (dataError && !profile) { 
        return <DashboardDataErrorDisplay onRetry={() => fetchAllData(session.user)} onGoHome={() => navigate('/')} />;
      }
      
      if (!profile) {
        return <LoadingSpinner fullScreen={true} />;
      }

      const tabItems = [
        { value: "profile", label: "Profile", icon: User, content: <DashboardProfileTab profile={profile} session={session} onProfileUpdate={handleProfileUpdate} stats={stats} /> },
        { value: "listings", label: "My Listings", icon: Briefcase, content: <MyListingsTab 
          shipments={shipments}
          yankings={yankings}
          isLoadingShipments={isLoadingShipments}
          isLoadingYankings={isLoadingYankings}        />
         },
        { value: "messages", label: "Messages", icon: MessageSquare, content: <p className="text-center text-muted-foreground">🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀</p> },
        { value: "reviews", label: "My Reviews", icon: Star, content: <DashboardReviewsTab userId={session?.user?.id} /> },
        { value: "settings", label: "Settings", icon: Settings, content: <DashboardSettingsTab /> },
      ];

      return (
        <motion.div 
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4 md:px-6 text-foreground dark:text-slate-100"
        >
          <DashboardHeader profile={profile} onSignOut={signOut} />
          <DashboardQuickActions />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-15 bg-primary/10 dark:bg-slate-800/60 p-2 rounded-lg ">
              {tabItems.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center justify-center py-3 px-2 text-sm font-medium rounded-md transition-all
                            text-slate-600 dark:text-slate-300 
                            hover:bg-sky-100 dark:hover:bg-slate-700/80
                            data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 
                            dark:data-[state=active]:from-purple-500 dark:data-[state=active]:to-indigo-500
                            data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabItems.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6 bg-card dark:bg-slate-800/40 p-4 md:p-6 rounded-lg shadow-md">
                 {(isLoadingShipments || isLoadingYankings) && activeTab === tab.value ? <LoadingSpinner /> : tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      );
    };

    export default DashboardPageComponent;