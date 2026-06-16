// This service worker immediately unregisters itself to fix router issues
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      }),
      // Unregister this service worker
      self.registration.unregister()
    ])
  );
});

// Don't intercept any fetch requests
self.addEventListener('fetch', () => {
  // Do nothing - let requests pass through normally
});
