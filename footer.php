<?php
/**
 * The footer for our theme
 */
?>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-logo">
                <?php
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    echo '<img src="' . get_template_directory_uri() . '/images/logo.png" alt="' . get_bloginfo('name') . '">';
                }
                ?>
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
            </div>
            <div class="footer-links">
                <div class="footer-column">
                    <h4>Product</h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-product',
                        'container'      => false,
                        'fallback_cb'    => function() {
                            echo '<ul>';
                            echo '<li><a href="#features">Features</a></li>';
                            echo '<li><a href="#">Pricing</a></li>';
                            echo '<li><a href="#">Integrations</a></li>';
                            echo '<li><a href="#">Updates</a></li>';
                            echo '</ul>';
                        }
                    ));
                    ?>
                </div>
                <div class="footer-column">
                    <h4>Company</h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-company',
                        'container'      => false,
                        'fallback_cb'    => function() {
                            echo '<ul>';
                            echo '<li><a href="#">About Us</a></li>';
                            echo '<li><a href="#">Careers</a></li>';
                            echo '<li><a href="#">Blog</a></li>';
                            echo '<li><a href="#">Press</a></li>';
                            echo '</ul>';
                        }
                    ));
                    ?>
                </div>
                <div class="footer-column">
                    <h4>Support</h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-support',
                        'container'      => false,
                        'fallback_cb'    => function() {
                            echo '<ul>';
                            echo '<li><a href="#">Help Center</a></li>';
                            echo '<li><a href="#">Contact Us</a></li>';
                            echo '<li><a href="#">Privacy Policy</a></li>';
                            echo '<li><a href="#">Terms of Service</a></li>';
                            echo '</ul>';
                        }
                    ));
                    ?>
                </div>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?> 
</body>
</html>
