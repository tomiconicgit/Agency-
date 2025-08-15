const CACHE_NAME = 'agency-cache-v1.2';
const urlsToCache = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'sounds/click.mp3',
  'sounds/login-success.mp3',
  'sounds/login-fail.mp3',
  'sounds/notification.mp3',
  'sounds/alert-critical.mp3',
  'sounds/typing.mp3',
  'sounds/deploy-success.mp3',
  'sounds/mission-complete.mp3',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
