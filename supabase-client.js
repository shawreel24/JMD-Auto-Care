// supabase-client.js

// Read credentials from env.js (window.ENV) if available, otherwise fallback to placeholders
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.warn('Supabase credentials are not configured. Please copy env.example.js to env.js and fill in your credentials.');
}

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export it for global use if using ES modules, 
// or attach to window for standard script inclusion.
window.supabaseClient = supabase;

