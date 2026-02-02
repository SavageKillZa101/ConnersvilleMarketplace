self.addEventListener('fetch', function(event) {
    // Basic pass-through to ensure PWA installability
    event.respondWith(fetch(event.request));
});
