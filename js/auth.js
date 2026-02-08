// Supabase Auth - Magic Link Sign In
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Will be replaced with env var
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Will be replaced with env var

// Initialize Supabase client
const { createClient } = supabase;
let supabaseClient;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Get Supabase credentials from meta tags (set by server)
    const supabaseUrl = document.querySelector('meta[name="supabase-url"]')?.content || SUPABASE_URL;
    const supabaseKey = document.querySelector('meta[name="supabase-key"]')?.content || SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('YOUR_')) {
        console.error('Supabase credentials not configured');
        return;
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    const authForm = document.getElementById('auth-form');
    
    if (authForm) {
        authForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            const messageDiv = document.getElementById('auth-message');
            const email = document.getElementById('email').value;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
            
            try {
                const { data, error } = await supabaseClient.auth.signInWithOtp({
                    email: email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/rsvp.html`
                    }
                });
                
                if (error) {
                    throw error;
                }
                
                messageDiv.textContent = `Magic link sent! Check your email (${email}) and click the link to continue.`;
                messageDiv.className = 'form-message success';
                authForm.reset();
                
            } catch (error) {
                console.error('Auth error:', error);
                messageDiv.textContent = error.message || 'Failed to send magic link. Please try again.';
                messageDiv.className = 'form-message error';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
