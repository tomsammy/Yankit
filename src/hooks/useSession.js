import { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';

    export const useSession = () => {
      const [session, setSession] = useState(null);
      const [loading, setLoading] = useState(true);
      const [user, setUser] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
        let mounted = true;
        setLoading(true);

        const fetchSessionAndUser = async () => {
          try {
            const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              if (mounted) {
                setError(sessionError);
                console.error("Error fetching session:", sessionError);
              }
            } else if (mounted) {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
            }
          } catch (e) {
            if (mounted) {
              setError(e);
              console.error("Exception fetching session:", e);
            }
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        };

        fetchSessionAndUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (loading) { 
              setLoading(false); 
            }
            setError(null); 
          }
        });

        return () => {
          mounted = false;
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      }, []); 

      return { session, user, loading, error };
    };