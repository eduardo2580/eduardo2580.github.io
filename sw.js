/* sw.js — Eduardo.AI Service Worker
   Clears ALL caches on every install. No caching. Network-only.
*/
var CACHE_NAME = 'eduardoai-v' + Date.now();

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* Network-only: never cache anything */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(function() {
      return new Response('Offline', { status: 503 });
    })
  );
});
