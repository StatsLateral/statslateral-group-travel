/**
 * Content Loader
 * Dynamically loads content from content.json and updates HTML elements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Handle hero image caption
    const imageCaption = document.querySelector('.image-caption');
    if (imageCaption) {
        const captionPath = imageCaption.getAttribute('data-content');
        if (captionPath) {
            fetch('content.json')
                .then(response => response.json())
                .then(data => {
                    const captionValue = getValueByPath(data, captionPath);
                    if (captionValue) {
                        imageCaption.textContent = captionValue;
                    }
                })
                .catch(error => console.error('Error loading image caption:', error));
        }
    }
    
    // Equalize heights for marketing pricing options
    equalizeMarketingPricingHeights();
    
    // Re-equalize on window resize
    window.addEventListener('resize', function() {
        equalizeMarketingPricingHeights();
    });
    
    // Fetch the content.json file
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the content data
            updatePageContent(data);
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });

    /**
     * Updates page content based on data attributes
     * @param {Object} contentData - The content data from content.json
     */
    function updatePageContent(contentData) {
        // Find all elements with data-content attribute
        const contentElements = document.querySelectorAll('[data-content]');
        
        contentElements.forEach(element => {
            // Get the content path from the data attribute
            const contentPath = element.getAttribute('data-content');
            
            // Get the content value using the path
            const contentValue = getValueByPath(contentData, contentPath);
            
            if (contentValue !== undefined) {
                // Update the element's content
                if (element.tagName === 'IMG') {
                    element.src = contentValue;
                    element.alt = contentValue;
                } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                    // For links and buttons, update the text content
                    element.textContent = contentValue;
                } else {
                    element.textContent = contentValue;
                }
            }
        });

        // Handle features section separately (it has a more complex structure)
        updateFeatures(contentData);
        
        // Handle client experience section
        updateClientExperience(contentData);
        
        // Handle video elements
        updateVideoElements(contentData);

        // Handle setup options section
        updateSetupOptions(contentData);
        
        // Update client engagement pricing section
        updateClientEngagementPricing(contentData);
    }

    /**
     * Gets a value from an object using a dot notation path
     * @param {Object} obj - The object to search in
     * @param {String} path - The path in dot notation (e.g., "hero.title")
     * @returns {*} The value at the specified path
     */
    function getValueByPath(obj, path) {
        // Handle array notation like "steps[0].title"
        const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1');
        const parts = normalizedPath.split('.');
        
        let current = obj;
        
        for (const part of parts) {
            if (current === null || current === undefined) {
                return undefined;
            }
            
            current = current[part];
        }
        
        return current;
    }

    /**
     * Updates the features section with content from the JSON
     * @param {Object} contentData - The content data
     */
    function updateFeatures(contentData) {
        if (!contentData.features || !contentData.features.items || !contentData.features.items.length) {
            return;
        }

        const featuresGrid = document.querySelector('.features-grid');
        if (!featuresGrid) return;

        // Clear existing features
        featuresGrid.innerHTML = '';

        // Add features from content data
        contentData.features.items.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'feature';
            
            featureElement.innerHTML = `
                <div class="feature-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            
            featuresGrid.appendChild(featureElement);
        });
    }

    /**
     * Updates video elements with content from the JSON
     * @param {Object} contentData - The content data
     */
    function updateVideoElements(contentData) {
        // Update hero video if it exists
        if (contentData.hero && contentData.hero.video_url) {
            const heroVideo = document.querySelector('.hero-video .video-container iframe');
            if (heroVideo) {
                heroVideo.src = contentData.hero.video_url;
            }
            
            const videoCaption = document.querySelector('.hero-video .video-caption');
            if (videoCaption && contentData.hero.video_caption) {
                videoCaption.textContent = contentData.hero.video_caption;
            }
        }
    }
    
    /**
     * Updates the client experience section with content from the JSON
     * @param {Object} contentData - The content data
     */
    function updateClientExperience(contentData) {
        if (!contentData.client_experience) {
            return;
        }
        
        // Update section header
        const sectionTitle = document.querySelector('.client-experience .section-header h2');
        if (sectionTitle && contentData.client_experience.title) {
            sectionTitle.textContent = contentData.client_experience.title;
        }
        
        const sectionSubtitle = document.querySelector('.client-experience .section-header p');
        if (sectionSubtitle && contentData.client_experience.subtitle) {
            sectionSubtitle.textContent = contentData.client_experience.subtitle;
        }
        
        // Update video
        const clientVideo = document.querySelector('.client-experience .video-container iframe');
        if (clientVideo && contentData.client_experience.video_url) {
            clientVideo.src = contentData.client_experience.video_url;
        }
        
        // Update testimonial
        if (contentData.client_experience.testimonial) {
            const testimonialQuote = document.querySelector('.client-testimonial > p');
            if (testimonialQuote) {
                testimonialQuote.textContent = '"' + contentData.client_experience.testimonial.quote + '"';
            }
            
            const authorName = document.querySelector('.client-details h4');
            if (authorName) {
                authorName.textContent = contentData.client_experience.testimonial.author;
            }
            
            const authorPosition = document.querySelector('.client-details p');
            if (authorPosition) {
                authorPosition.textContent = contentData.client_experience.testimonial.position;
            }
        }
    }
    
    /**
     * Dynamically renders the setup options section from content.json
     * @param {Object} contentData - The content data
     */
    function updateSetupOptions(contentData) {
        if (!contentData.setup_options || !contentData.setup_options.options || !contentData.setup_options.options.length) {
            return;
        }
        const optionsContainer = document.getElementById('setup-options-container');
        if (!optionsContainer) return;

        // Create a flex row for the option cards
        const optionsRow = document.createElement('div');
        optionsRow.className = 'options-row';

        contentData.setup_options.options.forEach(option => {
            const optionCard = document.createElement('div');
            optionCard.className = 'option-card';
            
            // Create header section
            const headerDiv = document.createElement('div');
            headerDiv.className = 'option-header';
            headerDiv.innerHTML = `<h3>${option.option_title}</h3>`;
            optionCard.appendChild(headerDiv);
            
            // Create content section
            const contentDiv = document.createElement('div');
            contentDiv.className = 'option-content';
            if (option.description) {
                contentDiv.innerHTML = `<p>${option.description}</p>`;
            }
            optionCard.appendChild(contentDiv);
            
            // Create steps section
            if (option.steps && Array.isArray(option.steps)) {
                const stepsDiv = document.createElement('div');
                stepsDiv.className = 'option-steps';
                option.steps.forEach(step => {
                    if (typeof step === 'object') {
                        stepsDiv.innerHTML += `<div class="option-step"><h4>${step.title}</h4><p>${step.description}</p></div>`;
                    } else if (typeof step === 'string') {
                        // Add green checkmark icon for string steps (Option 2)
                        stepsDiv.innerHTML += `<div class="option-step"><span style='color: #27ae60; font-size: 1.1em; margin-right: 8px;'>✅</span><span>${step}</span></div>`;
                    }
                });
                optionCard.appendChild(stepsDiv);
            }
            
            // Create footnote section if exists
            if (option.footnote) {
                const footnoteDiv = document.createElement('div');
                footnoteDiv.className = 'option-footnote';
                footnoteDiv.innerHTML = `<p class="footnote">${option.footnote}</p>`;
                optionCard.appendChild(footnoteDiv);
            }
            
            // Create CTA section
            if (option.cta) {
                const ctaDiv = document.createElement('div');
                ctaDiv.className = 'option-cta-center';
                let ctaBtn;
                if (option.cta_url) {
                    ctaBtn = document.createElement('a');
                    ctaBtn.href = option.cta_url;
                    ctaBtn.target = '_blank';
                    ctaBtn.className = 'btn btn-primary';
                    ctaBtn.textContent = option.cta;
                } else {
                    ctaBtn = document.createElement('a');
                    ctaBtn.href = '#';
                    ctaBtn.className = 'btn btn-primary';
                    ctaBtn.textContent = option.cta;
                }
                ctaDiv.appendChild(ctaBtn);
                optionCard.appendChild(ctaDiv);
            }
            
            optionsRow.appendChild(optionCard);
        });
        
        // Clear and append the row to the container
        optionsContainer.innerHTML = '';
        optionsContainer.appendChild(optionsRow);
        
        // Ensure equal heights and aligned CTAs
        setTimeout(() => {
            equalizeSetupOptionsHeights();
        }, 100);
    }
    
    /**
     * Equalizes heights of setup option cards and ensures CTAs are aligned
     */
    function equalizeSetupOptionsHeights() {
        const optionCards = document.querySelectorAll('.option-card');
        if (optionCards.length === 0) return;
        
        // Reset heights first
        optionCards.forEach(card => {
            card.style.height = 'auto';
            const header = card.querySelector('.option-header');
            const content = card.querySelector('.option-content');
            const steps = card.querySelector('.option-steps');
            const footnote = card.querySelector('.option-footnote');
            
            if (header) header.style.height = 'auto';
            if (content) content.style.height = 'auto';
            if (steps) steps.style.height = 'auto';
            if (footnote) footnote.style.height = 'auto';
        });
        
        // Get max heights
        let maxCardHeight = 0;
        let maxHeaderHeight = 0;
        let maxContentHeight = 0;
        let maxStepsHeight = 0;
        let maxFootnoteHeight = 0;
        
        optionCards.forEach(card => {
            const header = card.querySelector('.option-header');
            const content = card.querySelector('.option-content');
            const steps = card.querySelector('.option-steps');
            const footnote = card.querySelector('.option-footnote');
            
            maxCardHeight = Math.max(maxCardHeight, card.offsetHeight);
            if (header) maxHeaderHeight = Math.max(maxHeaderHeight, header.offsetHeight);
            if (content) maxContentHeight = Math.max(maxContentHeight, content.offsetHeight);
            if (steps) maxStepsHeight = Math.max(maxStepsHeight, steps.offsetHeight);
            if (footnote) maxFootnoteHeight = Math.max(maxFootnoteHeight, footnote.offsetHeight);
        });
        
        // Set equal heights
        optionCards.forEach(card => {
            card.style.height = `${maxCardHeight}px`;
            const header = card.querySelector('.option-header');
            const content = card.querySelector('.option-content');
            const steps = card.querySelector('.option-steps');
            const footnote = card.querySelector('.option-footnote');
            
            if (header) header.style.height = `${maxHeaderHeight}px`;
            if (content) content.style.height = `${maxContentHeight}px`;
            if (steps) steps.style.height = `${maxStepsHeight}px`;
            if (footnote) footnote.style.height = `${maxFootnoteHeight}px`;
        });
    }

    // FAQ section removed

    // Pricing section is now hardcoded in the HTML
    
    /**
     * Updates the client engagement pricing section with data from content.json
     * @param {Object} contentData - The content data
     */
    function updateClientEngagementPricing(contentData) {
        if (!contentData['pricing-clients-engagement'] || 
            !contentData['pricing-clients-engagement'].plans || 
            !contentData['pricing-clients-engagement'].plans.length) {
            console.log('No client engagement pricing data found');
            return;
        }
        
        console.log('Client engagement pricing data found:', contentData['pricing-clients-engagement']);
        
        // Update the section header using data-content attributes
        // The updatePageContent function already handles this
        
        const container = document.getElementById('client-engagement-container');
        if (!container) {
            console.error('Client engagement container not found');
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Get the first plan (we only display one plan for client engagement)
        const plan = contentData['pricing-clients-engagement'].plans[0];
        console.log('Using plan:', plan);
        
        // Create the option element
        const optionElement = document.createElement('div');
        optionElement.className = 'option client-pricing-option';
        
        // Add the title
        const titleElement = document.createElement('h3');
        titleElement.textContent = plan.name;
        optionElement.appendChild(titleElement);
        
        // Add the price section
        const priceSection = document.createElement('div');
        priceSection.className = 'option-price';
        
        const priceElement = document.createElement('div');
        priceElement.className = 'price';
        priceElement.textContent = plan.price;
        priceSection.appendChild(priceElement);
        
        const taglineElement = document.createElement('p');
        taglineElement.textContent = plan.tagline;
        priceSection.appendChild(taglineElement);
        
        optionElement.appendChild(priceSection);
        
        // Add the content section
        const contentSection = document.createElement('div');
        contentSection.className = 'option-content';
        
        // Add features
        const featuresSection = document.createElement('div');
        featuresSection.className = 'option-features';
        
        const featuresList = document.createElement('ul');
        plan.features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.textContent = feature;
            featuresList.appendChild(featureItem);
        });
        
        featuresSection.appendChild(featuresList);
        contentSection.appendChild(featuresSection);
        
        // Add CTA
        const ctaSection = document.createElement('div');
        ctaSection.className = 'option-cta';
        
        const ctaButton = document.createElement('a');
        ctaButton.href = '#';
        ctaButton.className = 'btn btn-primary';
        ctaButton.textContent = plan.cta || 'Launch My Practice';
        
        ctaSection.appendChild(ctaButton);
        contentSection.appendChild(ctaSection);
        
        optionElement.appendChild(contentSection);
        
        // Add the option to the container
        container.appendChild(optionElement);
        console.log('Client engagement pricing section updated');
    }
    
    /**
     * Helper function to equalize heights of pricing plans
     * @param {string} containerId - The ID of the container with plans to equalize
     */
    function equalizeHeightsByContainer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const plans = container.querySelectorAll('.pricing-plan');
        if (plans.length <= 1) return;
        
        // Reset heights first
        plans.forEach(plan => {
            plan.style.height = 'auto';
        });
        
        // Find the tallest plan
        let maxHeight = 0;
        plans.forEach(plan => {
            maxHeight = Math.max(maxHeight, plan.offsetHeight);
        });
        
        // Set all plans to the same height
        plans.forEach(plan => {
            plan.style.height = maxHeight + 'px';
        });
    }
    
    /**
     * Equalizes heights of pricing plans and ensures CTAs are aligned
     * @deprecated Use equalizeHeightsByContainer instead
     */
    function equalizeHeights() {
        equalizeHeightsByContainer('pricing-plans');
    }
    
    /**
     * Equalizes heights of marketing pricing options and ensures CTAs are aligned
     */
    function equalizeMarketingPricingHeights() {
        const marketingOptions = document.querySelectorAll('.marketing-pricing .option');
        if (marketingOptions.length <= 1) return;
        
        // Reset heights first
        marketingOptions.forEach(option => {
            option.style.height = 'auto';
            
            const title = option.querySelector('h3');
            const price = option.querySelector('.option-price');
            const features = option.querySelector('.option-features');
            const cta = option.querySelector('.option-cta');
            
            if (title) title.style.height = 'auto';
            if (price) price.style.height = 'auto';
            if (features) features.style.height = 'auto';
            if (cta) cta.style.height = 'auto';
        });
        
        // Get max heights
        let maxOptionHeight = 0;
        let maxTitleHeight = 0;
        let maxPriceHeight = 0;
        let maxFeaturesHeight = 0;
        let maxCtaHeight = 0;
        
        marketingOptions.forEach(option => {
            const title = option.querySelector('h3');
            const price = option.querySelector('.option-price');
            const features = option.querySelector('.option-features');
            const cta = option.querySelector('.option-cta');
            
            maxOptionHeight = Math.max(maxOptionHeight, option.offsetHeight);
            if (title) maxTitleHeight = Math.max(maxTitleHeight, title.offsetHeight);
            if (price) maxPriceHeight = Math.max(maxPriceHeight, price.offsetHeight);
            if (features) maxFeaturesHeight = Math.max(maxFeaturesHeight, features.offsetHeight);
            if (cta) maxCtaHeight = Math.max(maxCtaHeight, cta.offsetHeight);
        });
        
        // Set equal heights
        marketingOptions.forEach(option => {
            option.style.height = `${maxOptionHeight}px`;
            
            const title = option.querySelector('h3');
            const price = option.querySelector('.option-price');
            const features = option.querySelector('.option-features');
            const cta = option.querySelector('.option-cta');
            
            if (title) title.style.height = `${maxTitleHeight}px`;
            if (price) price.style.height = `${maxPriceHeight}px`;
            if (features) features.style.height = `${maxFeaturesHeight}px`;
            if (cta) cta.style.height = `${maxCtaHeight}px`;
        });
        
        console.log('Marketing pricing heights equalized');
    }
    
    /**
     * Equalizes heights of pricing plans within a specific container and ensures CTAs are aligned
     * @param {String} containerId - The ID of the container with pricing plans
     */
    function equalizeHeightsByContainer(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const plans = container.querySelectorAll('.pricing-plan');
        if (plans.length === 0) return;
        
        // Reset heights first
        plans.forEach(plan => {
            plan.style.height = 'auto';
            const header = plan.querySelector('.plan-header');
            const features = plan.querySelector('.plan-features');
            if (header) header.style.height = 'auto';
            if (features) features.style.height = 'auto';
        });
        
        // Get max heights
        let maxPlanHeight = 0;
        let maxHeaderHeight = 0;
        let maxFeaturesHeight = 0;
        
        plans.forEach(plan => {
            const header = plan.querySelector('.plan-header');
            const features = plan.querySelector('.plan-features');
            
            maxPlanHeight = Math.max(maxPlanHeight, plan.offsetHeight);
            if (header) maxHeaderHeight = Math.max(maxHeaderHeight, header.offsetHeight);
            if (features) maxFeaturesHeight = Math.max(maxFeaturesHeight, features.offsetHeight);
        });
        
        // Set equal heights
        plans.forEach(plan => {
            plan.style.height = `${maxPlanHeight}px`;
            const header = plan.querySelector('.plan-header');
            const features = plan.querySelector('.plan-features');
            
            if (header) header.style.height = `${maxHeaderHeight}px`;
            if (features) features.style.height = `${maxFeaturesHeight}px`;
        });
    }
});
