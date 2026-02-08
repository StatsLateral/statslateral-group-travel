// Airport-style Attendee Board
document.addEventListener('DOMContentLoaded', async function() {
    const boardBody = document.getElementById('attendee-board-body');
    const loadingDiv = document.getElementById('board-loading');
    const noAttendeesDiv = document.getElementById('no-attendees');
    
    if (!boardBody) return;
    
    try {
        // Fetch attendees from API
        const response = await fetch('/api/get-attendees');
        const result = await response.json();
        
        if (loadingDiv) loadingDiv.style.display = 'none';
        
        if (response.ok && result.attendees && result.attendees.length > 0) {
            // Show the table
            const boardTable = document.getElementById('attendee-board-table');
            if (boardTable) boardTable.style.display = 'table';
            
            // Display attendees with flip animation
            result.attendees.forEach((attendee, index) => {
                setTimeout(() => {
                    const row = createAttendeeRow(attendee);
                    boardBody.appendChild(row);
                    
                    // Trigger flip animation for all cells
                    setTimeout(() => {
                        const cells = row.querySelectorAll('td');
                        cells.forEach(cell => animateFlip(cell));
                    }, 100);
                }, index * 200); // Stagger the appearance
            });
        } else {
            if (noAttendeesDiv) noAttendeesDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading attendees:', error);
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (noAttendeesDiv) {
            noAttendeesDiv.style.display = 'block';
            noAttendeesDiv.textContent = 'Unable to load attendee list. Please try again later.';
        }
    }
});

function createAttendeeRow(attendee) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><span class="flip-container">${attendee.name}</span></td>
        <td><span class="flip-container">${attendee.city}</span></td>
        <td><span class="flip-container">${attendee.date}</span></td>
    `;
    
    return row;
}

function animateFlip(element) {
    const text = element.textContent;
    const container = element.querySelector('.flip-container');
    
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create flip animation for each character with slower stagger
    const chars = text.split('');
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'flip-char';
        span.textContent = char;
        // 0.5s delay between each character for mechanical scroll effect
        span.style.animationDelay = `${index * 0.5}s`;
        container.appendChild(span);
    });
}

// Periodically refresh the board (every 5 minutes)
setInterval(async function() {
    const boardBody = document.getElementById('attendee-board-body');
    if (!boardBody) return;
    
    try {
        const response = await fetch('/api/get-attendees');
        const result = await response.json();
        
        if (response.ok && result.attendees) {
            // Clear and reload
            boardBody.innerHTML = '';
            result.attendees.forEach((attendee, index) => {
                setTimeout(() => {
                    const row = createAttendeeRow(attendee);
                    boardBody.appendChild(row);
                    setTimeout(() => {
                        const cells = row.querySelectorAll('td');
                        cells.forEach(cell => animateFlip(cell));
                    }, 100);
                }, index * 200);
            });
        }
    } catch (error) {
        console.error('Error refreshing attendees:', error);
    }
}, 300000); // 5 minutes
