// Basic offline shell + asset pre-cache placeholder.
const CACHE_NAME = 'causehive-static-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/health.html'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      // Optionally put some responses in cache (runtime cache policy could be improved later)
      return resp;
    }))
  );
});
