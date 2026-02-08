// Registration form handler
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const cannotAttendCheckbox = document.getElementById('cannot-attend');
    const wishField = document.getElementById('wish-field');
    const attendanceFields = document.getElementById('attendance-fields');
    
    // Handle cannot-attend checkbox
    if (cannotAttendCheckbox) {
        cannotAttendCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Show wish field
                wishField.style.display = 'block';
                
                // Disable and hide attendance fields
                attendanceFields.classList.add('disabled');
                const inputs = attendanceFields.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.removeAttribute('required');
                });
                attendanceFields.style.display = 'none';
            } else {
                // Hide wish field
                wishField.style.display = 'none';
                document.getElementById('wish').value = '';
                
                // Enable and show attendance fields
                attendanceFields.classList.remove('disabled');
                const inputs = attendanceFields.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.disabled = false;
                    // Re-add required attributes for required fields
                    if (input.id === 'email' || input.id === 'phone' || 
                        input.id === 'arrival-date' || input.id === 'departure-date') {
                        input.setAttribute('required', 'required');
                    }
                });
                attendanceFields.style.display = 'block';
            }
        });
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
            
            // Get form data
            const cannotAttend = document.getElementById('cannot-attend').checked;
            const formData = {
                name: document.getElementById('name').value,
                cannotAttend: cannotAttend,
                wish: cannotAttend ? document.getElementById('wish').value : null,
                email: cannotAttend ? null : document.getElementById('email').value,
                phone: cannotAttend ? null : document.getElementById('phone').value,
                arrivalDate: cannotAttend ? null : document.getElementById('arrival-date').value,
                departureDate: cannotAttend ? null : document.getElementById('departure-date').value,
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
