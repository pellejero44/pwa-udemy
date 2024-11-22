const CACHE_STATIC_NAME = "static-v2";
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

self.addEventListener("fetch", (event) => {
  // 1. Cache only
  // event.respondWith(caches.match(event.request));

  // 2. Cache with network fallback
  // const response = caches.match(event.request).then((res) => {
  //   if (res) return res;

  //   return fetch(event.request).then((newResp) => {
  //     caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //       cache.put(event.request, newResp);
  //       cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //     });

  //     return newResp.clone();
  //   });
  // });

  // event.respondWith(response);

  // 3. Network with cache fallback
  // const response = fetch(event.request)
  //   .then((res) => {
  //     if (!res) return caches.match(event.request);

  //     caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //       cache.put(event.request, res);
  //       cleanCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //     });

  //     return res.clone();
  //   })
  //   .catch(() => caches.match(event.request));

  // event.respondWith(response);

  // 4. Cache with network update (When performance is a priority, this would always be a step backward)
  // if (event.request.url.includes("bootstrap")) {
  //   return event.respondWith(caches.match(event.request));
  // }
  // const response = caches.open(CACHE_STATIC_NAME).then((cache) => {
  //   fetch(event.request).then((newResp) => cache.put(event.request, newResp));
  //   return cache.match(event.request);
  // });
  // event.respondWith(response);

  // 5. Cache & network race
  const response = new Promise((resolve, reject) => {
    let rejected = false;

    const failedOnce = () => {
      if (rejected) {
        if (/\.(png|jpg)$/i.test(event.request.url)) {
          resolve(caches.match("/img/no-img.jpg"));
        }
      } else {
        rejected = true;
      }
    };

    fetch(event.request)
      .then((res) => {
        res.ok ? resolve(res) : failedOnce();
      })
      .catch(() => failedOnce());

    caches
      .match(event.request)
      .then((res) => {
        res ? resolve(res) : failedOnce();
      })
      .catch(() => failedOnce());
  });

  event.respondWith(response);
});
