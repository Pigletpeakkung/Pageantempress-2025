/* ===== MAIN.JS - ENHANCED LUXURY WEBSITE CORE FUNCTIONALITY ===== */

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
    animation: {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100,
        parallaxSpeed: 0.5
    },
    ui: {
        debounceDelay: 250,
        throttleDelay: 16,
        modalTransition: 300,
        notificationDuration: 4000
    },
    features: {
        smoothScroll: true,
        parallax: true,
        animations: true,
        autoplay: true,
        lazyLoading: true
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};

// ===== GLOBAL STATE MANAGEMENT =====
class LuxuryWebsite {
    constructor() {
        this.state = {
            isLoading: true,
            currentPage: '',
            viewport: this.getViewport(),
            user: {
                preferences: this.loadPreferences(),
                session: this.initializeSession()
            },
            ui: {
                activeModal: null,
                navigationOpen: false,
                searchOpen: false,
                notificationCount: 0
            },
            performance: {
                loadTime: 0,
                animations: [],
                observers: []
            }
        };
        
        this.components = new Map();
        this.eventListeners = new Map();
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.loadCriticalResources();
        this.startPerformanceMonitoring();
    }
    
    // ===== COMPONENT MANAGEMENT =====
    registerComponent(name, instance) {
        this.components.set(name, instance);
        console.log(`Component registered: ${name}`);
    }
    
    getComponent(name) {
        return this.components.get(name);
    }
    
    // ===== EVENT MANAGEMENT =====
    addEventListener(element, event, handler, options = {}) {
        const key = `${element.constructor.name}-${event}`;
        
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        
        this.eventListeners.get(key).push({ element, handler, options });
        element.addEventListener(event, handler, options);
    }
    
    removeEventListener(element, event, handler) {
        const key = `${element.constructor.name}-${event}`;
        const listeners = this.eventListeners.get(key) || [];
        
        const index = listeners.findIndex(l => l.element === element && l.handler === handler);
        if (index > -1) {
            listeners.splice(index, 1);
            element.removeEventListener(event, handler);
        }
    }
    
    // ===== UTILITY METHODS =====
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            type: window.innerWidth < CONFIG.breakpoints.mobile ? 'mobile' :
                  window.innerWidth < CONFIG.breakpoints.tablet ? 'tablet' : 'desktop'
        };
    }
    
    loadPreferences() {
        const defaults = {
            theme: 'luxury',
            animations: true,
            autoplay: true,
            reducedMotion: false,
            language: 'en'
        };
        
        try {
            const saved = localStorage.getItem('luxuryWebsitePreferences');
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return defaults;
        }
    }
    
    savePreferences(preferences) {
        try {
            this.state.user.preferences = { ...this.state.user.preferences, ...preferences };
            localStorage.setItem('luxuryWebsitePreferences', JSON.stringify(this.state.user.preferences));
            this.applyPreferences();
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }
    
    applyPreferences() {
        const { preferences } = this.state.user;
        
        document.documentElement.classList.toggle('animations-disabled', !preferences.animations);
        document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);
        document.documentElement.setAttribute('data-theme', preferences.theme);
        
        // Apply to components
        this.components.forEach(component => {
            if (component.applyPreferences) {
                component.applyPreferences(preferences);
            }
        });
    }
    
    initializeSession() {
        return {
            id: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 0,
            interactions: 0
        };
    }
    
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// ===== INITIALIZE GLOBAL INSTANCE =====
const luxuryWebsite = new LuxuryWebsite();
window.LuxuryWebsite = luxuryWebsite;

// ===== CORE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing Luxury Website...');
        
        // Initialize core components
        initializeCoreComponents();
        
        // Initialize UI components
        initializeUIComponents();
        
        // Initialize interactive features
        initializeInteractiveFeatures();
        
        // Initialize performance monitoring
        initializePerformanceMonitoring();
        
        // Initialize accessibility features
        initializeAccessibilityFeatures();
        
        // Initialize error handling
        initializeErrorHandling();
        
        console.log('✨ Luxury Website initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing website:', error);
        handleInitializationError(error);
    }
});

// ===== CORE COMPONENTS =====
function initializeCoreComponents() {
    // Loading Screen
    const loadingScreen = new LoadingScreen();
    luxuryWebsite.registerComponent('loadingScreen', loadingScreen);
    
    // Navigation
    const navigation = new Navigation();
    luxuryWebsite.registerComponent('navigation', navigation);
    
    // Scroll Manager
    const scrollManager = new ScrollManager();
    luxuryWebsite.registerComponent('scrollManager', scrollManager);
    
    // Theme Manager
    const themeManager = new ThemeManager();
    luxuryWebsite.registerComponent('themeManager', themeManager);
    
    // Modal System
    const modalSystem = new ModalSystem();
    luxuryWebsite.registerComponent('modalSystem', modalSystem);
    
    // Notification System
    const notificationSystem = new NotificationSystem();
    luxuryWebsite.registerComponent('notificationSystem', notificationSystem);
}

// ===== LOADING SCREEN COMPONENT =====
class LoadingScreen {
    constructor() {
        this.element = document.querySelector('.loading-screen');
        this.progress = 0;
        this.isVisible = true;
        this.init();
    }
    
    init() {
        if (!this.element) {
            this.createLoadingScreen();
        }
        
        this.bindEvents();
        this.startProgressSimulation();
    }
    
    createLoadingScreen() {
        this.element = document.createElement('div');
        this.element.className = 'loading-screen';
        this.element.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <img src="/images/logo-luxury.svg" alt="Luxury Logo" />
                </div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Loading... <span class="progress-percentage">0%</span></div>
                </div>
                <div class="loading-animation">
                    <div class="luxury-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.element);
        this.element.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 1;
            transition: opacity 0.5s ease;
        `;
    }
    
    bindEvents() {
        // Monitor actual loading progress
        this.monitorResourceLoading();
        
        // Handle window load
        window.addEventListener('load', () => {
            this.setProgress(100);
            setTimeout(() => this.hide(), 500);
        });
    }
    
    monitorResourceLoading() {
        const resources = [
            ...document.querySelectorAll('img'),
            ...document.querySelectorAll('video'),
            ...document.querySelectorAll('audio'),
            ...document.querySelectorAll('iframe')
        ];
        
        let loadedCount = 0;
        const totalResources = resources.length;
        
        if (totalResources === 0) {
            this.setProgress(50);
            return;
        }
        
        resources.forEach(resource => {
            if (resource.complete || resource.readyState === 4) {
                loadedCount++;
            } else {
                resource.addEventListener('load', () => {
                    loadedCount++;
                    const progress = Math.floor((loadedCount / totalResources) * 80);
                    this.setProgress(progress);
                });
                
                resource.addEventListener('error', () => {
                    loadedCount++;
                    const progress = Math.floor((loadedCount / totalResources) * 80);
                    this.setProgress(progress);
                });
            }
        });
        
        // Initial progress based on already loaded resources
        const initialProgress = Math.floor((loadedCount / totalResources) * 80);
        this.setProgress(initialProgress);
    }
    
    startProgressSimulation() {
        // Simulate initial loading progress
        let simulatedProgress = 0;
        const interval = setInterval(() => {
            simulatedProgress += Math.random() * 10;
            
            if (simulatedProgress >= 40) {
                clearInterval(interval);
                return;
            }
            
            this.setProgress(Math.min(simulatedProgress, this.progress + 5));
        }, 150);
    }
    
    setProgress(progress) {
        this.progress = Math.max(this.progress, Math.min(progress, 100));
        
        if (this.element) {
            const progressFill = this.element.querySelector('.progress-fill');
            const progressText = this.element.querySelector('.progress-percentage');
            
            if (progressFill) {
                progressFill.style.width = `${this.progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${Math.floor(this.progress)}%`;
            }
        }
    }
    
    hide() {
        if (!this.isVisible) return;
        
        this.isVisible = false;
        this.element.style.opacity = '0';
        
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.remove();
            }
            
            // Trigger loaded event
            document.dispatchEvent(new CustomEvent('websiteLoaded'));
        }, 500);
    }
    
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.element.style.opacity = '1';
        this.setProgress(0);
    }
}

// ===== NAVIGATION COMPONENT =====
class Navigation {
    constructor() {
        this.element = document.querySelector('.main-nav, .navigation');
        this.mobileToggle = document.querySelector('.mobile-nav-toggle, .nav-toggle');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isOpen = false;
        this.scrollPosition = 0;
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.bindEvents();
        this.setupScrollBehavior();
        this.setupActiveLinks();
        this.setupMobileNavigation();
        this.setupAccessibility();
    }
    
    bindEvents() {
        // Mobile toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileNav());
        }
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e, link));
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.element.contains(e.target) && !this.mobileToggle?.contains(e.target)) {
                this.closeMobileNav();
            }
        });
        
        // Close mobile nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMobileNav();
            }
        });
    }
    
    setupScrollBehavior() {
        let lastScrollY = 0;
        let ticking = false;
        
        const updateNavigation = () => {
            const currentScrollY = window.pageYOffset;
            
            // Add/remove scrolled class
            this.element.classList.toggle('scrolled', currentScrollY > 50);
            
            // Hide/show navigation based on scroll direction
            if (currentScrollY > 200) {
                if (currentScrollY > lastScrollY && !this.isOpen) {
                    this.element.classList.add('nav-hidden');
                } else {
                    this.element.classList.remove('nav-hidden');
                }
            } else {
                this.element.classList.remove('nav-hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        }, { passive: true });
    }
    
    setupActiveLinks() {
        // Set active link based on current page
        const currentPath = window.location.pathname;
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (href !== '/' && currentPath.includes(href))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update active link on section scroll
        this.setupSectionScrollDetection();
    }
    
    setupSectionScrollDetection() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`[href="#${sectionId}"]`);
                    
                    if (correspondingLink) {
                        this.navLinks.forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupMobileNavigation() {
        // Set up mobile navigation structure
        const mobileNav = this.element.querySelector('.mobile-nav');
        if (mobileNav) {
            this.setupMobileNavAnimations(mobileNav);
        }
    }
    
    setupMobileNavAnimations(mobileNav) {
        const navItems = mobileNav.querySelectorAll('.nav-item');
        
        navItems.forEach((item, index) => {
            item.style.transform = 'translateX(-100%)';
            item.style.opacity = '0';
            item.style.transition = `transform 0.3s ease ${index * 0.1}s, opacity 0.3s ease ${index * 0.1}s`;
        });
    }
    
    handleLinkClick(e, link) {
        const href = link.getAttribute('href');
        
        // Handle hash links (smooth scroll)
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                this.scrollToSection(target);
            }
        }
        
        // Close mobile nav after clicking
        if (this.isOpen) {
            this.closeMobileNav();
        }
    }
    
    scrollToSection(target) {
        const headerHeight = this.element.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    toggleMobileNav() {
        if (this.isOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }
    
    openMobileNav() {
        this.isOpen = true;
        this.element.classList.add('nav-open');
        document.body.classList.add('nav-open');
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.add('active');
            this.mobileToggle.setAttribute('aria-expanded', 'true');
        }
        
        // Animate mobile nav items
        const navItems = this.element.querySelectorAll('.mobile-nav .nav-item');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 100);
        });
    }
    
    closeMobileNav() {
        this.isOpen = false;
        this.element.classList.remove('nav-open');
        document.body.classList.remove('nav-open');
        
        if (this.mobileToggle) {
            this.mobileToggle.classList.remove('active');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Reset mobile nav items
        const navItems = this.element.querySelectorAll('.mobile-nav .nav-item');
        navItems.forEach(item => {
            item.style.transform = 'translateX(-100%)';
            item.style.opacity = '0';
        });
    }
    
    setupAccessibility() {
        // Add ARIA attributes
        if (this.mobileToggle) {
            this.mobileToggle.setAttribute('aria-controls', 'mobile-navigation');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
        }
        
        const mobileNav = this.element.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.setAttribute('id', 'mobile-navigation');
            mobileNav.setAttribute('aria-hidden', 'true');
        }
        
        // Focus management
        this.setupFocusManagement();
    }
    
    setupFocusManagement() {
        const focusableElements = this.element.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            // Trap focus in mobile navigation
            this.element.addEventListener('keydown', (e) => {
                if (!this.isOpen || e.key !== 'Tab') return;
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }
}

// ===== SCROLL MANAGER COMPONENT =====
class ScrollManager {
    constructor() {
        this.scrollTop = 0;
        this.isScrolling = false;
        this.scrollDirection = 'down';
        this.scrollSpeed = 0;
        this.callbacks = {
            scroll: [],
            scrollStart: [],
            scrollEnd: []
        };
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupScrollIndicator();
        this.setupSmoothScroll();
    }
    
    bindEvents() {
        let scrollTimer;
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset;
            
            // Determine scroll direction and speed
            this.scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
            this.scrollSpeed = Math.abs(currentScrollTop - lastScrollTop);
            this.scrollTop = currentScrollTop;
            
            // Trigger scroll start
            if (!this.isScrolling) {
                this.isScrolling = true;
                this.triggerCallbacks('scrollStart');
            }
            
            // Trigger scroll callbacks
            this.triggerCallbacks('scroll');
            
            // Clear existing timer
            clearTimeout(scrollTimer);
            
            // Set timer to detect scroll end
            scrollTimer = setTimeout(() => {
                this.isScrolling = false;
                this.triggerCallbacks('scrollEnd');
            }, 150);
            
            lastScrollTop = currentScrollTop;
        }, { passive: true });
    }
    
    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) {
            this.createScrollIndicator();
        }
        
        this.onScroll(() => {
            this.updateScrollIndicator();
        });
    }
    
    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = `
            <div class="scroll-progress"></div>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const progress = indicator.querySelector('.scroll-progress');
        progress.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #D4AF37, #FFD700);
            width: 0%;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(indicator);
        this.scrollIndicator = indicator;
    }
    
    updateScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        const progress = this.scrollIndicator.querySelector('.scroll-progress');
        const scrollPercent = (this.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        progress.style.width = `${Math.min(scrollPercent, 100)}%`;
        
        // Show/hide indicator based on scroll position
        if (this.scrollTop > 100) {
            this.scrollIndicator.style.opacity = '1';
        } else {
            this.scrollIndicator.style.opacity = '0';
        }
    }
    
    setupSmoothScroll() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            this.scrollToElement(target);
        });
    }
    
    scrollToElement(element, offset = 0) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = elementTop - offset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event system
    onScroll(callback) {
        this.callbacks.scroll.push(callback);
    }
    
    onScrollStart(callback) {
        this.callbacks.scrollStart.push(callback);
    }
    
    onScrollEnd(callback) {
        this.callbacks.scrollEnd.push(callback);
    }
    
    triggerCallbacks(event) {
        this.callbacks[event].forEach(callback => callback(this.getScrollData()));
    }
    
    getScrollData() {
        return {
            scrollTop: this.scrollTop,
            scrollDirection: this.scrollDirection,
            scrollSpeed: this.scrollSpeed,
            isScrolling: this.isScrolling,
            scrollPercent: (this.scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        };
    }
}

// ===== THEME MANAGER COMPONENT =====
class ThemeManager {
    constructor() {
        this.themes = {
            luxury: {
                primary: '#D4AF37',
                secondary: '#1A1A1A',
                accent: '#FFD700',
                background: '#000000',
                text: '#FFFFFF'
            },
            elegant: {
                primary: '#8B4513',
                secondary: '#2F2F2F',
                accent: '#CD853F',
                background: '#1A1A1A',
                text: '#F5F5F5'
            },
            modern: {
                primary: '#4A90E2',
                secondary: '#2C3E50',
                accent: '#3498DB',
                background: '#34495E',
                text: '#ECF0F1'
            }
        };
        
        this.currentTheme = 'luxury';
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.setupThemeToggle();
        this.setupCustomProperties();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        }
    }
    
    setTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Update CSS custom properties
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });
        
        // Update body class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);
        
        // Save theme
        localStorage.setItem('selectedTheme', themeName);
        
        // Trigger theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, colors: theme }
        }));
    }
    
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            const themes = Object.keys(this.themes);
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            
            this.setTheme(themes[nextIndex]);
        });
    }
    
    setupCustomProperties() {
        // Set initial custom properties
        this.setTheme(this.currentTheme);
        
        // Update properties based on system preferences
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark-mode');
            }
        });
        
        // Initial check
        if (mediaQuery.matches) {
            document.documentElement.classList.add('dark-mode');
        }
    }
    
    getTheme(themeName) {
        return this.themes[themeName];
    }
    
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            colors: this.themes[this.currentTheme]
        };
    }
    
    addTheme(name, colors) {
        this.themes[name] = colors;
    }
}

// ===== MODAL SYSTEM COMPONENT =====
class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.modalStack = [];
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAccessibility();
    }
    
    bindEvents() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close();
            }
        });
        
        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-backdrop')) {
                this.close();
            }
        });
    }
    
    create(options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                <div class="modal-header">
                    <h2 id="modal-title" class="modal-title">${options.title || 'Modal'}</h2>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${options.content || ''}
                </div>
                ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
            </div>
        `;
        
        // Add custom classes
        if (options.className) {
            modal.classList.add(options.className);
        }
        
        // Bind close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.close());
                // Add custom event listeners
        if (options.onOpen) {
            modal.addEventListener('modalOpen', options.onOpen);
        }
        
        if (options.onClose) {
            modal.addEventListener('modalClose', options.onClose);
        }
        
        return modal;
    }
    
    open(modal) {
        if (typeof modal === 'string') {
            // If string is passed, look for existing modal
            const existingModal = document.querySelector(modal);
            if (existingModal) {
                modal = existingModal;
            } else {
                console.error('Modal not found:', modal);
                return;
            }
        }
        
        // Store previous modal if exists
        if (this.activeModal) {
            this.modalStack.push(this.activeModal);
        }
        
        this.activeModal = modal;
        
        // Add to DOM if not already present
        if (!modal.parentNode) {
            document.body.appendChild(modal);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Show modal with animation
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        
        // Force reflow
        modal.offsetHeight;
        
        // Animate in
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '1';
        
        const container = modal.querySelector('.modal-container');
        if (container) {
            container.style.transform = 'scale(0.9) translateY(-50px)';
            container.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                container.style.transform = 'scale(1) translateY(0)';
            }, 10);
        }
        
        // Focus management
        this.setupFocusTrap(modal);
        
        // Trigger open event
        modal.dispatchEvent(new CustomEvent('modalOpen'));
        
        return modal;
    }
    
    close(modal = null) {
        const targetModal = modal || this.activeModal;
        if (!targetModal) return;
        
        // Animate out
        targetModal.style.opacity = '0';
        
        const container = targetModal.querySelector('.modal-container');
        if (container) {
            container.style.transform = 'scale(0.9) translateY(-50px)';
        }
        
        // Remove after animation
        setTimeout(() => {
            targetModal.style.display = 'none';
            
            // Remove from DOM if it was created dynamically
            if (targetModal.classList.contains('dynamic-modal')) {
                targetModal.remove();
            }
            
            // Restore previous modal or clear
            if (this.modalStack.length > 0) {
                this.activeModal = this.modalStack.pop();
            } else {
                this.activeModal = null;
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');
            }
            
            // Trigger close event
            targetModal.dispatchEvent(new CustomEvent('modalClose'));
        }, 300);
    }
    
    setupFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        // Trap focus within modal
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    setupAccessibility() {
        // Add ARIA attributes to existing modals
        const existingModals = document.querySelectorAll('.modal');
        existingModals.forEach(modal => {
            if (!modal.getAttribute('role')) {
                modal.setAttribute('role', 'dialog');
            }
            if (!modal.getAttribute('aria-modal')) {
                modal.setAttribute('aria-modal', 'true');
            }
        });
    }
    
    confirm(options = {}) {
        const modal = this.create({
            title: options.title || 'Confirm',
            content: `
                <p>${options.message || 'Are you sure?'}</p>
            `,
            footer: `
                <button class="btn btn-secondary modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">${options.confirmText || 'Confirm'}</button>
            `,
            className: 'modal-confirm dynamic-modal'
        });
        
        return new Promise((resolve) => {
            const handleConfirm = () => {
                this.close(modal);
                resolve(true);
            };
            
            const handleCancel = () => {
                this.close(modal);
                resolve(false);
            };
            
            modal.querySelector('.modal-confirm').addEventListener('click', handleConfirm);
            modal.querySelector('.modal-cancel').addEventListener('click', handleCancel);
            
            this.open(modal);
        });
    }
    
    alert(options = {}) {
        const modal = this.create({
            title: options.title || 'Alert',
            content: `
                <p>${options.message || 'Alert message'}</p>
            `,
            footer: `
                <button class="btn btn-primary modal-ok">OK</button>
            `,
            className: 'modal-alert dynamic-modal'
        });
        
        return new Promise((resolve) => {
            const handleOk = () => {
                this.close(modal);
                resolve();
            };
            
            modal.querySelector('.modal-ok').addEventListener('click', handleOk);
            this.open(modal);
        });
    }
}

// ===== NOTIFICATION SYSTEM COMPONENT =====
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 4000;
        this.init();
    }
    
    init() {
        this.createContainer();
        this.setupGlobalMethod();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.container);
    }
    
    setupGlobalMethod() {
        // Make notification system globally available
        window.showNotification = (message, type = 'info', options = {}) => {
            return this.show(message, type, options);
        };
        
        window.hideNotification = (id) => {
            return this.hide(id);
        };
    }
    
    show(message, type = 'info', options = {}) {
        const notification = this.createNotification(message, type, options);
        
        // Add to array
        this.notifications.push(notification);
        
        // Remove excess notifications
        while (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications.shift();
            this.hide(oldest.id);
        }
        
        // Add to DOM
        this.container.appendChild(notification.element);
        
        // Animate in
        setTimeout(() => {
            notification.element.style.transform = 'translateX(0)';
            notification.element.style.opacity = '1';
        }, 10);
        
        // Auto hide
        if (options.duration !== 0) {
            const duration = options.duration || this.defaultDuration;
            notification.timeout = setTimeout(() => {
                this.hide(notification.id);
            }, duration);
        }
        
        return notification.id;
    }
    
    createNotification(message, type, options) {
        const id = Date.now() + Math.random();
        const notification = document.createElement('div');
        
        notification.className = `notification notification-${type} ${options.className || ''}`;
        notification.style.cssText = `
            background: var(--glass-bg, rgba(255, 255, 255, 0.1));
            border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 12px;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            color: var(--text-color, #ffffff);
        `;
        
        const icon = this.getIcon(type);
        const canClose = options.closeable !== false;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <i class="notification-icon ${icon}"></i>
                    ${options.title ? `<h4 class="notification-title">${options.title}</h4>` : ''}
                    ${canClose ? '<button class="notification-close" aria-label="Close notification"><i class="fas fa-times"></i></button>' : ''}
                </div>
                <p class="notification-message">${message}</p>
                ${options.actions ? `<div class="notification-actions">${options.actions}</div>` : ''}
            </div>
        `;
        
        // Add close functionality
        if (canClose) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.hide(id));
        }
        
        // Add click handler
        if (options.onClick) {
            notification.addEventListener('click', options.onClick);
        }
        
        return {
            id,
            element: notification,
            type,
            timeout: null
        };
    }
    
    hide(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) return;
        
        const notification = this.notifications[index];
        
        // Clear timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }
        
        // Animate out
        notification.element.style.transform = 'translateX(100%)';
        notification.element.style.opacity = '0';
        
        // Remove from DOM and array
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.remove();
            }
            this.notifications.splice(index, 1);
        }, 300);
    }
    
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            loading: 'fas fa-spinner fa-spin'
        };
        
        return icons[type] || icons.info;
    }
    
    clear() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }
}

// ===== UI COMPONENTS INITIALIZATION =====
function initializeUIComponents() {
    // Back to Top Button
    initializeBackToTop();
    
    // Search Functionality
    initializeSearch();
    
    // Image Gallery
    initializeImageGallery();
    
    // Tooltips
    initializeTooltips();
    
    // Dropdown Menus
    initializeDropdowns();
    
    // Tabs
    initializeTabs();
    
    // Accordion
    initializeAccordion();
    
    // Form Enhancements
    initializeFormEnhancements();
    
    // Lazy Loading
    initializeLazyLoading();
    
    // Intersection Observer Animations
    initializeIntersectionAnimations();
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        createBackToTopButton();
    }
    
    const scrollManager = luxuryWebsite.getComponent('scrollManager');
    if (scrollManager) {
        scrollManager.onScroll((data) => {
            const btn = document.querySelector('.back-to-top');
            if (btn) {
                btn.classList.toggle('visible', data.scrollTop > 300);
            }
        });
    }
}

function createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-gold, #D4AF37);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;
    
    button.addEventListener('click', () => {
        const scrollManager = luxuryWebsite.getComponent('scrollManager');
        if (scrollManager) {
            scrollManager.scrollToTop();
        }
    });
    
    document.body.appendChild(button);
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchToggle || !searchModal) return;
    
    let searchData = [];
    
    // Load search data
    loadSearchData().then(data => {
        searchData = data;
    });
    
    // Search toggle
    searchToggle.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput?.focus();
    });
    
    // Close search
    const closeSearch = () => {
        searchModal.classList.remove('active');
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    };
    
    // Close on escape or overlay click
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });
    
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });
    
    // Search functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    performSearch(query, searchData, searchResults);
                } else {
                    if (searchResults) searchResults.innerHTML = '';
                }
            }, 300);
        });
    }
}

async function loadSearchData() {
    // Extract searchable content from the page
    const searchableElements = document.querySelectorAll('[data-searchable], h1, h2, h3, p, article, section');
    const searchData = [];
    
    searchableElements.forEach(element => {
        const text = element.textContent.trim();
        if (text.length > 10) {
            searchData.push({
                title: element.dataset.searchTitle || element.tagName.toLowerCase(),
                content: text,
                url: element.dataset.searchUrl || window.location.href,
                element: element
            });
        }
    });
    
    return searchData;
}

function performSearch(query, searchData, resultsContainer) {
    if (!resultsContainer) return;
    
    const results = searchData.filter(item => {
        const content = item.content.toLowerCase();
        const title = item.title.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        return content.includes(searchTerm) || title.includes(searchTerm);
    }).slice(0, 10);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result" data-url="${result.url}">
            <h4 class="search-result-title">${highlightText(result.title, query)}</h4>
            <p class="search-result-content">${highlightText(getSnippet(result.content, query), query)}</p>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
    
    // Add click handlers
    resultsContainer.querySelectorAll('.search-result').forEach(result => {
        result.addEventListener('click', () => {
            const url = result.dataset.url;
            if (url !== window.location.href) {
                window.location.href = url;
            } else {
                // Scroll to element if on same page
                const element = searchData.find(item => item.url === url)?.element;
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function getSnippet(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
}

// ===== IMAGE GALLERY =====
function initializeImageGallery() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                openLightbox(images, index);
            });
        });
    });
}

function openLightbox(images, startIndex) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">
                <i class="fas fa-times"></i>
            </button>
            <button class="lightbox-prev" aria-label="Previous image">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="lightbox-next" aria-label="Next image">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-image-container">
                <img class="lightbox-image" src="" alt="">
            </div>
            <div class="lightbox-counter">
                <span class="lightbox-current">1</span> / <span class="lightbox-total">${images.length}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    
    let currentIndex = startIndex;
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const currentSpan = lightbox.querySelector('.lightbox-current');
    
    const showImage = (index) => {
        currentIndex = index;
        lightboxImage.src = images[index].src;
        lightboxImage.alt = images[index].alt;
        currentSpan.textContent = index + 1;
        
        // Update navigation visibility
        lightbox.querySelector('.lightbox-prev').style.display = index > 0 ? 'block' : 'none';
        lightbox.querySelector('.lightbox-next').style.display = index < images.length - 1 ? 'block' : 'none';
    };
    
    const closeLightbox = () => {
        lightbox.remove();
        document.body.classList.remove('lightbox-open');
    };
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        if (currentIndex > 0) showImage(currentIndex - 1);
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        if (currentIndex < images.length - 1) showImage(currentIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function keyHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', keyHandler);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
            showImage(currentIndex + 1);
        }
    });
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Show lightbox
    document.body.classList.add('lightbox-open');
    showImage(startIndex);
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = createTooltip(element);
        
        element.addEventListener('mouseenter', () => showTooltip(tooltip));
        element.addEventListener('mouseleave', () => hideTooltip(tooltip));
        element.addEventListener('focus', () => showTooltip(tooltip));
        element.addEventListener('blur', () => hideTooltip(tooltip));
    });
}

function createTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.dataset.tooltip;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 10000;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(tooltip) {
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(-10px)';
}

// ===== DROPDOWN MENUS =====
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
        
        // Prevent closing when clicking inside menu
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// ===== TABS =====
function initializeTabs() {
    const tabGroups = document.querySelectorAll('.tabs');
    
    tabGroups.forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.tab');
        const panels = tabGroup.querySelectorAll('.tab-panel');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                if (panels[index]) {
                    panels[index].classList.add('active');
                }
            });
        });
    });
}

// ===== ACCORDION =====
function initializeAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (!header || !content) return;
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items if not multiple
                if (!accordion.classList.contains('multiple')) {
                    items.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.height = '0';
                        }
                    });
                }
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.height = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.height = '0';
                }
            });
        });
    });
}

// ===== FORM ENHANCEMENTS =====
function initializeFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Floating labels
        const floatingInputs = form.querySelectorAll('.floating-input');
        floatingInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
        
        // Form validation
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    // Phone validation
    else if (type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    // URL validation
    else if (type === 'url' && value && !isValidURL(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid URL';
    }
    
    // Display validation result
    showFieldValidation(field, isValid, errorMessage);
    
    return isValid;
}

function showFieldValidation(field, isValid, errorMessage) {
    const fieldContainer = field.closest('.form-group, .input-group');
    const errorElement = fieldContainer?.querySelector('.error-message');
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        } else if (fieldContainer) {
            // Create error element if it doesn't exist
            const newErrorElement = document.createElement('div');
            newErrorElement.className = 'error-message';
            newErrorElement.textContent = errorMessage;
            fieldContainer.appendChild(newErrorElement);
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ===== LAZY LOADING (continued) =====
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadLazyImage(entry.target);
                imageObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    const backgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadLazyBackground(entry.target);
                backgroundObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    lazyBackgrounds.forEach(el => backgroundObserver.observe(el));
}

function loadLazyImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    const imageLoader = new Image();
    imageLoader.onload = () => {
        img.src = src;
        img.style.opacity = '1';
        img.classList.add('loaded');
        img.removeAttribute('data-src');
    };
    
    imageLoader.onerror = () => {
        img.classList.add('error');
        console.error('Failed to load image:', src);
    };
    
    imageLoader.src = src;
}

function loadLazyBackground(element) {
    const bg = element.dataset.bg;
    if (!bg) return;
    
    const imageLoader = new Image();
    imageLoader.onload = () => {
        element.style.backgroundImage = `url(${bg})`;
        element.classList.add('loaded');
        element.removeAttribute('data-bg');
    };
    
    imageLoader.onerror = () => {
        element.classList.add('error');
        console.error('Failed to load background image:', bg);
    };
    
    imageLoader.src = bg;
}

// ===== INTERSECTION OBSERVER ANIMATIONS =====
function initializeIntersectionAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animate;
                const delay = parseInt(element.dataset.delay) || 0;
                const duration = parseInt(element.dataset.duration) || 600;
                
                setTimeout(() => {
                    applyAnimation(element, animation, duration);
                    element.classList.add('animated');
                    
                    // Dispatch animation event
                    element.dispatchEvent(new CustomEvent('elementAnimated', {
                        detail: { animation, element }
                    }));
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
        
        // Set initial state
        const animation = element.dataset.animate;
        setInitialAnimationState(element, animation);
    });
}

function setInitialAnimationState(element, animation) {
    switch (animation) {
        case 'fade-in':
            element.style.opacity = '0';
            break;
        case 'fade-in-up':
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            break;
        case 'fade-in-down':
            element.style.opacity = '0';
            element.style.transform = 'translateY(-30px)';
            break;
        case 'fade-in-left':
            element.style.opacity = '0';
            element.style.transform = 'translateX(-30px)';
            break;
        case 'fade-in-right':
            element.style.opacity = '0';
            element.style.transform = 'translateX(30px)';
            break;
        case 'scale-in':
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            break;
        case 'rotate-in':
            element.style.opacity = '0';
            element.style.transform = 'rotate(-10deg) scale(0.8)';
            break;
    }
}

function applyAnimation(element, animation, duration) {
    element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    switch (animation) {
        case 'fade-in':
            element.style.opacity = '1';
            break;
        case 'fade-in-up':
        case 'fade-in-down':
        case 'fade-in-left':
        case 'fade-in-right':
            element.style.opacity = '1';
            element.style.transform = 'translateX(0) translateY(0)';
            break;
        case 'scale-in':
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            break;
        case 'rotate-in':
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
            break;
    }
}

// ===== INTERACTIVE FEATURES =====
function initializeInteractiveFeatures() {
    // Parallax Effects
    initializeParallaxEffects();
    
    // Mouse Cursor Effects
    initializeMouseEffects();
    
    // Scroll Animations
    initializeScrollAnimations();
    
    // Loading Animations
    initializeLoadingAnimations();
    
    // Interactive Cards
    initializeInteractiveCards();
    
    // Video Players
    initializeVideoPlayers();
    
    // Audio Players
    initializeAudioPlayers();
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    if (!CONFIG.features.parallax) return;
    
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.parallax) || CONFIG.animation.parallaxSpeed;
            const offset = parseFloat(element.dataset.parallaxOffset) || 0;
            
            // Only animate if element is visible
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const elementTop = rect.top + scrollTop;
                const elementCenter = elementTop + rect.height / 2;
                const viewportCenter = scrollTop + windowHeight / 2;
                const distance = viewportCenter - elementCenter;
                
                const transform = distance * speed + offset;
                
                element.style.transform = `translateY(${transform}px)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial call
    updateParallax();
}

// ===== MOUSE CURSOR EFFECTS =====
function initializeMouseEffects() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        createCustomCursor();
    }
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor]');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.left = cursorX + 'px';
            customCursor.style.top = cursorY + 'px';
        }
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Interactive hover effects
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const customCursor = document.querySelector('.custom-cursor');
            if (customCursor) {
                customCursor.classList.add('hover');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            const customCursor = document.querySelector('.custom-cursor');
            if (customCursor) {
                customCursor.classList.remove('hover');
            }
        });
    });
}

function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-gold, #D4AF37);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.2s ease;
        opacity: 1;
    `;
    
    document.body.appendChild(cursor);
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    scrollElements.forEach(element => {
        const scrollType = element.dataset.scroll;
        const scrollSpeed = parseFloat(element.dataset.scrollSpeed) || 1;
        
        luxuryWebsite.getComponent('scrollManager')?.onScroll((data) => {
            applyScrollAnimation(element, scrollType, scrollSpeed, data);
        });
    });
}

function applyScrollAnimation(element, type, speed, scrollData) {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const windowHeight = window.innerHeight;
    
    // Calculate visibility percentage
    const visibilityStart = elementTop + elementHeight;
    const visibilityEnd = elementTop;
    const visibility = Math.max(0, Math.min(1, 
        (windowHeight - visibilityEnd) / (windowHeight + elementHeight - visibilityStart)
    ));
    
    switch (type) {
        case 'fade':
            element.style.opacity = visibility;
            break;
        case 'scale':
            const scale = 0.8 + (visibility * 0.2);
            element.style.transform = `scale(${scale})`;
            break;
        case 'rotate':
            const rotation = (1 - visibility) * 180 * speed;
            element.style.transform = `rotate(${rotation}deg)`;
            break;
        case 'slide-x':
            const slideX = (1 - visibility) * 100 * speed;
            element.style.transform = `translateX(${slideX}px)`;
            break;
        case 'slide-y':
            const slideY = (1 - visibility) * 100 * speed;
            element.style.transform = `translateY(${slideY}px)`;
            break;
    }
}

// ===== LOADING ANIMATIONS =====
function initializeLoadingAnimations() {
    // Staggered animations for child elements
    const staggeredContainers = document.querySelectorAll('[data-stagger]');
    
    staggeredContainers.forEach(container => {
        const children = container.children;
        const delay = parseInt(container.dataset.stagger) || 100;
        
        Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * delay);
        });
    });
    
    // Text animations
    initializeTextAnimations();
    
    // Number counters
    initializeCounters();
}

function initializeTextAnimations() {
    const textElements = document.querySelectorAll('[data-text-animate]');
    
    textElements.forEach(element => {
        const animationType = element.dataset.textAnimate;
        
        switch (animationType) {
            case 'typewriter':
                typewriterAnimation(element);
                break;
            case 'reveal':
                textRevealAnimation(element);
                break;
            case 'split':
                splitTextAnimation(element);
                break;
        }
    });
}

function typewriterAnimation(element) {
    const text = element.textContent;
    const speed = parseInt(element.dataset.typewriterSpeed) || 50;
    
    element.textContent = '';
    element.style.borderRight = '2px solid var(--primary-gold, #D4AF37)';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(timer);
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }, speed);
}

function textRevealAnimation(element) {
    const text = element.textContent;
    element.innerHTML = `<span class="text-reveal-content" style="display: inline-block; overflow: hidden;">
        <span style="display: inline-block; transform: translateY(100%);">${text}</span>
    </span>`;
    
    const inner = element.querySelector('span span');
    
    setTimeout(() => {
        inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        inner.style.transform = 'translateY(0)';
    }, 100);
}

function splitTextAnimation(element) {
    const text = element.textContent;
    const letters = text.split('').map(letter => 
        letter === ' ' ? '&nbsp;' : `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${letter}</span>`
    ).join('');
    
    element.innerHTML = letters;
    
    const spans = element.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.transition = 'all 0.4s ease';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function startCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = parseInt(element.dataset.duration) || 2000;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = easeOutQuart(progress);
        const current = Math.floor(startValue + (target - startValue) * easeProgress);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ===== INTERACTIVE CARDS =====
function initializeInteractiveCards() {
    const cards = document.querySelectorAll('.interactive-card, [data-tilt]');
    
    cards.forEach(card => {
        const maxTilt = parseFloat(card.dataset.tilt) || 15;
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (rect.height / 2)) * maxTilt * -1;
            const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
        
        // Add transition
        card.style.transition = 'transform 0.2s ease-out';
    });
}

// ===== VIDEO PLAYERS =====
function initializeVideoPlayers() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playButton = container.querySelector('.video-play-button');
        const controls = container.querySelector('.video-controls');
        
        if (!video) return;
        
        // Create custom controls if they don't exist
        if (!controls) {
            createVideoControls(container, video);
        }
        
        // Play button functionality
        if (playButton) {
            playButton.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playButton.style.display = 'none';
                } else {
                    video.pause();
                    playButton.style.display = 'block';
                }
            });
        }
        
        // Hide/show controls on hover
        container.addEventListener('mouseenter', () => {
            const customControls = container.querySelector('.custom-video-controls');
            if (customControls) {
                customControls.style.opacity = '1';
            }
        });
        
        container.addEventListener('mouseleave', () => {
            const customControls = container.querySelector('.custom-video-controls');
            if (customControls) {
                customControls.style.opacity = '0';
            }
        });
    });
}

function createVideoControls(container, video) {
    const controls = document.createElement('div');
    controls.className = 'custom-video-controls';
    controls.innerHTML = `
        <div class="video-progress">
            <div class="video-progress-bar">
                <div class="video-progress-filled"></div>
            </div>
        </div>
        <div class="video-buttons">
            <button class="video-btn play-pause">
                <i class="fas fa-play"></i>
            </button>
            <button class="video-btn volume">
                <i class="fas fa-volume-up"></i>
            </button>
            <span class="video-time">0:00 / 0:00</span>
            <button class="video-btn fullscreen">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    `;
    
    container.appendChild(controls);
    
    // Bind control events
    bindVideoControlEvents(controls, video);
}

function bindVideoControlEvents(controls, video) {
    const playPauseBtn = controls.querySelector('.play-pause');
    const volumeBtn = controls.querySelector('.volume');
    const fullscreenBtn = controls.querySelector('.fullscreen');
    const progressBar = controls.querySelector('.video-progress-bar');
    const progressFilled = controls.querySelector('.video-progress-filled');
    const timeDisplay = controls.querySelector('.video-time');
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Volume
    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        volumeBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });
    
    // Progress bar
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = progress + '%';
        
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);
        
        timeDisplay.textContent = 
            `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ` +
            `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    });
    
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = video.duration;
        
        video.currentTime = (clickX / width) * duration;
    });
}

// ===== AUDIO PLAYERS =====
function initializeAudioPlayers() {
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        const audio = player.querySelector('audio');
        if (!audio) return;
        
        createAudioControls(player, audio);
    });
}

function createAudioControls(container, audio) {
    const controls = document.createElement('div');
    controls.className = 'custom-audio-controls';
    controls.innerHTML = `
        <button class="audio-btn play-pause">
            <i class="fas fa-play"></i>
        </button>
        <div class="audio-progress">
            <div class="audio-progress-bar">
                <div class="audio-progress-filled"></div>
            </div>
        </div>
        <span class="audio-time">0:00</span>
        <button class="audio-btn volume">
            <i class="fas fa-volume-up"></i>
        </button>
    `;
    
    container.appendChild(controls);
    
    // Bind events (similar to video controls but simplified)
    bindAudioControlEvents(controls, audio);
}

function bindAudioControlEvents(controls, audio) {
    const playPauseBtn = controls.querySelector('.play-pause');
    const volumeBtn = controls.querySelector('.volume');
    const progressBar = controls.querySelector('.audio-progress-bar');
    const progressFilled = controls.querySelector('.audio-progress-filled');
    const timeDisplay = controls.querySelector('.audio-time');
    
    // Similar implementation to video controls but for audio
    // ... (implementation details similar to video)
}

// ===== PERFORMANCE MONITORING =====
function initializePerformanceMonitoring() {
    // Monitor loading performance
    const performanceData = {
        loadStart: performance.timing.navigationStart,
        domReady: 0,
        loadComplete: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
    };
    
    // DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        performanceData.domReady = performance.now();
    });
    
    // Load Complete
    window.addEventListener('load', () => {
        performanceData.loadComplete = performance.now();
        
        // Get paint timings
        if ('getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    performanceData.firstPaint = entry.startTime;
                } else if (entry.name === 'first-contentful-paint') {
                    performanceData.firstContentfulPaint = entry.startTime;
                }
            });
        }
        
        // Log performance metrics
        console.log('🔍 Performance Metrics:', {
            'DOM Ready': Math.round(performanceData.domReady) + 'ms',
            'Load Complete': Math.round(performanceData.loadComplete) + 'ms',
            'First Paint': Math.round(performanceData.firstPaint) + 'ms',
            'First Contentful Paint': Math.round(performanceData.firstContentfulPaint) + 'ms'
        });
    });
    
    // Monitor frame rate
    monitorFrameRate();
    
    // Monitor memory usage (if available)
    monitorMemoryUsage();
}

function monitorFrameRate() {
    let frames = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (currentTime - lastTime));
            
            // Update FPS display if exists
            const fpsDisplay = document.querySelector('.fps-counter');
            if (fpsDisplay) {
                fpsDisplay.textContent = fps + ' FPS';
            }
            
            // Log low FPS warnings
            if (fps < 30) {
                console.warn('⚠️ Low FPS detected:', fps);
            }
            
            frames = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(countFrames);
    }
}

function monitorMemoryUsage() {
    if (!performance.memory) return;
    
    setInterval(() => {
        const memory = performance.memory;
        const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        
        // Log memory warnings
        if (used / limit > 0.8) {
            console.warn('⚠️ High memory usage:', used + 'MB / ' + limit + 'MB');
        }
        
        // Update memory display if exists
        const memoryDisplay = document.querySelector('.memory-counter');
        if (memoryDisplay) {
            memoryDisplay.textContent = used + 'MB';
        }
    }, 5000);
}

// ===== ACCESSIBILITY FEATURES =====
function initializeAccessibilityFeatures() {
    // Skip links
    createSkipLinks();
    
    // Focus management
    initializeFocusManagement();
    
    // ARIA live regions
    createLiveRegions();
    
    // Keyboard navigation
    initializeKeyboardNavigation();
    
    // High contrast mode
    initializeHighContrastMode();
    
    // Reduced motion support
    initializeReducedMotionSupport();
}

function createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

function initializeFocusManagement() {
    // Focus visible polyfill
    let hadKeyboardEvent = false;
    
    const keyboardEvents = ['keydown', 'keyup'];
    const pointerEvents = ['mousedown', 'mouseup', 'touchstart', 'touchend'];
    
    keyboardEvents.forEach(event => {
        document.addEventListener(event, () => {
            hadKeyboardEvent = true;
        });
    });
    
    pointerEvents.forEach(event => {
        document.addEventListener(event, () => {
            hadKeyboardEvent = false;
        });
    });
    
    // Add focus-visible class when appropriate
    document.addEventListener('focusin', (e) => {
        if (hadKeyboardEvent) {
            e.target.classList.add('focus-visible');
        }
    });
    
    document.addEventListener('focusout', (e) => {
        e.target.classList.remove('focus-visible');
    });
}

function createLiveRegions() {
    // Polite live region for non-urgent announcements
    const politeLiveRegion = document.createElement('div');
    politeLiveRegion.setAttribute('aria-live', 'polite');
    politeLiveRegion.setAttribute('aria-atomic', 'true');
    politeLiveRegion.className = 'sr-only';
    document.body.appendChild(politeLiveRegion);
    
    // Assertive live region for urgent announcements
    const assertiveLiveRegion = document.createElement('div');
    assertiveLiveRegion.setAttribute('aria-live', 'assertive');
    assertiveLiveRegion.setAttribute('aria-atomic', 'true');
    assertiveLiveRegion.className = 'sr-only';
    document.body.appendChild(assertiveLiveRegion);
    
    // Global announce function
    window.announce = (message, urgent = false) => {
        const region = urgent ? assertiveLiveRegion : politeLiveRegion;
        region.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            region.textContent = '';
        }, 1000);
    };
}

function initializeKeyboardNavigation() {
    // Tab trap for modals (already implemented in modal system)
    
    // Arrow key navigation for menus
    const menus = document.querySelectorAll('[role="menu"]');
    menus.forEach(menu => {
        const items = menu.querySelectorAll('[role="menuitem"]');
        
        items.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % items.length;
                        items[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + items.length) % items.length;
                        items[prevIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        items[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        items[items.length - 1].focus();
                        break;
                }
            });
        });
    });
}

function initializeHighContrastMode() {
    // Detect high contrast mode
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const applyHighContrast = (matches) => {
        document.documentElement.classList.toggle('high-contrast', matches);
    };
    
    applyHighContrast(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => applyHighContrast(e.matches));
}

function initializeReducedMotionSupport() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const applyReducedMotion = (matches) => {
        document.documentElement.classList.toggle('reduced-motion', matches);
        
        if (matches) {
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    applyReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => applyReducedMotion(e.matches));
}

// ===== ERROR HANDLING =====
function initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        // Log error details
        const errorInfo = {
            message: event.error?.message || 'Unknown error',
            stack: event.error?.stack || 'No stack trace',
            filename: event.filename || 'Unknown file',
            lineno: event.lineno || 0,
            colno: event.colno || 0,
            timestamp: new Date().toISOString()
        };
        
        // Send error to logging service (if available)
        logError(errorInfo);
        
        // Show user-friendly message
        if (window.showNotification) {
            showNotification('An error occurred. Please refresh the page if problems persist.', 'error');
        }
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Prevent default browser behavior
        event.preventDefault();
        
        const errorInfo = {
            message: 'Unhandled promise rejection',
            reason: event.reason?.toString() || 'Unknown reason',
            timestamp: new Date().toISOString()
        };
        
        logError(errorInfo);
        
        if (window.showNotification) {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    });
}

function logError(errorInfo) {
    // Store in local storage for debugging
    try {
        const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
        errors.push(errorInfo);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(0, errors.length - 10);
        }
        
        localStorage.setItem('errorLog', JSON.stringify(errors));
    } catch (e) {
        console.error('Failed to log error:', e);
    }
    
    // Send to external logging service (implement based on your needs)
    // Example: sendToLoggingService(errorInfo);
}

function handleInitializationError(error) {
    console.error('Initialization error:', error);
    
    // Show fallback message
    const fallbackMessage = document.createElement('div');
    fallbackMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 10000;
    `;
    fallbackMessage.innerHTML = `
        <h3>Initialization Error</h3>
        <p>The website encountered an error during initialization.</p>
        <button onclick="window.location.reload()" style="background: white; color: #ff4444; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
            Reload Page
        </button>
    `;
    
    document.body.appendChild(fallbackMessage);
}

// ===== UTILITY FUNCTIONS =====
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

function isMobile() {
    return window.innerWidth <= CONFIG.breakpoints.mobile;
}

function isTablet() {
    return window.innerWidth > CONFIG.breakpoints.mobile && window.innerWidth <= CONFIG.breakpoints.tablet;
}

function isDesktop() {
    return window.innerWidth > CONFIG.breakpoints.tablet;
}

// ===== RESPONSIVE UTILITIES =====
function initializeResponsiveUtilities() {
    let currentBreakpoint = getCurrentBreakpoint();
    
    // Initial breakpoint class
    document.body.classList.add(`breakpoint-${currentBreakpoint}`);
    
    // Update on resize
    window.addEventListener('resize', debounce(() => {
        const newBreakpoint = getCurrentBreakpoint();
        
        if (newBreakpoint !== currentBreakpoint) {
            document.body.classList.remove(`breakpoint-${currentBreakpoint}`);
            document.body.classList.add(`breakpoint-${newBreakpoint}`);
            
            currentBreakpoint = newBreakpoint;
            
            // Dispatch breakpoint change event
            document.dispatchEvent(new CustomEvent('breakpointChange', {
                detail: { breakpoint: newBreakpoint }
            }));
        }
    }, 250));
}

function getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width <= CONFIG.breakpoints.mobile) {
        return 'mobile';
    } else if (width <= CONFIG.breakpoints.tablet) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

// ===== COOKIE UTILITIES =====
const CookieUtils = {
    set(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    remove(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    },
    
    exists(name) {
        return this.get(name) !== null;
    }
};

// ===== LOCAL STORAGE UTILITIES =====
const StorageUtils = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('localStorage set error:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('localStorage get error:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('localStorage remove error:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('localStorage clear error:', error);
            return false;
        }
    },
    
    exists(key) {
        return localStorage.getItem(key) !== null;
    }
};

// ===== API UTILITIES =====
const ApiUtils = {
    async request(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    },
    
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    },
    
    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
};

// ===== FORM UTILITIES =====
const FormUtils = {
    serialize(form) {
        const data = new FormData(form);
        const obj = {};
        
        for (let [key, value] of data.entries()) {
            if (obj[key]) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    obj[key] = [obj[key], value];
                }
            } else {
                obj[key] = value;
            }
        }
        
        return obj;
    },
    
    validate(form, rules = {}) {
        const errors = {};
        const data = this.serialize(form);
        
        Object.keys(rules).forEach(field => {
            const value = data[field];
            const fieldRules = rules[field];
            
            if (fieldRules.required && (!value || value.toString().trim() === '')) {
                errors[field] = 'This field is required';
            } else if (value && fieldRules.email && !isValidEmail(value)) {
                errors[field] = 'Please enter a valid email address';
            } else if (value && fieldRules.minLength && value.length < fieldRules.minLength) {
                errors[field] = `Must be at least ${fieldRules.minLength} characters`;
            } else if (value && fieldRules.maxLength && value.length > fieldRules.maxLength) {
                errors[field] = `Must be no more than ${fieldRules.maxLength} characters`;
            } else if (value && fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || 'Invalid format';
            }
        });
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    showErrors(form, errors) {
        // Clear previous errors
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
        
        // Add new errors
        Object.keys(errors).forEach(field => {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errors[field];
                
                input.classList.add('error');
                input.parentNode.appendChild(errorElement);
            }
        });
    },
    
    clearErrors(form) {
        const errors = form.querySelectorAll('.error-message');
        const inputs = form.querySelectorAll('.error');
        
        errors.forEach(error => error.remove());
        inputs.forEach(input => input.classList.remove('error'));
    }
};

// ===== ANIMATION UTILITIES =====
const AnimationUtils = {
    fadeIn(element, duration = 300) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    fadeOut(element, duration = 300) {
        return new Promise(resolve => {
            const start = performance.now();
            const startOpacity = parseFloat(getComputedStyle(element).opacity);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    slideDown(element, duration = 300) {
        return new Promise(resolve => {
            element.style.display = 'block';
            const height = element.scrollHeight;
            
            element.style.height = '0';
            element.style.overflow = 'hidden';
            
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (height * easeOutCubic(progress)) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    slideUp(element, duration = 300) {
        return new Promise(resolve => {
            const height = element.scrollHeight;
            element.style.height = height + 'px';
            element.style.overflow = 'hidden';
            
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (height * (1 - easeOutCubic(progress))) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    shake(element, intensity = 10, duration = 600) {
        return new Promise(resolve => {
            const start = performance.now();
            const originalTransform = element.style.transform;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const shake = Math.sin(progress * Math.PI * 10) * intensity * (1 - progress);
                    element.style.transform = `${originalTransform} translateX(${shake}px)`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    pulse(element, scale = 1.1, duration = 600) {
        return new Promise(resolve => {
            const start = performance.now();
            const originalTransform = element.style.transform;
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const pulseScale = 1 + (scale - 1) * Math.sin(progress * Math.PI);
                    element.style.transform = `${originalTransform} scale(${pulseScale})`;
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = originalTransform;
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
};

// ===== URL UTILITIES =====
const UrlUtils = {
    getParams() {
        const params = new URLSearchParams(window.location.search);
        const obj = {};
        
        for (let [key, value] of params.entries()) {
            obj[key] = value;
        }
        
        return obj;
    },
    
    getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },
    
    setParam(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    },
    
    removeParam(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.replaceState({}, '', url);
    },
    
    updateParams(params) {
        const url = new URL(window.location);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        window.history.replaceState({}, '', url);
    }
};

// ===== DEVICE DETECTION =====
const DeviceUtils = {
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet() {
        return /iPad|Android|Tablet/i.test(navigator.userAgent) && !this.isMobile();
    },
    
    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    },
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },
    
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    },
    
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    
    isChrome() {
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    },
    
    isFirefox() {
        return /Firefox/.test(navigator.userAgent);
    },
    
    isEdge() {
        return /Edge/.test(navigator.userAgent);
    },
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    
    supportsTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    
    getScreenSize() {
        return {
            width: screen.width,
            height: screen.height
        };
    }
};

// ===== FEATURE DETECTION =====
const FeatureDetection = {
    supportsIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },
    
    supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    },
    
    supportsLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    supportsServiceWorker() {
        return 'serviceWorker' in navigator;
    },
    
    supportsGeolocation() {
        return 'geolocation' in navigator;
    },
    
    supportsNotifications() {
        return 'Notification' in window;
    },
    
    supportsWebAudio() {
        return 'AudioContext' in window || 'webkitAudioContext' in window;
    },
    
    supportsWebRTC() {
        return 'RTCPeerConnection' in window || 'webkitRTCPeerConnection' in window;
    },
    
    supportsCanvas() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
    },
    
    supportsWebSockets() {
        return 'WebSocket' in window;
    }
};

// ===== PERFORMANCE OPTIMIZATION =====
const PerformanceUtils = {
    preloadImages(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        });
        
        return Promise.all(promises);
    },
    
    lazyLoadScript(src, async = true) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = async;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },
    
    prefetchLink(href, as = 'document') {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    },
    
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    },
    
    debounce: debounce,
    throttle: throttle,
    
    requestIdleCallback(callback, options = {}) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback, options);
        } else {
            // Fallback for browsers that don't support requestIdleCallback
            return setTimeout(callback, 1);
        }
    }
};

// ===== FINAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize responsive utilities
    initializeResponsiveUtilities();
    
    // Add device classes to body
    const body = document.body;
    body.classList.add(`device-${DeviceUtils.isMobile() ? 'mobile' : DeviceUtils.isTablet() ? 'tablet' : 'desktop'}`);
    
    if (DeviceUtils.supportsTouch()) {
        body.classList.add('touch-device');
    }
    
    // Add feature detection classes
    Object.keys(FeatureDetection).forEach(feature => {
        const methodName = feature;
        const hasFeature = FeatureDetection[methodName]();
        const className = feature.replace(/([A-Z])/g, '-$1').toLowerCase().replace('supports-', '');
        
        body.classList.add(`${hasFeature ? 'has' : 'no'}-${className}`);
    });
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('luxuryWebsiteReady', {
        detail: { luxuryWebsite }
    }));
});

// ===== WINDOW LOAD OPTIMIZATION =====
window.addEventListener('load', () => {
    // Hide loading screen
    const loadingScreen = luxuryWebsite.getComponent('loadingScreen');
    if (loadingScreen) {
        loadingScreen.hide();
    }
    
    // Start non-critical initializations
    PerformanceUtils.requestIdleCallback(() => {
        // Initialize non-critical features
        initializeNonCriticalFeatures();
    });
    
    // Update state
    luxuryWebsite.state.isLoading = false;
    luxuryWebsite.state.performance.loadTime = performance.now();
    
    console.log('🎉 Luxury Website fully loaded!');
});

function initializeNonCriticalFeatures() {
    // Initialize features that don't affect initial page load
    
    // Service Worker registration
    if (FeatureDetection.supportsServiceWorker()) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
    
    // Analytics initialization
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Chat widget or other third-party scripts
    // initializeChatWidget();
    
    // Prefetch important pages
    const importantPages = ['/about', '/services', '/contact'];
    importantPages.forEach(page => {
        PerformanceUtils.prefetchLink(page);
    });
}

// ===== GLOBAL EXPORTS =====
window.LuxuryWebsite = luxuryWebsite;
window.CONFIG = CONFIG;
window.CookieUtils = CookieUtils;
window.StorageUtils = StorageUtils;
window.ApiUtils = ApiUtils;
window.FormUtils = FormUtils;
window.AnimationUtils = AnimationUtils;
window.UrlUtils = UrlUtils;
window.DeviceUtils = DeviceUtils;
window.FeatureDetection = FeatureDetection;
window.PerformanceUtils = PerformanceUtils;

// ===== CLEANUP ON UNLOAD =====
window.addEventListener('beforeunload', () => {
    // Clean up event listeners
    luxuryWebsite.eventListeners.forEach((listeners, key) => {
        listeners.forEach(({ element, handler }) => {
            element.removeEventListener(key.split('-')[1], handler);
        });
    });
    
    // Clean up observers
    luxuryWebsite.state.performance.observers.forEach(observer => {
        if (observer.disconnect) {
            observer.disconnect();
        }
    });
    
    // Save user session data
    const sessionData = {
        ...luxuryWebsite.state.user.session,
        endTime: Date.now(),
        duration: Date.now() - luxuryWebsite.state.user.session.startTime
    };
    
    StorageUtils.set('lastSession', sessionData);
    
    console.log('👋 Luxury Website cleanup completed');
});

// ===== DEVELOPMENT HELPERS =====
if (process.env.NODE_ENV === 'development') {
    // Development-only utilities
    window.LuxuryWebsite.debug = {
        logState: () => console.log('Current state:', luxuryWebsite.state),
        logComponents: () => console.log('Registered components:', Array.from(luxuryWebsite.components.keys())),
        logPerformance: () => console.log('Performance data:', luxuryWebsite.state.performance),
        triggerError: () => { throw new Error('Test error'); },
        clearStorage: () => {
            localStorage.clear();
            sessionStorage.clear();
            console.log('Storage cleared');
        }
    };
    
    console.log('🔧 Development mode enabled. Access debug utilities via window.LuxuryWebsite.debug');
}

// ===== POLYFILLS =====
// Add polyfills for older browsers
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement) {
        return this.indexOf(searchElement) !== -1;
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, length) {
        if (length === undefined || length > this.length) {
            length = this.length;
        }
        return this.substring(length - searchString.length, length) === searchString;
    };
}

// ===== EXPORT FOR MODULE SYSTEMS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LuxuryWebsite,
        CONFIG,
        CookieUtils,
        StorageUtils,
        ApiUtils,
        FormUtils,
        AnimationUtils,
        UrlUtils,
        DeviceUtils,
        FeatureDetection,
        PerformanceUtils
    };
}

console.log('✨ Main.js loaded successfully!');
