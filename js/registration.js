// Registration form handler
document.addEventListener('DOMContentLoaded', async function() {
    const authRequired = document.getElementById('auth-required');
    const mainContent = document.getElementById('main-content');
    
    // Handle auth callback from magic link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
        // Magic link callback - exchange token for session
        try {
            const client = await window.getSupabaseClient();
            const { data, error } = await client.auth.setSession({
                access_token: accessToken,
                refresh_token: hashParams.get('refresh_token')
            });
            
            if (error) {
                console.error('Session error:', error);
            }
            
            // Clean up URL hash
            window.history.replaceState(null, '', window.location.pathname);
        } catch (error) {
            console.error('Auth callback error:', error);
        }
    }
    
    // Check authentication status
    const session = await checkAuth();
    
    if (!session) {
        // User not authenticated, show auth required message
        if (authRequired) authRequired.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        return;
    }
    
    // User is authenticated, show the form
    if (authRequired) authRequired.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    const registrationForm = document.getElementById('registration-form');
    const willAttendRadio = document.getElementById('will-attend');
    const cannotAttendRadio = document.getElementById('cannot-attend');
    const wishField = document.getElementById('wish-field');
    const attendanceFields = document.getElementById('attendance-fields');
    
    // Handle radio button changes
    function handleAttendanceChange() {
        const wishTextarea = document.getElementById('wish');
        
        if (willAttendRadio && willAttendRadio.checked) {
            // Show attendance fields, hide wish field
            attendanceFields.style.display = 'block';
            wishField.style.display = 'none';
            
            // Enable attendance fields and make them required
            const inputs = attendanceFields.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.disabled = false;
                if (input.id === 'email' || input.id === 'phone' || 
                    input.id === 'arrival-date' || input.id === 'departure-date' ||
                    input.id === 'connection') {
                    input.setAttribute('required', 'required');
                }
            });
            
            // Disable and clear wish field
            wishTextarea.disabled = true;
            wishTextarea.removeAttribute('required');
            wishTextarea.value = '';
            
        } else if (cannotAttendRadio && cannotAttendRadio.checked) {
            // Show wish field, hide attendance fields
            wishField.style.display = 'block';
            attendanceFields.style.display = 'none';
            
            // Disable attendance fields and remove required
            const inputs = attendanceFields.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.disabled = true;
                input.removeAttribute('required');
            });
            
            // Enable wish field and make it required
            wishTextarea.disabled = false;
            wishTextarea.setAttribute('required', 'required');
        }
    }
    
    // Add event listeners to radio buttons
    if (willAttendRadio) {
        willAttendRadio.addEventListener('change', handleAttendanceChange);
    }
    if (cannotAttendRadio) {
        cannotAttendRadio.addEventListener('change', handleAttendanceChange);
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            const messageDiv = document.getElementById('form-message');
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
            
            // Get authenticated user
            const user = await getCurrentUser();
            if (!user) {
                messageDiv.textContent = 'Authentication error. Please sign in again.';
                messageDiv.className = 'form-message error';
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }
            
            // Get form data
            const cannotAttend = document.getElementById('cannot-attend').checked;
            const formData = {
                userId: user.id,
                name: document.getElementById('name').value,
                cannotAttend: cannotAttend,
                wish: cannotAttend ? document.getElementById('wish').value : null,
                email: cannotAttend ? null : document.getElementById('email').value,
                phone: cannotAttend ? null : document.getElementById('phone').value,
                arrivalDate: cannotAttend ? null : document.getElementById('arrival-date').value,
                departureDate: cannotAttend ? null : document.getElementById('departure-date').value,
                connection: cannotAttend ? null : document.getElementById('connection').value,
                restrictions: cannotAttend ? null : document.getElementById('restrictions').value
            };
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    messageDiv.textContent = result.message || 'Registration submitted successfully! Redirecting...';
                    messageDiv.className = 'form-message success';
                    
                    // Redirect to index page with attendee board in focus after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = '/index.html#join';
                    }, 1500);
                } else {
                    messageDiv.textContent = result.error || 'Failed to submit registration. Please try again.';
                    messageDiv.className = 'form-message error';
                }
            } catch (error) {
                console.error('Registration error:', error);
                messageDiv.textContent = 'Network error. Please check your connection and try again.';
                messageDiv.className = 'form-message error';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
