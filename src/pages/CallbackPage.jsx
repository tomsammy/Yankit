import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { supabase } from '@/lib/supabaseClient';

const CallbackPage = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const handleAuthRedirect = async () => {
        const hash = window.location.hash; 
        const params = new URLSearchParams(hash.replace('#', '?'));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
  
        if (access_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  
          if (error) {
            console.error('Error setting session:', error.message);
          } else {
            console.log('User authenticated');
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