// Roadmap interaction script
document.addEventListener('DOMContentLoaded', function() {
    const dayData = {
        1: {
            title: "Thursday, Nov 18 — Arrival in Berlin",
            time: "Land, decompress, and ease into the week",
            items: [
                "<strong>Morning:</strong> Arrivals into Berlin (from wherever you're coming from)",
                "<strong>Daytime:</strong> Check in, stretch your legs, light wandering or napping",
                "<strong>Afternoon:</strong> Decompress together at Vabali Spa (optional but highly recommended)",
                "<strong>Evening:</strong> Welcome dinner at a great immigrant-run Berlin restaurant",
                "<strong>Hotels:</strong> Premium Berlin Hotel or Value Berlin Hotel (both central and walkable)"
            ]
        },
        2: {
            title: "Friday, Nov 19 — Berlin, Culture & Conversation",
            time: "History, walking, and finding our rhythm",
            items: [
                "<strong>Morning:</strong> Guided Berlin walking tour (history + neighborhoods, not a lecture)",
                "<strong>Daytime:</strong> Free time for cafés, shopping, museums, or just wandering",
                "<strong>Late afternoon:</strong> Rest, spa, or downtime back at the hotel",
                "<strong>Evening:</strong> Classic German dinner",
                "<strong>Late night (optional):</strong> Jazz bar, cocktail lounge, or Berlin nightlife"
            ]
        },
        3: {
            title: "Saturday, Nov 20 — Berlin → Prague (Birthday Day) 🎂",
            time: "Travel day + the heart of the celebration",
            items: [
                "<strong>Morning:</strong> Easy Berlin morning, coffee and packing",
                "<strong>Midday:</strong> First-class train from Berlin to Prague",
                "<strong>Afternoon:</strong> Check into Prague hotels and settle in",
                "<strong>Evening:</strong> Main birthday dinner, cake, and toasts in Prague",
                "<strong>Late night (optional):</strong> Prague nightlife for those who want it"
            ]
        },
        4: {
            title: "Sunday, Nov 21 — Prague, Nature & Old Town",
            time: "Fresh air, beauty, and deep conversations",
            items: [
                "<strong>Late morning:</strong> Hike across the river for views and fresh air",
                "<strong>Afternoon:</strong> Rest, café hopping, or Old Town wandering",
                "<strong>Evening:</strong> Group dinner in Prague's main square or historic district"
            ]
        },
        5: {
            title: "Monday, Nov 22 — Prague → Vienna",
            time: "Transition into elegance",
            items: [
                "<strong>Morning:</strong> Easy breakfast and check-out",
                "<strong>Late morning:</strong> Train from Prague to Vienna",
                "<strong>Afternoon:</strong> Check into Vienna hotels and walk the city center",
                "<strong>Evening:</strong> Casual dinner or wine bar in Vienna"
            ]
        },
        6: {
            title: "Tuesday, Nov 23 — Vienna, Art & Café Culture",
            time: "Slow, beautiful, and reflective",
            items: [
                "<strong>Morning:</strong> Vienna café breakfast together",
                "<strong>Daytime:</strong> Museum, classical music, or cultural experience",
                "<strong>Afternoon:</strong> Free time for shopping, walks, or people-watching",
                "<strong>Evening:</strong> Final group dinner in Vienna"
            ]
        },
        7: {
            title: "Wednesday, Nov 24 — Return Home",
            time: "Head back refreshed",
            items: [
                "<strong>Morning:</strong> Departures from Vienna",
                "<strong>Travel:</strong> Head back home in time for Thanksgiving",
                "<strong>Optional:</strong> Stay longer in Europe if you want to keep the magic going"
            ]
        },
        8: {
            title: "Thursday, Nov 25 — Thanksgiving at Home",
            time: "Back with stories to tell",
            items: [
                "<strong>Arrive home:</strong> Just in time for Thanksgiving with family",
                "<strong>Share stories:</strong> Tell everyone about your incredible brotherhood journey",
                "<strong>Rest:</strong> Recover from the trip and reflect on the memories made"
            ]
        }
    };

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
    }
});
