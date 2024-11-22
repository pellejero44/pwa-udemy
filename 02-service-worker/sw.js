self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          return response;
        } else {
          return fetch("img/main.jpg");
        }
      })
      .catch(() => {
        return new Response("Offline");
      })
  );
});
