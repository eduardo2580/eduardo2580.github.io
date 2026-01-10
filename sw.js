self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('meu-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.pt.html',
        '/index.es.html',
        '/index.en.html',
        '/manifest.json',
        '/site.webmanifest',
        '/index.html',
        '/terms.en.html',
        '/terms.pt.html',
        '/terms.es.html',
        '/style.css',
        '/script.js',
        '/socials.pt.html',
        '/socials.es.html',
        '/socials.en.html',
        '/about.en.html',
        '/about.pt.html',
        '/about.es.html',
      ]);
      
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
