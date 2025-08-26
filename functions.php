<?php
/**
 * App Landing Page Theme functions and definitions
 */

if (!defined('_S_VERSION')) {
    // Replace the version number of the theme on each release.
    define('_S_VERSION', '1.0.0');
}

/**
 * Include required files
 */
require get_template_directory() . '/inc/custom-post-types.php';
require get_template_directory() . '/inc/customizer.php';

/**
 * Enqueue scripts and styles.
 */
function app_landing_scripts() {
    wp_enqueue_style('app-landing-style', get_template_directory_uri() . '/css/style.css', array(), _S_VERSION);
    wp_enqueue_script('app-landing-script', get_template_directory_uri() . '/js/script.js', array('jquery'), _S_VERSION, true);
    
    // Add customizer preview script only in the customizer
    if (is_customize_preview()) {
        wp_enqueue_script('app-landing-customizer-preview', get_template_directory_uri() . '/js/customizer.js', array('customize-preview', 'jquery'), _S_VERSION, true);
    }
}
add_action('wp_enqueue_scripts', 'app_landing_scripts');

/**
 * Register navigation menus
 */
function app_landing_register_menus() {
    register_nav_menus(
        array(
            'header-menu' => __('Header Menu', 'app-landing'),
            'footer-product' => __('Footer Product Menu', 'app-landing'),
            'footer-company' => __('Footer Company Menu', 'app-landing'),
            'footer-support' => __('Footer Support Menu', 'app-landing'),
        )
    );
}
add_action('init', 'app_landing_register_menus');

/**
 * Register widget areas
 */
function app_landing_widgets_init() {
    register_sidebar(
        array(
            'name'          => __('Footer Widget Area', 'app-landing'),
            'id'            => 'footer-widget-area',
            'description'   => __('Add widgets here to appear in the footer.', 'app-landing'),
            'before_widget' => '<div class="footer-widget">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4>',
            'after_title'   => '</h4>',
        )
    );
}
add_action('widgets_init', 'app_landing_widgets_init');

/**
 * Add theme support
 */
function app_landing_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Add support for full and wide align images.
    add_theme_support('align-wide');

    // Add support for responsive embeds.
    add_theme_support('responsive-embeds');

    // Add support for custom logo.
    add_theme_support(
        'custom-logo',
        array(
            'height'      => 40,
            'width'       => 160,
            'flex-width'  => true,
            'flex-height' => true,
        )
    );
}
add_action('after_setup_theme', 'app_landing_setup');

/**
 * Custom template tags for this theme.
 */
function app_landing_posted_on() {
    printf(
        '<span class="posted-on">%s</span>',
        esc_html(get_the_date())
    );
}

function app_landing_posted_by() {
    printf(
        '<span class="byline"> %s</span>',
        '<span class="author vcard"><a href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>'
    );
}

/**
 * Add FullStory integration
 */
function app_landing_add_fullstory() {
    // Only add FullStory script if the organization ID is set
    $fullstory_org_id = get_theme_mod('fullstory_org_id', '');
    
    if (!empty($fullstory_org_id)) {
        ?>
        <script>
            window['_fs_debug'] = false;
            window['_fs_host'] = 'fullstory.com';
            window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
            window['_fs_org'] = '<?php echo esc_js($fullstory_org_id); ?>';
            window['_fs_namespace'] = 'FS';
            (function(m,n,e,t,l,o,g,y){
                if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
                y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                g.anonymize=function(){g.identify(!!0)};
                g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                g.log = function(a,b){g("log",[a,b])};
                g.consent=function(a){g("consent",!arguments.length||a)};
                g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                g.clearUserCookie=function(){};
                g.setVars=function(n, p){g('setVars',[n,p]);};
                g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
                if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
                g._v="1.3.0";
            })(window,document,window['_fs_namespace'],'script','user');
        </script>
        <?php
    }
}
add_action('wp_head', 'app_landing_add_fullstory', 10);

/**
 * Track CTA button clicks with FullStory
 */
function app_landing_track_cta_clicks() {
    if (get_theme_mod('fullstory_org_id', '')) {
        ?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Track all CTA button clicks
                document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(function(button) {
                    button.addEventListener('click', function() {
                        if (window.FS) {
                            FS.event('CTA_Button_Click', {
                                buttonText: this.textContent.trim(),
                                buttonType: this.classList.contains('btn-primary') ? 'primary' : 
                                           (this.classList.contains('btn-secondary') ? 'secondary' : 'outline'),
                                location: this.closest('section')?.id || 'unknown'
                            });
                        }
                    });
                });
            });
        </script>
        <?php
    }
}
add_action('wp_footer', 'app_landing_track_cta_clicks', 20);

/**
 * Create a page with the App Landing Page template on theme activation
 */
function app_landing_create_landing_page() {
    // Check if the landing page already exists
    $landing_page = get_page_by_path('app-landing');
    
    if (!$landing_page) {
        // Create the landing page
        $landing_page_id = wp_insert_post(array(
            'post_title'    => 'App Landing Page',
            'post_name'     => 'app-landing',
            'post_status'   => 'publish',
            'post_type'     => 'page',
            'post_content'  => '',
            'page_template' => 'page-landing.php'
        ));
        
        // Set the page template
        update_post_meta($landing_page_id, '_wp_page_template', 'page-landing.php');
    }
}
add_action('after_switch_theme', 'app_landing_create_landing_page');

/**
 * Add body class for the landing page template
 */
function app_landing_body_classes($classes) {
    if (is_page_template('page-landing.php')) {
        $classes[] = 'app-landing-page';
    }
    return $classes;
}
add_filter('body_class', 'app_landing_body_classes');
