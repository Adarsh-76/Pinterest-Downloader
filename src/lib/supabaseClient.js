import { createClient } from '@supabase/supabase-js';

// These will be populated from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enables persistent login
    autoRefreshToken: true, // Refreshes token automatically
    detectSessionInUrl: true, // Handles email verification redirects
  },
});
