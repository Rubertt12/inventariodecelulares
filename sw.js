const CACHE_NAME = 'celular-inventario-v7';
const APP_SHELL = [
  'celular.rubertt.html',
  'style.css',
  'manifest.json',
  'icon.svg',
  'geradordetermoprojetov1.html',
  'Gerador_Caixa_Etiqueta.html',
  'zebra/zebra.html',
  'public/coletor-celulares.html',
  'public/coletor.css',
  'public/coletor.js',
  'js/page-init.js',
  'js/core.js',
  'js/storage.js',
  'js/inventory.js',
  'js/terms.js',
  'js/management.js',
  'js/navigation.js',
  'js/import.js',

  'css/gerador-caixa.css',
  'js/gerador-caixa.js',
  'css/gerador-termo.css',
  'js/gerador-termo.js',
  'zebra/zebra.css',
  'zebra/zebra.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isAppShell = request.mode === 'navigate' ||
    /\.(?:html|css|js|json|svg)$/.test(url.pathname);

  if (isAppShell) {
    // HTML, CSS e JavaScript sempre tentam buscar a versão publicada mais recente.
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Recursos estáticos secundários continuam com cache-first.
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
