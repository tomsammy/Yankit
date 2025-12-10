import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '@/lib/supabaseClient';

const CallbackPage = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleAuthRedirect = async () => {
        // Extract the token and other parameters from the URL fragment
        const hash = window.location.hash; // Get everything after the #
        const params = new URLSearchParams(hash.replace('#', '?')); // Replace # with ? to treat it like a query string
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
  
        if (access_token) {
          // Set session if token exists
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  
          if (error) {
            console.error('Error setting session:', error.message);
          } else {
            console.log('User authenticated');
            // Redirect to the dashboard or desired page
            navigate('/dashboard');
          }
        } else {
          console.log('No access token found');
        }
      };
  
      handleAuthRedirect();
    }, [navigate]);
  
    return <div>Loading...</div>;
  };
  
  export default CallbackPage;