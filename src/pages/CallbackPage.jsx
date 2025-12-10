import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Log the full URL hash for debugging
      const hash = window.location.hash;
      console.log('URL hash:', hash);  // Log the full hash part

      // Convert the hash into query-like parameters
      const params = new URLSearchParams(hash.replace('#', '?'));  // Replace # with ? to parse as query params

      // Extract access_token and refresh_token
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      // Log extracted tokens for debugging
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);

      // Log the complete URL for context
      console.log('Full URL:', window.location.href);

      // Check if the access token is found
      if (access_token) {
        console.log('Found access token:', access_token);
        console.log('Found refresh token:', refresh_token);

        // Set the session with the access token and refresh token
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });

        if (error) {
          console.error('Error setting session:', error.message);
          navigate('/error');
        } else {
          console.log('User authenticated successfully');
          navigate('/dashboard');
        }
      } else {
        console.log('No access token found.');
        // navigate('/login');
      }
    };

    // Call the function to handle the authentication redirect
    handleAuthRedirect();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
