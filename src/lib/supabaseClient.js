import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

export default supabaseClient;

export { 
    supabaseClient,
    supabaseClient as supabase,
};
