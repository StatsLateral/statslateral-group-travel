<?php
/**
 * Custom Post Types for App Landing Page Theme
 */

// Register Custom Post Types
function app_landing_register_post_types() {
    
    // App Feature Custom Post Type
    $feature_labels = array(
        'name'                  => _x( 'App Features', 'Post Type General Name', 'app-landing' ),
        'singular_name'         => _x( 'App Feature', 'Post Type Singular Name', 'app-landing' ),
        'menu_name'             => __( 'App Features', 'app-landing' ),
        'name_admin_bar'        => __( 'App Feature', 'app-landing' ),
        'archives'              => __( 'Feature Archives', 'app-landing' ),
        'attributes'            => __( 'Feature Attributes', 'app-landing' ),
        'parent_item_colon'     => __( 'Parent Feature:', 'app-landing' ),
        'all_items'             => __( 'All Features', 'app-landing' ),
        'add_new_item'          => __( 'Add New Feature', 'app-landing' ),
        'add_new'               => __( 'Add New', 'app-landing' ),
        'new_item'              => __( 'New Feature', 'app-landing' ),
        'edit_item'             => __( 'Edit Feature', 'app-landing' ),
        'update_item'           => __( 'Update Feature', 'app-landing' ),
        'view_item'             => __( 'View Feature', 'app-landing' ),
        'view_items'            => __( 'View Features', 'app-landing' ),
        'search_items'          => __( 'Search Feature', 'app-landing' ),
        'not_found'             => __( 'Not found', 'app-landing' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'app-landing' ),
        'featured_image'        => __( 'Feature Image', 'app-landing' ),
        'set_featured_image'    => __( 'Set feature image', 'app-landing' ),
        'remove_featured_image' => __( 'Remove feature image', 'app-landing' ),
        'use_featured_image'    => __( 'Use as feature image', 'app-landing' ),
        'insert_into_item'      => __( 'Insert into feature', 'app-landing' ),
        'uploaded_to_this_item' => __( 'Uploaded to this feature', 'app-landing' ),
        'items_list'            => __( 'Features list', 'app-landing' ),
        'items_list_navigation' => __( 'Features list navigation', 'app-landing' ),
        'filter_items_list'     => __( 'Filter features list', 'app-landing' ),
    );
    
    $feature_args = array(
        'label'                 => __( 'App Feature', 'app-landing' ),
        'description'           => __( 'App features to display on the landing page', 'app-landing' ),
        'labels'                => $feature_labels,
        'supports'              => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 20,
        'menu_icon'             => 'dashicons-star-filled',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => false,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => true,
        'publicly_queryable'    => false,
        'capability_type'       => 'page',
        'show_in_rest'          => true,
    );
    
    register_post_type( 'app_feature', $feature_args );
    
    // Testimonial Custom Post Type
    $testimonial_labels = array(
        'name'                  => _x( 'Testimonials', 'Post Type General Name', 'app-landing' ),
        'singular_name'         => _x( 'Testimonial', 'Post Type Singular Name', 'app-landing' ),
        'menu_name'             => __( 'Testimonials', 'app-landing' ),
        'name_admin_bar'        => __( 'Testimonial', 'app-landing' ),
        'archives'              => __( 'Testimonial Archives', 'app-landing' ),
        'attributes'            => __( 'Testimonial Attributes', 'app-landing' ),
        'parent_item_colon'     => __( 'Parent Testimonial:', 'app-landing' ),
        'all_items'             => __( 'All Testimonials', 'app-landing' ),
        'add_new_item'          => __( 'Add New Testimonial', 'app-landing' ),
        'add_new'               => __( 'Add New', 'app-landing' ),
        'new_item'              => __( 'New Testimonial', 'app-landing' ),
        'edit_item'             => __( 'Edit Testimonial', 'app-landing' ),
        'update_item'           => __( 'Update Testimonial', 'app-landing' ),
        'view_item'             => __( 'View Testimonial', 'app-landing' ),
        'view_items'            => __( 'View Testimonials', 'app-landing' ),
        'search_items'          => __( 'Search Testimonial', 'app-landing' ),
        'not_found'             => __( 'Not found', 'app-landing' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'app-landing' ),
        'featured_image'        => __( 'User Photo', 'app-landing' ),
        'set_featured_image'    => __( 'Set user photo', 'app-landing' ),
        'remove_featured_image' => __( 'Remove user photo', 'app-landing' ),
        'use_featured_image'    => __( 'Use as user photo', 'app-landing' ),
        'insert_into_item'      => __( 'Insert into testimonial', 'app-landing' ),
        'uploaded_to_this_item' => __( 'Uploaded to this testimonial', 'app-landing' ),
        'items_list'            => __( 'Testimonials list', 'app-landing' ),
        'items_list_navigation' => __( 'Testimonials list navigation', 'app-landing' ),
        'filter_items_list'     => __( 'Filter testimonials list', 'app-landing' ),
    );
    
    $testimonial_args = array(
        'label'                 => __( 'Testimonial', 'app-landing' ),
        'description'           => __( 'Customer testimonials to display on the landing page', 'app-landing' ),
        'labels'                => $testimonial_labels,
        'supports'              => array( 'title', 'editor', 'thumbnail' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 21,
        'menu_icon'             => 'dashicons-format-quote',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => false,
        'can_export'            => true,
        'has_archive'           => false,
        'exclude_from_search'   => true,
        'publicly_queryable'    => false,
        'capability_type'       => 'page',
        'show_in_rest'          => true,
    );
    
    register_post_type( 'testimonial', $testimonial_args );
}
add_action( 'init', 'app_landing_register_post_types' );

// Add meta boxes for custom post types
function app_landing_add_meta_boxes() {
    // Feature Icon Meta Box
    add_meta_box(
        'feature_icon_meta',
        __( 'Feature Icon', 'app-landing' ),
        'app_landing_feature_icon_callback',
        'app_feature',
        'side',
        'high'
    );
    
    // Testimonial Position Meta Box
    add_meta_box(
        'testimonial_position_meta',
        __( 'Position/Company', 'app-landing' ),
        'app_landing_testimonial_position_callback',
        'testimonial',
        'side',
        'high'
    );
}
add_action( 'add_meta_boxes', 'app_landing_add_meta_boxes' );

// Feature Icon Meta Box Callback
function app_landing_feature_icon_callback( $post ) {
    wp_nonce_field( 'app_landing_feature_icon_nonce', 'feature_icon_nonce' );
    $value = get_post_meta( $post->ID, 'feature_icon', true );
    ?>
    <p><?php _e( 'Enter an emoji or icon character for this feature.', 'app-landing' ); ?></p>
    <input type="text" id="feature_icon" name="feature_icon" value="<?php echo esc_attr( $value ); ?>" size="4" style="font-size: 24px; width: 60px; text-align: center;" />
    <p class="description"><?php _e( 'Examples: 🚀 🔒 📱 ⚡ 🔄 💬', 'app-landing' ); ?></p>
    <?php
}

// Testimonial Position Meta Box Callback
function app_landing_testimonial_position_callback( $post ) {
    wp_nonce_field( 'app_landing_testimonial_position_nonce', 'testimonial_position_nonce' );
    $value = get_post_meta( $post->ID, 'testimonial_position', true );
    ?>
    <p><?php _e( 'Enter the position and/or company of the person giving the testimonial.', 'app-landing' ); ?></p>
    <input type="text" id="testimonial_position" name="testimonial_position" value="<?php echo esc_attr( $value ); ?>" style="width: 100%;" />
    <p class="description"><?php _e( 'Example: "Marketing Director" or "CEO at Company Name"', 'app-landing' ); ?></p>
    <?php
}

// Save Meta Box Data
function app_landing_save_meta_box_data( $post_id ) {
    // Check if our nonce is set for feature icon
    if ( isset( $_POST['feature_icon_nonce'] ) ) {
        if ( ! wp_verify_nonce( $_POST['feature_icon_nonce'], 'app_landing_feature_icon_nonce' ) ) {
            return;
        }
        
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }
        
        if ( isset( $_POST['post_type'] ) && 'app_feature' == $_POST['post_type'] ) {
            if ( ! current_user_can( 'edit_page', $post_id ) ) {
                return;
            }
        } else {
            if ( ! current_user_can( 'edit_post', $post_id ) ) {
                return;
            }
        }
        
        if ( ! isset( $_POST['feature_icon'] ) ) {
            return;
        }
        
        $icon_data = sanitize_text_field( $_POST['feature_icon'] );
        update_post_meta( $post_id, 'feature_icon', $icon_data );
    }
    
    // Check if our nonce is set for testimonial position
    if ( isset( $_POST['testimonial_position_nonce'] ) ) {
        if ( ! wp_verify_nonce( $_POST['testimonial_position_nonce'], 'app_landing_testimonial_position_nonce' ) ) {
            return;
        }
        
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }
        
        if ( isset( $_POST['post_type'] ) && 'testimonial' == $_POST['post_type'] ) {
            if ( ! current_user_can( 'edit_page', $post_id ) ) {
                return;
            }
        } else {
            if ( ! current_user_can( 'edit_post', $post_id ) ) {
                return;
            }
        }
        
        if ( ! isset( $_POST['testimonial_position'] ) ) {
            return;
        }
        
        $position_data = sanitize_text_field( $_POST['testimonial_position'] );
        update_post_meta( $post_id, 'testimonial_position', $position_data );
    }
}
add_action( 'save_post', 'app_landing_save_meta_box_data' );

// Add the custom columns to the app_feature post type
function app_landing_set_feature_columns($columns) {
    $new_columns = array(
        'cb' => $columns['cb'],
        'title' => __('Title', 'app-landing'),
        'feature_icon' => __('Icon', 'app-landing'),
        'feature_excerpt' => __('Description', 'app-landing'),
        'date' => $columns['date'],
    );
    return $new_columns;
}
add_filter('manage_app_feature_posts_columns', 'app_landing_set_feature_columns');

// Add the data to the custom columns for the app_feature post type
function app_landing_feature_custom_column($column, $post_id) {
    switch ($column) {
        case 'feature_icon':
            echo get_post_meta($post_id, 'feature_icon', true);
            break;
        case 'feature_excerpt':
            echo get_the_excerpt($post_id);
            break;
    }
}
add_action('manage_app_feature_posts_custom_column', 'app_landing_feature_custom_column', 10, 2);

// Add the custom columns to the testimonial post type
function app_landing_set_testimonial_columns($columns) {
    $new_columns = array(
        'cb' => $columns['cb'],
        'title' => __('Name', 'app-landing'),
        'testimonial_position' => __('Position', 'app-landing'),
        'testimonial_content' => __('Testimonial', 'app-landing'),
        'date' => $columns['date'],
    );
    return $new_columns;
}
add_filter('manage_testimonial_posts_columns', 'app_landing_set_testimonial_columns');

// Add the data to the custom columns for the testimonial post type
function app_landing_testimonial_custom_column($column, $post_id) {
    switch ($column) {
        case 'testimonial_position':
            echo get_post_meta($post_id, 'testimonial_position', true);
            break;
        case 'testimonial_content':
            echo wp_trim_words(get_the_content(null, false, $post_id), 10, '...');
            break;
    }
}
add_action('manage_testimonial_posts_custom_column', 'app_landing_testimonial_custom_column', 10, 2);
