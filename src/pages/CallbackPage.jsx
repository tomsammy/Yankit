import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const CallbackPage = () => {
  const history = useHistory();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { user, session, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log("Error in callback:", error.message);
      } else if (user) {
        console.log("User authenticated:", user);
        history.push('/dashboard');
      }
    };

    handleAuthRedirect();
  }, [history]);

  return <div>Loading...</div>;
};

export default CallbackPage;
