// sw.js - Enhanced Service Worker for PageantEmpress
const CACHE_NAME = 'pageant-empress-v1.2.0';
const STATIC_CACHE = 'pageant-empress-static-v1.2.0';
const DYNAMIC_CACHE = 'pageant-empress-dynamic-v1.2.0';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/faq.css',
    '/js/main.js',
    '/js/faq.js',
    '/assets/images/logo.png',
    '/assets/images/favicon-32x32.png',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

const DYNAMIC_FILES = [
    '/api/',
    '/data/',
    'https://images.unsplash.com/'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker install failed:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - Enhanced caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle different types of requests
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        // Cache first for static files
        event.respondWith(cacheFirst(request));
    } else if (request.url.includes('/api/')) {
        // Network first for API calls
        event.respondWith(networkFirst(request));
    } else if (request.url.includes('images.unsplash.com')) {
        // Stale while revalidate for images
        event.respondWith(staleWhileRevalidate(request));
    } else {
        // Network first for other requests
        event.respondWith(networkFirst(request));
    }
});

// Caching strategies
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first failed:', error);
        return new Response('Content not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Content not available offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const networkResponsePromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });
    
    return cachedResponse || networkResponsePromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'newsletter-subscribe') {
        event.waitUntil(handleNewsletterSync());
    }
});

async function handleNewsletterSync() {
    // Handle offline newsletter subscriptions
    const subscriptions = await getStoredSubscriptions();
    for (const subscription of subscriptions) {
        try {
            await submitNewsletterSubscription(subscription);
            await removeStoredSubscription(subscription.id);
        } catch (error) {
            console.error('Failed to sync subscription:', error);
        }
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Pageant Empress!',
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

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
