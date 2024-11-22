if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js").then((registration) => {
    console.log("Service Worker registered with scope:", registration.scope);

    Notification.requestPermission().then((result) => {
      console.log(result);
      registration.showNotification("Hello world");
    });
  });
}
