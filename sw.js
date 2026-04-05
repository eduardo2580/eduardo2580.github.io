/* ===========================================================
   Service Worker – Bíblia Sagrada PWA
   =========================================================== */

const CACHE_NAME    = 'bible-sagrada-v24'; // ← incremente a cada deploy
const PRECACHE_NAME = `${CACHE_NAME}-precache`;
const RUNTIME_NAME  = `${CACHE_NAME}-runtime`;

// ------------------------------
// 1. Assets para pré-cache
// ------------------------------
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  '/css/style.css',
  '/css/bootstrap.min.css',
  '/js/daily.js',
  '/js/bible-data.js',
  '/js/bootstrap.min.js',
  '/js/script.js',
  '/js/sidebar.js',
  '/js/teens.js',
  '/js/splash.js'
];

// ------------------------------
// 2. Debug logging
// ------------------------------
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[SW]', ...args);
}

// ------------------------------
// 3. INSTALL – precache e skipWaiting
// ------------------------------
self.addEventListener('install', event => {
  log('Installing...');
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        log('Precache complete, calling skipWaiting()');
        return self.skipWaiting(); // força passar de "waiting" para "activating"
      })
      .catch(err => console.error('Precache failed:', err))
  );
});

// ------------------------------
// 4. ACTIVATE – limpa caches antigos e assume controle imediato
// ------------------------------
self.addEventListener('activate', event => {
  log('Activating...');
  const expected = [PRECACHE_NAME, RUNTIME_NAME];
  event.waitUntil(
    caches.keys()
      .then(keys => keys.filter(k => !expected.includes(k)))
      .then(old => {
        return Promise.all(
          old.map(k => {
            log('Deleting old cache:', k);
            return caches.delete(k);
          })
        );
      })
      .then(() => self.skipWaiting()) // garante skipWaiting também no activate
      .then(() => self.clients.claim()) // assume controle de todas as abas abertas
      .then(() => {
        // Notifica todos os clientes que o SW foi atualizado → dispara reload
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          log(`Notifying ${clients.length} client(s) of SW update`);
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// ------------------------------
// 5. FETCH – estratégias de cache
// ------------------------------
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) return;

  // Cache First – assets estáticos
  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network First com fallback offline – navegação HTML
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Stale While Revalidate – dados / JSON
  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/api/') || url.pathname.includes('.json')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Padrão: Network First → cache
  event.respondWith(networkFirstFallbackToCache(request));
});

// ------------------------------
// 6. Implementações das estratégias
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
// 7. MESSAGE – recebe comandos do cliente
// ------------------------------
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    log('Received SKIP_WAITING message from client');
    self.skipWaiting();
  }
});

// ------------------------------
// 8. Background Sync (para anotações futuras)
// ------------------------------
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bible-notes') {
    log('Background sync: sync-bible-notes');
    event.waitUntil(syncBibleNotes());
  }
});

async function syncBibleNotes() {
  log('Syncing bible notes... (implemente sua lógica aqui)');
}