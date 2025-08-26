<?php
/**
 * The header for our theme
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="header">
    <div class="container">
        <nav class="navbar">
            <div class="logo">
                <?php
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo '<a href="' . esc_url(home_url('/')) . '"><img src="' . get_template_directory_uri() . '/images/logo.png" alt="' . get_bloginfo('name') . '"></a>';
                }
                ?>
            </div>
            
            <?php
            wp_nav_menu(array(
                'theme_location' => 'header-menu',
                'container'      => false,
                'menu_class'     => 'nav-menu',
                'fallback_cb'    => function() {
                    // Default menu if none is assigned
                    echo '<ul class="nav-menu">';
                    echo '<li><a href="#features">Features</a></li>';
                    echo '<li><a href="#how-it-works">How It Works</a></li>';
                    echo '<li><a href="#testimonials">Testimonials</a></li>';
                    echo '<li><a href="' . esc_url(get_theme_mod('login_url', '#')) . '" class="btn btn-secondary">Log In</a></li>';
                    echo '<li><a href="' . esc_url(get_theme_mod('primary_cta_url', '#')) . '" class="btn btn-primary">' . get_theme_mod('primary_cta_text', 'Sign Up Free') . '</a></li>';
                    echo '</ul>';
                }
            ));
            ?>
            
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </nav>
    </div>
</header>
