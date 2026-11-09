const CACHE_NAME = 'celular-inventario-v3';
const urlsToCache = [
  'celular.rubertt.html',
  'style.css',
  'app.js',
  'manifest.json',
  'icon.svg',
  'geradordetermoprojetov1.html',
  'zebra/zebra.html',
  // Adicione outros assets críticos aqui, como imagens, fontes, etc.
  // Se você tiver uma cópia local do qz-tray.js, adicione-a aqui:
  // 'zebra/node_modules/qz-tray@2.2.4/qz-tray.js',
  // Se o qz-tray.js for carregado de um CDN e você quiser cacheá-lo, adicione a URL completa:
  // 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(cacheNames.map((cacheName) => {
      if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
    })))
  );
});
