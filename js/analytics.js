(function(){
  // Load PostHog only after consent
  let loaded = false;
  function getConfig(){
    // Prefer CONFIG if available, else fallback to safe defaults present in repo
    const key = (window.CONFIG && window.CONFIG.POSTHOG_API_KEY) ? window.CONFIG.POSTHOG_API_KEY : 'phc_2NYqhDO03y18IDWcRn16AQQD0Jg5fFJq4JIbKN1VGOQ';
    const host = (window.CONFIG && window.CONFIG.POSTHOG_HOST) ? window.CONFIG.POSTHOG_HOST : 'https://us.i.posthog.com';
    return { key, host };
  }

  function loadScript(src, cb){
    const s = document.createElement('script');
    s.async = true; s.src = src; s.crossOrigin = 'anonymous';
    s.onload = cb; s.onerror = function(){ console.warn('PostHog script failed to load'); };
    document.head.appendChild(s);
  }

  function initPostHog(){
    if (loaded || window.posthog) return; // idempotent
    const { key, host } = getConfig();
    // Array loader, then init
    const assetsHost = host.replace('.i.posthog.com','-assets.i.posthog.com');
    loadScript(assetsHost + '/static/array.js', function(){
      try {
        window.posthog = window.posthog || [];
        posthog.init(key, {
          api_host: host,
          capture_pageview: true,
          // Only create profiles after consent
          person_profiles: 'always',
          loaded: function(ph){
            if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
              ph.debug();
            }
          }
        });
        loaded = true;
      } catch(e) {
        console.warn('PostHog init error', e);
      }
    });
  }

  function handleConsent(){
    if (window.CookieConsent && window.CookieConsent.isAccepted()) {
      initPostHog();
    }
    // If rejected or not set, do nothing (no tracking)
  }

  // React to consent selection
  document.addEventListener('cookieConsent:accepted', initPostHog);
  document.addEventListener('cookieConsent:rejected', function(){ /* no-op, ensure not loaded */ });

  // If consent already granted before this script runs, initialize immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handleConsent();
  } else {
    document.addEventListener('DOMContentLoaded', handleConsent);
  }
})();
