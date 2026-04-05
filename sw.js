/* ===========================================================
   Service Worker – Bíblia Sagrada PWA
   v25 – FORCE UPDATE / GITHUB PAGES COMPATIBLE
   =========================================================== */

const CACHE_VERSION = 'v27'; // ← INCREMENTE SEMPRE QUE FIZER DEPLOY
const CACHE_NAME    = `bible-sagrada-${CACHE_VERSION}`;
const PRECACHE_NAME = `${CACHE_NAME}-precache`;
const RUNTIME_NAME  = `${CACHE_NAME}-runtime`;

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
  'js/sidebar.js',
  'js/teens.js',
  'js/splash.js'
];

const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[SW]', ...args);
}

// ------------------------------
// INSTALL – skipWaiting imediato
// ------------------------------
self.addEventListener('install', event => {
  log('Installing version:', CACHE_VERSION);
  self.skipWaiting(); // fora do waitUntil = mais agressivo
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => log('Precache complete'))
      .catch(err => console.error('Precache failed:', err))
  );
});

// ------------------------------
// ACTIVATE – limpa caches antigos e assume controle
// ------------------------------
self.addEventListener('activate', event => {
  log('Activating version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(k => {
          if (k !== PRECACHE_NAME && k !== RUNTIME_NAME) {
            log('Deleting old cache:', k);
            return caches.delete(k);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ------------------------------
// FETCH – estratégias de cache
// ------------------------------
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições externas e não-GET
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) return;

  // Nunca faz cache do próprio sw.js
  if (url.pathname.includes('sw.js')) return;

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/api/') || url.pathname.includes('.json')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(networkFirstFallbackToCache(request));
});

// ------------------------------
// Estratégias
// ------------------------------
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) { log('Cache hit:', request.url); return cached; }
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
    throw new Error('Bad response');
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match('/offline.html');
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
  const cache  = await caches.open(RUNTIME_NAME);
  const cached = await cache.match(request);
  const revalidate = fetch(request).then(response => {
    if (response?.status === 200) cache.put(request, response.clone());
    return response;
  }).catch(() => {});
  return cached || revalidate;
}

async function networkFirstFallbackToCache(request) {
  try {
    const response = await fetch(request);
    if (response?.status === 200) {
      const cache = await caches.open(RUNTIME_NAME);
      cache.put(request, response.clone());
      return response;
    }
    throw new Error('Bad response');
  } catch {
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