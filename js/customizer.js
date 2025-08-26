/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $ ) {

	// Hero Section
	wp.customize( 'hero_headline', function( value ) {
		value.bind( function( to ) {
			$( '.hero-text h1' ).text( to );
		} );
	} );

	wp.customize( 'hero_subheadline', function( value ) {
		value.bind( function( to ) {
			$( '.hero-text p' ).text( to );
		} );
	} );

	// How It Works Section
	wp.customize( 'how_it_works_title', function( value ) {
		value.bind( function( to ) {
			$( '#how-it-works .section-header h2' ).text( to );
		} );
	} );

	wp.customize( 'how_it_works_subtitle', function( value ) {
		value.bind( function( to ) {
			$( '#how-it-works .section-header p' ).text( to );
		} );
	} );

	// Step titles and descriptions
	for (let i = 1; i <= 3; i++) {
		wp.customize( 'step_' + i + '_title', function( value ) {
			value.bind( function( to ) {
				$( '.steps .step:nth-child(' + i + ') h3' ).text( to );
			} );
		} );

		wp.customize( 'step_' + i + '_description', function( value ) {
			value.bind( function( to ) {
				$( '.steps .step:nth-child(' + i + ') p' ).text( to );
			} );
		} );
	}

	// Features Section
	wp.customize( 'features_title', function( value ) {
		value.bind( function( to ) {
			$( '#features .section-header h2' ).text( to );
		} );
	} );

	wp.customize( 'features_subtitle', function( value ) {
		value.bind( function( to ) {
			$( '#features .section-header p' ).text( to );
		} );
	} );

	// Testimonials Section
	wp.customize( 'testimonials_title', function( value ) {
		value.bind( function( to ) {
			$( '#testimonials .section-header h2' ).text( to );
		} );
	} );

	wp.customize( 'testimonials_subtitle', function( value ) {
		value.bind( function( to ) {
			$( '#testimonials .section-header p' ).text( to );
		} );
	} );

	// Footer CTA Section
	wp.customize( 'footer_cta_title', function( value ) {
		value.bind( function( to ) {
			$( '.cta-section .cta-content h2' ).text( to );
		} );
	} );

	wp.customize( 'footer_cta_subtitle', function( value ) {
		value.bind( function( to ) {
			$( '.cta-section .cta-content > p:first-of-type' ).text( to );
		} );
	} );

	wp.customize( 'footer_cta_note', function( value ) {
		value.bind( function( to ) {
			$( '.cta-section .cta-small' ).text( to );
		} );
	} );

	// CTA Buttons
	wp.customize( 'primary_cta_text', function( value ) {
		value.bind( function( to ) {
			$( '.btn-primary' ).text( to );
		} );
	} );

	wp.customize( 'secondary_cta_text', function( value ) {
		value.bind( function( to ) {
			$( '.btn-outline' ).text( to );
		} );
	} );

} )( jQuery );
