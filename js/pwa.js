/* ==========================================================================
   PWA.JS - PageantEmpress 2025
   Progressive Web App Functionality
   ========================================================================== */

class PageantEmpressPWA {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
        this.cacheVersion = 'pageant-empress-v1.0.0';
        this.urlsToCache = [
            '/',
            '/index.html',
            '/css/main.css',
            '/css/components.css',
            '/css/animations.css',
            '/js/main.js',
            '/js/animations.js',
            '/js/performance.js',
            '/js/pwa.js',
            '/manifest.json',
            '/images/icons/icon-192x192.png',
            '/images/icons/icon-512x512.png',
            '/images/logo.png'
        ];
        
        this.init();
    }

    init() {
        this.checkInstallation();
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupBeforeInstallPrompt();
        this.handleAppInstalled();
        this.setupNetworkStatusHandling();
        this.setupBackgroundSync();
        this.setupPushNotifications();
        this.handleStandaloneMode();
        this.setupPerformanceMonitoring();
    }

    // Check if app is already installed
    checkInstallation() {
        // Check if running as standalone app
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true;
        
        // Check if app is installed
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then(apps => {
                this.isInstalled = apps.length > 0;
                this.updateInstallButton();
            });
        }

        // Hide install banner if already installed
        if (this.isStandalone) {
            this.hideInstallBanner();
        }
    }

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registered:', registration);

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });

                // Check for updates
                this.checkForUpdates(registration);

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Setup install prompt handling
    setupInstallPrompt() {
        const installBtn = document.getElementById('installBtn');
        const installBanner = document.getElementById('installBanner');
        const bannerClose = document.getElementById('bannerClose');

        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.promptInstall();
            });
        }

        if (bannerClose) {
            bannerClose.addEventListener('click', () => {
                this.hideInstallBanner();
            });
        }

        // Show install banner after delay if not installed
        if (!this.isStandalone && !this.isInstalled) {
            setTimeout(() => {
                this.showInstallBanner();
            }, 30000); // Show after 30 seconds
        }
    }

    // Setup before install prompt
    setupBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show install banner
            this.showInstallBanner();
        });
    }

    // Handle app installed event
    handleAppInstalled() {
        window.addEventListener('appinstalled', (e) => {
            console.log('PageantEmpress PWA was installed');
            this.isInstalled = true;
            this.hideInstallBanner();
            this.showInstalledMessage();
            
            // Track installation
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_install', {
                    'event_category': 'engagement',
                    'event_label': 'PWA Installed'
                });
            }
        });
    }

    // Prompt for installation
    async promptInstall() {
        if (!this.deferredPrompt) {
            this.showInstallInstructions();
            return;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`User response to install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('Install prompt error:', error);
            this.showInstallInstructions();
        }
    }

    // Show install banner
    showInstallBanner() {
        const banner = document.getElementById('installBanner');
        if (banner && !this.isInstalled && !this.isStandalone) {
            banner.style.display = 'block';
            banner.classList.add('animate-fadeInUp');
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (banner.style.display === 'block') {
                    this.hideInstallBanner();
                }
            }, 10000);
        }
    }

    // Hide install banner
    hideInstallBanner() {
        const banner = document.getElementById('installBanner');
        if (banner) {
            banner.classList.add('animate-fadeOut');
            setTimeout(() => {
                banner.style.display = 'none';
                banner.classList.remove('animate-fadeOut');
            }, 300);
        }
    }

    // Show installed message
    showInstalledMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-message success';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <span>PageantEmpress installed successfully!</span>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('animate-fadeInUp');
        }, 100);
        
        setTimeout(() => {
            message.classList.add('animate-fadeOut');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }

    // Show install instructions for different browsers
    showInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <div class="install-instructions">
                    <h3>Install PageantEmpress on iOS</h3>
                    <ol>
                        <li>Tap the Share button <i class="fas fa-share"></i></li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add" to confirm</li>
                    </ol>
                </div>
            `;
        } else if (isAndroid) {
            instructions = `
                <div class="install-instructions">
                    <h3>Install PageantEmpress on Android</h3>
                    <ol>
                        <li>Tap the menu button <i class="fas fa-ellipsis-v"></i></li>
                        <li>Tap "Add to Home Screen"</li>
                        <li>Tap "Add" to confirm</li>
                    </ol>
                </div>
            `;
        } else {
            instructions = `
                <div class="install-instructions">
                    <h3>Install PageantEmpress</h3>
                    <p>Look for the install button in your browser's address bar or menu.</p>
                </div>
            `;
        }
        
        this.showModal(instructions);
    }

    // Show modal
    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'pwa-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                ${content}
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
    }

    // Hide modal
    hideModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    // Update install button
    updateInstallButton() {
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            if (this.isInstalled || this.isStandalone) {
                installBtn.style.display = 'none';
            } else {
                installBtn.style.display = 'flex';
            }
        }
    }

    // Setup network status handling
    setupNetworkStatusHandling() {
        window.addEventListener('online', () => {
            this.showNetworkStatus('online');
            this.syncPendingData();
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus('offline');
        });

        // Check initial network status
        if (!navigator.onLine) {
            this.showNetworkStatus('offline');
        }
    }

    // Show network status
    showNetworkStatus(status) {
        const existingStatus = document.querySelector('.network-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusBar = document.createElement('div');
        statusBar.className = `network-status ${status}`;
        statusBar.innerHTML = `
            <div class="status-content">
                <i class="fas fa-${status === 'online' ? 'wifi' : 'wifi-slash'}"></i>
                <span>${status === 'online' ? 'Back online' : 'No internet connection'}</span>
            </div>
        `;
        
        document.body.appendChild(statusBar);
        
        if (status === 'online') {
            setTimeout(() => {
                statusBar.classList.add('animate-fadeOut');
                setTimeout(() => {
                    if (statusBar.parentNode) {
                        statusBar.remove();
                    }
                }, 300);
            }, 3000);
        }
    }

    // Setup background sync
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            navigator.serviceWorker.ready.then(registration => {
                // Register background sync
                registration.sync.register('background-sync');
            });
        }
    }

    // Sync pending data
    syncPendingData() {
        // Sync any pending newsletter subscriptions, form data, etc.
        const pendingData = this.getPendingData();
        
        if (pendingData.length > 0) {
            pendingData.forEach(data => {
                this.syncData(data);
            });
        }
    }

    // Get pending data from localStorage
    getPendingData() {
        const pending = localStorage.getItem('pendingSync');
        return pending ? JSON.parse(pending) : [];
    }

    // Sync data to server
    async syncData(data) {
        try {
            const response = await fetch(data.url, {
                method: data.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.payload)
            });

            if (response.ok) {
                this.removePendingData(data.id);
                console.log('Data synced successfully:', data);
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }

    // Remove synced data from pending
    removePendingData(id) {
        const pending = this.getPendingData();
        const filtered = pending.filter(item => item.id !== id);
        localStorage.setItem('pendingSync', JSON.stringify(filtered));
    }

    // Setup push notifications
    async setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Request permission
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.subscribeToPushNotifications();
            }
        }
    }

    // Subscribe to push notifications
    async subscribeToPushNotifications() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY || '')
            });

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    }

    // Send subscription to server
    async sendSubscriptionToServer(subscription) {
        try {
            const response = await fetch('/api/push-subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });

            if (response.ok) {
                console.log('Push subscription sent to server');
            }
        } catch (error) {
            console.error('Failed to send subscription to server:', error);
        }
    }

    // Convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Handle standalone mode
    handleStandaloneMode() {
        if (this.isStandalone) {
            document.body.classList.add('standalone');
            
            // Add status bar padding for iOS
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                document.body.classList.add('ios-standalone');
            }
            
            // Handle external links
            this.handleExternalLinks();
        }
    }

    // Handle external links in standalone mode
    handleExternalLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (link && link.hostname !== window.location.hostname) {
                e.preventDefault();
                window.open(link.href, '_blank');
            }
        });
    }

    // Check for updates
    checkForUpdates(registration) {
        setInterval(() => {
            registration.update();
        }, 60000); // Check every minute
    }

    // Show update available
    showUpdateAvailable() {
        const updateBar = document.createElement('div');
        updateBar.className = 'update-available';
        updateBar.innerHTML = `
            <div class="update-content">
                <div class="update-text">
                    <i class="fas fa-download"></i>
                    <span>New version available!</span>
                </div>
                <button class="update-btn" id="updateBtn">Update</button>
                <button class="update-close" id="updateClose">×</button>
            </div>
        `;
        
        document.body.appendChild(updateBar);
        
        // Add event listeners
        document.getElementById('updateBtn').addEventListener('click', () => {
            this.applyUpdate();
        });
        
        document.getElementById('updateClose').addEventListener('click', () => {
            updateBar.remove();
        });
    }

    // Apply update
    applyUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                });
                window.location.reload();
            });
        }
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.measurePerformance();
                }, 1000);
            });
        }
    }

    // Measure performance
    measurePerformance() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            connectionType: navigator.connection?.effectiveType || 'unknown'
        };
        
        console.log('Performance metrics:', metrics);
        
        // Send metrics to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', {
                'event_category': 'performance',
                'custom_map': {
                    'metric_1': 'load_time',
                    'metric_2': 'dom_content_loaded',
                    'metric_3': 'first_paint',
                    'metric_4': 'first_contentful_paint'
                },
                'metric_1': metrics.loadTime,
                'metric_2': metrics.domContentLoaded,
                'metric_3': metrics.firstPaint,
                'metric_4': metrics.firstContentfulPaint
            });
        }
    }

    // Add data to pending sync
    addToPendingSync(data) {
        const pending = this.getPendingData();
        pending.push({
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
            ...data
        });
        localStorage.setItem('pendingSync', JSON.stringify(pending));
    }

    // Show offline message
    showOfflineMessage() {
        const message = document.createElement('div');
        message.className = 'offline-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-wifi-slash"></i>
                <h3>You're offline</h3>
                <p>Some features may not be available while offline.</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('animate-fadeInUp');
        }, 100);
    }

    // Cache management
    clearCache() {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }
    }

    // Get cache size
    async getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                available: estimate.quota
            };
        }
        return null;
    }
}

// Initialize PWA
document.addEventListener('DOMContentLoaded', () => {
    window.pageantEmpressPWA = new PageantEmpressPWA();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageantEmpressPWA;
}
