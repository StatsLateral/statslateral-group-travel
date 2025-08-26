document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Accounting for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add shadow to header on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Simple testimonial slider functionality
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    // Only set up auto-scrolling if there are multiple testimonials
    if (testimonials.length > 1) {
        // Auto-scroll testimonials on mobile
        if (window.innerWidth < 768) {
            setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                const slider = document.querySelector('.testimonials-slider');
                if (slider) {
                    slider.scrollTo({
                        left: testimonials[currentTestimonial].offsetLeft,
                        behavior: 'smooth'
                    });
                }
            }, 5000);
        }
    }

    // Track CTA button clicks for analytics
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Track the event with PostHog
            if (window.posthog) {
                posthog.capture('CTA_Button_Click', {
                    buttonText: this.textContent,
                    location: this.closest('section')?.id || 'unknown',
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Log to console for debugging
            console.log('CTA button clicked:', this.textContent);
        });
    });
});
