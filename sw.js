const CACHE_NAME = 'my-pwa-cache-v1'; // Change version when updating files
const urlsToCache = [
  '../index.html/',
  '../en/index.html',
  '../en/about.html',
  '../en/socials.html', 
  '../en/terms.html',
  '../en/imgs/anyweb-8831.png',
  '../en/imgs/profile.png',
  '../es/index.html',
  '../es/about.html',
  '../es/socials.html', 
  '../es/terms.html',
  '../es/imgs/anyweb-8831.png',
  '../es/imgs/profile.png',
  '../pt/index.html',
  '../pt/about.html',
  '../pt/socials.html', 
  '../pt/terms.html',
  '../pt/imgs/anyweb-8831.png',
  '../pt/imgs/profile.png',
  '../css/style.css', // Replace with your actual CSS files
  '../css/socials.css', // Replace with your actual CSS files
  '../en/js/main.js',  // Replace with your actual JS files
  '../icon-192x192.png', // Include your icons
  '../icon-512x512.png'
  // Add all static assets you want to cache for offline use
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

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
});