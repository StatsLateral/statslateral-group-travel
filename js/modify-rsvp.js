// Modify RSVP functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailLookupForm = document.getElementById('email-lookup-form');
    const emailLookupContainer = document.getElementById('email-lookup-container');
    const editFormContainer = document.getElementById('edit-form-container');
    const editRegistrationForm = document.getElementById('edit-registration-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const editWillAttendRadio = document.getElementById('edit-will-attend');
    const editCannotAttendRadio = document.getElementById('edit-cannot-attend');
    const editWishField = document.getElementById('edit-wish-field');
    const editAttendanceFields = document.getElementById('edit-attendance-fields');

    // Handle radio button changes for edit form
    function handleEditAttendanceChange() {
        const editWishTextarea = document.getElementById('edit-wish');
        
        if (editWillAttendRadio && editWillAttendRadio.checked) {
            // Show attendance fields, hide wish field
            editAttendanceFields.style.display = 'block';
            editWishField.style.display = 'none';
            
            // Enable attendance fields and make them required
            const inputs = editAttendanceFields.querySelectorAll('input:not(#edit-email), textarea, select');
            inputs.forEach(input => {
                input.disabled = false;
                if (input.id === 'edit-phone' || input.id === 'edit-arrival-date' || 
                    input.id === 'edit-departure-date' || input.id === 'edit-connection') {
                    input.setAttribute('required', 'required');
                }
            });
            
            // Disable and clear wish field
            editWishTextarea.disabled = true;
            editWishTextarea.removeAttribute('required');
            editWishTextarea.value = '';
            
        } else if (editCannotAttendRadio && editCannotAttendRadio.checked) {
            // Show wish field, hide attendance fields
            editWishField.style.display = 'block';
            editAttendanceFields.style.display = 'none';
            
            // Disable attendance fields and remove required
            const inputs = editAttendanceFields.querySelectorAll('input:not(#edit-email), textarea, select');
            inputs.forEach(input => {
                input.disabled = true;
                input.removeAttribute('required');
            });
            
            // Enable wish field and make it required
            editWishTextarea.disabled = false;
            editWishTextarea.setAttribute('required', 'required');
        }
    }
    
    // Add event listeners to radio buttons
    if (editWillAttendRadio) {
        editWillAttendRadio.addEventListener('change', handleEditAttendanceChange);
    }
    if (editCannotAttendRadio) {
        editCannotAttendRadio.addEventListener('change', handleEditAttendanceChange);
    }

    // Email lookup form submission
    if (emailLookupForm) {
        emailLookupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            const messageDiv = document.getElementById('lookup-message');
            
            submitButton.disabled = true;
            submitButton.textContent = 'Searching...';
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
            
            const email = document.getElementById('lookup-email').value;
            
            try {
                const response = await fetch('/api/get-registration-by-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                const result = await response.json();
                
                if (response.ok && result.registration) {
                    // Populate edit form with existing data
                    populateEditForm(result.registration);
                    
                    // Hide lookup form, show edit form
                    emailLookupContainer.style.display = 'none';
                    editFormContainer.style.display = 'block';
                } else {
                    messageDiv.textContent = result.error || 'No registration found with this email address.';
                    messageDiv.className = 'form-message error';
                }
            } catch (error) {
                console.error('Lookup error:', error);
                messageDiv.textContent = 'Network error. Please try again.';
                messageDiv.className = 'form-message error';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Populate edit form with registration data
    function populateEditForm(registration) {
        document.getElementById('edit-registration-id').value = registration.id;
        document.getElementById('edit-name').value = registration.name;
        document.getElementById('edit-email').value = registration.email || '';
        
        if (registration.cannot_attend) {
            // Set "cannot attend" radio button
            document.getElementById('edit-cannot-attend').checked = true;
            document.getElementById('edit-wish').value = registration.wish || '';
            // Trigger the change handler
            handleEditAttendanceChange();
        } else {
            // Set "will attend" radio button
            document.getElementById('edit-will-attend').checked = true;
            document.getElementById('edit-phone').value = registration.phone || '';
            document.getElementById('edit-arrival-date').value = registration.arrival_date || '';
            document.getElementById('edit-departure-date').value = registration.departure_date || '';
            document.getElementById('edit-connection').value = registration.connection || '';
            document.getElementById('edit-restrictions').value = registration.restrictions || '';
            // Trigger the change handler
            handleEditAttendanceChange();
        }
    }

    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            editFormContainer.style.display = 'none';
            emailLookupContainer.style.display = 'block';
            emailLookupForm.reset();
            document.getElementById('lookup-message').textContent = '';
        });
    }

    // Edit registration form submission
    if (editRegistrationForm) {
        editRegistrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            const messageDiv = document.getElementById('edit-message');
            
            submitButton.disabled = true;
            submitButton.textContent = 'Updating...';
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
            
            const cannotAttend = document.getElementById('edit-cannot-attend').checked;
            const formData = {
                id: document.getElementById('edit-registration-id').value,
                name: document.getElementById('edit-name').value,
                cannotAttend: cannotAttend,
                wish: cannotAttend ? document.getElementById('edit-wish').value : null,
                email: document.getElementById('edit-email').value,
                phone: cannotAttend ? null : document.getElementById('edit-phone').value,
                arrivalDate: cannotAttend ? null : document.getElementById('edit-arrival-date').value,
                departureDate: cannotAttend ? null : document.getElementById('edit-departure-date').value,
                connection: cannotAttend ? null : document.getElementById('edit-connection').value,
                restrictions: cannotAttend ? null : document.getElementById('edit-restrictions').value
            };
            
            try {
                const response = await fetch('/api/update-registration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    messageDiv.textContent = result.message || 'RSVP updated successfully!';
                    messageDiv.className = 'form-message success';
                    
                    // Redirect to home page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    messageDiv.textContent = result.error || 'Failed to update RSVP. Please try again.';
                    messageDiv.className = 'form-message error';
                }
            } catch (error) {
                console.error('Update error:', error);
                messageDiv.textContent = 'Network error. Please check your connection and try again.';
                messageDiv.className = 'form-message error';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
