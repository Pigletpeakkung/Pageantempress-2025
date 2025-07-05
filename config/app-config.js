// config/app-config.js - Application Configuration
window.PageantEmpressConfig = {
    // Application Settings
    app: {
        name: 'Pageant Empress',
        version: '1.2.0',
        environment: 'production', // 'development', 'staging', 'production'
        debug: false,
        baseUrl: 'https://pageantempress.com',
        apiUrl: 'https://api.pageantempress.com/v1'
    },
    
    // Feature Flags
    features: {
        animations: true,
        sparkles: true,
        geometricShapes: true,
        shineOverlay: true,
        magneticEffects: true,
        tiltEffects: true,
        parallaxEffects: true,
        lazyLoading: true,
        offlineSupport: true,
        pushNotifications: true,
        analytics: true,
        errorTracking: true,
        performanceMonitoring: true,
        a11yEnhancements: true
    },
    
    // Performance Settings
    performance: {
        enableGPUAcceleration: true,
        maxSparkles: 30,
        maxGeometricShapes: 15,
        animationThrottle: 16, // ~60fps
        scrollThrottle: 16,
        resizeThrottle: 250,
        searchDebounce: 300,
        lazyLoadThreshold: 0.1,
        lazyLoadRootMargin: '50px'
    },
    
    // Animation Settings
    animations: {
        sparkle: {
            duration: '3s',
            count: 30,
            types: ['small', 'medium', 'large', 'star'],
            colors: ['#d4af37', '#ffd700', '#b8860b']
        },
        shapes: {
            duration: '15s',
            count: 15,
            types: ['diamond', 'hexagon', 'triangle'],
            colors: ['#d4af37', '#ff6b9d', '#a855f7']
        },
        shine: {
            duration: '4s',
            opacity: 0.03
        }
    },
    
    // Theme Settings
    theme: {
        default: 'dark',
        storageKey: 'pageant-empress-theme',
        transitions: true,
        systemPreference: true
    },
    
    // Notification Settings
    notifications: {
        position: 'top-right',
        duration: 5000,
        maxVisible: 3,
        stackSpacing: '1rem',
        animations: true
    },
    
    // Search Settings
    search: {
        minLength: 3,
        debounceTime: 300,
        maxSuggestions: 5,
        highlightMatches: true,
        trackQueries: true
    },
    
    // Analytics Configuration
    analytics: {
        gtag: 'G-XXXXXXXXXX', // Replace with your GA4 ID
        trackPageViews: true,
        trackScrollDepth: true,
        trackClicks: true,
        trackFormSubmissions: true,
        trackSearchQueries: true,
        trackPerformance: true,
        trackErrors: true
    },
    
    // Social Media Links
    social: {
        instagram: 'https://instagram.com/pageantempress',
        youtube: 'https://youtube.com/@pageantempress',
        tiktok: 'https://tiktok.com/@pageantempress',
        facebook: 'https://facebook.com/pageantempress',
        twitter: 'https://twitter.com/pageantempress',
        pinterest: 'https://pinterest.com/pageantempress'
    },
    
    // Contact Information
    contact: {
        email: 'info@pageantempress.com',
        phone: '+1-555-PAGEANT',
        address: 'Los Angeles, CA',
        hours: 'Mon-Fri 9AM-6PM PST'
    },
    
    // API Endpoints
    api: {
        newsletter: '/api/newsletter/subscribe',
        contact: '/api/contact/submit',
        search: '/api/search',
        faq: '/api/faq/search',
        analytics: '/api/analytics/track'
    },
    // Cache Settings (completing the cut-off section)
cache: {
    enabled: true,
    version: '1.2.0',
    strategies: {
        static: 'cacheFirst',
        api: 'networkFirst',
        images: 'staleWhileRevalidate'
    },
    maxAge: {
        static: 30 * 24 * 60 * 60 * 1000, // 30 days
        api: 5 * 60 * 1000, // 5 minutes
        images: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    maxEntries: {
        static: 100,
        api: 50,
        images: 200
    }
},

// Error Handling
errorHandling: {
    enabled: true,
    sentry: {
        dsn: process.env.SENTRY_DSN,
        environment: 'production',
        tracesSampleRate: 0.1
    },
    logLevel: 'error', // 'debug', 'info', 'warn', 'error'
    maxRetries: 3,
    retryDelay: 1000
},

// Security Settings
security: {
    csp: {
        enabled: true,
        reportOnly: false
    },
    cors: {
        allowedOrigins: ['https://pageantempress.com', 'https://api.pageantempress.com']
    },
    rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 15 * 60 * 1000 // 15 minutes
    }
},

// A11y Settings
accessibility: {
    announcements: true,
    keyboardNavigation: true,
    highContrast: true,
    reducedMotion: true,
    screenReader: true,
    focusManagement: true
},

// Development Settings
development: {
    hotReload: true,
    sourceMaps: true,
    mockApi: false,
    debugPanel: false,
    performanceMetrics: true
},
        
