const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/stories/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        // Update the cache with the latest version of the file
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });

                    // If the cache is still valid, return the cached version, otherwise fetch a new one
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
