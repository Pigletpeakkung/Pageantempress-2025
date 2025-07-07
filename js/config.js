/* ==========================================================================
   CONFIG.JS - PageantEmpress 2025
   Application Configuration and Settings
   ========================================================================== */

/**
 * PageantEmpress Configuration
 * Centralized configuration management for the application
 */
class PageantConfig {
    constructor() {
        this.env = this.detectEnvironment();
        this.config = this.initializeConfig();
        this.features = this.initializeFeatures();
        this.theme = this.initializeTheme();
        this.performance = this.initializePerformance();
        this.accessibility = this.initializeAccessibility();
        this.pwa = this.initializePWA();
        this.analytics = this.initializeAnalytics();
        this.security = this.initializeSecurity();
    }

    /**
     * Detect current environment
     * @returns {string} - Environment name
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('dev')) {
            return 'staging';
        } else if (protocol === 'https:' && !hostname.includes('test')) {
            return 'production';
        }
        
        return 'development';
    }

    /**
     * Initialize base configuration
     * @returns {Object} - Base configuration
     */
    initializeConfig() {
        const baseConfig = {
            app: {
                name: 'PageantEmpress',
                version: '2025.1.0',
                description: 'Premier Beauty Pageant Competition Platform',
                author: 'PageantEmpress Team',
                license: 'MIT',
                repository: 'https://github.com/pageantempress/2025'
            },
            
            api: {
                baseUrl: this.getApiBaseUrl(),
                timeout: 30000,
                retries: 3,
                retryDelay: 1000,
                endpoints: {
                    contestants: '/api/contestants',
                    events: '/api/events',
                    voting: '/api/voting',
                    gallery: '/api/gallery',
                    newsletter: '/api/newsletter',
                    contact: '/api/contact',
                    sponsors: '/api/sponsors',
                    search: '/api/search'
                }
            },
            
            assets: {
                baseUrl: this.getAssetBaseUrl(),
                images: {
                    quality: 85,
                    formats: ['webp', 'avif', 'jpeg', 'png'],
                    sizes: {
                        thumbnail: 200,
                        small: 400,
                        medium: 800,
                        large: 1200,
                        xlarge: 1920
                    }
                },
                fonts: {
                    preload: [
                                                'Montserrat-Regular.woff2',
                        'Montserrat-Bold.woff2',
                        'Playfair-Display-Bold.woff2'
                    ],
                    display: 'swap'
                },
                videos: {
                    quality: 'hd',
                    formats: ['webm', 'mp4'],
                    autoplay: false,
                    controls: true
                }
            },
            
            cache: {
                version: 'v2025.1.0',
                maxAge: {
                    static: 31536000, // 1 year
                    dynamic: 3600, // 1 hour
                    api: 300 // 5 minutes
                },
                strategies: {
                    images: 'cache-first',
                    api: 'network-first',
                    static: 'cache-first',
                    pages: 'stale-while-revalidate'
                }
            },
            
            social: {
                platforms: {
                    facebook: 'https://facebook.com/pageantempress',
                    instagram: 'https://instagram.com/pageantempress',
                    twitter: 'https://twitter.com/pageantempress',
                    youtube: 'https://youtube.com/pageantempress',
                    tiktok: 'https://tiktok.com/@pageantempress',
                    linkedin: 'https://linkedin.com/company/pageantempress'
                },
                sharing: {
                    url: 'https://pageantempress.com',
                    title: 'PageantEmpress 2025 - Premier Beauty Pageant Competition',
                    description: 'Join the most prestigious beauty pageant competition of 2025.',
                    image: 'https://pageantempress.com/assets/images/og-image.jpg',
                    hashtags: ['PageantEmpress2025', 'BeautyPageant', 'Crown', 'Elegance']
                }
            }
        };

        return this.mergeEnvironmentConfig(baseConfig);
    }

    /**
     * Get API base URL based on environment
     * @returns {string} - API base URL
     */
    getApiBaseUrl() {
        const urls = {
            development: 'http://localhost:3001',
            staging: 'https://api-staging.pageantempress.com',
            production: 'https://api.pageantempress.com'
        };
        
        return urls[this.env] || urls.development;
    }

    /**
     * Get asset base URL based on environment
     * @returns {string} - Asset base URL
     */
    getAssetBaseUrl() {
        const urls = {
            development: '/assets',
            staging: 'https://cdn-staging.pageantempress.com',
            production: 'https://cdn.pageantempress.com'
        };
        
        return urls[this.env] || urls.development;
    }

    /**
     * Merge environment-specific configuration
     * @param {Object} baseConfig - Base configuration
     * @returns {Object} - Merged configuration
     */
    mergeEnvironmentConfig(baseConfig) {
        const envConfigs = {
            development: {
                debug: true,
                logging: {
                    level: 'debug',
                    console: true,
                    remote: false
                },
                performance: {
                    monitoring: true,
                    budget: false
                },
                security: {
                    csp: false,
                    hsts: false
                }
            },
            
            staging: {
                debug: true,
                logging: {
                    level: 'info',
                    console: true,
                    remote: true
                },
                performance: {
                    monitoring: true,
                    budget: true
                },
                security: {
                    csp: true,
                    hsts: true
                }
            },
            
            production: {
                debug: false,
                logging: {
                    level: 'error',
                    console: false,
                    remote: true
                },
                performance: {
                    monitoring: true,
                    budget: true
                },
                security: {
                    csp: true,
                    hsts: true
                }
            }
        };

        return this.deepMerge(baseConfig, envConfigs[this.env] || {});
    }

    /**
     * Initialize feature flags
     * @returns {Object} - Feature configuration
     */
    initializeFeatures() {
        return {
            // Core Features
            voting: {
                enabled: true,
                realTime: true,
                authentication: true,
                captcha: true,
                rateLimit: {
                    maxVotes: 10,
                    window: 3600000 // 1 hour
                }
            },
            
            gallery: {
                enabled: true,
                lazyLoading: true,
                lightbox: true,
                infiniteScroll: true,
                filters: true,
                sorting: true,
                sharing: true
            },
            
            search: {
                enabled: true,
                instantSearch: true,
                filters: true,
                suggestions: true,
                history: true,
                analytics: true
            },
            
            newsletter: {
                enabled: true,
                doubleOptIn: true,
                automation: true,
                segmentation: true,
                analytics: true
            },
            
            // Advanced Features
            liveStreaming: {
                enabled: false,
                provider: 'youtube',
                chat: true,
                recording: true
            },
            
            virtualReality: {
                enabled: false,
                formats: ['webxr', 'cardboard'],
                fallback: '360-video'
            },
            
            artificialIntelligence: {
                enabled: false,
                chatbot: true,
                recommendations: true,
                contentModeration: true
            },
            
            // Experimental Features
            webAssembly: {
                enabled: false,
                imageProcessing: true,
                videoFilters: true
            },
            
            blockchain: {
                enabled: false,
                voting: true,
                certificates: true,
                nft: true
            }
        };
    }

    /**
     * Initialize theme configuration
     * @returns {Object} - Theme configuration
     */
    initializeTheme() {
        return {
            default: 'luxury-gold',
            
            themes: {
                'luxury-gold': {
                    name: 'Luxury Gold',
                    primary: '#d4af37',
                    secondary: '#f4e09e',
                    accent: '#ffd700',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.8)',
                    border: 'rgba(212, 175, 55, 0.3)',
                    glassBg: 'rgba(255, 255, 255, 0.1)',
                    gradients: {
                        primary: 'linear-gradient(135deg, #d4af37 0%, #f4e09e 100%)',
                        secondary: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                        accent: 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)'
                    }
                },
                
                'royal-purple': {
                    name: 'Royal Purple',
                    primary: '#8b5cf6',
                    secondary: '#a78bfa',
                    accent: '#c084fc',
                    background: '#0f0f23',
                    surface: '#1e1b4b',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.8)',
                    border: 'rgba(139, 92, 246, 0.3)',
                    glassBg: 'rgba(255, 255, 255, 0.1)',
                    gradients: {
                        primary: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                        secondary: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 100%)',
                        accent: 'linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%)'
                    }
                },
                
                'rose-gold': {
                    name: 'Rose Gold',
                    primary: '#e879f9',
                    secondary: '#f3a8ff',
                    accent: '#fbbf24',
                    background: '#1f1f1f',
                    surface: '#2a2a2a',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.8)',
                    border: 'rgba(232, 121, 249, 0.3)',
                    glassBg: 'rgba(255, 255, 255, 0.1)',
                    gradients: {
                        primary: 'linear-gradient(135deg, #e879f9 0%, #f3a8ff 100%)',
                        secondary: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                        accent: 'linear-gradient(135deg, #fbbf24 0%, #e879f9 100%)'
                    }
                }
            },
            
            darkMode: {
                enabled: true,
                auto: true,
                toggle: true,
                system: true
            },
            
            animations: {
                enabled: true,
                respectReducedMotion: true,
                duration: {
                    fast: 200,
                    normal: 300,
                    slow: 500
                },
                easing: {
                    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
                    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
                    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }
            },
            
            breakpoints: {
                mobile: '480px',
                tablet: '768px',
                laptop: '1024px',
                desktop: '1200px',
                wide: '1440px'
            },
            
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                xxl: '3rem'
            },
            
            typography: {
                fontFamily: {
                    primary: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif',
                    secondary: 'Playfair Display, Georgia, serif',
                    mono: 'Monaco, Consolas, monospace'
                },
                fontSize: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem',
                    '5xl': '3rem'
                },
                fontWeight: {
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700,
                    extrabold: 800
                },
                lineHeight: {
                    tight: 1.25,
                    snug: 1.375,
                    normal: 1.5,
                    relaxed: 1.625,
                    loose: 2
                }
            }
        };
    }

    /**
     * Initialize performance configuration
     * @returns {Object} - Performance configuration
     */
    initializePerformance() {
        return {
            budget: {
                firstContentfulPaint: 1500,
                largestContentfulPaint: 2500,
                cumulativeLayoutShift: 0.1,
                totalBlockingTime: 300,
                speedIndex: 3400
            },
            
            optimization: {
                lazyLoading: {
                    enabled: true,
                    offset: 100,
                    placeholder: 'blur'
                },
                
                imageOptimization: {
                    enabled: true,
                    formats: ['webp', 'avif'],
                    quality: 85,
                    progressive: true,
                    responsive: true
                },
                
                codesplitting: {
                    enabled: true,
                    chunks: 'async',
                    minChunkSize: 20000,
                    maxAsyncRequests: 30
                },
                
                compression: {
                    enabled: true,
                    algorithm: 'gzip',
                    threshold: 1024
                },
                
                preloading: {
                    enabled: true,
                    critical: ['main.css', 'main.js'],
                    fonts: true,
                    images: true
                }
            },
            
            monitoring: {
                enabled: true,
                webVitals: true,
                userTiming: true,
                resourceTiming: true,
                longTasks: true,
                memoryUsage: true
            },
            
            caching: {
                enabled: true,
                strategy: 'stale-while-revalidate',
                maxAge: {
                    static: 31536000,
                    dynamic: 3600,
                    api: 300
                }
            }
        };
    }

    /**
     * Initialize accessibility configuration
     * @returns {Object} - Accessibility configuration
     */
    initializeAccessibility() {
        return {
            wcag: {
                level: 'AA',
                version: '2.1'
            },
            
            colorContrast: {
                normal: 4.5,
                large: 3.0,
                nonText: 3.0
            },
            
            keyboard: {
                navigation: true,
                skipLinks: true,
                focusVisible: true,
                tabTrapping: true
            },
            
            screenReader: {
                announcements: true,
                liveRegions: true,
                landmarks: true,
                headings: true
            },
            
            motion: {
                respectReducedMotion: true,
                alternatives: true,
                controls: true
            },
            
            fonts: {
                minimumSize: 16,
                scalable: true,
                readableContrast: true
            },
            
            form: {
                labels: true,
                instructions: true,
                validation: true,
                errorMessages: true
            }
        };
    }

    /**
     * Initialize PWA configuration
     * @returns {Object} - PWA configuration
     */
    initializePWA() {
        return {
            manifest: {
                name: 'PageantEmpress 2025',
                shortName: 'PageantEmpress',
                description: 'Premier Beauty Pageant Competition Platform',
                category: 'entertainment',
                display: 'standalone',
                orientation: 'portrait-primary',
                themeColor: '#d4af37',
                backgroundColor: '#0a0a0a',
                startUrl: '/',
                scope: '/',
                icons: this.generateIconSizes(),
                shortcuts: [
                    {
                        name: 'Contestants',
                        url: '/contestants',
                        description: 'View all contestants'
                    },
                    {
                        name: 'Events',
                        url: '/events',
                        description: 'Event schedule'
                    },
                    {
                        name: 'Gallery',
                        url: '/gallery',
                        description: 'Photo gallery'
                    },
                    {
                        name: 'Vote',
                        url: '/voting',
                        description: 'Cast your vote'
                    }
                ]
            },
            
            serviceWorker: {
                enabled: true,
                scope: '/',
                updateViaCache: 'imports',
                strategies: {
                    pages: 'NetworkFirst',
                    static: 'CacheFirst',
                    images: 'CacheFirst',
                    api: 'NetworkFirst'
                }
            },
            
            installation: {
                enabled: true,
                prompt: true,
                deferredPrompt: true,
                criteria: {
                    userEngagement: 30000, // 30 seconds
                    visitCount: 2,
                    daysInstalled: 0
                }
            },
            
            notifications: {
                enabled: true,
                permission: 'default',
                badging: true,
                actions: true,
                categories: ['event', 'voting', 'result', 'general']
            },
            
            offline: {
                enabled: true,
                fallback: '/offline.html',
                strategy: 'cache-first',
                pages: ['/', '/contestants', '/events', '/gallery']
            },
            
            backgroundSync: {
                enabled: true,
                syncInterval: 60000, // 1 minute
                tags: ['voting', 'newsletter', 'contact']
            }
        };
    }

    /**
     * Generate icon sizes for PWA manifest
     * @returns {Array} - Icon configurations
     */
    generateIconSizes() {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        return sizes.map(size => ({
            src: `/assets/images/icons/icon-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            purpose: size >= 192 ? 'maskable any' : 'maskable'
        }));
    }

    /**
     * Initialize analytics configuration
     * @returns {Object} - Analytics configuration
     */
    initializeAnalytics() {
        return {
            google: {
                enabled: true,
                trackingId: this.getGoogleAnalyticsId(),
                config: {
                    anonymize_ip: true,
                    respect_dnt: true,
                    cookie_expires: 63072000, // 2 years
                    send_page_view: true
                },
                events: {
                    pageView: true,
                    scroll: true,
                    click: true,
                    form: true,
                    video: true,
                    file: true,
                    outbound: true
                }
            },
            
            facebook: {
                enabled: true,
                pixelId: this.getFacebookPixelId(),
                events: ['PageView', 'Lead', 'CompleteRegistration']
            },
            
            hotjar: {
                enabled: this.env !== 'development',
                siteId: this.getHotjarSiteId(),
                version: 6
            },

