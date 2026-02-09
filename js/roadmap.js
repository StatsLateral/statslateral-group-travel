// Roadmap interaction script
document.addEventListener('DOMContentLoaded', async function() {
    // Load content from content.json
    let dayData = {};
    
    try {
        const response = await fetch('/content.json');
        const content = await response.json();
        
        // Transform content.json roadmap data into the format needed for display
        if (content.roadmap && content.roadmap.days) {
            content.roadmap.days.forEach((day, index) => {
                const dayNumber = index + 1;
                dayData[dayNumber] = {
                    title: day.title,
                    time: day.time,
                    items: day.items.map(item => {
                        // Format items with bold labels if they contain colons
                        if (item.includes(':')) {
                            const parts = item.split(':');
                            return `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}`;
                        }
                        return item;
                    })
                };
            });
        }
    } catch (error) {
        console.error('Error loading roadmap content:', error);
        // Fallback to empty data if content.json fails to load
    }

    const bubbles = document.querySelectorAll('.day-bubble');
    const detailsContainer = document.getElementById('details-container');

    if (bubbles.length > 0 && detailsContainer) {
        bubbles.forEach(bubble => {
            bubble.addEventListener('mouseenter', function() {
                const day = this.getAttribute('data-day');
                
                // Remove active class from all bubbles
                bubbles.forEach(b => b.classList.remove('active'));
                
                // Add active class to hovered bubble
                this.classList.add('active');
                
                // Show details
                showDayDetails(day);
            });
        });

        function showDayDetails(day) {
            const data = dayData[day];
            
            if (!data) {
                console.error(`No data found for day ${day}. Available days:`, Object.keys(dayData));
                return;
            }
            
            const html = `
                <div class="details-header">
                    <div class="details-icon">Day ${day}</div>
                    <div class="details-title-group">
                        <h2>${data.title}</h2>
                        <p class="details-time">${data.time}</p>
                    </div>
                </div>
                <ul class="details-items">
                    ${data.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            
            detailsContainer.innerHTML = html;
            detailsContainer.classList.add('active');
        }
        
        // Log loaded data for debugging
        console.log('Roadmap data loaded:', dayData);
    }
});
