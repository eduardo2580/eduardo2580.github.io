var CACHE_VERSION = '1.0.111';

/* ── Files to pre-cache on install (app shell) ── */
var PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/compat.js',
  './js/knowledge.js',
  './js/db.js',
  './js/avatar.js',
  './js/voice.js',
  './js/webllm-loader.js',
  './js/chat.js',
  './js/glow-sync.js',
  './js/sw-register.js',
  './js/pwa-install.js',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png'
];

/* ════════════════════════════════════════════
   INSTALL — pre-cache the app shell
════════════════════════════════════════════ */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ════════════════════════════════════════════
   ACTIVATE — delete old cache versions
════════════════════════════════════════════ */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_VERSION; })
          .map(function (name) {
            if (self.console) self.console.info('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ════════════════════════════════════════════
   FETCH — serve from cache or network
════════════════════════════════════════════ */
self.addEventListener('fetch', function (event) {
  var url = event.request.url;

  if (event.request.method !== 'GET') return;
  if (url.indexOf('http') !== 0) return;

  /* CDN / external assets → Network First */
  var isExternal = (
    url.indexOf('fonts.googleapis.com') >= 0 ||
    url.indexOf('fonts.gstatic.com')    >= 0 ||
    url.indexOf('cdn.jsdelivr.net')     >= 0 ||
    url.indexOf('esm.run')              >= 0 ||
    url.indexOf('esm.sh')               >= 0 ||
    url.indexOf('cdnjs.cloudflare.com') >= 0
  );

  if (isExternal) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  /* App shell → Cache First */
  event.respondWith(cacheFirst(event.request));
});

function cacheFirst(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetchAndCache(request);
  });
}

function networkFirst(request) {
  return fetch(request).then(function (response) {
    if (response && response.ok) {
      var cloned = response.clone();
      caches.open(CACHE_VERSION).then(function (cache) {
        cache.put(request, cloned);
      });
    }
    return response;
  }).catch(function () {
    return caches.match(request);
  });
}

function fetchAndCache(request) {
  return fetch(request).then(function (response) {
    if (!response || response.status !== 200 || response.type === 'opaque') {
      return response;
    }
    var cloned = response.clone();
    caches.open(CACHE_VERSION).then(function (cache) {
      cache.put(request, cloned);
    });
    return response;
  }).catch(function () {
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  });
}
