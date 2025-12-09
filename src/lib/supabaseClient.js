import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://funprubplxgwmsswwauj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bnBydWJwbHhnd21zc3d3YXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNTQ2NTksImV4cCI6MjA2MzYzMDY1OX0.ZbUuoqEMHQboBEvuqwdtz718PMX1bZ_NEELaQaSeixg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);