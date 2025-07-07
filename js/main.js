/* ==========================================================================
   MAIN.JS - PageantEmpress 2025
   Site Preloader & Experience Preparation System
   ========================================================================== */

(function() {
    'use strict';

    // Global variables
    let preloadComplete = false;
    let experienceReady = false;
    let assetsLoaded = 0;
    let totalAssets = 0;
    let loadingStartTime = Date.now();
    let minimumLoadTime = 2000; // Minimum 2 seconds for branding

    // Preloader elements
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const loadingStage = document.querySelector('.loading-stage');
    const crownSpinner = document.querySelector('.crown-spinner');
    const sparkles = document.querySelectorAll('.sparkle');

    // Experience preparation elements
    const experienceOverlay = document.getElementById('experience-overlay');
    const experienceProgress = document.querySelector('.experience-progress');
    const experienceText = document.querySelector('.experience-text');
    const experienceSteps = document.querySelector('.experience-steps');

    // Asset loading queue
    const assetQueue = [];
    const loadedAssets = new Set();

    // Loading stages
    const loadingStages = [
        { stage: 'initializing', text: 'Initializing PageantEmpress...', duration: 300 },
        { stage: 'assets', text: 'Loading Assets...', duration: 1000 },
        { stage: 'fonts', text: 'Loading Fonts...', duration: 500 },
        { stage: 'images', text: 'Loading Images...', duration: 800 },
        { stage: 'scripts', text: 'Loading Scripts...', duration: 400 },
        { stage: 'styles', text: 'Loading Styles...', duration: 300 },
        { stage: 'data', text: 'Loading Data...', duration: 600 },
        { stage: 'preparing', text: 'Preparing Experience...', duration: 500 },
        { stage: 'finalizing', text: 'Finalizing...', duration: 200 }
    ];

    // Experience preparation steps
    const experienceSteps = [
        { step: 'theme', text: 'Applying Theme...', icon: 'fa-palette' },
        { step: 'layout', text: 'Preparing Layout...', icon: 'fa-th-large' },
        { step: 'animations', text: 'Initializing Animations...', icon: 'fa-magic' },
        { step: 'interactions', text: 'Setting Up Interactions...', icon: 'fa-hand-pointer' },
        { step: 'optimization', text: 'Optimizing Performance...', icon: 'fa-tachometer-alt' },
        { step: 'finalization', text: 'Final Touch...', icon: 'fa-crown' }
    ];

    // Initialize preloader
    function initPreloader() {
        console.log('🎭 PageantEmpress: Initializing preloader...');
        
        // Show preloader
        if (preloader) {
            preloader.style.display = 'flex';
            preloader.classList.add('active');
        }

        // Start crown animation
        animateCrown();
        
        // Start sparkle effects
        animateSparkles();
        
        // Begin loading sequence
        startLoadingSequence();
        
        // Queue critical assets
        queueCriticalAssets();
        
        // Set up progress tracking
        setupProgressTracking();
    }

    // Animate crown spinner
    function animateCrown() {
        if (!crownSpinner) return;
        
        crownSpinner.style.animation = 'crown-spin 2s linear infinite';
        
        // Add pulsing glow effect
        setInterval(() => {
            crownSpinner.style.boxShadow = `
                0 0 20px rgba(212, 175, 55, 0.6),
                0 0 40px rgba(212, 175, 55, 0.4),
                0 0 60px rgba(212, 175, 55, 0.2)
            `;
            
            setTimeout(() => {
                crownSpinner.style.boxShadow = `
                    0 0 10px rgba(212, 175, 55, 0.3),
                    0 0 20px rgba(212, 175, 55, 0.2),
                    0 0 30px rgba(212, 175, 55, 0.1)
                `;
            }, 500);
        }, 1000);
    }

    // Animate sparkles
    function animateSparkles() {
        if (!sparkles.length) return;
        
        sparkles.forEach((sparkle, index) => {
            setTimeout(() => {
                sparkle.style.animation = `sparkle-twinkle 2s ease-in-out infinite`;
                sparkle.style.animationDelay = `${index * 0.2}s`;
            }, index * 100);
        });
    }

    // Start loading sequence
    function startLoadingSequence() {
        let currentStage = 0;
        let stageStartTime = Date.now();
        
        function processStage() {
            if (currentStage >= loadingStages.length) {
                completePreload();
                return;
            }
            
            const stage = loadingStages[currentStage];
            updateLoadingStage(stage.text);
            
            // Simulate stage processing
            setTimeout(() => {
                updateProgress((currentStage + 1) / loadingStages.length * 100);
                currentStage++;
                processStage();
            }, stage.duration);
        }
        
        processStage();
    }

    // Update loading stage
    function updateLoadingStage(text) {
        if (loadingStage) {
            loadingStage.textContent = text;
            loadingStage.style.animation = 'fade-in 0.3s ease-in-out';
        }
        
        console.log(`🎭 PageantEmpress: ${text}`);
    }

    // Update progress
    function updateProgress(percentage) {
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.style.background = `linear-gradient(45deg, 
                #d4af37 0%, 
                #f1c40f ${percentage}%, 
                #d4af37 100%)`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}%`;
        }
        
        // Add shimmer effect at milestones
        if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
            addShimmerEffect();
        }
    }

    // Add shimmer effect
    function addShimmerEffect() {
        if (progressBar) {
            progressBar.style.boxShadow = `
                0 0 20px rgba(212, 175, 55, 0.8),
                inset 0 0 20px rgba(255, 255, 255, 0.3)
            `;
            
            setTimeout(() => {
                progressBar.style.boxShadow = 'none';
            }, 500);
        }
    }

    // Queue critical assets
    function queueCriticalAssets() {
        // Critical CSS files
        queueAsset('css/bootstrap.min.css');
        queueAsset('css/font-awesome.min.css');
        queueAsset('css/main.css');
        queueAsset('css/pageant.css');
        
        // Critical JavaScript files
        queueAsset('js/jquery.min.js');
        queueAsset('js/bootstrap.bundle.min.js');
        queueAsset('js/pageant.js');
        
        // Critical images
        queueAsset('images/logo.png');
        queueAsset('images/crown-icon.png');
        queueAsset('images/hero-bg.jpg');
        
        // Fonts
        queueAsset('fonts/fa-solid-900.woff2');
        queueAsset('fonts/fa-regular-400.woff2');
        queueAsset('fonts/fa-brands-400.woff2');
        
        // Start loading assets
        loadQueuedAssets();
    }

    // Queue asset for loading
    function queueAsset(url) {
        if (!loadedAssets.has(url)) {
            assetQueue.push(url);
            totalAssets++;
        }
    }

    // Load queued assets
    function loadQueuedAssets() {
        assetQueue.forEach(url => {
            loadAsset(url);
        });
    }

    // Load individual asset
    function loadAsset(url) {
        return new Promise((resolve, reject) => {
            const extension = url.split('.').pop().toLowerCase();
            let element;
            
            switch (extension) {
                case 'css':
                    element = document.createElement('link');
                    element.rel = 'stylesheet';
                    element.href = url;
                    break;
                    
                case 'js':
                    element = document.createElement('script');
                    element.src = url;
                    element.async = true;
                    break;
                    
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'svg':
                case 'webp':
                    element = new Image();
                    element.src = url;
                    break;
                    
                case 'woff':
                case 'woff2':
                case 'ttf':
                case 'otf':
                    element = document.createElement('link');
                    element.rel = 'preload';
                    element.as = 'font';
                    element.href = url;
                    element.crossOrigin = 'anonymous';
                    break;
                    
                default:
                    resolve();
                    return;
            }
            
            element.onload = () => {
                loadedAssets.add(url);
                assetsLoaded++;
                resolve();
                updateAssetProgress();
            };
            
            element.onerror = () => {
                console.warn(`Failed to load asset: ${url}`);
                assetsLoaded++;
                resolve(); // Continue even if asset fails
                updateAssetProgress();
            };
            
            // Add to document if needed
            if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
                document.head.appendChild(element);
            }
        });
    }

    // Update asset loading progress
    function updateAssetProgress() {
        const assetPercentage = (assetsLoaded / totalAssets) * 100;
        console.log(`🎭 PageantEmpress: Assets loaded: ${assetsLoaded}/${totalAssets} (${Math.round(assetPercentage)}%)`);
    }

    // Setup progress tracking
    function setupProgressTracking() {
        // Track document ready state
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('🎭 PageantEmpress: DOM content loaded');
            });
        }
        
        // Track window load
        window.addEventListener('load', () => {
            console.log('🎭 PageantEmpress: Window loaded');
        });
        
        // Track font loading
        if (document.fonts) {
            document.fonts.ready.then(() => {
                console.log('🎭 PageantEmpress: Fonts loaded');
            });
        }
    }

    // Complete preload
    function completePreload() {
        const loadingTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minimumLoadTime - loadingTime);
        
        setTimeout(() => {
            preloadComplete = true;
            console.log('🎭 PageantEmpress: Preload complete');
            
            // Transition to experience preparation
            transitionToExperiencePreparation();
        }, remainingTime);
    }

    // Transition to experience preparation
    function transitionToExperiencePreparation() {
        // Fade out preloader
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease-out';
        }
        
        setTimeout(() => {
            // Hide preloader
            if (preloader) {
                preloader.style.display = 'none';
            }
            
            // Show experience overlay
            if (experienceOverlay) {
                experienceOverlay.style.display = 'flex';
                experienceOverlay.classList.add('active');
                
                // Start experience preparation
                prepareExperience();
            } else {
                // Skip experience preparation if overlay not found
                completeInitialization();
            }
        }, 500);
    }

    // Prepare experience
    function prepareExperience() {
        console.log('🎭 PageantEmpress: Preparing experience...');
        
        let currentStep = 0;
        
        function processExperienceStep() {
            if (currentStep >= experienceSteps.length) {
                completeExperiencePreparation();
                return;
            }
            
            const step = experienceSteps[currentStep];
            updateExperienceStep(step);
            
            // Execute step logic
            executeExperienceStep(step.step).then(() => {
                currentStep++;
                
                // Update progress
                const progress = (currentStep / experienceSteps.length) * 100;
                updateExperienceProgress(progress);
                
                // Continue to next step
                setTimeout(() => {
                    processExperienceStep();
                }, 300);
            });
        }
        
        processExperienceStep();
    }

    // Update experience step
    function updateExperienceStep(step) {
        if (experienceText) {
            experienceText.innerHTML = `
                <i class="fas ${step.icon}"></i>
                ${step.text}
            `;
        }
        
        // Add step to steps list
        if (experienceSteps) {
            const stepElement = document.createElement('div');
            stepElement.className = 'experience-step';
            stepElement.innerHTML = `
                <i class="fas ${step.icon}"></i>
                <span>${step.text}</span>
                <div class="step-check">
                    <i class="fas fa-check"></i>
                </div>
            `;
            experienceSteps.appendChild(stepElement);
            
            // Animate step
            setTimeout(() => {
                stepElement.classList.add('completed');
            }, 200);
        }
    }

    // Execute experience step
    function executeExperienceStep(stepName) {
        return new Promise((resolve) => {
            switch (stepName) {
                case 'theme':
                    applyTheme();
                    break;
                    
                case 'layout':
                    prepareLayout();
                    break;
                    
                case 'animations':
                    initializeAnimations();
                    break;
                    
                case 'interactions':
                    setupInteractions();
                    break;
                    
                case 'optimization':
                    optimizePerformance();
                    break;
                    
                case 'finalization':
                    finalizeExperience();
                    break;
                    
                default:
                    break;
            }
            
            // Simulate processing time
            setTimeout(resolve, 200 + Math.random() * 300);
        });
    }

    // Apply theme
    function applyTheme() {
        console.log('🎭 PageantEmpress: Applying theme...');
        
        // Set theme variables
        document.documentElement.style.setProperty('--primary-color', '#d4af37');
        document.documentElement.style.setProperty('--secondary-color', '#f1c40f');
        document.documentElement.style.setProperty('--accent-color', '#e74c3c');
        
        // Apply theme class
        document.body.classList.add('pageant-theme');
        
        // Initialize theme switching
        if (localStorage.getItem('theme')) {
            document.body.classList.add(localStorage.getItem('theme'));
        }
    }

    // Prepare layout
    function prepareLayout() {
        console.log('🎭 PageantEmpress: Preparing layout...');
        
        // Initialize responsive utilities
        setupResponsiveUtilities();
        
        // Prepare grid system
        setupGridSystem();
        
        // Initialize layout components
        setupLayoutComponents();
    }

    // Initialize animations
    function initializeAnimations() {
        console.log('🎭 PageantEmpress: Initializing animations...');
        
        // Set up Intersection Observer for scroll animations
        setupScrollAnimations();
        
        // Initialize hover effects
        setupHoverEffects();
        
        // Prepare transition effects
        setupTransitionEffects();
    }

    // Setup interactions
    function setupInteractions() {
        console.log('🎭 PageantEmpress: Setting up interactions...');
        
        // Initialize touch gestures
        setupTouchGestures();
        
        // Setup keyboard navigation
        setupKeyboardNavigation();
        
        // Initialize form interactions
        setupFormInteractions();
    }

    // Optimize performance
    function optimizePerformance() {
        console.log('🎭 PageantEmpress: Optimizing performance...');
        
        // Lazy load images
        setupLazyLoading();
        
        // Optimize animations
        optimizeAnimations();
        
        // Setup resource hints
        setupResourceHints();
    }

    // Finalize experience
    function finalizeExperience() {
        console.log('🎭 PageantEmpress: Finalizing experience...');
        
        // Initialize analytics
        setupAnalytics();
        
        // Setup error handling
        setupErrorHandling();
        
        // Final checks
        performFinalChecks();
    }

    // Update experience progress
    function updateExperienceProgress(percentage) {
        if (experienceProgress) {
            experienceProgress.style.width = `${percentage}%`;
        }
    }

    // Complete experience preparation
    function completeExperiencePreparation() {
        console.log('🎭 PageantEmpress: Experience preparation complete');
        
        experienceReady = true;
        
        // Add completion animation
        if (experienceOverlay) {
            experienceOverlay.classList.add('completing');
        }
        
        setTimeout(() => {
            completeInitialization();
        }, 1000);
    }

    // Complete initialization
    function completeInitialization() {
        console.log('🎭 PageantEmpress: Initialization complete');
        
        // Hide experience overlay
        if (experienceOverlay) {
            experienceOverlay.style.opacity = '0';
            experienceOverlay.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                experienceOverlay.style.display = 'none';
            }, 500);
        }
        
        // Show main content
        showMainContent();
        
        // Fire ready event
        fireReadyEvent();
        
        // Initialize main application
        initializeApplication();
    }

    // Show main content
    function showMainContent() {
        const mainContent = document.querySelector('main') || document.body;
        
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.visibility = 'visible';
            
            // Animate in
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.8s ease-in-out';
                mainContent.style.opacity = '1';
            }, 100);
        }
        
        // Trigger entrance animations
        triggerEntranceAnimations();
    }

    // Fire ready event
    function fireReadyEvent() {
        const readyEvent = new CustomEvent('pageantReady', {
            detail: {
                preloadComplete,
                experienceReady,
                loadTime: Date.now() - loadingStartTime
            }
        });
        
        document.dispatchEvent(readyEvent);
        console.log('🎭 PageantEmpress: Ready event fired');
    }

    // Initialize application
    function initializeApplication() {
        // Initialize page-specific functionality
        initializePageSpecificFeatures();
        
        // Setup global event listeners
        setupGlobalEventListeners();
        
        // Initialize components
        initializeComponents();
        
        // Final setup
        finalSetup();
    }

    // Setup responsive utilities
    function setupResponsiveUtilities() {
        // Create responsive utility functions
        window.PageantEmpress = window.PageantEmpress || {};
        window.PageantEmpress.responsive = {
            isMobile: () => window.innerWidth < 768,
            isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
            isDesktop: () => window.innerWidth >= 1024,
            
            onResize: (callback) => {
                window.addEventListener('resize', callback);
                callback(); // Execute immediately
            }
        };
    }

    // Setup grid system
    function setupGridSystem() {
        // Dynamic grid adjustments
        const gridContainers = document.querySelectorAll('.container, .container-fluid');
        
        gridContainers.forEach(container => {
            container.style.transition = 'all 0.3s ease';
        });
    }

    // Setup layout components
    function setupLayoutComponents() {
        // Initialize sticky headers
        const stickyHeaders = document.querySelectorAll('.sticky-header');
        
        stickyHeaders.forEach(header => {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.zIndex = '1000';
        });
    }

    // Setup scroll animations
    function setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Observe elements with animation classes
            const animatedElements = document.querySelectorAll('[class*="animate-"]');
            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }

    // Setup hover effects
    function setupHoverEffects() {
        const hoverElements = document.querySelectorAll('[data-hover]');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                e.target.classList.add('hover-active');
            });
            
            element.addEventListener('mouseleave', (e) => {
                e.target.classList.remove('hover-active');
            });
        });
    }

    // Setup transition effects
    function setupTransitionEffects() {
        // Page transition effects
        const pageLinks = document.querySelectorAll('a[href^="/"], a[href^="./"]');
        
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.hostname === window.location.hostname) {
                    e.preventDefault();
                    
                    // Trigger page transition
                    triggerPageTransition(e.target.href);
                }
            });
        });
    }

    // Setup touch gestures
    function setupTouchGestures() {
        if ('ontouchstart' in window) {
            let touchStartX = 0;
            let touchStartY = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                
                // Detect swipe gestures
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 50) {
                        // Swipe right
                        document.dispatchEvent(new CustomEvent('swipeRight'));
                    } else if (deltaX < -50) {
                        // Swipe left
                        document.dispatchEvent(new CustomEvent('swipeLeft'));
                    }
                } else {
                    if (deltaY > 50) {
                        // Swipe down
                        document.dispatchEvent(new CustomEvent('swipeDown'));
                    } else if (deltaY < -50) {
                        // Swipe up
                        document.dispatchEvent(new CustomEvent('swipeUp'));
                    }
                }
            });
        }
    }

    // Setup keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle escape key
            if (e.key === 'Escape') {
                closeModals();
                closeDropdowns();
            }
            
            // Handle arrow keys for navigation
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                handleArrowKeyNavigation(e);
            }
        });
    }

    // Setup form interactions
    function setupFormInteractions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add form validation
            form.addEventListener('submit', handleFormSubmit);
            
            // Add input enhancements
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', (e) => {
                    e.target.classList.add('focused');
                });
                
                input.addEventListener('blur', (e) => {
                    e.target.classList.remove('focused');
                });
            });
        });
    }

    // Setup lazy loading
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Optimize animations
    function optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-animations');
        }
        
        // Pause animations when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused-animations');
            } else {
                document.body.classList.remove('paused-animations');
            }
        });
    }

    // Setup resource hints
    function setupResourceHints() {
        // Preload critical resources
        const criticalResources = [
            'images/hero-bg.jpg',
            'images/logo.png',
            'fonts/fa-solid-900.woff2'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = getResourceType(resource);
            document.head.appendChild(link);
        });
    }

    // Get resource type
    function getResourceType(url) {
        const extension = url.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return 'image';
            case 'woff':
            case 'woff2':
            case 'ttf':
            case 'otf':
                return 'font';
            case 'css':
                return 'style';
            case 'js':
                return 'script';
            default:
                return 'fetch';
        }
    }

    // Setup analytics
    function setupAnalytics() {
        // Initialize analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_complete', {
                'load_time': Date.now() - loadingStartTime,
                'page_title': document.title
            });
        }
    }

    // Setup error handling
    function setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('PageantEmpress Error:', e.error);
            
            // Report error to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    'description': e.error.message,
                    'fatal': false
                });
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('PageantEmpress Unhandled Promise Rejection:', e.reason);
        });
    }

    // Perform final checks
    function performFinalChecks() {
        // Check for missing critical elements
        const criticalElements = [
            'header',
            'nav',
            'main',
            'footer'
        ];
        
        criticalElements.forEach(selector => {
            if (!document.querySelector(selector)) {
                console.warn(`Critical element missing: ${selector}`);
            }
        });
        
        // Check for accessibility issues
        checkAccessibility();
    }

    // Check accessibility
    function checkAccessibility() {
        // Check for images without alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            console.warn('Images without alt text found:', imagesWithoutAlt.length);
        }
        
        // Check for buttons without labels
        const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([title])');
        if (buttonsWithoutLabels.length > 0) {
            console.warn('Buttons without labels found:', buttonsWithoutLabels.length);
        }
    }

    // Trigger entrance animations
    function triggerEntranceAnimations() {
        const entranceElements = document.querySelectorAll('[data-entrance]');
        
        entranceElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('entrance-active');
            }, index * 100);
        });
    }

    // Initialize page-specific features
    function initializePageSpecificFeatures() {
        const pageType = document.body.getAttribute('data-page-type');
        
        switch (pageType) {
            case 'home':
                initializeHomePage();
                break;
            case 'gallery':
                initializeGalleryPage();
                break;
            case 'contest':
                initializeContestPage();
                break;
            case 'profile':
                initializeProfilePage();
                break;
            default:
                initializeDefaultPage();
        }
    }

    // Initialize home page
    function initializeHomePage() {
        console.log('🎭 PageantEmpress: Initializing home page features...');
        
        // Initialize hero slider
        if (document.querySelector('.hero-slider')) {
            initializeHeroSlider();
        }
        
        // Initialize featured contests
        if (document.querySelector('.featured-contests')) {
            initializeFeaturedContests();
        }
    }

        // Initialize gallery page
    function initializeGalleryPage() {
        console.log('🎭 PageantEmpress: Initializing gallery page features...');
        
        // Initialize image gallery
        if (document.querySelector('.image-gallery')) {
            initializeImageGallery();
        }
        
        // Initialize filtering
        if (document.querySelector('.gallery-filters')) {
            initializeGalleryFilters();
        }
        
        // Initialize lightbox
        initializeLightbox();
    }

    // Initialize contest page
    function initializeContestPage() {
        console.log('🎭 PageantEmpress: Initializing contest page features...');
        
        // Initialize voting system
        if (document.querySelector('.voting-system')) {
            initializeVotingSystem();
        }
        
        // Initialize contestant grid
        if (document.querySelector('.contestant-grid')) {
            initializeContestantGrid();
        }
        
        // Initialize live updates
        initializeLiveUpdates();
    }

    // Initialize profile page
    function initializeProfilePage() {
        console.log('🎭 PageantEmpress: Initializing profile page features...');
        
        // Initialize profile editor
        if (document.querySelector('.profile-editor')) {
            initializeProfileEditor();
        }
        
        // Initialize photo upload
        if (document.querySelector('.photo-upload')) {
            initializePhotoUpload();
        }
        
        // Initialize achievement system
        initializeAchievements();
    }

    // Initialize default page
    function initializeDefaultPage() {
        console.log('🎭 PageantEmpress: Initializing default page features...');
        
        // Initialize common components
        initializeCommonComponents();
    }

    // Initialize hero slider
    function initializeHeroSlider() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;
        
        const slides = slider.querySelectorAll('.slide');
        const indicators = slider.querySelectorAll('.indicator');
        let currentSlide = 0;
        
        // Auto-advance slides
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000);
        
        // Update slider
        function updateSlider() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Initialize slider
        updateSlider();
    }

    // Initialize featured contests
    function initializeFeaturedContests() {
        const container = document.querySelector('.featured-contests');
        if (!container) return;
        
        // Add hover effects
        const cards = container.querySelectorAll('.contest-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Initialize image gallery
    function initializeImageGallery() {
        const gallery = document.querySelector('.image-gallery');
        if (!gallery) return;
        
        // Create masonry layout
        const masonry = new Masonry(gallery, {
            itemSelector: '.gallery-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: 20
        });
        
        // Layout after images load
        imagesLoaded(gallery, () => {
            masonry.layout();
        });
    }

    // Initialize gallery filters
    function initializeGalleryFilters() {
        const filters = document.querySelector('.gallery-filters');
        if (!filters) return;
        
        const filterButtons = filters.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    const shouldShow = filter === 'all' || item.classList.contains(filter);
                    item.style.display = shouldShow ? 'block' : 'none';
                });
            });
        });
    }

    // Initialize lightbox
    function initializeLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add event listeners
        const images = document.querySelectorAll('.gallery-item img');
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                openLightbox(index);
            });
        });
        
        // Lightbox controls
        let currentImageIndex = 0;
        
        function openLightbox(index) {
            currentImageIndex = index;
            const img = images[index];
            lightbox.querySelector('.lightbox-image').src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            }
        });
        
        function navigateLightbox(direction) {
            currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
            openLightbox(currentImageIndex);
        }
    }

    // Initialize voting system
    function initializeVotingSystem() {
        const votingButtons = document.querySelectorAll('.vote-btn');
        
        votingButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const contestantId = button.dataset.contestantId;
                const voteType = button.dataset.voteType;
                
                // Disable button during voting
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Voting...';
                
                try {
                    // Send vote to server
                    const response = await fetch('/api/vote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contestantId,
                            voteType
                        })
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        
                        // Update vote count
                        const voteCount = button.querySelector('.vote-count');
                        if (voteCount) {
                            voteCount.textContent = result.newCount;
                        }
                        
                        // Show success animation
                        button.classList.add('vote-success');
                        setTimeout(() => {
                            button.classList.remove('vote-success');
                        }, 2000);
                        
                        // Fire vote event
                        document.dispatchEvent(new CustomEvent('votecast', {
                            detail: { contestantId, voteType, newCount: result.newCount }
                        }));
                    } else {
                        throw new Error('Vote failed');
                    }
                } catch (error) {
                    console.error('Voting error:', error);
                    
                    // Show error state
                    button.classList.add('vote-error');
                    setTimeout(() => {
                        button.classList.remove('vote-error');
                    }, 2000);
                } finally {
                    // Re-enable button
                    button.disabled = false;
                    button.innerHTML = `<i class="fas fa-heart"></i> Vote`;
                }
            });
        });
    }

    // Initialize contestant grid
    function initializeContestantGrid() {
        const grid = document.querySelector('.contestant-grid');
        if (!grid) return;
        
        // Initialize infinite scroll
        let loading = false;
        let page = 1;
        
        window.addEventListener('scroll', () => {
            if (loading) return;
            
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 1000) {
                loadMoreContestants();
            }
        });
        
        async function loadMoreContestants() {
            loading = true;
            
            try {
                const response = await fetch(`/api/contestants?page=${page + 1}`);
                const data = await response.json();
                
                if (data.contestants && data.contestants.length > 0) {
                    data.contestants.forEach(contestant => {
                        const card = createContestantCard(contestant);
                        grid.appendChild(card);
                    });
                    
                    page++;
                }
            } catch (error) {
                console.error('Failed to load more contestants:', error);
            } finally {
                loading = false;
            }
        }
        
        function createContestantCard(contestant) {
            const card = document.createElement('div');
            card.className = 'contestant-card';
            card.innerHTML = `
                <div class="contestant-image">
                    <img src="${contestant.image}" alt="${contestant.name}">
                    <div class="contestant-overlay">
                        <button class="btn btn-primary vote-btn" data-contestant-id="${contestant.id}">
                            <i class="fas fa-heart"></i>
                            Vote
                        </button>
                    </div>
                </div>
                <div class="contestant-info">
                    <h3>${contestant.name}</h3>
                    <p>${contestant.title}</p>
                    <div class="contestant-stats">
                        <span class="vote-count">${contestant.votes}</span> votes
                    </div>
                </div>
            `;
            return card;
        }
    }

    // Initialize live updates
    function initializeLiveUpdates() {
        if (typeof io !== 'undefined') {
            const socket = io();
            
            socket.on('voteUpdate', (data) => {
                // Update vote counts in real-time
                const voteElements = document.querySelectorAll(`[data-contestant-id="${data.contestantId}"] .vote-count`);
                voteElements.forEach(element => {
                    element.textContent = data.newCount;
                });
            });
            
            socket.on('newContestant', (data) => {
                // Add new contestant to grid
                const grid = document.querySelector('.contestant-grid');
                if (grid) {
                    const card = createContestantCard(data.contestant);
                    grid.prepend(card);
                }
            });
        }
    }

    // Initialize profile editor
    function initializeProfileEditor() {
        const form = document.querySelector('.profile-form');
        if (!form) return;
        
        // Auto-save functionality
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(autoSave, 2000));
        });
        
        async function autoSave() {
            const formData = new FormData(form);
            
            try {
                const response = await fetch('/api/profile/auto-save', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showNotification('Profile auto-saved', 'success');
                }
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }
    }

    // Initialize photo upload
    function initializePhotoUpload() {
        const uploadZone = document.querySelector('.photo-upload-zone');
        if (!uploadZone) return;
        
        const fileInput = uploadZone.querySelector('input[type="file"]');
        const preview = uploadZone.querySelector('.photo-preview');
        
        // Drag and drop functionality
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
        
        async function handleFileUpload(file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showNotification('File size must be less than 5MB', 'error');
                return;
            }
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
            
            // Upload file
            const formData = new FormData();
            formData.append('photo', file);
            
            try {
                const response = await fetch('/api/profile/upload-photo', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const result = await response.json();
                    showNotification('Photo uploaded successfully', 'success');
                    
                    // Update profile photo
                    const profilePhotos = document.querySelectorAll('.profile-photo');
                    profilePhotos.forEach(photo => {
                        photo.src = result.photoUrl;
                    });
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                showNotification('Upload failed. Please try again.', 'error');
            }
        }
    }

    // Initialize achievements
    function initializeAchievements() {
        const achievementElements = document.querySelectorAll('.achievement');
        
        achievementElements.forEach(achievement => {
            const progress = achievement.dataset.progress || 0;
            const progressBar = achievement.querySelector('.progress-bar');
            
            if (progressBar) {
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.width = `${progress}%`;
                }, 500);
            }
            
            // Add unlock animation for completed achievements
            if (progress >= 100) {
                achievement.classList.add('unlocked');
            }
        });
    }

    // Initialize common components
    function initializeCommonComponents() {
        // Initialize tooltips
        initializeTooltips();
        
        // Initialize modals
        initializeModals();
        
        // Initialize dropdowns
        initializeDropdowns();
        
        // Initialize search
        initializeSearch();
        
        // Initialize notifications
        initializeNotifications();
    }

    // Initialize tooltips
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            element.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - 40}px`;
                tooltip.classList.add('visible');
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    // Initialize modals
    function initializeModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    openModal(modal);
                }
            });
        });
        
        // Close modal functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                closeModal(e.target.closest('.modal'));
            }
        });
    }

    // Initialize dropdowns
    function initializeDropdowns() {
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
        
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = trigger.nextElementSibling;
                
                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                const activeDropdowns = document.querySelectorAll('.dropdown-menu.active');
                activeDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    // Initialize search
    function initializeSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', debounce(handleSearch, 300));
        });
        
        async function handleSearch(e) {
            const query = e.target.value.trim();
            const resultsContainer = document.querySelector('.search-results');
            
            if (query.length < 2) {
                if (resultsContainer) {
                    resultsContainer.innerHTML = '';
                }
                return;
            }
            
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                
                if (resultsContainer) {
                    renderSearchResults(results, resultsContainer);
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        }
        
        function renderSearchResults(results, container) {
            container.innerHTML = '';
            
            if (results.length === 0) {
                container.innerHTML = '<div class="search-no-results">No results found</div>';
                return;
            }
            
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'search-result';
                resultElement.innerHTML = `
                    <div class="search-result-image">
                        <img src="${result.image}" alt="${result.title}">
                    </div>
                    <div class="search-result-content">
                        <h4>${result.title}</h4>
                        <p>${result.description}</p>
                        <a href="${result.url}" class="search-result-link">View Details</a>
                    </div>
                `;
                container.appendChild(resultElement);
            });
        }
    }

    // Initialize notifications
    function initializeNotifications() {
        // Create notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Make showNotification available globally
        window.showNotification = function(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">
                        <i class="fas fa-${getNotificationIcon(type)}"></i>
                    </div>
                    <div class="notification-message">${message}</div>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            notificationContainer.appendChild(notification);
            
            // Auto-remove notification
            setTimeout(() => {
                removeNotification(notification);
            }, duration);
            
            // Close button functionality
            notification.querySelector('.notification-close').addEventListener('click', () => {
                removeNotification(notification);
            });
        };
        
        function getNotificationIcon(type) {
            switch (type) {
                case 'success': return 'check-circle';
                case 'error': return 'exclamation-circle';
                case 'warning': return 'exclamation-triangle';
                default: return 'info-circle';
            }
        }
        
        function removeNotification(notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Setup global event listeners
    function setupGlobalEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause non-essential animations
                document.body.classList.add('page-hidden');
            } else {
                // Resume animations
                document.body.classList.remove('page-hidden');
            }
        });
        
        // Handle connection status
        window.addEventListener('online', () => {
            showNotification('Connection restored', 'success');
            document.body.classList.remove('offline');
        });
        
        window.addEventListener('offline', () => {
            showNotification('Connection lost', 'warning');
            document.body.classList.add('offline');
        });
        
        // Handle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 100);
        });
    }

    // Utility functions
    function debounce(func, wait) {
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

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeModals() {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => closeModal(modal));
    }

    function closeDropdowns() {
        const activeDropdowns = document.querySelectorAll('.dropdown-menu.active');
        activeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    function handleArrowKeyNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            focusableElements[prevIndex].focus();
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Disable submit button during submission
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }
        
        // Here you would typically send the form data to your server
        // For now, we'll just simulate a successful submission
        setTimeout(() => {
            showNotification('Form submitted successfully!', 'success');
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit';
            }
            
            // Reset form if needed
            form.reset();
        }, 1000);
    }

    function triggerPageTransition(href) {
        // Add page transition effect
        document.body.classList.add('page-transition');
        
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }

    function finalSetup() {
        // Mark initialization as complete
        document.body.classList.add('pageant-ready');
        
        // Remove loading classes
        document.body.classList.remove('loading', 'preloading');
        
        // Add entrance animations
        setTimeout(() => {
            document.body.classList.add('entrance-complete');
        }, 100);
        
        // Log completion
        console.log('🎭 PageantEmpress: Initialization complete!');
        console.log(`⏱️  Total load time: ${Date.now() - loadingStartTime}ms`);
    }

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPreloader);
    } else {
        initPreloader();
    }

    // Expose PageantEmpress API
    window.PageantEmpress = window.PageantEmpress || {};
    Object.assign(window.PageantEmpress, {
        version: '2025.1.0',
        initialized: false,
        
        // API methods
        showNotification,
        openModal,
        closeModal,
        
        // Events
        on: function(event, callback) {
            document.addEventListener(event, callback);
        },
        
        off: function(event, callback) {
            document.removeEventListener(event, callback);
        },
        
        // Utilities
        debounce,
        
        // Ready callback
        ready: function(callback) {
            if (this.initialized) {
                callback();
            } else {
                document.addEventListener('pageantReady', callback);
            }
        }
    });

    // Mark as initialized when ready
    document.addEventListener('pageantReady', () => {
        window.PageantEmpress.initialized = true;
    });

})();

// Additional CSS for enhanced preloader experience
const additionalCSS = `
/* Enhanced Preloader Styles */
.preloader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    opacity: 1;
    transition: opacity 0.8s ease;
}

.preloader.fade-out {
    opacity: 0;
    pointer-events: none;
}

.preloader-content {
    text-align: center;
    color: white;
    position: relative;
    z-index: 2;
}

.crown-spinner {
    font-size: 4rem;
    color: #d4af37;
    margin-bottom: 2rem;
    animation: crown-spin 2s linear infinite;
}

@keyframes crown-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-bar {
    width: 300px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 2rem auto;
    position: relative;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(45deg, #d4af37, #f1c40f);
    border-radius: 2px;
    transition: width 0.3s ease;
}

.loading-stage {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    opacity: 0.8;
}

.progress-text {
    font-size: 0.9rem;
    color: #d4af37;
    font-weight: 600;
}

.sparkle {
    position: absolute;
    color: #f1c40f;
    opacity: 0;
    animation: sparkle-twinkle 2s ease-in-out infinite;
}

@keyframes sparkle-twinkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
}

/* Experience Overlay */
.experience-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 99
/* Experience Overlay Continued */
.experience-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 99998;
    opacity: 1;
    transition: opacity 0.8s ease;
}

.experience-overlay.active {
    display: flex;
}

.experience-overlay.fade-out {
    opacity: 0;
    pointer-events: none;
}

.experience-content {
    text-align: center;
    color: white;
    max-width: 500px;
    padding: 2rem;
}

.experience-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #d4af37;
    font-weight: 700;
}

.experience-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.experience-progress {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin: 2rem 0;
    position: relative;
}

.experience-progress::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(45deg, #d4af37, #f1c40f);
    border-radius: 3px;
    transition: width 0.5s ease;
    width: 0%;
}

.experience-steps {
    margin-top: 2rem;
}

.experience-step {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    opacity: 0.5;
    transition: all 0.3s ease;
}

.experience-step.completed {
    opacity: 1;
    color: #27ae60;
}

.experience-step i {
    margin-right: 1rem;
    width: 20px;
    text-align: center;
}

.step-check {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.experience-step.completed .step-check {
    opacity: 1;
}

/* Notification System */
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100000;
    max-width: 400px;
}

.notification {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 10px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 15px;
}

.notification-icon {
    margin-right: 15px;
    font-size: 1.2rem;
}

.notification-message {
    flex: 1;
    font-size: 0.9rem;
    line-height: 1.4;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    margin-left: 15px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.notification-close:hover {
    opacity: 1;
}

.notification-success {
    border-left: 4px solid #27ae60;
}

.notification-success .notification-icon {
    color: #27ae60;
}

.notification-error {
    border-left: 4px solid #e74c3c;
}

.notification-error .notification-icon {
    color: #e74c3c;
}

.notification-warning {
    border-left: 4px solid #f39c12;
}

.notification-warning .notification-icon {
    color: #f39c12;
}

.notification-info {
    border-left: 4px solid #3498db;
}

.notification-info .notification-icon {
    color: #3498db;
}

/* Modal System */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.modal.active .modal-content {
    transform: scale(1);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 1.5rem;
    margin: 0;
    color: #2c3e50;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #7f8c8d;
    padding: 0;
    transition: color 0.2s ease;
}

.modal-close:hover {
    color: #2c3e50;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* Tooltip System */
.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.8rem;
    z-index: 10001;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    transform: translateX(-50%) translateY(-5px);
    pointer-events: none;
}

.tooltip.visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
}

/* Dropdown System */
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
}

.dropdown-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: block;
    padding: 12px 16px;
    text-decoration: none;
    color: #2c3e50;
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

/* Search Results */
.search-results {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-height: 400px;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
}

.search-result {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
}

.search-result:hover {
    background-color: #f8f9fa;
}

.search-result:last-child {
    border-bottom: none;
}

.search-result-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
    flex-shrink: 0;
}

.search-result-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.search-result-content {
    flex: 1;
}

.search-result-content h4 {
    margin: 0 0 5px 0;
    font-size: 1rem;
    color: #2c3e50;
}

.search-result-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #7f8c8d;
}

.search-result-link {
    color: #d4af37;
    text-decoration: none;
    font-weight: 500;
    margin-left: 15px;
}

.search-no-results {
    padding: 20px;
    text-align: center;
    color: #7f8c8d;
}

/* Voting System */
.vote-btn {
    background: linear-gradient(45deg, #d4af37, #f1c40f);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    position: relative;
    overflow: hidden;
}

.vote-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.vote-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.vote-btn.vote-success {
    background: linear-gradient(45deg, #27ae60, #2ecc71);
    animation: voteSuccess 0.3s ease;
}

@keyframes voteSuccess {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.vote-btn.vote-error {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    animation: voteError 0.3s ease;
}

@keyframes voteError {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Lightbox */
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.lightbox.active {
    opacity: 1;
    visibility: visible;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

.lightbox-prev,
.lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lightbox-prev {
    left: 20px;
}

.lightbox-next {
    right: 20px;
}

.lightbox-prev:hover,
.lightbox-next:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Form Enhancements */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
}

.form-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.form-input.focused {
    border-color: #d4af37;
}

.form-input.error {
    border-color: #e74c3c;
}

.form-error {
    color: #e74c3c;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

/* Photo Upload */
.photo-upload-zone {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    transition: border-color 0.3s ease;
    cursor: pointer;
}

.photo-upload-zone:hover {
    border-color: #d4af37;
}

.photo-upload-zone.drag-over {
    border-color: #d4af37;
    background-color: rgba(212, 175, 55, 0.1);
}

.photo-preview {
    margin-top: 20px;
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;
}

.photo-preview img {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

/* Achievement System */
.achievement {
    background: white;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
}

.achievement.unlocked {
    border-color: #d4af37;
    background: linear-gradient(135deg, #fff9e6, #ffffff);
    transform: scale(1.02);
}

.achievement-icon {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #7f8c8d;
}

.achievement.unlocked .achievement-icon {
    color: #d4af37;
    animation: achievementUnlock 0.5s ease;
}

@keyframes achievementUnlock {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.achievement-title {
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: #2c3e50;
}

.achievement-description {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 15px;
}

.achievement-progress {
    background: #f8f9fa;
    border-radius: 10px;
    height: 8px;
    overflow: hidden;
}

.achievement-progress .progress-bar {
    height: 100%;
    background: linear-gradient(45deg, #d4af37, #f1c40f);
    transition: width 0.5s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
    .preloader-content {
        padding: 20px;
    }
    
    .crown-spinner {
        font-size: 3rem;
    }
    
    .progress-bar {
        width: 250px;
    }
    
    .experience-title {
        font-size: 2rem;
    }
    
    .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .modal-content {
        margin: 10px;
        max-width: calc(100% - 20px);
    }
    
    .lightbox-prev,
    .lightbox-next {
        width: 40px;
        height: 40px;
    }
    
    .lightbox-prev {
        left: 10px;
    }
    
    .lightbox-next {
        right: 10px;
    }
    
    .photo-upload-zone {
        padding: 30px 20px;
    }
}

/* Performance Optimizations */
.pageant-ready * {
    will-change: auto;
}

.page-transition {
    transition: opacity 0.3s ease;
}

.page-transition * {
    pointer-events: none;
}

.page-hidden .crown-spinner {
    animation-play-state: paused;
}

.reduced-animations * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}

.paused-animations * {
    animation-play-state: paused !important;
}

/* Offline Styles */
.offline {
    filter: grayscale(50%);
}

.offline::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 9999;
    pointer-events: none;
}

/* Scrolling Optimizations */
.scrolling .crown-spinner {
    animation-play-state: paused;
}

.scrolling .sparkle {
    animation-play-state: paused;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    .modal-content {
        background: #2c3e50;
        color: white;
    }
    
    .modal-header {
        border-color: #34495e;
    }
    
    .modal-footer {
        border-color: #34495e;
    }
    
    .dropdown-menu {
        background: #2c3e50;
        border-color: #34495e;
        color: white;
    }
    
    .dropdown-item {
        color: white;
    }
    
    .dropdown-item:hover {
        background-color: #34495e;
    }
    
    .search-results {
        background: #2c3e50;
        border-color: #34495e;
        color: white;
    }
    
    .search-result:hover {
        background-color: #34495e;
    }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
    .preloader {
        background: #000000;
    }
    
    .crown-spinner {
        color: #ffff00;
    }
    
    .progress-bar::after {
        background: #ffff00;
    }
    
    .vote-btn {
        background: #ffff00;
        color: #000000;
    }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .crown-spinner {
        animation: none;
    }
    
    .sparkle {
        animation: none;
        opacity: 0.5;
    }
}

/* Print Styles */
@media print {
    .preloader,
    .experience-overlay,
    .notification-container,
    .modal,
    .lightbox,
    .tooltip {
        display: none !important;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PageantEmpress;
}
