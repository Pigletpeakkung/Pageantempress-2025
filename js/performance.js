/* ==========================================================================
   PERFORMANCE.JS - PageantEmpress 2025
   Performance Optimization and Monitoring
   ========================================================================== */

class PageantPerformance {
    constructor() {
        this.metrics = {};
        this.observers = new Map();
        this.optimizations = new Map();
        this.config = {
            lazyLoadOffset: 100,
            imageQuality: 0.85,
            cacheExpiry: 86400000, // 24 hours
            performanceThreshold: 50,
            memoryThreshold: 100 * 1024 * 1024, // 100MB
            maxConcurrentLoads: 3
        };
        this.loadQueue = [];
        this.activeLoads = 0;
        
        this.init();
    }

    init() {
        this.measureInitialLoad();
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourcePreloading();
        this.setupCriticalResourcePriority();
        this.setupMemoryManagement();
        this.setupNetworkOptimization();
        this.setupRenderOptimization();
        this.setupPerformanceMonitoring();
        this.setupAdaptiveLoading();
        this.initServiceWorkerCaching();
    }

    // Measure initial load performance
    measureInitialLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.collectPerformanceMetrics();
                this.analyzeWebVitals();
                this.optimizeBasedOnMetrics();
            }, 1000);
        });
    }

    // Collect performance metrics
    collectPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        this.metrics = {
            // Load times
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            
            // Paint metrics
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            
            // Network
            networkType: navigator.connection?.effectiveType || 'unknown',
            downlink: navigator.connection?.downlink || 0,
            
            // Memory (if available)
            usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
            totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
            
            // Timing
            responseStart: navigation.responseStart - navigation.fetchStart,
            responseEnd: navigation.responseEnd - navigation.responseStart,
            
            // Current timestamp
            timestamp: Date.now()
        };

        console.log('Performance Metrics:', this.metrics);
        this.storeMetrics();
    }

    // Analyze Web Vitals
    analyzeWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                this.metrics.lcp = entry.startTime;
                this.checkLCPThreshold(entry.startTime);
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.checkFIDThreshold(entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver(list => {
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.cls = clsValue;
                    this.checkCLSThreshold(clsValue);
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // Check LCP threshold
    checkLCPThreshold(lcp) {
        if (lcp > 2500) { // Poor LCP
            this.applyLCPOptimizations();
        }
    }

    // Check FID threshold
    checkFIDThreshold(fid) {
        if (fid > 100) { // Poor FID
            this.applyFIDOptimizations();
        }
    }

    // Check CLS threshold
    checkCLSThreshold(cls) {
        if (cls > 0.1) { // Poor CLS
            this.applyCLSOptimizations();
        }
    }

    // Apply LCP optimizations
    applyLCPOptimizations() {
        // Preload critical images
        this.preloadCriticalImages();
        
        // Optimize fonts
        this.optimizeFonts();
        
        // Remove render-blocking resources
        this.removeRenderBlocking();
    }

    // Apply FID optimizations
    applyFIDOptimizations() {
        // Break up long tasks
        this.breakUpLongTasks();
        
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Optimize event handlers
        this.optimizeEventHandlers();
    }

    // Apply CLS optimizations
    applyCLSOptimizations() {
        // Set image dimensions
        this.setImageDimensions();
        
        // Reserve space for dynamic content
        this.reserveDynamicContentSpace();
        
        // Optimize font loading
        this.optimizeFontLoading();
    }

    // Setup lazy loading
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: `${this.config.lazyLoadOffset}px`
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });

        this.observers.set('images', imageObserver);

        // Lazy load other content
        this.setupContentLazyLoading();
    }

    // Load image with optimization
    async loadImage(img) {
        if (this.activeLoads >= this.config.maxConcurrentLoads) {
            this.loadQueue.push(img);
            return;
        }

        this.activeLoads++;

        try {
            const src = img.dataset.src || img.dataset.srcset;
            if (!src) return;

            // Create optimized image URL
            const optimizedSrc = this.getOptimizedImageUrl(src, img);

            // Preload the image
            const imageLoader = new Image();
            imageLoader.onload = () => {
                img.src = optimizedSrc;
                img.classList.add('loaded');
                this.handleImageLoaded();
            };
            
            imageLoader.onerror = () => {
                // Fallback to original src
                img.src = src;
                img.classList.add('error');
                this.handleImageLoaded();
            };

            imageLoader.src = optimizedSrc;

        } catch (error) {
            console.error('Image loading error:', error);
            this.handleImageLoaded();
        }
    }

    // Handle image loaded
    handleImageLoaded() {
        this.activeLoads--;
        
        // Process queue
        if (this.loadQueue.length > 0 && this.activeLoads < this.config.maxConcurrentLoads) {
            const nextImage = this.loadQueue.shift();
            this.loadImage(nextImage);
        }
    }

    // Get optimized image URL
    getOptimizedImageUrl(src, img) {
        const rect = img.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Calculate optimal dimensions
        const width = Math.ceil(rect.width * devicePixelRatio);
        const height = Math.ceil(rect.height * devicePixelRatio);
        
        // Check if we should use WebP
        const supportsWebP = this.supportsWebP();
        const format = supportsWebP ? 'webp' : 'jpeg';
        
        // Return optimized URL (this would typically be handled by a CDN)
        if (src.includes('?')) {
            return `${src}&w=${width}&h=${height}&f=${format}&q=${Math.floor(this.config.imageQuality * 100)}`;
        } else {
            return `${src}?w=${width}&h=${height}&f=${format}&q=${Math.floor(this.config.imageQuality * 100)}`;
        }
    }

    // Check WebP support
    supportsWebP() {
        if (this._webpSupport !== undefined) {
            return this._webpSupport;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        
        this._webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        return this._webpSupport;
    }

    // Setup content lazy loading
    setupContentLazyLoading() {
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadContent(entry.target);
                    contentObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('.lazy-content').forEach(element => {
            contentObserver.observe(element);
        });

        this.observers.set('content', contentObserver);
    }

    // Load content
    async loadContent(element) {
        const contentUrl = element.dataset.src;
        if (!contentUrl) return;

        try {
            element.classList.add('loading');
            
            const response = await fetch(contentUrl);
            const content = await response.text();
            
            element.innerHTML = content;
            element.classList.remove('loading');
            element.classList.add('loaded');
            
            // Initialize any new components
            if (window.pageantAnimations) {
                window.pageantAnimations.setupScrollAnimations();
            }
            
        } catch (error) {
            console.error('Content loading error:', error);
            element.classList.remove('loading');
            element.classList.add('error');
        }
    }

    // Setup image optimization
    setupImageOptimization() {
        // Set dimensions for images to prevent CLS
        this.setImageDimensions();
        
        // Optimize critical images
        this.optimizeCriticalImages();
        
        // Setup responsive images
        this.setupResponsiveImages();
    }

    // Set image dimensions
    setImageDimensions() {
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            if (img.dataset.width && img.dataset.height) {
                img.width = img.dataset.width;
                img.height = img.dataset.height;
                img.style.aspectRatio = `${img.dataset.width} / ${img.dataset.height}`;
            }
        });
    }

    // Optimize critical images
    optimizeCriticalImages() {
        // Preload above-the-fold images
        document.querySelectorAll('img[data-critical="true"]').forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src || img.dataset.src;
            document.head.appendChild(link);
        });
    }

    // Setup responsive images
    setupResponsiveImages() {
        const updateImageSrc = () => {
            document.querySelectorAll('img[data-responsive]').forEach(img => {
                const breakpoints = JSON.parse(img.dataset.responsive);
                const currentBreakpoint = this.getCurrentBreakpoint();
                
                if (breakpoints[currentBreakpoint]) {
                    img.src = breakpoints[currentBreakpoint];
                }
            });
        };

        window.addEventListener('resize', this.debounce(updateImageSrc, 250));
        updateImageSrc();
    }

    // Setup resource preloading
    setupResourcePreloading() {
        // Preload critical CSS
        this.preloadCriticalCSS();
        
        // Preload important fonts
        this.preloadFonts();
        
        // Prefetch likely navigation targets
        this.setupNavigationPrefetch();
    }

    // Preload critical CSS
    preloadCriticalCSS() {
        const criticalStylesheets = [
            '/css/main.css',
            '/css/components.css'
        ];

        criticalStylesheets.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    // Preload fonts
    preloadFonts() {
        const criticalFonts = [
            '/fonts/Montserrat-Regular.woff2',
            '/fonts/Playfair-Display-Bold.woff2'
        ];

        criticalFonts.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // Setup navigation prefetch
    setupNavigationPrefetch() {
        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.prefetchPage(entry.target.href);
                }
            });
        });

        document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.href);
            });
        });
    }

    // Prefetch page
    prefetchPage(href) {
        if (this.prefetchedPages?.has(href) || href === window.location.href) {
            return;
        }

        if (!this.prefetchedPages) {
            this.prefetchedPages = new Set();
        }

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
        
        this.prefetchedPages.add(href);
    }

    // Setup critical resource priority
    setupCriticalResourcePriority() {
        // Set resource hints
        this.setResourceHints();
        
        // Optimize script loading
        this.optimizeScriptLoading();
        
        // Manage render-blocking resources
        this.manageRenderBlocking();
    }

    // Set resource hints
    setResourceHints() {
        // DNS prefetch for external domains
        const externalDomains = [
            '//fonts.googleapis.com',
            '//www.google-analytics.com',
            '//cdnjs.cloudflare.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // Optimize script loading
    optimizeScriptLoading() {
        // Defer non-critical scripts
        document.querySelectorAll('script[data-defer="true"]').forEach(script => {
            script.defer = true;
        });

        // Async load analytics scripts
        document.querySelectorAll('script[data-analytics="true"]').forEach(script => {
            script.async = true;
        });
    }

    // Setup memory management
    setupMemoryManagement() {
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Cleanup unused resources
        this.setupResourceCleanup();
        
        // Manage cache size
        this.manageCacheSize();
    }

    // Monitor memory usage
    monitorMemoryUsage() {
        if (!performance.memory) return;

        setInterval(() => {
            const memoryInfo = performance.memory;
            
            if (memoryInfo.usedJSHeapSize > this.config.memoryThreshold) {
                this.performMemoryCleanup();
            }
            
            this.metrics.memoryUsage = {
                used: memoryInfo.usedJSHeapSize,
                total: memoryInfo.totalJSHeapSize,
                limit: memoryInfo.jsHeapSizeLimit,
                timestamp: Date.now()
            };
        }, 30000); // Check every 30 seconds
    }

    // Perform memory cleanup
    performMemoryCleanup() {
        // Remove cached images that are out of viewport
        this.cleanupImages();
        
        // Clear animation cache
        this.cleanupAnimations();
        
                // Garbage collection hint
        if (window.gc) {
            window.gc();
        }
    }

    // Cleanup images
    cleanupImages() {
        document.querySelectorAll('img.loaded').forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight + 500 && 
                             rect.bottom > -500;
            
            if (!isVisible && img.src) {
                // Store src for later restoration
                img.dataset.originalSrc = img.src;
                img.src = '';
                img.classList.remove('loaded');
                img.classList.add('unloaded');
            }
        });
    }

    // Cleanup animations
    cleanupAnimations() {
        // Remove completed animation elements
        document.querySelectorAll('.animation-complete').forEach(el => {
            el.remove();
        });
        
        // Stop non-visible animations
        if (window.pageantAnimations) {
            window.pageantAnimations.stopAllAnimations();
        }
    }

    // Setup resource cleanup
    setupResourceCleanup() {
        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.performResourceCleanup();
            }
        });

        // Cleanup on low memory
        window.addEventListener('beforeunload', () => {
            this.performResourceCleanup();
        });
    }

    // Perform resource cleanup
    performResourceCleanup() {
        // Cancel pending network requests
        this.cancelPendingRequests();
        
        // Clear event listeners
        this.cleanupEventListeners();
        
        // Clear intervals and timeouts
        this.clearTimers();
    }

    // Cancel pending requests
    cancelPendingRequests() {
        if (this.pendingRequests) {
            this.pendingRequests.forEach(request => {
                if (request.abort) {
                    request.abort();
                }
            });
            this.pendingRequests.clear();
        }
    }

    // Cleanup event listeners
    cleanupEventListeners() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
    }

    // Clear timers
    clearTimers() {
        if (this.timers) {
            this.timers.forEach(timer => {
                clearTimeout(timer);
                clearInterval(timer);
            });
            this.timers.clear();
        }
    }

    // Setup network optimization
    setupNetworkOptimization() {
        // Adapt to network conditions
        this.adaptToNetworkConditions();
        
        // Implement request batching
        this.setupRequestBatching();
        
        // Setup compression
        this.setupCompression();
    }

    // Adapt to network conditions
    adaptToNetworkConditions() {
        if (!navigator.connection) return;

        const connection = navigator.connection;
        const updateStrategy = () => {
            switch (connection.effectiveType) {
                case 'slow-2g':
                case '2g':
                    this.applyLowBandwidthOptimizations();
                    break;
                case '3g':
                    this.applyMediumBandwidthOptimizations();
                    break;
                case '4g':
                    this.applyHighBandwidthOptimizations();
                    break;
                default:
                    this.applyDefaultOptimizations();
            }
        };

        connection.addEventListener('change', updateStrategy);
        updateStrategy();
    }

    // Apply low bandwidth optimizations
    applyLowBandwidthOptimizations() {
        // Reduce image quality
        this.config.imageQuality = 0.6;
        
        // Disable non-essential animations
        document.body.classList.add('low-bandwidth');
        
        // Reduce concurrent requests
        this.config.maxConcurrentLoads = 1;
        
        // Defer non-critical resources
        this.deferNonCriticalResources();
    }

    // Apply medium bandwidth optimizations
    applyMediumBandwidthOptimizations() {
        this.config.imageQuality = 0.75;
        this.config.maxConcurrentLoads = 2;
        document.body.classList.add('medium-bandwidth');
    }

    // Apply high bandwidth optimizations
    applyHighBandwidthOptimizations() {
        this.config.imageQuality = 0.9;
        this.config.maxConcurrentLoads = 5;
        document.body.classList.add('high-bandwidth');
        
        // Preload more resources
        this.preloadAdditionalResources();
    }

    // Setup request batching
    setupRequestBatching() {
        this.requestBatch = [];
        this.batchTimer = null;
        
        // Batch analytics requests
        this.batchAnalyticsRequests();
    }

    // Batch analytics requests
    batchAnalyticsRequests() {
        const originalGtag = window.gtag;
        
        if (originalGtag) {
            window.gtag = (...args) => {
                this.requestBatch.push(args);
                this.scheduleBatchSend();
            };
        }
    }

    // Schedule batch send
    scheduleBatchSend() {
        if (this.batchTimer) return;
        
        this.batchTimer = setTimeout(() => {
            this.sendBatch();
            this.requestBatch = [];
            this.batchTimer = null;
        }, 1000);
    }

    // Send batch
    sendBatch() {
        if (this.requestBatch.length === 0) return;
        
        // Send batched requests
        this.requestBatch.forEach(args => {
            if (window.gtag) {
                window.gtag(...args);
            }
        });
    }

    // Setup render optimization
    setupRenderOptimization() {
        // Virtualize long lists
        this.setupVirtualization();
        
        // Optimize paint operations
        this.optimizePaintOperations();
        
        // Minimize reflows
        this.minimizeReflows();
    }

    // Setup virtualization
    setupVirtualization() {
        document.querySelectorAll('.virtual-list').forEach(list => {
            this.virtualizeList(list);
        });
    }

    // Virtualize list
    virtualizeList(list) {
        const items = Array.from(list.children);
        const itemHeight = items[0]?.offsetHeight || 100;
        const visibleCount = Math.ceil(window.innerHeight / itemHeight) + 2;
        
        let startIndex = 0;
        let endIndex = Math.min(visibleCount, items.length);
        
        const updateVisibleItems = () => {
            const scrollTop = list.scrollTop;
            const newStartIndex = Math.floor(scrollTop / itemHeight);
            const newEndIndex = Math.min(newStartIndex + visibleCount, items.length);
            
            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                
                // Hide all items
                items.forEach(item => item.style.display = 'none');
                
                // Show visible items
                for (let i = startIndex; i < endIndex; i++) {
                    items[i].style.display = '';
                    items[i].style.transform = `translateY(${i * itemHeight}px)`;
                }
            }
        };
        
        list.addEventListener('scroll', this.throttle(updateVisibleItems, 16));
        updateVisibleItems();
    }

    // Optimize paint operations
    optimizePaintOperations() {
        // Use CSS containment
        document.querySelectorAll('.performance-container').forEach(container => {
            container.style.contain = 'layout style paint';
        });
        
        // Promote elements to composite layers
        document.querySelectorAll('.will-change-transform').forEach(element => {
            element.style.willChange = 'transform';
        });
    }

    // Minimize reflows
    minimizeReflows() {
        // Batch DOM operations
        this.batchDOMOperations();
        
        // Use requestAnimationFrame for layout changes
        this.useRAFForLayoutChanges();
    }

    // Batch DOM operations
    batchDOMOperations() {
        let pendingOperations = [];
        
        window.batchDOM = (operation) => {
            pendingOperations.push(operation);
            
            if (pendingOperations.length === 1) {
                requestAnimationFrame(() => {
                    pendingOperations.forEach(op => op());
                    pendingOperations = [];
                });
            }
        };
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor long tasks
        this.monitorLongTasks();
        
        // Monitor resource timing
        this.monitorResourceTiming();
        
        // Setup performance alerts
        this.setupPerformanceAlerts();
    }

    // Monitor long tasks
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry.duration + 'ms');
                        this.handleLongTask(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    // Handle long task
    handleLongTask(entry) {
        // Break up the task if possible
        this.breakUpLongTasks();
        
        // Defer non-critical operations
        this.deferNonCriticalOperations();
    }

    // Break up long tasks
    breakUpLongTasks() {
        // Use scheduler.postTask if available
        if ('scheduler' in window && 'postTask' in scheduler) {
            scheduler.postTask(() => {
                // Perform task
            }, { priority: 'background' });
        } else {
            // Fallback to setTimeout
            setTimeout(() => {
                // Perform task
            }, 0);
        }
    }

    // Monitor resource timing
    monitorResourceTiming() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 1000) {
                        console.warn('Slow resource:', entry.name, entry.duration + 'ms');
                        this.optimizeSlowResource(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }

    // Optimize slow resource
    optimizeSlowResource(entry) {
        // Add to optimization queue
        if (!this.slowResources) {
            this.slowResources = new Set();
        }
        
        this.slowResources.add(entry.name);
        
        // Apply optimizations
        this.applyResourceOptimizations(entry);
    }

    // Apply resource optimizations
    applyResourceOptimizations(entry) {
        if (entry.name.includes('.jpg') || entry.name.includes('.png')) {
            // Optimize images
            this.optimizeImageResource(entry.name);
        } else if (entry.name.includes('.js')) {
            // Optimize scripts
            this.optimizeScriptResource(entry.name);
        } else if (entry.name.includes('.css')) {
            // Optimize styles
            this.optimizeStyleResource(entry.name);
        }
    }

    // Setup adaptive loading
    setupAdaptiveLoading() {
        // Monitor device capabilities
        this.monitorDeviceCapabilities();
        
        // Adjust loading strategy
        this.adjustLoadingStrategy();
        
        // Implement progressive enhancement
        this.implementProgressiveEnhancement();
    }

    // Monitor device capabilities
    monitorDeviceCapabilities() {
        this.deviceCapabilities = {
            memory: navigator.deviceMemory || 4,
            cores: navigator.hardwareConcurrency || 4,
            connection: navigator.connection?.effectiveType || '4g',
            battery: null
        };
        
        // Monitor battery
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.deviceCapabilities.battery = {
                    level: battery.level,
                    charging: battery.charging
                };
                
                this.adjustForBatteryStatus();
            });
        }
    }

    // Adjust for battery status
    adjustForBatteryStatus() {
        const battery = this.deviceCapabilities.battery;
        if (!battery) return;
        
        if (battery.level < 0.2 && !battery.charging) {
            // Low battery - reduce performance
            this.applyLowPowerOptimizations();
        }
    }

    // Apply low power optimizations
    applyLowPowerOptimizations() {
        document.body.classList.add('low-power');
        
        // Reduce animations
        this.config.animationsEnabled = false;
        
        // Reduce image quality
        this.config.imageQuality = 0.6;
        
        // Disable non-essential features
        this.disableNonEssentialFeatures();
    }

    // Disable non-essential features
    disableNonEssentialFeatures() {
        // Disable particles
        document.querySelectorAll('.floating-particle').forEach(particle => {
            particle.style.display = 'none';
        });
        
        // Disable complex animations
        document.querySelectorAll('.complex-animation').forEach(element => {
            element.classList.add('animation-disabled');
        });
    }

    // Get current breakpoint
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < 480) return 'mobile';
        if (width < 768) return 'tablet';
        if (width < 1024) return 'laptop';
        return 'desktop';
    }

    // Store metrics
    storeMetrics() {
        try {
            const stored = localStorage.getItem('pageant-performance-metrics');
            const metrics = stored ? JSON.parse(stored) : [];
            
            metrics.push(this.metrics);
            
            // Keep only last 10 entries
            if (metrics.length > 10) {
                metrics.splice(0, metrics.length - 10);
            }
            
            localStorage.setItem('pageant-performance-metrics', JSON.stringify(metrics));
        } catch (error) {
            console.error('Error storing metrics:', error);
        }
    }

    // Get stored metrics
    getStoredMetrics() {
        try {
            const stored = localStorage.getItem('pageant-performance-metrics');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error retrieving metrics:', error);
            return [];
        }
    }

    // Optimize based on metrics
    optimizeBasedOnMetrics() {
        const storedMetrics = this.getStoredMetrics();
        if (storedMetrics.length < 2) return;
        
        const avgLCP = storedMetrics.reduce((sum, m) => sum + (m.lcp || 0), 0) / storedMetrics.length;
        const avgFID = storedMetrics.reduce((sum, m) => sum + (m.fid || 0), 0) / storedMetrics.length;
        
        if (avgLCP > 2500) {
            this.applyLCPOptimizations();
        }
        
        if (avgFID > 100) {
            this.applyFIDOptimizations();
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Get performance summary
    getPerformanceSummary() {
        return {
            metrics: this.metrics,
            deviceCapabilities: this.deviceCapabilities,
            optimizations: Array.from(this.optimizations.keys()),
            cacheSize: this.getCacheSize(),
            memoryUsage: this.getMemoryUsage()
        };
    }

    // Get cache size
    getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            return navigator.storage.estimate();
        }
        return null;
    }

    // Get memory usage
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // Cleanup on destroy
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.clearTimers();
        this.cancelPendingRequests();
        
        // Remove performance monitoring
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
    }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
    window.pageantPerformance = new PageantPerformance();
});

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', () => {
    if (window.pageantPerformance) {
        if (document.hidden) {
            window.pageantPerformance.performResourceCleanup();
        } else {
            window.pageantPerformance.resumeOptimizations();
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageantPerformance;
}
