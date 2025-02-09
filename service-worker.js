importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Pre-cache the static assets (if any, like index.html, CSS, JS, etc.)
precacheAndRoute(self.__WB_MANIFEST);

// Cache all GET requests that match the current origin
registerRoute(
    ({ request, url }) => {
        // Match all GET requests
        return request.method === 'GET' && url.origin === self.location.origin;
    },
    new StaleWhileRevalidate({
        cacheName: 'dynamic-cache', // Name of the cache
    })
);
