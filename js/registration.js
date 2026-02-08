// Registration form handler
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    
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
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                arrivalDate: document.getElementById('arrival-date').value,
                departureDate: document.getElementById('departure-date').value,
                restrictions: document.getElementById('restrictions').value
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
                    messageDiv.textContent = result.message || 'Registration submitted successfully!';
                    messageDiv.className = 'form-message success';
                    registrationForm.reset();
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
