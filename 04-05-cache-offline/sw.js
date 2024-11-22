const CACHE_STATIC_NAME = "static-v3";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_IMMUTABLE_NAME = "immutable-v1";
const CACHE_DYNAMIC_LIMIT = 50;

function cleanCache(cacheName, sizeItems) {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > sizeItems) {
        cache.delete(keys[0]).then(() => {
          cleanCache(cacheName, sizeItems);
        });
      }
    });
  });
}

self.addEventListener("install", (event) => {
  const cacheStatic = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      "/",
      "/index.html",
      "/css/style.css",
      "/img/main.jpg",
      "/js/app.js",
      "img/no-img.jpg",
      "/pages/offline.html",
    ]);
  });

  const cacheImmutable = caches
    .open(CACHE_IMMUTABLE_NAME)
    .then((cache) =>
      cache.add(
        "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
      )
    );

  event.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

self.addEventListener("activate", (event) => {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_STATIC_NAME && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  event.waitUntil();
});

self.addEventListener("fetch", (event) => {
  const response = caches.match(event.request).then((res) => {
    console.log(res);
    if (res) return res;
    return fetch(event.request)
      .then((newResp) => {
        caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
          cache.put(event.request, newResp);
          cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
        });
        return newResp.clone();
      })
      .catch((e) => {
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/pages/offline.html");
        }
      });
  });
  event.respondWith(response);
});
