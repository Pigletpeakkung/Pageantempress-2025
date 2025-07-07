// PageantEmpress Service Worker v2.1.0
// Advanced PWA capabilities with intelligent caching and performance optimization

const CACHE_NAME = 'pageantempress-v2.1.0';
const STATIC_CACHE = 'pageantempress-static-v2.1.0';
const DYNAMIC_CACHE = 'pageantempress-dynamic-v2.1.0';
const IMAGE_CACHE = 'pageantempress-images-v2.1.0';
const API_CACHE = 'pageantempress-api-v2.1.0';

// Cache duration settings (in milliseconds)
const CACHE_DURATION = {
    STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
    DYNAMIC: 24 * 60 * 60 * 1000,    // 1 day
    IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
    API: 5 * 60 * 1000,              // 5 minutes
    OFFLINE: 365 * 24 * 60 * 60 * 1000 // 1 year
};

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/instagram.css',
    '/js/main.js',
    '/js/themes.js',
    '/js/particles.js',
    '/js/accessibility.js',
    '/js/performance.js',
    '/manifest.json',
    '/offline.html',
    '/assets/images/favicon-32x32.png',
    '/assets/images/favicon-16x16.png',
    '/assets/images/apple-touch-icon.png',
    '/assets/images/logo.png',
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Dancing+Script:wght@700&display=swap',
    // Font Awesome
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    // AOS Animation Library
    'https://unpkg.com/aos@2.3.1/dist/aos.css',
    'https://unpkg.com/aos@2.3.1/dist/aos.js',
    // Swiper
    'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css',
    'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js'
];

// Dynamic content patterns
const DYNAMIC_PATTERNS = [
    /\/api\//,
    /\/search\//,
    /\/user\//,
    /\/analytics\//
];

// Image patterns for optimized caching
const IMAGE_PATTERNS = [
    /\.(?:png|jpg|jpeg|webp|svg|gif|ico)$/,
    /images\.unsplash\.com/,
    /cdn\.pixabay\.com/,
    /images\.pexels\.com/
];

// API patterns
const API_PATTERNS = [
    /\/api\//,
    /googleapis\.com/,
    /jsonplaceholder\.typicode\.com/,
    /analytics\.google\.com/
];

// Advanced service worker features
class AdvancedServiceWorker {
    constructor() {
        this.isOnline = navigator.onLine;
        this.backgroundSync = null;
        this.pushManager = null;
        this.analytics = new AnalyticsManager();
        this.performance = new PerformanceManager();
        this.offlineQueue = [];
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Install event
        self.addEventListener('install', (event) => {
            console.log('🔧 Service Worker: Installing...');
            event.waitUntil(this.handleInstall());
        });
        
        // Activate event
        self.addEventListener('activate', (event) => {
            console.log('🚀 Service Worker: Activating...');
            event.waitUntil(this.handleActivate());
        });
        
        // Fetch event with intelligent caching
        self.addEventListener('fetch', (event) => {
            event.respondWith(this.handleFetch(event));
        });
        
        // Background sync
        self.addEventListener('sync', (event) => {
            console.log('🔄 Service Worker: Background sync triggered');
            event.waitUntil(this.handleBackgroundSync(event));
        });
        
        // Push notifications
        self.addEventListener('push', (event) => {
            console.log('📱 Service Worker: Push received');
            event.waitUntil(this.handlePush(event));
        });
        
        // Notification click
        self.addEventListener('notificationclick', (event) => {
            console.log('📱 Service Worker: Notification clicked');
            event.waitUntil(this.handleNotificationClick(event));
        });
        
        // Message from main thread
        self.addEventListener('message', (event) => {
            console.log('💬 Service Worker: Message received', event.data);
            this.handleMessage(event);
        });
        
        // Online/offline detection
        self.addEventListener('online', () => {
            console.log('🌐 Service Worker: Online');
            this.isOnline = true;
            this.syncOfflineQueue();
        });
        
        self.addEventListener('offline', () => {
            console.log('📴 Service Worker: Offline');
            this.isOnline = false;
        });
    }
    
    async handleInstall() {
        try {
            // Skip waiting to activate immediately
            self.skipWaiting();
            
            // Cache static assets
            const staticCache = await caches.open(STATIC_CACHE);
            await staticCache.addAll(STATIC_ASSETS);
            
            // Preload critical images
            await this.preloadCriticalImages();
            
            // Initialize analytics
            this.analytics.track('sw_install', {
                version: CACHE_NAME,
                timestamp: Date.now()
            });
            
            console.log('✅ Service Worker: Installation complete');
            
        } catch (error) {
            console.error('❌ Service Worker: Installation failed', error);
            throw error;
        }
    }
    
    async handleActivate() {
        try {
            // Claim all clients
            await self.clients.claim();
            
            // Clean up old caches
            await this.cleanupOldCaches();
            
            // Initialize background sync
            await this.initializeBackgroundSync();
            
            // Initialize push notifications
            await this.initializePushNotifications();
            
            // Update analytics
            this.analytics.track('sw_activate', {
                version: CACHE_NAME,
                timestamp: Date.now()
            });
            
            console.log('✅ Service Worker: Activation complete');
            
        } catch (error) {
            console.error('❌ Service Worker: Activation failed', error);
            throw error;
        }
    }
    
    async handleFetch(event) {
        const { request } = event;
        const url = new URL(request.url);
        
        // Skip non-GET requests for caching
        if (request.method !== 'GET') {
            return this.handleNonGETRequest(request);
        }
        
        // Handle different types of requests
        if (this.isStaticAsset(request)) {
            return this.handleStaticAsset(request);
        }
        
        if (this.isImageRequest(request)) {
            return this.handleImageRequest(request);
        }
        
        if (this.isAPIRequest(request)) {
            return this.handleAPIRequest(request);
        }
        
        if (this.isDynamicContent(request)) {
            return this.handleDynamicContent(request);
        }
        
        // Default: Network first with cache fallback
        return this.networkFirstWithCacheFallback(request);
    }
    
    async handleStaticAsset(request) {
        try {
            // Cache first strategy for static assets
            const cachedResponse = await caches.match(request);
            
            if (cachedResponse) {
                // Check if cache is still valid
                const cacheTime = await this.getCacheTime(request);
                const isExpired = Date.now() - cacheTime > CACHE_DURATION.STATIC;
                
                if (!isExpired) {
                    this.performance.recordCacheHit('static');
                    return cachedResponse;
                }
            }
            
            // Fetch from network and update cache
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                const cache = await caches.open(STATIC_CACHE);
                await cache.put(request, networkResponse.clone());
                await this.setCacheTime(request, Date.now());
                this.performance.recordCacheMiss('static');
            }
            
            return networkResponse;
            
        } catch (error) {
            console.error('Static asset fetch failed:', error);
            
            // Return cached version if available
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Return offline fallback
            return this.getOfflineFallback(request);
        }
    }
    
    async handleImageRequest(request) {
        try {
            // Cache first with background update
            const cachedResponse = await caches.match(request);
            
            if (cachedResponse) {
                // Update cache in background
                this.updateImageCacheInBackground(request);
                this.performance.recordCacheHit('image');
                return cachedResponse;
            }
            
            // Fetch from network
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                const cache = await caches.open(IMAGE_CACHE);
                await cache.put(request, networkResponse.clone());
                await this.setCacheTime(request, Date.now());
                this.performance.recordCacheMiss('image');
            }
            
            return networkResponse;
            
        } catch (error) {
            console.error('Image fetch failed:', error);
            
            // Return cached version if available
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Return placeholder image
            return this.getPlaceholderImage();
        }
    }
    
    async handleAPIRequest(request) {
        try {
            // Network first for API requests
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // Cache successful API responses
                const cache = await caches.open(API_CACHE);
                await cache.put(request, networkResponse.clone());
                await this.setCacheTime(request, Date.now());
                this.performance.recordCacheMiss('api');
            }
            
            return networkResponse;
            
        } catch (error) {
            console.error('API fetch failed:', error);
            
            // Return cached version if available and not expired
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                const cacheTime = await this.getCacheTime(request);
                const isExpired = Date.now() - cacheTime > CACHE_DURATION.API;
                
                if (!isExpired) {
                    this.performance.recordCacheHit('api');
                    return cachedResponse;
                }
            }
            
            // Queue for background sync
            this.queueForBackgroundSync(request);
            
            // Return offline API response
            return this.getOfflineAPIResponse(request);
        }
    }
    
    async handleDynamicContent(request) {
        try {
            // Stale while revalidate strategy
            const cachedResponse = await caches.match(request);
            
            const networkResponsePromise = fetch(request).then(response => {
                if (response.ok) {
                    const cache = caches.open(DYNAMIC_CACHE);
                    cache.then(c => c.put(request, response.clone()));
                    this.setCacheTime(request, Date.now());
                }
                return response;
            }).catch(error => {
                console.error('Dynamic content fetch failed:', error);
                return null;
            });
            
            // Return cached content immediately if available
            if (cachedResponse) {
                this.performance.recordCacheHit('dynamic');
                return cachedResponse;
            }
            
            // Wait for network response
            const networkResponse = await networkResponsePromise;
            if (networkResponse) {
                this.performance.recordCacheMiss('dynamic');
                return networkResponse;
            }
            
            // Return offline fallback
            return this.getOfflineFallback(request);
            
        } catch (error) {
            console.error('Dynamic content handling failed:', error);
            return this.getOfflineFallback(request);
        }
    }
    
    async networkFirstWithCacheFallback(request) {
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // Cache successful responses
                const cache = await caches.open(DYNAMIC_CACHE);
                await cache.put(request, networkResponse.clone());
                this.performance.recordCacheMiss('default');
            }
            
            return networkResponse;
            
        } catch (error) {
            console.error('Network request failed:', error);
            
            // Return cached version if available
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                this.performance.recordCacheHit('default');
                return cachedResponse;
            }
            
            // Return offline fallback
            return this.getOfflineFallback(request);
        }
    }
    
    async handleNonGETRequest(request) {
        try {
            // Try network first
            const networkResponse = await fetch(request);
            return networkResponse;
            
        } catch (error) {
            console.error('Non-GET request failed:', error);
            
            // Queue for background sync
            this.queueForBackgroundSync(request);
            
            // Return appropriate response
            return new Response(JSON.stringify({
                error: 'Request queued for background sync',
                queued: true
            }), {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
    async handleBackgroundSync(event) {
        if (event.tag === 'background-sync') {
            await this.syncOfflineQueue();
        }
    }
    
    async handlePush(event) {
        const data = event.data ? event.data.json() : {};
        
        const options = {
            title: data.title || 'PageantEmpress',
            body: data.body || 'New content available!',
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/badge-72x72.png',
            tag: data.tag || 'general',
            data: data.data || {},
            actions: data.actions || [],
            vibrate: [100, 50, 100],
            requireInteraction: data.requireInteraction || false
        };
        
        await self.registration.showNotification(options.title, options);
    }
    
    async handleNotificationClick(event) {
        event.notification.close();
        
        const notificationData = event.notification.data || {};
        const url = notificationData.url || '/';
        
        // Open or focus the app
        const clients = await self.clients.matchAll({ type: 'window' });
        
        for (const client of clients) {
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }
        
        // Open new window
        if (self.clients.openWindow) {
            return self.clients.openWindow(url);
        }
    }
    
    async handleMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'CACHE_URLS':
                await this.cacheUrls(data.urls);
                break;
                
            case 'CLEAR_CACHE':
                await this.clearCache(data.cacheNames);
                break;
                
            case 'GET_CACHE_STATS':
                const stats = await this.getCacheStats();
                event.ports[0].postMessage(stats);
                break;
                
            case 'SYNC_OFFLINE_QUEUE':
                await this.syncOfflineQueue();
                break;
                
            default:
                console.warn('Unknown message type:', type);
        }
    }
    
    // Helper methods
    isStaticAsset(request) {
        const url = new URL(request.url);
        return STATIC_ASSETS.some(asset => 
            url.pathname === asset || url.href === asset
        );
    }
    
    isImageRequest(request) {
        return IMAGE_PATTERNS.some(pattern => 
            pattern.test(request.url)
        );
    }
    
    isAPIRequest(request) {
        return API_PATTERNS.some(pattern => 
            pattern.test(request.url)
        );
    }
    
    isDynamicContent(request) {
        return DYNAMIC_PATTERNS.some(pattern => 
            pattern.test(request.url)
        );
    }
    
    async cleanupOldCaches() {
        const cacheNames = await caches.keys();
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
        
        return Promise.all(
            cacheNames.map(cacheName => {
                if (!currentCaches.includes(cacheName)) {
                    console.log('🗑️ Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
    }
    
    async preloadCriticalImages() {
        const criticalImages = [
            'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542140372-de3e121eb11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ];
        
        const cache = await caches.open(IMAGE_CACHE);
        
        return Promise.all(
            criticalImages.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response);
                    }
                } catch (error) {
                    console.warn('Failed to preload image:', url, error);
                }
            })
        );
    }
    
    async updateImageCacheInBackground(request) {
        try {
            const response = await fetch(request);
            if (response.ok) {
                const cache = await caches.open(IMAGE_CACHE);
                await cache.put(request, response);
                await this.setCacheTime(request, Date.now());
            }
        } catch (error) {
            console.warn('Background image update failed:', error);
        }
    }
    
    async getCacheTime(request) {
        const cache = await caches.open('cache-metadata');
        const response = await cache.match(request.url + ':timestamp');
        if (response) {
            return parseInt(await response.text());
        }
        return 0;
    }
    
    async setCacheTime(request, timestamp) {
        const cache = await caches.open('cache-metadata');
        await cache.put(
            request.url + ':timestamp',
            new Response(timestamp.toString())
        );
    }
    
    async getOfflineFallback(request) {
        const url = new URL(request.url);
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        
        // Return empty response for other requests
        return new Response('', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
    
    async getPlaceholderImage() {
        // Return a simple SVG placeholder
        const svg = `
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="#f0f0f0"/>
                <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">
                    Image unavailable
                </text>
            </svg>
        `;
        
        return new Response(svg, {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
    
    async getOfflineAPIResponse(request) {
        return new Response(JSON.stringify({
            error: 'Network unavailable',
            offline: true,
            cached: false
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    queueForBackgroundSync(request) {
        this.offlineQueue.push({
            url: request.url,
            method: request.method,
            headers: [...request.headers.entries()],
            body: request.body,
            timestamp: Date.now()
        });
        
        // Register background sync
        self.registration.sync.register('background-sync');
    }
    
    async syncOfflineQueue() {
        if (this.offlineQueue.length === 0) return;
        
        console.log('🔄 Syncing offline queue:', this.offlineQueue.length, 'items');
        
        const syncPromises = this.offlineQueue.map(async (queuedRequest) => {
            try {
                const response = await fetch(queuedRequest.url, {
                    method: queuedRequest.method,
                    headers: queuedRequest.headers,
                    body: queuedRequest.body
                });
                
                if (response.ok) {
                    console.log('✅ Synced:', queuedRequest.url);
                    return true;
                }
                
                console.warn('⚠️ Sync failed:', queuedRequest.url, response.status);
                return false;
                
            } catch (error) {
                console.error('❌ Sync error:', queuedRequest.url, error);
                return false;
            }
        });
        
        const results = await Promise.all(syncPromises);
        
        // Remove successful syncs from queue
        this.offlineQueue = this.offlineQueue.filter((_, index) => !results[index]);
        
        console.log('🔄 Sync complete. Remaining queue:', this.offlineQueue.length);
    }
    
    async initializeBackgroundSync() {
        if ('sync' in self.registration) {
            this.backgroundSync = self.registration.sync;
            console.log('✅ Background sync initialized');
        } else {
            console.warn('⚠️ Background sync not supported');
        }
    }
    
    async initializePushNotifications() {
        if ('pushManager' in self.registration) {
            this.pushManager = self.registration.pushManager;
            console.log('✅ Push notifications initialized');
        } else {
            console.warn('⚠️ Push notifications not supported');
        }
    }
    
    async cacheUrls(urls) {
        const cache = await caches.open(DYNAMIC_CACHE);
        return Promise.all(
            urls.map(url => 
                fetch(url).then(response => {
                    if (response.ok) {
                        return cache.put(url, response);
                    }
                }).catch(error => {
                    console.warn('Failed to cache URL:', url, error);
                })
            )
        );
    }
    
    async clearCache(cacheNames) {
        if (!cacheNames || cacheNames.length === 0) {
            // Clear all caches
            const allCaches = await caches.keys();
            return Promise.all(allCaches.map(name => caches.delete(name)));
        }
        
        return Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    async getCacheStats() {
        const cacheNames = await caches.keys();
        const stats = {};
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            stats[cacheName] = {
                count: keys.length,
                size: await this.calculateCacheSize(cache)
            };
        }
        
        return stats;
    }
    
    async calculateCacheSize(cache) {
        const keys = await cache.keys();
        let totalSize = 0;
        
        for (const key of keys) {
            const response = await cache.match(key);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
        
        return totalSize;
    }
}

// Analytics Manager
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.isOnline = navigator.onLine;
    }
    
    track(event, data = {}) {
        const eventData = {
            event,
            data,
            timestamp: Date.now(),
            url: self.location.href
        };
        
        this.events.push(eventData);
        
        // Send immediately if online, otherwise queue
        if (this.isOnline) {
            this.sendEvents();
        }
    }
    
    async sendEvents() {
        if (this.events.length === 0) return;
        
        try {
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.events)
            });
            
            if (response.ok) {
                this.events = [];
                console.log('📊 Analytics sent successfully');
            }
            
        } catch (error) {
            console.warn('Analytics sending failed:', error);
        }
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.metrics = {
            cacheHits: { static: 0, dynamic: 0, image: 0, api: 0, default: 0 },
            cacheMisses: { static: 0, dynamic: 0, image: 0, api: 0, default: 0 },
            totalRequests: 0,
            startTime: Date.now()
        };
    }
    
    recordCacheHit(type) {
        this.metrics.cacheHits[type]++;
        this.metrics.totalRequests++;
    }
    
    recordCacheMiss(type) {
        this.metrics.cacheMisses[type]++;
        this.metrics.totalRequests++;
    }
    
    getMetrics() {
        const totalHits = Object.values(this.metrics.cacheHits).reduce((a, b) => a + b, 0);
        const totalMisses = Object.values(this.metrics.cacheMisses).reduce((a, b) => a + b, 0);
        const hitRate = totalHits / (totalHits + totalMisses) * 100;
        
        return {
            ...this.metrics,
            hitRate: hitRate.toFixed(2),
            uptime: Date.now() - this.metrics.startTime
        };
    }
}

// Initialize the advanced service worker
const advancedSW = new AdvancedServiceWorker();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedServiceWorker, AnalyticsManager, PerformanceManager };
}
