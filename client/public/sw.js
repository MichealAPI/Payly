/* Simple service worker for Payly PWA */
const CACHE_NAME = 'payly-app-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/vite.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
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
  const { request } = event;
  const url = new URL(request.url);
  // SPA navigation fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  // Network first for API calls
  if (/^\/api\//.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const respClone = resp.clone();
          caches.open('payly-api').then((cache) => cache.put(request, respClone));
          return resp;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (request.method === 'GET' && (url.origin === self.location.origin)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResp) => {
            if (networkResp && networkResp.status === 200) {
              const clone = networkResp.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
