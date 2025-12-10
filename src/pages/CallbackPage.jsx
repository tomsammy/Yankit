import { useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { user, session, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log("Error in callback:", error.message);
      } else if (user) {
        console.log("User authenticated:", user);
        navigate('/dashboard');      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
