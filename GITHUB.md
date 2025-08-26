# Vybri Cancer Survivorship Landing Page

A responsive landing page for the Vybri cancer survivorship coaching service, built with modern design principles and optimized for conversions.

## Features

- **Responsive Design**: Looks great on all devices (mobile, tablet, desktop)
- **Conversion-Optimized Layout**: Strategic placement of CTAs to maximize sign-ups
- **PostHog Integration**: Built-in analytics tracking for user behavior
- **Dynamic Content**: Content loaded from JSON for easy updates
- **Modern UI**: Clean, professional design with attention to UX
- **Performance Optimized**: Fast loading times for better SEO and user experience

## Theme Structure

```
Vybri-cancer-landing-page/
├── css/
│   └── style.css         # Main stylesheet
├── images/               # Theme images directory
├── js/
│   ├── content-loader.js  # Content loading functionality
│   └── script.js         # JavaScript functionality
├── content.json          # Content configuration file
├── index.html            # Main landing page HTML
├── README.md             # Project documentation
└── GITHUB.md             # GitHub documentation
```

## Installation

### Option 1: Install as a WordPress Theme

1. Download this repository as a ZIP file
2. In your WordPress admin, go to Appearance > Themes > Add New
3. Click "Upload Theme" and select the ZIP file
4. Activate the theme
5. Create a new page and select "App Landing Page" as the template

### Option 2: Deploy via GitHub

1. Fork this repository
2. Clone your fork to your local machine
3. Make your customizations
4. Push changes to your GitHub repository
5. Use a deployment service like Netlify, Vercel, or GitHub Pages to deploy your site
6. For WordPress integration, use a CI/CD pipeline to deploy to your WordPress hosting

## Customization

### Using WordPress Customizer

1. In WordPress admin, go to Appearance > Customize
2. You'll find sections for each part of the landing page:
   - Hero Section
   - How It Works Section
   - Features Section
   - Testimonials Section
   - Footer CTA Section
   - Call to Action Buttons
   - FullStory Integration

### Manual Customization

1. Edit CSS in `css/style.css` to change styles
2. Modify PHP templates to change structure
3. Update JavaScript in `js/script.js` for functionality changes

## PostHog Analytics Integration

1. Sign up for a [PostHog](https://posthog.com/) account
2. Get your API key from PostHog dashboard
3. Update the PostHog initialization code in index.html with your API key
4. Configure event tracking as needed

## Adding Content

### Dynamic Content

This landing page loads content dynamically from content.json:

1. **Features**: Add features with icons and descriptions
2. **Testimonials**: Add customer testimonials

### Images

Replace placeholder images in the `images/` directory:

- `logo.png`: Vybri logo
- `app-screenshot.png`: Main screenshot of coaching interface
- `step-*.png`: Icons for How It Works section

## GitHub Workflow

### Recommended Workflow

1. Create a development branch for new features
2. Make changes and test locally
3. Commit changes with descriptive messages
4. Create a pull request to merge into main
5. After review, merge and deploy

### Continuous Integration

Set up GitHub Actions for automated testing and deployment:

```yaml
# Example GitHub Action for WordPress deployment
name: Deploy to WordPress

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: WordPress Theme Deploy
        uses: SamKirkland/FTP-Deploy-Action@4.0.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./
          server-dir: wp-content/themes/app-landing/
```

## Best Practices

1. **Version Control**: Keep track of changes with meaningful commit messages
2. **Image Optimization**: Compress images before adding to the repository
3. **Testing**: Test on multiple devices and browsers before deployment
4. **Updates**: Regularly update the theme for security and compatibility
5. **Documentation**: Document any custom modifications for future reference

## Support

For questions or support, please open an issue on GitHub or contact the theme author.

## License

This theme is licensed under the GPL v2 or later.

---

Happy coding! 🚀
