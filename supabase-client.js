// supabase-client.js

// Replace these placeholders with your actual Supabase project credentials.
// You can find these in your Supabase Dashboard under Settings > API.
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export it for global use if using ES modules, 
// or attach to window for standard script inclusion.
window.supabaseClient = supabase;
