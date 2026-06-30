const CACHE_NAME = "Mercury2026";

self.addEventListener("install", event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") return;

    const url = new URL(request.url);

    if (
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/server/") ||
        request.headers.get("content-type")?.includes("application/json")
    ) {
        event.respondWith(fetch(request));
        return;
    }

    event.respondWith(
        fetch(request)
            .then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // Only cache successful static responses
                    if (networkResponse && networkResponse.ok) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});