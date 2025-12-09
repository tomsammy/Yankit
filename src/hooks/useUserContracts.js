import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const useUserContracts = () => {
  const { session } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select(`
          *,
          listing:listings (*),
          shipper:profiles!shipper_user_id (*),
          traveler:profiles!traveler_user_id (*)
        `)
        .or(`shipper_user_id.eq.${session.user.id},traveler_user_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      
      setContracts(data || []);
    } catch (e) {
      console.error("Failed to fetch user contracts:", e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, loading, error, refetchContracts: fetchContracts };
};

export default useUserContracts;