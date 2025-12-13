// Service Worker for Algebra Helper PWA
const CACHE_NAME = 'algebra-helper-v1.0.0';
const urlsToCache = [
  '/algebra_helper/algebra-helper.html',
  '/algebra_helper/index.html',
  '/algebra_helper/css/styles.css',
  '/algebra_helper/js/main.js',
  '/algebra_helper/js/ui.js',
  '/algebra_helper/js/generator.js',
  '/algebra_helper/js/state.js',
  '/algebra_helper/js/drill.js',
  '/algebra_helper/js/calibration.js',
  '/algebra_helper/js/constants.js',
  '/algebra_helper/js/storage-manager.js',
  '/algebra_helper/js/stats-modal.js',
  '/algebra_helper/js/activity-tracker.js',
  '/algebra_helper/js/gamification.js',
  '/algebra_helper/js/debug-mode.js',
  '/algebra_helper/manifest.json',
  '/algebra_helper/icons/icon-192x192.png',
  '/algebra_helper/icons/icon-512x512.png'
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
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
