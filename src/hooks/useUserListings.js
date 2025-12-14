import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const useUserListings = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const userId = session?.user?.id;

  const [yankingListings, setYankingListings] = useState([]);
  const [shippingListings, setShippingListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    if (!userId) {
      setYankingListings([]);
      setShippingListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [{ data: yankings, error: yErr }, { data: shipments, error: sErr }] =
        await Promise.all([
          supabase
            .from('yankings')
            .select('*')
            .eq('yanker_user_id', userId)
            .order('created_at', { ascending: false }),

          supabase
            .from('shipments')
            .select('*')
            .eq('shipper_user_id', userId)
            .order('created_at', { ascending: false }),
        ]);

      if (yErr) throw yErr;
      if (sErr) throw sErr;

      setYankingListings(yankings || []);
      setShippingListings(shipments || []);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load your listings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const deleteYanking = async (id) => {
    const { error } = await supabase.from('yankings').delete().eq('id', id);
    if (error) throw error;
    fetchListings();
  };

  const deleteShipment = async (id) => {
    const { error } = await supabase.from('shipments').delete().eq('id', id);
    if (error) throw error;
    fetchListings();
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    yankingListings,
    shippingListings,
    isLoading,
    deleteYanking,
    deleteShipment,
  };
};

export default useUserListings;
