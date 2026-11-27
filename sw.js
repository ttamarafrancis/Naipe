const CACHE_NAME = "naipe-v2";
const ARQUIVOS = ["./", "./index.html", "./css/style.css", "./js/app.js", "./js/firebase-config.js", "./manifest.json"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ARQUIVOS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(chaves => Promise.all(chaves.filter(c => c !== CACHE_NAME).map(c => caches.delete(c))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copia));
        return resposta;
      })
      .catch(() => caches.match(e.request))
  );
});
