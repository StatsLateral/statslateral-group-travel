// Supabase Configuration
// This file initializes the Supabase client for client-side use
// Configuration is fetched from environment variables via API endpoint

let supabaseClient = null;
let configPromise = null;

// Fetch Supabase configuration from API endpoint
async function getSupabaseConfig() {
    if (!configPromise) {
        configPromise = fetch('/api/get-supabase-config')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Supabase configuration');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching Supabase config:', error);
                throw error;
            });
    }
    return configPromise;
}

// Initialize Supabase client
async function initSupabase() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    const config = await getSupabaseConfig();
    const { createClient } = supabase;
    supabaseClient = createClient(config.url, config.publishableKey);
    return supabaseClient;
}

// Check authentication status
async function checkAuth() {
    const client = await initSupabase();
    const { data: { session }, error } = await client.auth.getSession();
    return session;
}

// Get current user
async function getCurrentUser() {
    const client = await initSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    return user;
}

// Sign out
async function signOut() {
    const client = await initSupabase();
    const { error } = await client.auth.signOut();
    if (!error) {
        window.location.href = 'index.html';
    }
    return error;
}

// Get Supabase client (initializes if needed)
async function getSupabaseClient() {
    return await initSupabase();
}

// Export for use in other scripts
window.initSupabase = initSupabase;
window.getSupabaseClient = getSupabaseClient;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.signOut = signOut;
