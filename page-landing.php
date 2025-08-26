<?php
/**
 * Template Name: App Landing Page
 *
 * A custom page template for the app landing page.
 */

get_header();
?>

<section class="hero" id="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <h1><?php echo get_theme_mod('hero_headline', 'Your App\'s Powerful Headline Goes Here'); ?></h1>
                <p><?php echo get_theme_mod('hero_subheadline', 'A compelling subheadline that explains your app\'s value proposition in a clear and concise way.'); ?></p>
                <div class="cta-buttons">
                    <a href="<?php echo esc_url(get_theme_mod('primary_cta_url', '#')); ?>" class="btn btn-primary"><?php echo get_theme_mod('primary_cta_text', 'Get Started Free'); ?></a>
                    <a href="<?php echo esc_url(get_theme_mod('secondary_cta_url', '#')); ?>" class="btn btn-outline"><?php echo get_theme_mod('secondary_cta_text', 'Learn More'); ?></a>
                </div>
            </div>
            <div class="hero-image">
                <?php 
                $hero_image = get_theme_mod('hero_image');
                if ($hero_image) {
                    echo wp_get_attachment_image($hero_image, 'full', false, array('alt' => 'App Screenshot'));
                } else {
                    echo '<img src="' . get_template_directory_uri() . '/images/app-screenshot.png" alt="App Screenshot">';
                }
                ?>
            </div>
        </div>
    </div>
</section>

<section class="how-it-works" id="how-it-works">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('how_it_works_title', 'How It Works'); ?></h2>
            <p><?php echo get_theme_mod('how_it_works_subtitle', 'Simple steps to get started with our app'); ?></p>
        </div>
        <div class="steps">
            <?php for ($i = 1; $i <= 3; $i++) : ?>
                <div class="step">
                    <div class="step-icon">
                        <?php 
                        $step_icon = get_theme_mod('step_' . $i . '_icon');
                        if ($step_icon) {
                            echo wp_get_attachment_image($step_icon, 'thumbnail', false, array('alt' => 'Step ' . $i));
                        } else {
                            echo '<img src="' . get_template_directory_uri() . '/images/step-' . $i . '.png" alt="Step ' . $i . '">';
                        }
                        ?>
                    </div>
                    <h3><?php echo get_theme_mod('step_' . $i . '_title', 'Step ' . $i . ': ' . ($i == 1 ? 'Sign Up' : ($i == 2 ? 'Configure' : 'Enjoy'))); ?></h3>
                    <p><?php echo get_theme_mod('step_' . $i . '_description', ($i == 1 ? 'Create your account in seconds and get immediate access to all features.' : ($i == 2 ? 'Set up your preferences and customize the app to fit your needs.' : 'Start using the app and see the results immediately.'))); ?></p>
                </div>
            <?php endfor; ?>
        </div>
    </div>
</section>

<section class="features" id="features">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('features_title', 'Features & Benefits'); ?></h2>
            <p><?php echo get_theme_mod('features_subtitle', 'Discover what makes our app special'); ?></p>
        </div>
        <div class="features-grid">
            <?php
            // Get features from custom post type if available, otherwise use default features
            $features_query = new WP_Query(array(
                'post_type' => 'app_feature',
                'posts_per_page' => 6,
                'orderby' => 'menu_order',
                'order' => 'ASC',
            ));

            if ($features_query->have_posts()) :
                while ($features_query->have_posts()) : $features_query->the_post();
                    ?>
                    <div class="feature">
                        <div class="feature-icon"><?php echo get_post_meta(get_the_ID(), 'feature_icon', true); ?></div>
                        <h3><?php the_title(); ?></h3>
                        <p><?php the_excerpt(); ?></p>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                // Default features if no custom features are added
                $default_features = array(
                    array('🚀', 'Lightning Fast', 'Experience blazing fast performance with our optimized app.'),
                    array('🔒', 'Secure & Private', 'Your data is always protected with enterprise-grade security.'),
                    array('📱', 'Works Everywhere', 'Use on any device with our responsive design.'),
                    array('⚡', 'Easy Integration', 'Connects seamlessly with your favorite tools and services.'),
                    array('🔄', 'Regular Updates', 'Get new features and improvements automatically.'),
                    array('💬', '24/7 Support', 'Our team is always ready to help whenever you need it.')
                );

                foreach ($default_features as $feature) :
                    ?>
                    <div class="feature">
                        <div class="feature-icon"><?php echo $feature[0]; ?></div>
                        <h3><?php echo $feature[1]; ?></h3>
                        <p><?php echo $feature[2]; ?></p>
                    </div>
                    <?php
                endforeach;
            endif;
            ?>
        </div>
    </div>
</section>

<section class="testimonials" id="testimonials">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('testimonials_title', 'What Our Users Say'); ?></h2>
            <p><?php echo get_theme_mod('testimonials_subtitle', 'Trusted by thousands of satisfied customers'); ?></p>
        </div>
        <div class="testimonials-slider">
            <?php
            // Get testimonials from custom post type if available, otherwise use default testimonials
            $testimonials_query = new WP_Query(array(
                'post_type' => 'testimonial',
                'posts_per_page' => 3,
                'orderby' => 'date',
                'order' => 'DESC',
            ));

            if ($testimonials_query->have_posts()) :
                while ($testimonials_query->have_posts()) : $testimonials_query->the_post();
                    ?>
                    <div class="testimonial">
                        <div class="testimonial-content">
                            <p>"<?php echo get_the_content(); ?>"</p>
                        </div>
                        <div class="testimonial-author">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('thumbnail', array('alt' => get_the_title())); ?>
                            <?php else : ?>
                                <img src="<?php echo get_template_directory_uri(); ?>/images/user-1.png" alt="<?php the_title(); ?>">
                            <?php endif; ?>
                            <div class="author-info">
                                <h4><?php the_title(); ?></h4>
                                <p><?php echo get_post_meta(get_the_ID(), 'testimonial_position', true); ?></p>
                            </div>
                        </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                // Default testimonials if no custom testimonials are added
                $default_testimonials = array(
                    array('Jane Smith', 'Marketing Director', 'This app has completely transformed how I work. I can\'t imagine going back to my old workflow!'),
                    array('John Davis', 'Product Manager', 'The interface is intuitive and the features are exactly what I needed. Highly recommended!'),
                    array('Sarah Johnson', 'Small Business Owner', 'Customer support is exceptional. They helped me set everything up in minutes.')
                );

                foreach ($default_testimonials as $index => $testimonial) :
                    ?>
                    <div class="testimonial">
                        <div class="testimonial-content">
                            <p>"<?php echo $testimonial[2]; ?>"</p>
                        </div>
                        <div class="testimonial-author">
                            <img src="<?php echo get_template_directory_uri(); ?>/images/user-<?php echo $index + 1; ?>.png" alt="<?php echo $testimonial[0]; ?>">
                            <div class="author-info">
                                <h4><?php echo $testimonial[0]; ?></h4>
                                <p><?php echo $testimonial[1]; ?></p>
                            </div>
                        </div>
                    </div>
                    <?php
                endforeach;
            endif;
            ?>
        </div>
    </div>
</section>

<section class="cta-section">
    <div class="container">
        <div class="cta-content">
            <h2><?php echo get_theme_mod('footer_cta_title', 'Ready to Get Started?'); ?></h2>
            <p><?php echo get_theme_mod('footer_cta_subtitle', 'Join thousands of satisfied users today and take your experience to the next level.'); ?></p>
            <a href="<?php echo esc_url(get_theme_mod('primary_cta_url', '#')); ?>" class="btn btn-primary"><?php echo get_theme_mod('primary_cta_text', 'Sign Up For Free'); ?></a>
            <p class="cta-small"><?php echo get_theme_mod('footer_cta_note', 'No credit card required. Cancel anytime.'); ?></p>
        </div>
    </div>
</section>

<?php get_footer(); ?>
