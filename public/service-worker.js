self.addEventListener("install", (event) => {
    console.log("Service worker installed");
  });
  self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
  });
  self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.open("my-app-cache").then((cache) =>
        cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((fetchResponse) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            })
          );
        }),
      ),
    );
  });