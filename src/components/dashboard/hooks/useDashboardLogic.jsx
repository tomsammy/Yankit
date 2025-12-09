import { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { AlertTriangle } from 'lucide-react';

    const fetchSupabaseCount = async (table, userIdField, userId) => {
      const { count, error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq(userIdField, userId);
      if (error) {
        console.error(`Supabase query error for ${table} count:`, error.message);
        throw error;
      }
      return count || 0;
    };

    const fetchSupabaseData = async (table, selectQuery, userIdField, userId) => {
      const { data, error } = await supabase
        .from(table)
        .select(selectQuery)
        .eq(userIdField, userId);
      if (error) {
        console.error(`Supabase query error for ${table} data:`, error.message);
        throw error;
      }
      return data || [];
    };
    
    const useDashboardLogic = (session) => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [stats, setStats] = useState({ listings: 0, shipmentsSent: 0, shipmentsCarried: 0, rating: 0, reviews: 0 });
      const [sentShipments, setSentShipments] = useState([]);
      const [carryingShipments, setCarryingShipments] = useState([]);
      const [isLoadingSent, setIsLoadingSent] = useState(true);
      const [isLoadingCarrying, setIsLoadingCarrying] = useState(true);
      const [error, setError] = useState(null);

      const navigate = useNavigate();
      const { toast } = useToast();

      const fetchAllData = useCallback(async (user) => {
        if (!user) {
          setLoading(false);
          setError(new Error("User is not authenticated."));
          return;
        }
        
        setLoading(true);
        setError(null);
        setIsLoadingSent(true);
        setIsLoadingCarrying(true);

        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError) throw profileError;
          setProfile(profileData);

          const [listingsCount, shipmentsSentCount, shipmentsCarriedCount, reviewsData] = await Promise.all([
            fetchSupabaseCount('listings', 'user_id', user.id),
            fetchSupabaseCount('shipments', 'shipper_user_id', user.id),
            fetchSupabaseCount('shipments', 'traveler_user_id', user.id),
            fetchSupabaseData('reviews', 'rating, id', 'reviewed_user_id', user.id)
          ]);
          
          const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
          const avgRating = reviewsData.length > 0 ? (totalRating / reviewsData.length)?.toFixed(1) : 0;

          setStats({
            listings: listingsCount,
            shipmentsSent: shipmentsSentCount,
            shipmentsCarried: shipmentsCarriedCount,
            rating: parseFloat(avgRating),
            reviews: reviewsData.length,
          });

          const sentPromise = supabase
            .from('shipments')
            .select('*, traveler_profile:profiles!shipments_traveler_user_id_fkey(full_name, avatar_url), listing:listings(origin, destination, departure_date)')
            .eq('shipper_user_id', user.id)
            .order('created_at', { ascending: false });

          const carryingPromise = supabase
            .from('shipments')
            .select('*, sender_profile:profiles!shipments_shipper_user_id_fkey(full_name, avatar_url), listing:listings(origin, destination, departure_date)')
            .eq('traveler_user_id', user.id)
            .order('created_at', { ascending: false });
          
          const [{data: sentData, error: sentError}, {data: carryingData, error: carryingError}] = await Promise.all([sentPromise, carryingPromise]);

          if(sentError) throw sentError;
          setSentShipments(sentData || []);
          setIsLoadingSent(false);

          if(carryingError) throw carryingError;
          setCarryingShipments(carryingData || []);
          setIsLoadingCarrying(false);

        } catch (err) {
          console.error("Dashboard data fetch error:", err);
          setError(err);
          let description = err.message || "An unexpected error occurred.";
          if (err.message?.toLowerCase().includes('failed to fetch') || err.message?.toLowerCase().includes('network error')) {
            description = 'A network error occurred while loading dashboard data. Please check your internet connection and try again.';
          } else if (err.code === 'PGRST116') {
             description = "Your profile could not be found. It might not have been created yet. Please try refreshing the page.";
          }
          toast({ 
            title: 'Error Loading Dashboard Data', 
            description, 
            variant: 'destructive',
            icon: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
          });
        } finally {
          setLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        if (session?.user) {
          fetchAllData(session.user);
        } else if (!session && session !== undefined) { 
          setLoading(false);
        }
      }, [session, fetchAllData, navigate]);
      
      const handleProfileUpdate = useCallback(async (updatedProfileData) => {
        if (!session?.user) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updatedProfileData)
                .eq('id', session.user.id);
            if (error) throw error;
            setProfile(prev => ({...prev, ...updatedProfileData}));
            return { success: true };
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }, [session]);

      return { profile, loading, stats, error, handleProfileUpdate, sentShipments, carryingShipments, isLoadingSent, isLoadingCarrying, fetchAllData };
    };
    
    export default useDashboardLogic;