const CACHE_STATIC_NAME = "static-v1";
const CACHE_IMMUTABLE_NAME = "immutable-v1";

self.addEventListener("install", (event) => {
  const cacheStatic = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      "/",
      "index.html",
      "style/base.css",
      "style/bg.png",
      "js/app.js",
      "js/base.js",
    ]);
  });

  const cacheImmutable = caches
    .open(CACHE_IMMUTABLE_NAME)
    .then((cache) =>
      cache.add(
        "https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js"
      )
    );

  event.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

self.addEventListener("activate", (event) => {
  const updateCache = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_STATIC_NAME && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  event.waitUntil(updateCache);
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});
