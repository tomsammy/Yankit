import React, { useState, useEffect } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import DashboardHeader from '@/components/bookings/DashboardHeader';
    import BookingsTabs from '@/components/bookings/BookingsTabs';
    import LoadingSpinner from '@/components/bookings/LoadingSpinner';
    import UserAuthGuard from '@/components/bookings/UserAuthGuard';
    import { useSession } from '@/hooks/useSession';

    const MyBookingsPage = () => {
      const { session, loading: sessionLoading } = useSession();
      const location = useLocation();
      const navigate = useNavigate();
      const { toast } = useToast();

      const [activeTab, setActiveTab] = useState(location.state?.defaultTab || 'myListings');
      const [data, setData] = useState({
        myListings: [],
        sentShipments: [],
        carriedShipments: [],
      });
      const [loadingData, setLoadingData] = useState(true);

      useEffect(() => {
        if (location.state?.defaultTab) {
          setActiveTab(location.state.defaultTab);
        }
      }, [location.state]);

      useEffect(() => {
        if (!sessionLoading && session?.user) {
          fetchData();
        } else if (!sessionLoading && !session) {
          setLoadingData(false);
        }
      }, [session, sessionLoading]);

      const fetchData = async () => {
        if (!session?.user) return;
        setLoadingData(true);
        try {
          const [listingsRes, sentShipmentsRes, carriedShipmentsRes] = await Promise.all([
            supabase.from('listings').select(`*, profiles (full_name, avatar_url)`).eq('user_id', session.user.id).order('created_at', { ascending: false }),
            supabase.from('shipments').select(`*, listings (*, profiles (full_name, avatar_url)), traveler_profile:profiles!shipments_traveler_user_id_fkey (full_name, avatar_url), shipper_profile:profiles!shipments_shipper_user_id_fkey (full_name, avatar_url)`).eq('shipper_user_id', session.user.id).order('created_at', { ascending: false }),
            supabase.from('shipments').select(`*, listings (*, profiles (full_name, avatar_url)), traveler_profile:profiles!shipments_traveler_user_id_fkey (full_name, avatar_url), shipper_profile:profiles!shipments_shipper_user_id_fkey (full_name, avatar_url)`).eq('traveler_user_id', session.user.id).order('created_at', { ascending: false }),
          ]);

          if (listingsRes.error) throw listingsRes.error;
          if (sentShipmentsRes.error) throw sentShipmentsRes.error;
          if (carriedShipmentsRes.error) throw carriedShipmentsRes.error;
          
          setData({
            myListings: listingsRes.data || [],
            sentShipments: sentShipmentsRes.data || [],
            carriedShipments: carriedShipmentsRes.data || [],
          });
        } catch (error) {
          console.error('Error fetching user activity:', error);
          toast({
            title: 'Error Fetching Data',
            description: 'Could not load your activity. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoadingData(false);
        }
      };
      
      const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({ title: 'Error Signing Out', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
          navigate('/signin');
        }
      };

      const handleSignIn = () => {
        navigate('/signin', { state: { from: location.pathname } });
      };

      if (sessionLoading) {
        return <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><LoadingSpinner /></div>;
      }

      if (!session) {
        return <UserAuthGuard onSignIn={handleSignIn} />;
      }
      
      const profile = {
        name: session.user.user_metadata?.full_name || session.user.email,
        avatarUrl: session.user.user_metadata?.avatar_url,
      };

      return (
        <div className="container mx-auto py-8 px-4 md:px-6">
          <DashboardHeader 
            userName={profile.name} 
            userAvatar={profile.avatarUrl}
            onSignOut={handleSignOut}
          />
          {loadingData ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <BookingsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              data={data}
              userId={session.user.id}
              refreshData={fetchData}
            />
          )}
        </div>
      );
    };

    export default MyBookingsPage;