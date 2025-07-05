const CACHE_NAME = 'pageant-empress-v1.2.0';
const urlsToCache = [
    '/',
    '/css/main.css',
    '/css/instagram.css',
    '/css/blog.css',
    '/js/main.js',
    '/js/instagram.js',
    '/js/blog.js',
    '/assets/images/logo.png',
    '/assets/images/favicon.ico',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css'
];

const criticalResources = [
    '/',
    '/css/main.css',
    '/js/main.js',
    '/assets/images/logo.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event with network-first strategy for dynamic content
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Cache-first strategy for static assets
    if (request.url.includes('/assets/') || 
        request.url.includes('/css/') || 
        request.url.includes('/js/') ||
        request.url.includes('.png') ||
        request.url.includes('.jpg') ||
        request.url.includes('.jpeg') ||
        request.url.includes('.gif') ||
        request.url.includes('.webp')) {
        
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(request).then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    });
                })
        );
    }
    // Network-first strategy for dynamic content
    else {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            
                            // Return offline page for HTML requests
                            if (request.headers.get('accept').includes('text/html')) {
                                return caches.match('/offline.html');
                            }
                        });
                })
        );
    }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync logic
            console.log('Background sync triggered')
        );
    }
});

// Push notification handler
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New content available!',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Pageant Empress', options)
    );
});
