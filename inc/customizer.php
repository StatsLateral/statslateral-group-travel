<?php
/**
 * App Landing Page Theme Customizer
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function app_landing_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('app_landing_hero', array(
        'title'    => __('Hero Section', 'app-landing'),
        'priority' => 130,
    ));

    // Hero Headline
    $wp_customize->add_setting('hero_headline', array(
        'default'           => 'Your App\'s Powerful Headline Goes Here',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('hero_headline', array(
        'label'   => __('Headline', 'app-landing'),
        'section' => 'app_landing_hero',
        'type'    => 'text',
    ));

    // Hero Subheadline
    $wp_customize->add_setting('hero_subheadline', array(
        'default'           => 'A compelling subheadline that explains your app\'s value proposition in a clear and concise way.',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('hero_subheadline', array(
        'label'   => __('Subheadline', 'app-landing'),
        'section' => 'app_landing_hero',
        'type'    => 'textarea',
    ));

    // Hero Image
    $wp_customize->add_setting('hero_image', array(
        'default'           => '',
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'hero_image', array(
        'label'     => __('Hero Image', 'app-landing'),
        'section'   => 'app_landing_hero',
        'mime_type' => 'image',
    )));

    // How It Works Section
    $wp_customize->add_section('app_landing_how_it_works', array(
        'title'    => __('How It Works Section', 'app-landing'),
        'priority' => 140,
    ));

    // Section Title
    $wp_customize->add_setting('how_it_works_title', array(
        'default'           => 'How It Works',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('how_it_works_title', array(
        'label'   => __('Section Title', 'app-landing'),
        'section' => 'app_landing_how_it_works',
        'type'    => 'text',
    ));

    // Section Subtitle
    $wp_customize->add_setting('how_it_works_subtitle', array(
        'default'           => 'Simple steps to get started with our app',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('how_it_works_subtitle', array(
        'label'   => __('Section Subtitle', 'app-landing'),
        'section' => 'app_landing_how_it_works',
        'type'    => 'text',
    ));

    // Steps
    for ($i = 1; $i <= 3; $i++) {
        // Step Icon
        $wp_customize->add_setting('step_' . $i . '_icon', array(
            'default'           => '',
            'sanitize_callback' => 'absint',
        ));

        $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'step_' . $i . '_icon', array(
            'label'     => sprintf(__('Step %d Icon', 'app-landing'), $i),
            'section'   => 'app_landing_how_it_works',
            'mime_type' => 'image',
        )));

        // Step Title
        $wp_customize->add_setting('step_' . $i . '_title', array(
            'default'           => 'Step ' . $i . ': ' . ($i == 1 ? 'Sign Up' : ($i == 2 ? 'Configure' : 'Enjoy')),
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'postMessage',
        ));

        $wp_customize->add_control('step_' . $i . '_title', array(
            'label'   => sprintf(__('Step %d Title', 'app-landing'), $i),
            'section' => 'app_landing_how_it_works',
            'type'    => 'text',
        ));

        // Step Description
        $wp_customize->add_setting('step_' . $i . '_description', array(
            'default'           => ($i == 1 ? 'Create your account in seconds and get immediate access to all features.' : ($i == 2 ? 'Set up your preferences and customize the app to fit your needs.' : 'Start using the app and see the results immediately.')),
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'postMessage',
        ));

        $wp_customize->add_control('step_' . $i . '_description', array(
            'label'   => sprintf(__('Step %d Description', 'app-landing'), $i),
            'section' => 'app_landing_how_it_works',
            'type'    => 'textarea',
        ));
    }

    // Features Section
    $wp_customize->add_section('app_landing_features', array(
        'title'    => __('Features Section', 'app-landing'),
        'priority' => 150,
    ));

    // Section Title
    $wp_customize->add_setting('features_title', array(
        'default'           => 'Features & Benefits',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('features_title', array(
        'label'   => __('Section Title', 'app-landing'),
        'section' => 'app_landing_features',
        'type'    => 'text',
    ));

    // Section Subtitle
    $wp_customize->add_setting('features_subtitle', array(
        'default'           => 'Discover what makes our app special',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('features_subtitle', array(
        'label'   => __('Section Subtitle', 'app-landing'),
        'section' => 'app_landing_features',
        'type'    => 'text',
    ));

    // Testimonials Section
    $wp_customize->add_section('app_landing_testimonials', array(
        'title'    => __('Testimonials Section', 'app-landing'),
        'priority' => 160,
    ));

    // Section Title
    $wp_customize->add_setting('testimonials_title', array(
        'default'           => 'What Our Users Say',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('testimonials_title', array(
        'label'   => __('Section Title', 'app-landing'),
        'section' => 'app_landing_testimonials',
        'type'    => 'text',
    ));

    // Section Subtitle
    $wp_customize->add_setting('testimonials_subtitle', array(
        'default'           => 'Trusted by thousands of satisfied customers',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('testimonials_subtitle', array(
        'label'   => __('Section Subtitle', 'app-landing'),
        'section' => 'app_landing_testimonials',
        'type'    => 'text',
    ));

    // Footer CTA Section
    $wp_customize->add_section('app_landing_footer_cta', array(
        'title'    => __('Footer CTA Section', 'app-landing'),
        'priority' => 170,
    ));

    // CTA Title
    $wp_customize->add_setting('footer_cta_title', array(
        'default'           => 'Ready to Get Started?',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('footer_cta_title', array(
        'label'   => __('CTA Title', 'app-landing'),
        'section' => 'app_landing_footer_cta',
        'type'    => 'text',
    ));

    // CTA Subtitle
    $wp_customize->add_setting('footer_cta_subtitle', array(
        'default'           => 'Join thousands of satisfied users today and take your experience to the next level.',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('footer_cta_subtitle', array(
        'label'   => __('CTA Subtitle', 'app-landing'),
        'section' => 'app_landing_footer_cta',
        'type'    => 'textarea',
    ));

    // CTA Note
    $wp_customize->add_setting('footer_cta_note', array(
        'default'           => 'No credit card required. Cancel anytime.',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('footer_cta_note', array(
        'label'   => __('CTA Note', 'app-landing'),
        'section' => 'app_landing_footer_cta',
        'type'    => 'text',
    ));

    // Call to Action Buttons
    $wp_customize->add_section('app_landing_cta_buttons', array(
        'title'    => __('Call to Action Buttons', 'app-landing'),
        'priority' => 120,
    ));

    // Primary CTA Text
    $wp_customize->add_setting('primary_cta_text', array(
        'default'           => 'Sign Up Free',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('primary_cta_text', array(
        'label'   => __('Primary CTA Text', 'app-landing'),
        'section' => 'app_landing_cta_buttons',
        'type'    => 'text',
    ));

    // Primary CTA URL
    $wp_customize->add_setting('primary_cta_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('primary_cta_url', array(
        'label'   => __('Primary CTA URL', 'app-landing'),
        'section' => 'app_landing_cta_buttons',
        'type'    => 'url',
    ));

    // Secondary CTA Text
    $wp_customize->add_setting('secondary_cta_text', array(
        'default'           => 'Learn More',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'postMessage',
    ));

    $wp_customize->add_control('secondary_cta_text', array(
        'label'   => __('Secondary CTA Text', 'app-landing'),
        'section' => 'app_landing_cta_buttons',
        'type'    => 'text',
    ));

    // Secondary CTA URL
    $wp_customize->add_setting('secondary_cta_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('secondary_cta_url', array(
        'label'   => __('Secondary CTA URL', 'app-landing'),
        'section' => 'app_landing_cta_buttons',
        'type'    => 'url',
    ));

    // Login URL
    $wp_customize->add_setting('login_url', array(
        'default'           => '#',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('login_url', array(
        'label'   => __('Login URL', 'app-landing'),
        'section' => 'app_landing_cta_buttons',
        'type'    => 'url',
    ));

    // FullStory Integration
    $wp_customize->add_section('app_landing_fullstory', array(
        'title'    => __('FullStory Integration', 'app-landing'),
        'priority' => 200,
    ));

    // FullStory Org ID
    $wp_customize->add_setting('fullstory_org_id', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('fullstory_org_id', array(
        'label'       => __('FullStory Organization ID', 'app-landing'),
        'description' => __('Enter your FullStory organization ID to enable analytics tracking.', 'app-landing'),
        'section'     => 'app_landing_fullstory',
        'type'        => 'text',
    ));
}
add_action('customize_register', 'app_landing_customize_register');

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function app_landing_customize_preview_js() {
    wp_enqueue_script('app_landing_customizer', get_template_directory_uri() . '/js/customizer.js', array('customize-preview'), '20230101', true);
}
add_action('customize_preview_init', 'app_landing_customize_preview_js');
