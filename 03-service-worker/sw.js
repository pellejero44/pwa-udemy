// Life cycle SW

self.addEventListener("install", (event) => {
  //download assets
  //create cache

  const installation = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("SW2: Instalaciones terminadas");
      self.skipWaiting();
      resolve();
    }, 1);
  });

  event.waitUntil(installation);
});

//service worker take control of the app
self.addEventListener("activate", (event) => {
  // clean old cache
  console.log("SW: Service Worker activo y controlando la app", event);
});

self.addEventListener("fetch", (event) => {
  // apply strategy cache
});

// SYNC: recover connection with internet
self.addEventListener("sync", (event) => {
  console.log("we have connection");
  console.log(event);
  console.log(event.tag);
});

// PUSH: manage push notifications
self.addEventListener("push", (event) => {
  console.log("push notification");
  console.log(event);
});
