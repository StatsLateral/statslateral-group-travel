// Supabase Configuration
// This file initializes the Supabase client for client-side use

// These will be replaced with actual values from environment variables
// For now, they need to be set manually or via a build process
const SUPABASE_URL = window.location.hostname === 'localhost' 
    ? 'YOUR_SUPABASE_URL' 
    : 'YOUR_SUPABASE_URL';

const SUPABASE_PUBLISHABLE_KEY = window.location.hostname === 'localhost'
    ? 'YOUR_SUPABASE_PUBLISHABLE_KEY'
    : 'YOUR_SUPABASE_PUBLISHABLE_KEY';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check authentication status
async function checkAuth() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    return session;
}

// Get current user
async function getCurrentUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    return user;
}

// Sign out
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        window.location.href = 'index.html';
    }
    return error;
}

// Export for use in other scripts
window.supabaseClient = supabaseClient;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.signOut = signOut;
