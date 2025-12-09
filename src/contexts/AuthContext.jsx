import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate, useLocation } from 'react-router-dom';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [session, setSession] = useState(undefined); 
      const [userLoading, setUserLoading] = useState(true); 
      const [authError, setAuthError] = useState(null);
      const { toast } = useToast();
      const navigate = useNavigate();
      const location = useLocation();

      const createProfileIfNeeded = useCallback(async (currentUser) => {
        if (!currentUser) return;

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', currentUser.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') { // PGRST116: Row does not exist
            const userMetaData = currentUser.user_metadata;
            const newProfile = {
              id: currentUser.id,
              email: currentUser.email,
              full_name: userMetaData?.full_name || `${userMetaData?.first_name || ''} ${userMetaData?.surname || ''}`.trim() || 'New User',
              first_name: userMetaData?.first_name || '',
              surname: userMetaData?.surname || '',
              avatar_url: userMetaData?.avatar_url || null,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            };
            const { error: insertError } = await supabase.from('profiles').insert(newProfile);
            if (insertError) {
              toast({ title: 'Profile Creation Failed', description: `Could not save profile: ${insertError.message}`, variant: 'destructive' });
            } else {
              toast({ title: 'Profile Created', description: 'Your profile has been successfully created.', variant: 'default', className: "bg-green-500 dark:bg-green-600 text-white" });
            }
          } else if (profileError) {
            toast({ title: 'Error loading profile', description: profileError.message, variant: 'destructive' });
          }
        } catch (error) {
          toast({ title: 'Profile Operation Failed', description: error.message, variant: 'destructive' });
        }
      }, [toast]);


      useEffect(() => {
        setUserLoading(true);
        setAuthError(null);
        
        supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
          if (error) {
            console.error("Error fetching initial session:", error);
            toast({ title: "Session Error", description: `Failed to fetch initial session: ${error.message}. Check network.`, variant: "destructive" });
            setAuthError(error.message);
            setSession(null);
          } else {
            setSession(initialSession);
            if (initialSession?.user) {
              await createProfileIfNeeded(initialSession.user);
            }
          }
          setUserLoading(false); 
        }).catch(error => {
            console.error("Critical error during initial session fetch:", error);
            toast({ title: "Application Error", description: "A critical error occurred. Check network.", variant: "destructive" });
            setAuthError(error.message);
            setSession(null);
            setUserLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
          setSession(currentSession);
          setAuthError(null);
          
          if (_event === 'SIGNED_IN' && currentSession?.user) {
            await createProfileIfNeeded(currentSession.user);
            
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const type = hashParams.get('type');

            if (type === 'invite' || type === 'signup' || _event === 'USER_UPDATED' || (currentSession?.user?.email_confirmed_at && !currentSession?.user?.last_sign_in_at)) {
              toast({ title: "Welcome!", description: "You're signed in and ready to go!", variant: "default", className: "bg-green-500 dark:bg-green-600 text-white" });
              if (window.location.hash) {
                window.location.hash = ''; 
              }
              navigate('/dashboard', { replace: true });
            }
          } else if (_event === 'SIGNED_OUT') {
            navigate('/signin', { replace: true });
          }
          
          if (userLoading) setUserLoading(false);
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      }, [toast, createProfileIfNeeded, navigate, userLoading]);


      useEffect(() => {
        if (userLoading || session === undefined) return; 

        const currentUser = session?.user;
        const fromPath = location.state?.from;
        const searchCriteria = location.state?.searchCriteria;
        const formData = location.state?.formData;
        
        if (currentUser) { 
          const isAuthPage = ['/signin', '/signup', '/confirm-email'].includes(location.pathname);
          
          if (isAuthPage) {
             navigate(fromPath || '/dashboard', { replace: true, state: { searchCriteria, formData } });
          } else if (fromPath && fromPath !== location.pathname) {
             navigate(fromPath, { replace: true, state: { searchCriteria, formData } });
          }
        } else { 
          const protectedRoutes = ['/dashboard', '/my-activity', '/my-bookings', '/my-shipments', '/payment', '/tracking'];
          if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
            if (location.pathname !== '/signin') {
              navigate('/signin', { replace: true, state: { from: location.pathname } });
            }
          }
        }
      }, [session, userLoading, location, navigate, toast]);

      return (
        <AuthContext.Provider value={{ session, loading: userLoading, authError, setSession }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };