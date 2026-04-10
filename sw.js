/* ===========================================================
   Service Worker – Bíblia Sagrada PW
   v28 – FIXED
   =========================================================== */

const CACHE_VERSION = 'v60';
const PRECACHE_NAME = `bible-sagrada-${CACHE_VERSION}-precache`;
const RUNTIME_NAME = `bible-sagrada-${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
  './',
  'index.html',
  'offline.html',
  'site.webmanifest',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.ico',
  'css/style.css',
  'css/bootstrap.min.css',
  'js/daily.js',
  'js/bible-data.js',
  'js/bootstrap.min.js',
  'js/script.js',
  'js/teens.js',
  'js/splash.js'
];

const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[SW]', ...args);
}

// ------------------------------
// INSTALL
// ------------------------------
self.addEventListener('install', event => {
  log('Installing version:', CACHE_VERSION);
  // FIX: skipWaiting inside waitUntil to avoid race conditions
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        log('Precache complete');
        return self.skipWaiting();
      })
      .catch(err => console.error('Precache failed:', err))
  );
});

// ------------------------------
// ACTIVATE – delete old caches and claim clients
// ------------------------------
self.addEventListener('activate', event => {
  log('Activating version:', CACHE_VERSION);
  const validCaches = new Set([PRECACHE_NAME, RUNTIME_NAME]);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(k => {
          // FIX: delete any cache NOT in the current version's set
          if (!validCaches.has(k)) {
            log('Deleting old cache:', k);
            return caches.delete(k);
          }
        })
      ))
      .then(() => {
        log('Now controlling all clients');
        return self.clients.claim();
      })
  );
});

// ------------------------------
// FETCH
// ------------------------------
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // FIX: strict equality, not startsWith
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never cache the SW itself
  if (url.pathname.includes('sw.js')) return;

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  if (
    url.pathname.startsWith('/data/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('.json')
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(networkFirstFallbackToCache(request));
});

// ------------------------------
// Strategies
// ------------------------------
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    log('Cache hit:', request.url);
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response?.status === 200) {
      const cache = await caches.open(RUNTIME_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.error('cacheFirst fetch failed:', request.url, err);
    throw err;
  }
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response?.status === 200) {
      const cache = await caches.open(RUNTIME_NAME);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error(`Bad response: ${response?.status}`);
  } catch (err) {
    log('Network failed, falling back to cache:', err.message);
    const cached = await caches.match(request);
    if (cached) return cached;

    const offline = await caches.match('offline.html');
    if (offline) return offline;

    return new Response(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8"><title>Offline – Bíblia Sagrada</title>
      <style>body{text-align:center;padding:2rem;font-family:sans-serif;background:#f5edd8}</style></head>
      <body><h1>📖 Sem conexão</h1><p>Verifique sua internet e tente novamente.</p>
      <button onclick="location.reload()">Tentar novamente</button></body>
      </html>`, { headers: { 'Content-Type': 'text/html' } });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_NAME);
  const cached = await cache.match(request);

  // FIX: always kick off revalidation, but don't let it block the response
  const revalidatePromise = fetch(request)
    .then(response => {
      if (response?.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(err => {
      log('Revalidation failed:', request.url, err.message);
      return null;
    });

  // FIX: if we have a cached copy, return it immediately; else await the network
  return cached ?? revalidatePromise;
}

async function networkFirstFallbackToCache(request) {
  try {
    const response = await fetch(request);
    if (response?.status === 200) {
      const cache = await caches.open(RUNTIME_NAME);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error(`Bad response: ${response?.status}`);
  } catch (err) {
    log('Network failed, trying cache:', request.url, err.message);
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Recurso não disponível offline', { status: 404 });
  }
}

// ------------------------------
// MESSAGE
// ------------------------------
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    log('Received SKIP_WAITING from client');
    self.skipWaiting();
  }
});

// ------------------------------
// Background Sync
// ------------------------------
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bible-notes') {
    log('Background sync: sync-bible-notes');
    event.waitUntil(syncBibleNotes());
  }
});

async function syncBibleNotes() {
  log('Syncing bible notes...');
}

async function syncBibleNotes() {
  log('Syncing bible notes...');
}
