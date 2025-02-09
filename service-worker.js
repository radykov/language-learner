// Import workbox libraries
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

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
