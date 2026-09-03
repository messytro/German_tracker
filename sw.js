// Service worker: caches the app shell on first visit so it keeps working
// without a network connection afterward. The sync API is deliberately
// never cached — offline it'll just fail silently and the app falls back
// to local-only storage, same as if sync were never configured.

const CACHE_NAME = 'b2quest-cache-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {}) // don't fail install if e.g. icons 404 during dev
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never intercept the sync API — always hit the network directly,
  // and let it fail naturally (with the app's own try/catch) if offline.
  if (url.pathname.startsWith('/api/')) return;
  if (event.request.method !== 'GET') return;

  // For the page itself: try the network first (so you get updates when
  // online), fall back to the cached copy when offline.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else (icons, manifest): cache-first, network fallback.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
