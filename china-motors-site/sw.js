// Bump this on every deploy that changes a file listed in STATIC_ASSETS below —
// cacheFirst() means old visitors never see updated JS/CSS until this changes.
const CACHE_VERSION = 'v1.0.2';
const STATIC_CACHE = `cm-static-${CACHE_VERSION}`;
const PAGES_CACHE = `cm-pages-${CACHE_VERSION}`;

// style.css удалён на шаге 7.3; style-v2.css и style-manager.css сюда
// намеренно НЕ добавлены — они и так попадают под cacheFirst() по
// req.destination === 'style'. Но помнить надо вот что: cacheFirst() не
// перепроверяет ничего и никогда, поэтому правка любой таблицы стилей
// доходит до вернувшегося посетителя ТОЛЬКО со сменой CACHE_VERSION выше.
const STATIC_ASSETS = [
  '/offline.html',
  '/js/common.js',
  '/js/catalog.js',
  '/js/calculator.js',
  '/js/contacts.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    // Добавляем по одному, чтобы установка не падала из-за 1 ошибки
    for (const url of STATIC_ASSETS) {
      try { await cache.add(url); } catch (_) {}
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![STATIC_CACHE, PAGES_CACHE].includes(k))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || caches.match('/offline.html');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Не трогаем чужие домены (fonts, cdn и т.п.)
  if (url.origin !== self.location.origin) return;

  // HTML навигация
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // API — сеть в приоритете (fallback на кэш при офлайне)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Статика — из кэша в приоритете
  if (['style', 'script', 'image', 'font'].includes(req.destination)) {
    event.respondWith(cacheFirst(req));
    return;
  }
});
