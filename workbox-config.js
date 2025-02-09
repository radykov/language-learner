module.exports = {
    globDirectory: 'public/',  // The folder to cache
    globPatterns: ['**/*.*'],  // Cache ALL files in public/
    swDest: 'public/service-worker.js',  // Output service worker
    clientsClaim: true,  // Take control of uncontrolled clients
    skipWaiting: true,  // Immediately activate the new service worker
    runtimeCaching: [
        {
            urlPattern: /^\/.*/,  // Match everything
            handler: 'CacheFirst',  // Always serve from cache first
            options: {
                cacheName: 'static-cache',
                expiration: {
                    maxEntries: 100,  // Store up to 100 files
                    maxAgeSeconds: 30 * 24 * 60 * 60  // Keep for 30 days
                }
            }
        }
    ]
};
