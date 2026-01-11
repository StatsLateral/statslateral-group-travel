/**
 * Meta Loader
 * Dynamically loads metadata and structured data from content.json
 */
(function() {
    // Load content.json and update meta tags
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            updateMetaTags(data);
            updateStructuredData(data);
        })
        .catch(error => console.error('Error loading meta content:', error));

    /**
     * Updates meta tags in the document head
     * @param {Object} data - Content data from content.json
     */
    function updateMetaTags(data) {
        if (!data.meta) return;

        // Update title
        if (data.meta.title) {
            document.title = data.meta.title;
        }

        // Update meta tags
        const metaMap = {
            'description': data.meta.description,
            'canonical': data.meta.canonical_url,
            'og:title': data.meta.og_title,
            'og:description': data.meta.og_description,
            'og:image': data.meta.og_image,
            'og:image:width': data.meta.og_image_width,
            'og:image:height': data.meta.og_image_height,
            'og:url': data.meta.og_url,
            'og:type': data.meta.og_type,
            'og:site_name': data.meta.og_site_name,
            'og:locale': data.meta.og_locale,
            'twitter:card': data.meta.twitter_card,
            'twitter:title': data.meta.twitter_title,
            'twitter:description': data.meta.twitter_description,
            'twitter:image': data.meta.twitter_image,
            'twitter:image:width': data.meta.twitter_image_width,
            'twitter:image:height': data.meta.twitter_image_height,
            'linkedin:title': data.meta.linkedin_title,
            'linkedin:description': data.meta.linkedin_description,
            'linkedin:image': data.meta.linkedin_image,
            'reddit:title': data.meta.reddit_title,
            'reddit:description': data.meta.reddit_description,
            'reddit:image': data.meta.reddit_image
        };

        // Update or create meta tags
        for (const [key, value] of Object.entries(metaMap)) {
            if (!value) continue;

            if (key === 'canonical') {
                let link = document.querySelector('link[rel="canonical"]');
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'canonical';
                    document.head.appendChild(link);
                }
                link.href = value;
            } else if (key === 'description') {
                let meta = document.querySelector('meta[name="description"]');
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.name = 'description';
                    document.head.appendChild(meta);
                }
                meta.content = value;
            } else if (key.startsWith('og:') || key.startsWith('twitter:') || key.startsWith('linkedin:') || key.startsWith('reddit:')) {
                const isProperty = key.startsWith('og:') || key.startsWith('linkedin:');
                const selector = isProperty 
                    ? `meta[property="${key}"]` 
                    : `meta[name="${key}"]`;
                
                let meta = document.querySelector(selector);
                if (!meta) {
                    meta = document.createElement('meta');
                    if (isProperty) {
                        meta.setAttribute('property', key);
                    } else {
                        meta.setAttribute('name', key);
                    }
                    document.head.appendChild(meta);
                }
                meta.content = value;
            }
        }
    }

    /**
     * Updates structured data (JSON-LD) in the document head
     * @param {Object} data - Content data from content.json
     */
    function updateStructuredData(data) {
        if (!data.structured_data) return;

        // Remove existing structured data scripts
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => script.remove());

        // Add WebSite schema
        if (data.structured_data.website) {
            const websiteSchema = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": data.structured_data.website.name,
                "url": data.structured_data.website.url,
                "description": data.structured_data.website.description
            };

            if (data.structured_data.website.search_action_target) {
                websiteSchema.potentialAction = {
                    "@type": "SearchAction",
                    "target": data.structured_data.website.search_action_target,
                    "query-input": "required name=search_term_string"
                };
            }

            addStructuredDataScript(websiteSchema);
        }

        // Add WebPage schema
        if (data.structured_data.webpage) {
            const webpageSchema = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": data.structured_data.webpage.name,
                "url": data.structured_data.webpage.url,
                "description": data.structured_data.webpage.description
            };

            addStructuredDataScript(webpageSchema);
        }

        // Add SoftwareApplication schema
        if (data.structured_data.software_application) {
            const app = data.structured_data.software_application;
            const appSchema = {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": app.name,
                "applicationCategory": app.application_category,
                "operatingSystem": app.operating_system,
                "offers": {
                    "@type": "Offer",
                    "price": app.price,
                    "priceCurrency": app.price_currency,
                    "availability": app.availability
                },
                "description": app.description,
                "keywords": app.keywords
            };

            addStructuredDataScript(appSchema);
        }

        // Add Organization schema
        if (data.structured_data.organization) {
            const org = data.structured_data.organization;
            const orgSchema = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": org.name,
                "url": org.url,
                "logo": org.logo,
                "description": org.description
            };

            if (org.same_as && org.same_as.length > 0) {
                orgSchema.sameAs = org.same_as;
            }

            addStructuredDataScript(orgSchema);
        }

        // Add FAQ schema
        if (data.structured_data.faq && data.structured_data.faq.length > 0) {
            const faqSchema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": data.structured_data.faq.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            };

            addStructuredDataScript(faqSchema);
        }
    }

    /**
     * Adds a structured data script to the document head
     * @param {Object} schema - The schema object to add
     */
    function addStructuredDataScript(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }
})();
