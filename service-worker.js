const CACHE_NAME = "Mercury2026";
const PRECACHE_FILES = [
    "/form.json"
];

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_FILES))
    );
});

// clear old
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(fetch(event.request).then(networkResponse => { // Put a copy of the response in cache
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
        });
        return networkResponse;
    }).catch(() => { // Network failed, fallback to cache
        return caches.match(event.request);
    }));
});