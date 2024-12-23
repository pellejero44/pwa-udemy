importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v4";
const DYNAMIC_CACHE = "dynamic-v2";
const IMMUTABLE_CACHE = "immutable-v1";

const APP_SHELL = [
  // "/",
  "/pwa-udemy/06-twittor/index.html",
  "/pwa-udemy/06-twittor/css/style.css",
  "/pwa-udemy/06-twittor/img/favicon.ico",
  "/pwa-udemy/06-twittor/img/avatars/hulk.jpg",
  "/pwa-udemy/06-twittor/img/avatars/ironman.jpg",
  "/pwa-udemy/06-twittor/img/avatars/spiderman.jpg",
  "/pwa-udemy/06-twittor/img/avatars/thor.jpg",
  "/pwa-udemy/06-twittor/img/avatars/wolverine.jpg",
  "/pwa-udemy/06-twittor/js/app.js",
];

const APP_SHELL_IMMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheImmutable = caches
    .open(IMMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_IMMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

self.addEventListener("activate", (e) => {
  const res = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(res);
});

self.addEventListener("fetch", (e) => {
  const response = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then((newRes) => {
        return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
      });
    }
  });

  e.respondWith(response);
});
