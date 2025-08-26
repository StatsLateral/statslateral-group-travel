# Vybri Cancer Survivorship Landing Page

This is a responsive landing page for the Vybri platform - a coaching and support service for cancer survivors. It follows best practices for content structure and includes integration with PostHog for analytics.

## Project Structure

```
Vybri-cancer-landing-page/
├── css/
│   └── style.css         # Main stylesheet with responsive design
├── images/               # Directory for all images
│   ├── logo.png          # Vybri logo
│   ├── app-screenshot.png # Main screenshot for hero section
│   ├── step-1.png        # How It Works section icons
│   ├── step-2.png
│   ├── step-3.png
├── js/
│   ├── content-loader.js  # JavaScript for loading dynamic content
│   └── script.js         # JavaScript for interactive elements
├── content.json          # Content configuration file
├── index.html            # Main landing page HTML
└── README.md             # This file
```

## Image Placeholders

All image files referenced in the HTML should be placed in the `images/` directory. You need to replace the placeholder images with your actual images:

1. **logo.png**: Vybri logo (recommended size: 160px × 40px)
2. **app-screenshot.png**: Screenshot of the Vybri coaching interface for the hero section (recommended size: 600px × 1200px)
3. **step-1.png, step-2.png, step-3.png**: Icons representing the cancer survivorship coaching process (recommended size: 80px × 80px)

## PostHog Analytics Integration

The landing page includes PostHog analytics integration for tracking user interactions. The integration is configured to:

1. Create profiles for all users (including anonymous visitors)
2. Track page views automatically
3. Track CTA button clicks with properties like buttonText, location, URL, and timestamp

The PostHog script is already set up with the API key in the index.html file. If you need to use a different PostHog account, simply replace the API key in the PostHog initialization code.

## Public URL

The landing page will be accessible at the Vybri domain once deployed.

## Call-to-Action (CTA) Buttons

The landing page includes multiple CTAs for:

1. Get started (primary CTA)
2. Learn more (secondary CTA)
3. Contact a coach (for interested users)

## Customization

To customize the landing page:

1. Update the content in `content.json` to modify text across the site
2. Edit the HTML structure in `index.html` if needed
3. Modify colors and styling in `css/style.css` (primary colors are defined as CSS variables at the top)
4. Add or remove sections as needed

## WordPress Integration

To integrate this landing page with WordPress:

1. Create a new WordPress theme or child theme
2. Copy the HTML structure from `index.html` into your theme's template files
3. Enqueue the CSS and JavaScript files in your theme's `functions.php`
4. Use WordPress functions like `get_template_directory_uri()` to reference assets

Example for `functions.php`:

```php
function app_landing_scripts() {
    wp_enqueue_style('app-landing-style', get_template_directory_uri() . '/css/style.css');
    wp_enqueue_script('app-landing-script', get_template_directory_uri() . '/js/script.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'app_landing_scripts');
```

## Responsive Design

The landing page is fully responsive and works on all device sizes. The CSS uses media queries to adjust the layout for:

- Desktop (992px and above)
- Tablet (768px to 991px)
- Mobile (below 768px)
