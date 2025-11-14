// Mobile Cache Invalidation Script
// Forces fresh data loading on mobile devices

(function() {
  const APP_VERSION = '1.1.0';
  const STORAGE_KEY = 'khesed-tek-version';
  
  function clearAppCache() {
    // Clear localStorage
    try {
      const currentVersion = localStorage.getItem(STORAGE_KEY);
      if (currentVersion !== APP_VERSION) {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem(STORAGE_KEY, APP_VERSION);
        console.log('📱 Cache cleared for version', APP_VERSION);
      }
    } catch (e) {
      console.warn('Cache clear failed:', e);
    }
    
    // Clear service worker cache
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.indexOf('khesed-tek') !== -1 && cacheName !== `khesed-tek-v${APP_VERSION}`) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      });
    }
    
    // Force reload analytics data
    const currentPath = window.location.pathname;
    if (currentPath.includes('analytics')) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clearAppCache);
  } else {
    clearAppCache();
  }
  
  // Force refresh for mobile browsers
  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Add timestamp to all fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string') {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}v=${APP_VERSION}&t=${Date.now()}`;
      }
      return originalFetch(url, options);
    };
  }
})();