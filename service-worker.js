const CACHE_NAME = 'music-visualizer-v1';
const RUNTIME = 'runtime-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/bg.jpg',
  '/sw-register.js',
  '/js/aide.js','/js/app.js','/js/audio.js','/js/colorExtractor.js','/js/controls.js','/js/effects.js','/js/modes.js','/js/playback.js','/js/recorder.js','/js/ui.js','/js/utils.js','/js/visualizer.js',
  '/css/all.min.css','/css/style.css',
  '/logo.png',
  '/logo.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  const keep = [CACHE_NAME, RUNTIME];
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => keep.includes(k) ? null : caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  const url = new URL(req.url);

  // Navigation (HTML) : network first, fallback cache -> offline page
  if (req.mode === 'navigate') {
    evt.respondWith(
      fetch(req).then(res => res).catch(() => caches.match('/index.html').then(r => r || caches.match('/offline.html')))
    );
    return;
  }

  // Same-origin: cache-first for static assets
  if (url.origin === location.origin) {
    // Audio/media: cache then network (runtime)
    if (req.destination === 'audio' || /\.(mp3|wav|ogg)$/i.test(url.pathname)) {
      evt.respondWith(
        caches.open(RUNTIME).then(cache =>
          cache.match(req).then(cached => {
            const network = fetch(req).then(res => { if (res && res.status === 200) cache.put(req, res.clone()); return res; }).catch(() => null);
            return cached || network;
          })
        )
      );
      return;
    }

    // Images/CSS/JS: cache-first
    evt.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (req.method === 'GET' && res && res.status === 200) {
          caches.open(RUNTIME).then(cache => cache.put(req, res.clone()));
        }
        return res;
      }).catch(() => {
        if (req.destination === 'image') return caches.match('/bg.jpg');
        return null;
      }))
    );
    return;
  }

  // Cross-origin: network then cache
  evt.respondWith(fetch(req).catch(() => caches.match(req)));
});