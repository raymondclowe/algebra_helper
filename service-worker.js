// Service Worker for Algebra Helper PWA
const CACHE_NAME = 'algebra-helper-v1.0.2-offline';
const urlsToCache = [
  // HTML files
  './algebra-helper.html',
  './index.html',
  
  // CSS files
  './css/styles.css',
  './css/tailwind.css',
  
  // Core JS files
  './js/activity-tracker.js',
  './js/calibration.js',
  './js/constants.js',
  './js/debug-mode.js',
  './js/display-modes.js',
  './js/drill.js',
  './js/explanation-modal.js',
  './js/fixing-habits-questions.js',
  './js/gamification.js',
  './js/generator.js',
  './js/help-modal.js',
  './js/main.js',
  './js/name-modal.js',
  './js/settings-modal.js',
  './js/state.js',
  './js/stats-modal.js',
  './js/storage-manager.js',
  './js/time-tracking-modal.js',
  './js/topic-definitions.js',
  './js/ui.js',
  './js/worksheet-generator.js',
  
  // Question template files
  './js/question-templates/advanced-calculus.js',
  './js/question-templates/advanced-integration.js',
  './js/question-templates/advanced-probability.js',
  './js/question-templates/advanced-trig.js',
  './js/question-templates/basic-arithmetic.js',
  './js/question-templates/basic-equations.js',
  './js/question-templates/calculus.js',
  './js/question-templates/complex-numbers.js',
  './js/question-templates/complex-polar.js',
  './js/question-templates/decimals-percentages.js',
  './js/question-templates/differential-equations.js',
  './js/question-templates/exponentials-logs.js',
  './js/question-templates/fractions.js',
  './js/question-templates/functions.js',
  './js/question-templates/generator-utils.js',
  './js/question-templates/hypothesis-testing.js',
  './js/question-templates/inequalities.js',
  './js/question-templates/matrix-algebra.js',
  './js/question-templates/multiplication-tables.js',
  './js/question-templates/polynomials.js',
  './js/question-templates/probability-distributions.js',
  './js/question-templates/probability.js',
  './js/question-templates/proofs-contradiction.js',
  './js/question-templates/proofs-induction.js',
  './js/question-templates/quadratics.js',
  './js/question-templates/sequences-series.js',
  './js/question-templates/squares-roots.js',
  './js/question-templates/statistics.js',
  './js/question-templates/trigonometry.js',
  './js/question-templates/vectors-3d.js',
  './js/question-templates/vectors.js',
  './js/question-templates/why-questions.js',
  
  // PWA files
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache install error:', err);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // For MathJax CDN resources, use network-first strategy
  if (requestUrl.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the successful response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For local resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Only cache same-origin requests
            if (response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          }
        ).catch(() => {
          // Network request failed
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
