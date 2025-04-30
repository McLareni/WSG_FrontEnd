import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_LOGIN_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };