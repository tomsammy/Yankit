import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { notifyShipmentCancelledForYanker, notifyYankingCancelledForShipper } from '@/lib/notify';

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

  const deleteYanking = async (yanking) => {
    const { data: shipments, error: refErr } = await supabase
      .from('shipments')
      .select('*')
      .eq('matched_yanking_id', yanking.id);
  
    if (refErr) throw refErr;
  
    for (const shipment of shipments || []) {
      await supabase
        .from('shipments')
        .update({
          traveler_user_id: null,
          matched_yanking_id: null,
          status: 'awaiting_yanker',
        })
        .eq('id', shipment.id);
  
      const { data: shipper } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', shipment.shipper_user_id)
        .single();
  
      if (shipper?.email) {
        await notifyYankingCancelledForShipper({ to: shipper.email });
      }
    }
  
    const { error } = await supabase
      .from('yankings')
      .delete()
      .eq('id', yanking.id);
  
    if (error) throw error;
  
    fetchListings();
  };
  
  
  const deleteShipment = async (shipment) => {
    try {
      if (shipment.is_paid) {
        const { data, error } = await supabase.functions.invoke('cancel-shipment-and-refund', {
          body: { shipmentId: shipment.id, retainFeePercentage: 0.2 },
        });
        if (error) throw error;
  
        if (shipment.traveler_user_id) {
          const { data: traveler } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', shipment.traveler_user_id)
            .single();
          if (traveler?.email) await notifyShipmentCancelledForYanker({ to: traveler.email });
        }
      }
  
      if (shipment.matched_yanking_id) {
        await supabase
          .from('yankings')
          .update({ matched_shipment_id: null, status: 'available' })
          .eq('id', shipment.matched_yanking_id);
      }
  
      const { data: deletedData, error: deleteError } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipment.id)
        .select();
      if (deleteError) throw deleteError;
  
      fetchListings();
      return deletedData;
    } catch (err) {
      console.error(err);
      throw err;
    }
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
