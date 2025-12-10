import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient'; // Your Supabase client

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Extract the token from the URL fragment (after #)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', '?')); // Convert fragment to query-like params
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token) {
        // Set session using the access_token
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });

        if (error) {
          console.error("Error setting session:", error.message);
          navigate('/error'); // Redirect to an error page or show a toast message
        } else {
          console.log("User authenticated.");
          navigate('/dashboard');  // Redirect to the dashboard after authentication
        }
      } else {
        console.log("No access token found.");
        navigate('/login'); // Redirect to login if token is missing
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
