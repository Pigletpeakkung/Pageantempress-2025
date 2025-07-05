const CACHE_NAME = 'pageantempress-v1';
const urlsToCache = [
    '/',
    '/css/main.css',
    '/js/main.js',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for newsletter
self.addEventListener('sync', event => {
    if (event.tag === 'newsletter-sync') {
        event.waitUntil(syncNewsletter());
    }
});

async function syncNewsletter() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('newsletter')) {
                await fetch(request);
                await cache.delete(request);
            }
        }
    } catch (error) {
        console.error('Newsletter sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=192&q=80',
        badge: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=96&q=80',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore Now',
                icon: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=48&q=80'
            },
            {
                action: 'close',
                title: 'Close',
                icon: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=48&q=80'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('PageantEmpress', options)
    );
});
