(function(){
  // Load PostHog only after consent
  let loaded = false;
  let trackingBound = false;
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
            // Bind tracking as soon as PostHog is ready
            try { setupGlobalTracking(); } catch(e) { console.warn('Tracking setup error', e); }
          }
        });
        loaded = true;
      } catch(e) {
        console.warn('PostHog init error', e);
      }
    });
  }

  function captureSafe(eventName, props){
    try { if (window.posthog && posthog.capture) posthog.capture(eventName, props || {}); } catch(e) {}
  }

  function setupGlobalTracking(){
    if (trackingBound) return;
    if (!window.posthog) return; // wait for PH
    trackingBound = true;

    // Page context
    const ctx = { path: location.pathname, url: location.href, title: document.title };

    // Link clicks (delegated)
    document.addEventListener('click', function(e){
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const outbound = /^https?:\/\//i.test(href) && !href.includes(location.hostname);
      captureSafe('Link Click', { ...ctx, href, text: (a.textContent||'').trim().slice(0,200), outbound });
    });

    // Button clicks (delegated)
    document.addEventListener('click', function(e){
      const btn = e.target.closest('button, .btn, [role="button"]');
      if (!btn) return;
      captureSafe('Button Click', { ...ctx, text: (btn.textContent||'').trim().slice(0,200), classes: btn.className||'' });
    });

    // FAQ preview card clicks on index
    document.addEventListener('click', function(e){
      const card = e.target.closest('.faq-card');
      if (!card) return;
      const q = (card.querySelector('h3')?.textContent||'').trim();
      captureSafe('FAQ Preview Click', { ...ctx, question: q });
    });

    // Expose helpers for other scripts (faq.js) without coupling
    window.__track = window.__track || {};
    window.__track.faqItemViewed = function(question){ captureSafe('FAQ Item Viewed', { ...ctx, question }); };
    window.__track.faqItemClicked = function(question){ captureSafe('FAQ Item Click', { ...ctx, question }); };
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
    // If PH already present (e.g., cached), ensure tracking is bound
    try { if (window.posthog) setupGlobalTracking(); } catch(e) {}
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      handleConsent();
      try { if (window.posthog) setupGlobalTracking(); } catch(e) {}
    });
  }
})();
