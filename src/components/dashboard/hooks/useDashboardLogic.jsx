import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

const fetchCount = async (table, column, userId) => {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, userId);

  if (error) throw error;
  return count ?? 0;
};

const fetchData = async (table, query, column, userId) => {
  const { data, error } = await supabase
    .from(table)
    .select(query)
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

const useDashboardLogic = (session) => {
  const { toast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    listings: 0,
    shipmentsSent: 0,
    shipmentsCarried: 0,
    rating: 0,
    reviews: 0,
  });

  const [sentShipments, setSentShipments] = useState([]);
  const [carryingShipments, setCarryingShipments] = useState([]);
  const [isLoadingSent, setIsLoadingSent] = useState(true);
  const [isLoadingCarrying, setIsLoadingCarrying] = useState(true);

  const fetchAllData = useCallback(async (user) => {
    if (!user) {
      setLoading(false);
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

      const [
        yankingCount,
        sentCount,
        carriedCount,
        reviews,
      ] = await Promise.all([
        fetchCount('yankings', 'yanker_user_id', user.id),
        fetchCount('shipments', 'shipper_user_id', user.id),
        fetchCount('shipments', 'traveler_user_id', user.id),
        fetchData('reviews', 'id, rating', 'reviewed_user_id', user.id),
      ]);

      const avgRating =
        reviews.length > 0
          ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
          : 0;

      setStats({
        listings: yankingCount,
        shipmentsSent: sentCount,
        shipmentsCarried: carriedCount,
        rating: Number(avgRating),
        reviews: reviews.length,
      });

      const sent = await fetchData(
        'shipments',
        '*, traveler_profile:profiles!shipments_traveler_user_id_fkey(full_name, avatar_url)',
        'shipper_user_id',
        user.id
      );

      const carried = await fetchData(
        'shipments',
        '*, sender_profile:profiles!shipments_shipper_user_id_fkey(full_name, avatar_url)',
        'traveler_user_id',
        user.id
      );

      setSentShipments(sent);
      setCarryingShipments(carried);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err);

      toast({
        title: 'Dashboard Error',
        description: err.message || 'Failed to load dashboard data',
        variant: 'destructive',
        icon: <AlertTriangle className="h-5 w-5" />,
      });

    } finally {
      setIsLoadingSent(false);
      setIsLoadingCarrying(false);
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session?.user) {
      fetchAllData(session.user);
    } else {
      setLoading(false);
    }
  }, [session, fetchAllData]);

  const handleProfileUpdate = async (payload) => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', session.user.id);

    if (error) throw error;
    setProfile(p => ({ ...p, ...payload }));
  };

  return {
    profile,
    loading,
    stats,
    error,
    sentShipments,
    carryingShipments,
    isLoadingSent,
    isLoadingCarrying,
    fetchAllData,
    handleProfileUpdate,
  };
};

export default useDashboardLogic;
