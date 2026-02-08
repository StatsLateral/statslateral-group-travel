// Supabase Auth - Magic Link Sign In
// Supabase client is initialized via supabase-config.js

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
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
                // Get Supabase client from config
                const supabaseClient = await window.getSupabaseClient();
                
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
