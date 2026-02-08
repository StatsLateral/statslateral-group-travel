// Modify RSVP functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailLookupForm = document.getElementById('email-lookup-form');
    const emailLookupContainer = document.getElementById('email-lookup-container');
    const editFormContainer = document.getElementById('edit-form-container');
    const editRegistrationForm = document.getElementById('edit-registration-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const editCannotAttendCheckbox = document.getElementById('edit-cannot-attend');
    const editWishField = document.getElementById('edit-wish-field');
    const editAttendanceFields = document.getElementById('edit-attendance-fields');

    // Handle cannot-attend checkbox for edit form
    if (editCannotAttendCheckbox) {
        editCannotAttendCheckbox.addEventListener('change', function() {
            if (this.checked) {
                editWishField.style.display = 'block';
                const inputs = editAttendanceFields.querySelectorAll('input:not(#edit-email):not(#edit-cannot-attend), textarea:not(#edit-wish)');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.removeAttribute('required');
                });
                // Hide other fields
                editAttendanceFields.querySelectorAll('.form-group').forEach(group => {
                    if (!group.classList.contains('checkbox-group') && 
                        group.id !== 'edit-wish-field' &&
                        !group.querySelector('#edit-email')) {
                        group.style.display = 'none';
                    }
                });
            } else {
                editWishField.style.display = 'none';
                document.getElementById('edit-wish').value = '';
                const inputs = editAttendanceFields.querySelectorAll('input:not(#edit-email):not(#edit-cannot-attend), textarea:not(#edit-wish)');
                inputs.forEach(input => {
                    input.disabled = false;
                    if (input.id === 'edit-phone' || input.id === 'edit-arrival-date' || input.id === 'edit-departure-date') {
                        input.setAttribute('required', 'required');
                    }
                });
                // Show all fields
                editAttendanceFields.querySelectorAll('.form-group').forEach(group => {
                    group.style.display = 'block';
                });
            }
        });
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
            document.getElementById('edit-cannot-attend').checked = true;
            document.getElementById('edit-wish').value = registration.wish || '';
            editWishField.style.display = 'block';
            // Hide and disable attendance fields
            const inputs = editAttendanceFields.querySelectorAll('input:not(#edit-email):not(#edit-cannot-attend), textarea:not(#edit-wish)');
            inputs.forEach(input => {
                input.disabled = true;
                input.removeAttribute('required');
            });
            editAttendanceFields.querySelectorAll('.form-group').forEach(group => {
                if (!group.classList.contains('checkbox-group') && 
                    group.id !== 'edit-wish-field' &&
                    !group.querySelector('#edit-email')) {
                    group.style.display = 'none';
                }
            });
        } else {
            document.getElementById('edit-cannot-attend').checked = false;
            document.getElementById('edit-phone').value = registration.phone || '';
            document.getElementById('edit-arrival-date').value = registration.arrival_date || '';
            document.getElementById('edit-departure-date').value = registration.departure_date || '';
            document.getElementById('edit-connection').value = registration.connection || '';
            document.getElementById('edit-restrictions').value = registration.restrictions || '';
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
