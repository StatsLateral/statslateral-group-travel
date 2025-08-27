(function(){
  const STORAGE_KEY = 'cookie_consent'; // stores 'accepted' | 'rejected'
  const CONSENT_EVENTS = {
    accepted: 'cookieConsent:accepted',
    rejected: 'cookieConsent:rejected'
  };

  function getConsent(){
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }
  function setConsent(value){
    try { localStorage.setItem(STORAGE_KEY, value); } catch(e) {}
  }
  function dispatch(eventName){
    document.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
  }

  function createBanner(){
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.position = 'fixed';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.bottom = '0';
    banner.style.zIndex = '9999';
    banner.style.background = '#111827';
    banner.style.color = '#fff';
    banner.style.padding = '16px';
    banner.style.boxShadow = '0 -4px 20px rgba(0,0,0,0.2)';

    banner.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        <p style="margin: 0; line-height: 1.4; font-size: 14px;">
          We use cookies and similar technologies to provide essential site functionality and, with your consent, to analyze usage and improve our services.
          See our <a href="privacy.html" target="_blank" rel="noopener noreferrer" style="color:#93c5fd; text-decoration: underline;">Privacy Policy</a>.
        </p>
        <div style="display:flex; gap: 8px;">
          <button id="cookie-reject" style="background: transparent; color: #fff; border: 1px solid #374151; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Reject non-essential</button>
          <button id="cookie-accept" style="background: #2563eb; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Accept all</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    const acceptBtn = banner.querySelector('#cookie-accept');
    const rejectBtn = banner.querySelector('#cookie-reject');

    acceptBtn.addEventListener('click', function(){
      setConsent('accepted');
      removeBanner();
      dispatch(CONSENT_EVENTS.accepted);
    });
    rejectBtn.addEventListener('click', function(){
      setConsent('rejected');
      removeBanner();
      dispatch(CONSENT_EVENTS.rejected);
    });
  }

  function removeBanner(){
    const el = document.getElementById('cookie-consent-banner');
    if (el) el.remove();
  }

  function init(){
    const current = getConsent();
    if (current === 'accepted') {
      dispatch(CONSENT_EVENTS.accepted);
      return;
    }
    if (current === 'rejected') {
      dispatch(CONSENT_EVENTS.rejected);
      return;
    }
    // no consent yet -> show banner
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }

  // Public helper
  window.CookieConsent = {
    get: getConsent,
    set: setConsent,
    isAccepted: function(){ return getConsent() === 'accepted'; },
    isRejected: function(){ return getConsent() === 'rejected'; }
  };

  init();
})();
