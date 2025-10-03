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
// Allow web pages to ask the service worker to skip waiting or clear caches.
self.addEventListener('message', (event) => {
  try {
    const data = event.data || {}
    if (data && data.type === 'SKIP_WAITING') {
      // Activate this service worker immediately
      self.skipWaiting()
    }
    if (data && data.type === 'CLEAR_CACHE') {
      // Delete all caches except the current one
      caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
    }
  } catch (e) {
    console.warn('Service worker message handler error', e)
  }
})
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // For navigation requests (SPA index.html), prefer the network so clients get
  // the freshest index.html (avoids serving a stale HTML that references old hashed assets).
  // Fall back to the cached index.html when offline.
  const acceptHeader = request.headers.get('accept') || ''
  const isNavigate = request.mode === 'navigate' || acceptHeader.includes('text/html')

  if (isNavigate) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update the cached index.html so subsequent offline loads work
          try {
            const copy = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy))
          } catch (e) {
            // ignore cache write failures
            console.warn('Failed to update index.html in cache', e)
          }
          return networkResponse
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // For other GET requests, prefer cache and fall back to network.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((resp) => {
      // Optionally, we could add runtime caching here for static assets.
      return resp
    }))
  )
})
