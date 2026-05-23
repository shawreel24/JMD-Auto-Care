// supabase-client.js

// Supabase project credentials
// Note: The anon/publishable key is safe to include here — it is restricted by Row Level Security (RLS).
const SUPABASE_URL = 'https://azregvpcwuhrsrrovmfu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9zROIKCIUb1p0zZC2rniOA_0mVVd36r';

// Initialize the Supabase client and attach to window for global access.
// NOTE: We avoid `const supabase` because the CDN already declares a global `supabase` variable.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
