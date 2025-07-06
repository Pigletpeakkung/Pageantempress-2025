// ===== MAIN APPLICATION CONTROLLER =====
class PageantEmpressApp {
    constructor() {
        this.theme = this.loadTheme();
        this.animations = new AnimationController();
        this.sparkles = new SparkleSystem();
        this.geometricShapes = new GeometricShapeSystem();
        this.header = new HeaderController();
        this.search = new SearchController();
        this.notifications = new NotificationSystem();
        this.performance = new PerformanceMonitor();
        this.analytics = new AnalyticsTracker();
        
        this.init();
    }

    async init() {
        try {
            // Initialize theme
            this.applyTheme();
            
            // Initialize all systems
            await Promise.all([
                this.animations.init(),
                this.sparkles.init(),
                this.geometricShapes.init(),
                this.header.init(),
                this.search.init()
            ]);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize performance monitoring
            this.performance.startMonitoring();
            
            // Track page load
            this.analytics.track('page_load', {
                theme: this.theme,
                viewport: this.getViewportInfo()
            });
            
            // Show welcome notification
            this.notifications.show({
                type: 'success',
                message: 'Welcome to Pageant Empress! ✨',
                duration: 3000
            });
            
        } catch (error) {
            console.error('App initialization error:', error);
            this.handleInitError(error);
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScroll(target);
                }
            });
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();

        // Performance optimization on scroll
        this.optimizeScrollPerformance();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveTheme();
        
        // Animate theme transition
        this.animations.playThemeTransition();
        
        // Track theme change
        this.analytics.track('theme_change', { newTheme: this.theme });
    }

    applyTheme() {
        document.body.classList.toggle('light-theme', this.theme === 'light');
    }

    loadTheme() {
        return localStorage.getItem('pageant-empress-theme') || 'dark';
    }

    saveTheme() {
        localStorage.setItem('pageant-empress-theme', this.theme);
    }

    smoothScroll(target) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animations.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    optimizeScrollPerformance() {
        let scrollTimeout;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                document.body.classList.add('is-scrolling');
                isScrolling = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
                isScrolling = false;
            }, 150);
        }, { passive: true });
    }

    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }

    handleInitError(error) {
        this.notifications.show({
            type: 'error',
            message: 'Something went wrong. Please refresh the page.',
            duration: 5000
        });
    }
}

// ===== SPARKLE SYSTEM =====
class SparkleSystem {
    constructor() {
        this.container = null;
        this.sparkles = [];
        this.maxSparkles = 50;
        this.isActive = true;
    }

    async init() {
        this.createContainer();
        this.generateSparkles();
        this.animateSparkles();
        
        // Reduce sparkles on mobile for performance
        if (window.innerWidth < 768) {
            this.maxSparkles = 20;
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'sparkle-container';
        this.container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.container);
    }

    generateSparkles() {
        for (let i = 0; i < this.maxSparkles; i++) {
            this.createSparkle();
        }
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        const type = this.getRandomSparkleType();
        
        sparkle.className = `sparkle ${type}`;
        
        // Random position
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${100 + Math.random() * 100}%`;
        
        // Random animation duration and delay
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;
        
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(sparkle);
        this.sparkles.push(sparkle);
        
        // Remove sparkle after animation
        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
            this.sparkles = this.sparkles.filter(s => s !== sparkle);
            
            // Create new sparkle to maintain count
            if (this.isActive && this.sparkles.length < this.maxSparkles) {
                setTimeout(() => this.createSparkle(), Math.random() * 1000);
            }
        });
    }

    getRandomSparkleType() {
        const types = ['sparkle-small', 'sparkle-medium', 'sparkle-large', 'sparkle-star'];
        const weights = [40, 30, 20, 10]; // Percentage weights
        
        const random = Math.random() * 100;
        let accumulator = 0;
        
        for (let i = 0; i < types.length; i++) {
            accumulator += weights[i];
            if (random <= accumulator) {
                return types[i];
            }
        }
        
        return types[0];
    }

    animateSparkles() {
        // Add mouse interaction
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.95) { // 5% chance on mouse move
                this.createSparkleAtPosition(e.clientX, e.clientY);
            }
        });
    }

    createSparkleAtPosition(x, y) {
        if (!this.isActive || this.sparkles.length >= this.maxSparkles * 1.5) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle sparkle-medium';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.animationDuration = '1s';
        
        this.container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }

    pause() {
        this.isActive = false;
        this.sparkles.forEach(sparkle => {
            sparkle.style.animationPlayState = 'paused';
        });
    }

    resume() {
        this.isActive = true;
        this.sparkles.forEach(sparkle => {
            sparkle.style.animationPlayState = 'running';
        });
    }
}

// ===== GEOMETRIC SHAPE SYSTEM =====
class GeometricShapeSystem {
    constructor() {
        this.container = null;
        this.shapes = [];
        this.maxShapes = 15;
    }

    async init() {
        this.createContainer();
        this.generateShapes();
        this.animateShapes();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'geometric-shapes';
        this.container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.container);
    }

    generateShapes() {
        const shapeTypes = ['shape-diamond', 'shape-hexagon', 'shape-triangle'];
        
        for (let i = 0; i < this.maxShapes; i++) {
            const shape = document.createElement('div');
            const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            
            shape.className = `geometric-shape ${type}`;
            
            // Random position
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            
            // Random animation properties
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 10;
            
            shape.style.animationDuration = `${duration}s`;
            shape.style.animationDelay = `${delay}s`;
            
            // Random size variation
            const scale = 0.5 + Math.random() * 1.5;
            shape.style.transform = `scale(${scale})`;
            
            this.container.appendChild(shape);
            this.shapes.push(shape);
        }
    }

    animateShapes() {
        // Parallax effect on mouse move
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.01;
                const x = (mouseX - 0.5) * speed * 100;
                const y = (mouseY - 0.5) * speed * 100;
                
                shape.style.transform = `translate(${x}px, ${y}px) scale(${shape.dataset.scale || 1})`;
            });
        });
    }
}

// ===== HEADER CONTROLLER =====
class HeaderController {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
        this.hideThreshold = 500;
        this.mobileMenu = new MobileMenuController();
        this.scrollIndicator = new ScrollIndicator();
    }

    async init() {
        this.setupScrollBehavior();
        this.setupNavigation();
        await this.mobileMenu.init();
        this.scrollIndicator.init();
    }

    setupScrollBehavior() {
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header based on scroll direction
            if (currentScrollY > this.hideThreshold) {
                if (currentScrollY > this.lastScrollY) {
                    this.header.classList.add('header-hidden');
                } else {
                    this.header.classList.remove('header-hidden');
                }
            }
            
            this.lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    setupNavigation() {
        // Highlight active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
}

// ===== MOBILE MENU CONTROLLER =====
class MobileMenuController {
    constructor() {
        this.toggle = document.querySelector('.mobile-toggle');
        this.menu = document.querySelector('.mobile-menu');
        this.overlay = document.querySelector('.mobile-overlay');
        this.closeBtn = document.querySelector('.mobile-close');
        this.isOpen = false;
    }

    async init() {
        if (!this.toggle || !this.menu) return;
        
        this.setupEventListeners();
        this.setupSwipeGestures();
    }

    setupEventListeners() {
        // Toggle button
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close button
        this.closeBtn?.addEventListener('click', () => this.closeMenu());
        
        // Overlay click
        this.overlay?.addEventListener('click', () => this.closeMenu());
        
        // Close on nav link click
        this.menu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.menu.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.menu.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            
            // Swipe right to close
            if (touchEndX - touchStartX > 100) {
                this.closeMenu();
            }
                }, { passive: true });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        this.menu.classList.add('active');
        this.overlay?.classList.add('active');
        this.toggle.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Animate menu items
        this.animateMenuItems();
        
        // Track menu open
        if (window.app?.analytics) {
            window.app.analytics.track('mobile_menu_opened');
        }
    }

    closeMenu() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.overlay?.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    animateMenuItems() {
        const items = this.menu.querySelectorAll('.mobile-nav-link');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
}

// ===== SCROLL INDICATOR =====
class ScrollIndicator {
    constructor() {
        this.indicator = null;
        this.progress = null;
    }

    init() {
        this.createIndicator();
        this.updateProgress();
        this.setupScrollListener();
    }

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'scroll-indicator';
        
        this.progress = document.createElement('div');
        this.progress.className = 'scroll-progress';
        
        this.indicator.appendChild(this.progress);
        document.body.appendChild(this.indicator);
    }

    updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        this.progress.style.width = `${scrollPercentage}%`;
    }

    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
}

// ===== SEARCH CONTROLLER =====
class SearchController {
    constructor() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchInput = document.querySelector('.search-input');
        this.searchClose = document.querySelector('.search-close');
        this.searchResults = [];
        this.isOpen = false;
    }

        async init() {
        if (!this.searchToggle || !this.searchOverlay) return;
        
        this.setupEventListeners();
        this.setupSearchFunctionality();
        await this.loadSearchIndex();
    }

    setupEventListeners() {
        // Toggle search
        this.searchToggle.addEventListener('click', () => this.openSearch());
        
        // Close search
        this.searchClose?.addEventListener('click', () => this.closeSearch());
        
        // Close on overlay click
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.closeSearch();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
        });
        
        // Open search with keyboard shortcut (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }

    setupSearchFunctionality() {
        let searchTimeout;
        
        this.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                this.clearResults();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });
        
        // Tag click functionality
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.searchInput.value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });
    }

    async loadSearchIndex() {
        // In a real application, this would load from an API or JSON file
        this.searchIndex = [
            { title: 'Walking Techniques', category: 'Training', url: '/training/walking' },
            { title: 'Interview Preparation', category: 'Training', url: '/training/interview' },
            { title: 'Evening Gown Selection', category: 'Fashion', url: '/fashion/evening-gown' },
            { title: 'Competition Schedule', category: 'Events', url: '/events/schedule' },
            { title: 'Pageant History', category: 'Resources', url: '/resources/history' },
            { title: 'Makeup Tutorials', category: 'Beauty', url: '/beauty/makeup' },
            { title: 'Fitness Routines', category: 'Health', url: '/health/fitness' },
            { title: 'Public Speaking Tips', category: 'Skills', url: '/skills/public-speaking' }
        ];
    }

    performSearch(query) {
        const results = this.searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displayResults(results);
        
        // Track search
        if (window.app?.analytics) {
            window.app.analytics.track('search_performed', { query, resultsCount: results.length });
        }
    }

    displayResults(results) {
        const resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <div class="result-icon">
                    <i class="fas fa-${this.getCategoryIcon(result.category)}"></i>
                </div>
                <div class="result-content">
                    <h4>${result.title}</h4>
                    <span class="result-category">${result.category}</span>
                </div>
                <i class="fas fa-arrow-right result-arrow"></i>
            </a>
        `).join('');
        
        resultsContainer.innerHTML = `
            <h3>Search Results (${results.length})</h3>
            <div class="results-list">${resultsHTML}</div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            'Training': 'graduation-cap',
            'Fashion': 'tshirt',
            'Events': 'calendar',
            'Resources': 'book',
            'Beauty': 'palette',
            'Health': 'heartbeat',
            'Skills': 'award'
        };
        return icons[category] || 'file';
    }

    clearResults() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    openSearch() {
        this.isOpen = true;
        this.searchOverlay.classList.add('active');
        setTimeout(() => {
            this.searchInput?.focus();
        }, 300);
    }

    closeSearch() {
        this.isOpen = false;
        this.searchOverlay.classList.remove('active');
        this.searchInput.value = '';
        this.clearResults();
    }
}

// ===== NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-stack';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);
    }

    show(options) {
        const defaults = {
            type: 'info',
            message: '',
            duration: 5000,
            dismissible: true,
            icon: null
        };
        
        const config = { ...defaults, ...options };
        const id = this.generateId();
        
        const notification = this.createNotification(id, config);
        this.notifications.set(id, notification);
        
        // Auto dismiss
        if (config.duration > 0) {
            setTimeout(() => this.dismiss(id), config.duration);
        }
        
        return id;
    }

    createNotification(id, config) {
        const notification = document.createElement('div');
        notification.className = `notification-item ${config.type}`;
        notification.dataset.id = id;
        
        const icon = config.icon || this.getDefaultIcon(config.type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${config.message}</span>
            </div>
            ${config.dismissible ? '<button class="notification-close" aria-label="Close notification"><i class="fas fa-times"></i></button>' : ''}
        `;
        
        if (config.dismissible) {
            notification.querySelector('.notification-close').addEventListener('click', () => {
                this.dismiss(id);
            });
        }
        
        this.container.appendChild(notification);
        
        // Trigger show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        return notification;
    }

    getDefaultIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    dismiss(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.classList.remove('show');
        
        notification.addEventListener('transitionend', () => {
            notification.remove();
            this.notifications.delete(id);
        });
    }

    dismissAll() {
        this.notifications.forEach((notification, id) => {
            this.dismiss(id);
        });
    }

    generateId() {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// ===== ANIMATION CONTROLLER =====
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
    }

    async init() {
        this.setupAnimationClasses();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupRippleEffect();
    }

    setupAnimationClasses() {
        // Add GPU acceleration to animated elements
        document.querySelectorAll('.animate-on-scroll, .enhanced-card, .glass-morphism').forEach(el => {
            el.classList.add('gpu-accelerated');
        });
    }

    setupScrollAnimations() {
        const animationOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, animationOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
        
        this.observers.set('scroll', animationObserver);
    }

    animateElement(element) {
        const animationType = element.dataset.animate || 'fadeInUp';
        const delay = element.dataset.animateDelay || 0;
        const duration = element.dataset.animateDuration || 1000;
        
        setTimeout(() => {
            element.style.animationDuration = `${duration}ms`;
            element.classList.add('animated', animationType);
        }, delay);
    }

    setupHoverEffects() {
        // Interactive glow effect
        document.querySelectorAll('.interactive-glow').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                this.createGlowEffect(e.target);
            });
        });
        
        // Button hover effects
        document.querySelectorAll('.enhanced-button, .btn').forEach(button => {
            button.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', `${x}px`);
                this.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    setupRippleEffect() {
        document.querySelectorAll('.ripple-effect').forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                element.appendChild(ripple);
                
                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            });
        });
    }

    createGlowEffect(element) {
        element.classList.add('glowing');
        
        setTimeout(() => {
            element.classList.remove('glowing');
        }, 1000);
    }

    playThemeTransition() {
        document.body.classList.add('theme-transitioning');
        
        // Create a flash effect
        const flash = document.createElement('div');
        flash.className = 'theme-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(flash);
        
        requestAnimationFrame(() => {
            flash.style.opacity = '0.3';
            
            setTimeout(() => {
                flash.style.opacity = '0';
                
                setTimeout(() => {
                    flash.remove();
                    document.body.classList.remove('theme-transitioning');
                }, 300);
            }, 150);
        });
    }
}

// ===== PERFORMANCE MONITOR =====
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.isMonitoring = false;
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Monitor FPS
        this.monitorFPS();
        
        // Monitor memory usage (if available)
        this.monitorMemory();
        
        // Monitor long tasks
        this.monitorLongTasks();
        
        // Monitor resource timing
        this.monitorResources();
    }

    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 0;
        
        const calculateFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.set('fps', fps);
                
                // Reduce animations if FPS is low
                if (fps < 30) {
                    document.body.classList.add('reduce-animations');
                } else {
                    document.body.classList.remove('reduce-animations');
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(calculateFPS);
            }
        };
        
        requestAnimationFrame(calculateFPS);
    }

    monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                this.metrics.set('memory', {
                    used: memoryInfo.usedJSHeapSize,
                    total: memoryInfo.totalJSHeapSize,
                    limit: memoryInfo.jsHeapSizeLimit
                });
            }, 5000);
        }
    }

    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry);
                            this.metrics.set('lastLongTask', {
                                duration: entry.duration,
                                timestamp: entry.startTime
                            });
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Long task monitoring not supported
            }
        }
    }

    monitorResources() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const totalLoadTime = resources.reduce((total, resource) => {
                return total + resource.duration;
            }, 0);
            
            this.metrics.set('resources', {
                count: resources.length,
                totalLoadTime: totalLoadTime,
                averageLoadTime: totalLoadTime / resources.length
            });
        });
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }

        stopMonitoring() {
        this.isMonitoring = false;
    }
}

// ===== ANALYTICS TRACKER =====
class AnalyticsTracker {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.init();
    }

    init() {
        // Track page views
        this.trackPageView();
        
        // Track interactions
        this.setupInteractionTracking();
        
        // Track performance metrics
        this.trackPerformanceMetrics();
        
        // Send analytics batch every 30 seconds
        setInterval(() => this.sendBatch(), 30000);
        
        // Send analytics on page unload
        window.addEventListener('beforeunload', () => {
            this.sendBatch(true);
        });
    }

    track(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            data: {
                ...data,
                url: window.location.href,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                userAgent: navigator.userAgent
            }
        };
        
        this.events.push(event);
        
        // Send immediately if critical event
        if (this.isCriticalEvent(eventName)) {
            this.sendBatch();
        }
    }

    trackPageView() {
        this.track('page_view', {
            title: document.title,
            referrer: document.referrer,
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
        });
    }

    setupInteractionTracking() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-track]');
            if (target) {
                this.track('element_click', {
                    element: target.dataset.track,
                    text: target.textContent.trim().substring(0, 50)
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.track('form_submit', {
                    formId: e.target.id || 'unnamed_form',
                    formAction: e.target.action
                });
            }
        });
        
        // Track video interactions
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', () => {
                this.track('video_play', { videoSrc: video.src });
            });
            
            video.addEventListener('ended', () => {
                this.track('video_complete', { videoSrc: video.src });
            });
        });
    }

    trackPerformanceMetrics() {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
            const firstPaintTime = performance.getEntriesByType('paint')[0]?.startTime || 0;
            
            this.track('performance_metrics', {
                pageLoadTime,
                domReadyTime,
                firstPaintTime,
                resources: performance.getEntriesByType('resource').length
            });
        });
    }

    isCriticalEvent(eventName) {
        const criticalEvents = ['error', 'purchase', 'signup', 'form_submit'];
        return criticalEvents.includes(eventName);
    }

    async sendBatch(immediate = false) {
        if (this.events.length === 0) return;
        
        const batch = [...this.events];
        this.events = [];
        
        try {
            if (immediate && navigator.sendBeacon) {
                // Use sendBeacon for immediate sends (page unload)
                navigator.sendBeacon('/api/analytics', JSON.stringify(batch));
            } else {
                // Regular fetch for normal batches
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(batch)
                });
            }
        } catch (error) {
            // Re-add events to queue if send failed
            this.events.unshift(...batch);
            console.error('Analytics send failed:', error);
        }
    }

    generateSessionId() {
        return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getUserId() {
        let userId = localStorage.getItem('pageant-empress-user-id');
        if (!userId) {
            userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('pageant-empress-user-id', userId);
        }
        return userId;
    }
}

// ===== FORM VALIDATION SYSTEM =====
class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = new Map();
        this.errors = new Map();
        this.init();
    }

    init() {
        // Prevent default HTML5 validation
        this.form.setAttribute('novalidate', true);
        
        // Setup field validators
        this.setupFieldValidators();
        
        // Setup form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Setup real-time validation
        this.setupRealtimeValidation();
    }

    setupFieldValidators() {
        this.form.querySelectorAll('[data-validate]').forEach(field => {
            const rules = field.dataset.validate.split(',').map(r => r.trim());
            this.fields.set(field.name, {
                element: field,
                rules: rules,
                touched: false
            });
        });
    }

    setupRealtimeValidation() {
        this.fields.forEach((fieldConfig, fieldName) => {
            const field = fieldConfig.element;
            
            // Validate on blur
            field.addEventListener('blur', () => {
                fieldConfig.touched = true;
                this.validateField(fieldName);
            });
            
            // Clear error on input
            field.addEventListener('input', () => {
                if (fieldConfig.touched) {
                    this.clearFieldError(fieldName);
                    
                    // Debounced validation
                    clearTimeout(field.validationTimeout);
                    field.validationTimeout = setTimeout(() => {
                        this.validateField(fieldName);
                    }, 500);
                }
            });
        });
    }

    validateField(fieldName) {
        const fieldConfig = this.fields.get(fieldName);
        if (!fieldConfig) return true;
        
        const field = fieldConfig.element;
        const value = field.value.trim();
        const rules = fieldConfig.rules;
        
        for (const rule of rules) {
            const [ruleName, ...params] = rule.split(':');
            const validator = this.validators[ruleName];
            
            if (validator) {
                const result = validator(value, field, params.join(':'));
                if (result !== true) {
                    this.setFieldError(fieldName, result);
                    return false;
                }
            }
        }
        
        this.clearFieldError(fieldName);
        return true;
    }

    setFieldError(fieldName, message) {
        const fieldConfig = this.fields.get(fieldName);
        const field = fieldConfig.element;
        const formGroup = field.closest('.form-group');
        
        this.errors.set(fieldName, message);
        
        // Add error classes
        field.classList.add('error');
        formGroup?.classList.add('has-error');
        
        // Display error message
        let errorElement = formGroup?.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup?.appendChild(errorElement);
        }
        errorElement.textContent = message;
        
        // Animate error
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
            errorElement.style.transition = 'all 0.3s ease';
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        });
    }

    clearFieldError(fieldName) {
        const fieldConfig = this.fields.get(fieldName);
        const field = fieldConfig.element;
        const formGroup = field.closest('.form-group');
        
        this.errors.delete(fieldName);
        
        // Remove error classes
        field.classList.remove('error');
        formGroup?.classList.remove('has-error');
        
        // Remove error message
        const errorElement = formGroup?.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => errorElement.remove(), 300);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        this.fields.forEach((fieldConfig, fieldName) => {
            fieldConfig.touched = true;
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.onSubmitSuccess();
        } else {
            this.onSubmitError();
        }
    }

    onSubmitSuccess() {
        // Show success notification
        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'success',
                message: 'Form submitted successfully!',
                duration: 3000
            });
        }
        
        // Submit form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Track form submission
        if (window.app?.analytics) {
            window.app.analytics.track('form_submit_success', {
                formId: this.form.id,
                fields: Object.keys(data)
            });
        }
        
        // Reset form after short delay
        setTimeout(() => {
            this.form.reset();
            this.fields.forEach((fieldConfig) => {
                fieldConfig.touched = false;
            });
        }, 1000);
    }

    onSubmitError() {
        // Show error notification
        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'error',
                message: 'Please correct the errors in the form.',
                duration: 5000
            });
        }
        
        // Focus first error field
        const firstError = Array.from(this.errors.keys())[0];
        if (firstError) {
            const field = this.fields.get(firstError).element;
            field.focus();
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Validation rules
    validators = {
        required: (value) => {
            return value.length > 0 || 'This field is required';
        },
        
        email: (value) => {
            if (!value) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) || 'Please enter a valid email address';
        },
        
        minLength: (value, field, length) => {
            if (!value) return true;
            const minLength = parseInt(length);
            return value.length >= minLength || `Must be at least ${minLength} characters`;
        },
        
        maxLength: (value, field, length) => {
            if (!value) return true;
            const maxLength = parseInt(length);
            return value.length <= maxLength || `Must be no more than ${maxLength} characters`;
        },
        
        pattern: (value, field, pattern) => {
            if (!value) return true;
            const regex = new RegExp(pattern);
            return regex.test(value) || 'Invalid format';
        },
        
        phone: (value) => {
            if (!value) return true;
            const phoneRegex = /^\+?[\d\s-()]+$/;
            return phoneRegex.test(value) || 'Please enter a valid phone number';
        },
        
        url: (value) => {
            if (!value) return true;
            try {
                new URL(value);
                return true;
            } catch {
                return 'Please enter a valid URL';
            }
        },
        
        match: (value, field, targetFieldName) => {
            const targetField = field.form.querySelector(`[name="${targetFieldName}"]`);
            if (!targetField) return true;
            return value === targetField.value || 'Fields do not match';
        }
    };
}

// ===== ACCESSIBILITY MANAGER =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderAnnouncements();
        this.setupFocusManagement();
        this.setupHighContrastMode();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-gold);
            color: var(--dark-bg);
            padding: 8px;
            text-decoration: none;
            z-index: 100;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + S: Search
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                document.querySelector('.search-toggle')?.click();
            }
            
            // Alt + M: Menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                document.querySelector('.mobile-toggle')?.click();
            }
            
            // Alt + T: Theme toggle
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                document.querySelector('#theme-toggle')?.click();
            }
        });
    }

    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.className = 'sr-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        document.body.appendChild(liveRegion);
        
        // Helper function to announce messages
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        };
    }

    setupFocusManagement() {
        // Add focus visible class
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
        
                // Focus trap for modals
        this.setupFocusTrap();
        
        // Restore focus after modal close
        this.setupFocusRestore();
    }

    setupFocusTrap() {
        const trapFocus = (element) => {
            const focusableElements = element.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
            
            // Focus first element
            firstFocusable?.focus();
        };
        
        // Make trapFocus globally available
        window.trapFocus = trapFocus;
    }

    setupFocusRestore() {
        let previousActiveElement = null;
        
        // Store focus before modal opens
        window.storeFocus = () => {
            previousActiveElement = document.activeElement;
        };
        
        // Restore focus after modal closes
        window.restoreFocus = () => {
            if (previousActiveElement) {
                previousActiveElement.focus();
                previousActiveElement = null;
            }
        };
    }

    setupHighContrastMode() {
        // Check for user preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        if (prefersHighContrast.matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Listen for changes
        prefersHighContrast.addEventListener('change', (e) => {
            document.body.classList.toggle('high-contrast', e.matches);
        });
    }

    setupReducedMotion() {
        // Check for user preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.reduceMotion();
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.reduceMotion();
            } else {
                this.restoreMotion();
            }
        });
    }

    reduceMotion() {
        document.body.classList.add('reduce-motion');
        
        // Pause all animations
        document.querySelectorAll('.sparkle, .geometric-shape').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        
        // Disable parallax effects
        window.disableParallax = true;
        
        // Announce to screen reader
        window.announceToScreenReader?.('Animations reduced');
    }

    restoreMotion() {
        document.body.classList.remove('reduce-motion');
        
        // Resume animations
        document.querySelectorAll('.sparkle, .geometric-shape').forEach(el => {
            el.style.animationPlayState = 'running';
        });
        
        // Enable parallax effects
        window.disableParallax = false;
        
        // Announce to screen reader
        window.announceToScreenReader?.('Animations restored');
    }
}

// ===== LAZY LOADING MANAGER =====
class LazyLoadManager {
    constructor() {
        this.imageObserver = null;
        this.videoObserver = null;
        this.init();
    }

    init() {
        this.setupImageLazyLoading();
        this.setupVideoLazyLoading();
        this.setupIframeLazyLoading();
    }

    setupImageLazyLoading() {
        const imageOptions = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };
        
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, imageOptions);
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
            
            // Add loading placeholder
            img.classList.add('lazy-loading');
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        // Create a new image to load
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Apply sources
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            // Remove loading class with animation
            img.classList.add('lazy-loaded');
            setTimeout(() => {
                img.classList.remove('lazy-loading');
            }, 300);
            
            // Clean up data attributes
            delete img.dataset.src;
            delete img.dataset.srcset;
        };
        
        tempImg.onerror = () => {
            img.classList.add('lazy-error');
            console.error('Failed to load image:', src);
        };
        
        // Start loading
        if (srcset) tempImg.srcset = srcset;
        tempImg.src = src;
    }

    setupVideoLazyLoading() {
        const videoOptions = {
            rootMargin: '100px 0px',
            threshold: 0.25
        };
        
        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    this.videoObserver.unobserve(video);
                }
            });
        }, videoOptions);
        
        // Observe all lazy videos
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }

    loadVideo(video) {
        const sources = video.querySelectorAll('source[data-src]');
        
        sources.forEach(source => {
            source.src = source.dataset.src;
            delete source.dataset.src;
        });
        
        video.load();
        
        // Auto-play if specified
        if (video.dataset.autoplay === 'true') {
            video.play().catch(err => {
                console.warn('Video autoplay failed:', err);
            });
        }
    }

    setupIframeLazyLoading() {
        const iframeOptions = {
            rootMargin: '200px 0px',
            threshold: 0.01
        };
        
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    delete iframe.dataset.src;
                    iframeObserver.unobserve(iframe);
                }
            });
        }, iframeOptions);
        
        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }
}

// ===== RESOURCE PRELOADER =====
class ResourcePreloader {
    constructor() {
        this.preloadedResources = new Set();
        this.init();
    }

    init() {
        this.preloadCriticalResources();
        this.setupPrefetchOnHover();
        this.setupIdlePrefetch();
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fonts = [
            '/fonts/PlayfairDisplay-Bold.woff2',
            '/fonts/Inter-Regular.woff2',
            '/fonts/Inter-Medium.woff2'
        ];
        
        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = font;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // Preload hero images
        const heroImages = document.querySelectorAll('[data-preload="true"]');
        heroImages.forEach(img => {
            this.preloadImage(img.dataset.src || img.src);
        });
    }

    preloadImage(url) {
        if (this.preloadedResources.has(url)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
        
        this.preloadedResources.add(url);
    }

    setupPrefetchOnHover() {
        // Prefetch links on hover
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.href;
            
            // Only prefetch internal links
            if (href.startsWith(window.location.origin) && !this.preloadedResources.has(href)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                document.head.appendChild(prefetchLink);
                
                this.preloadedResources.add(href);
            }
        });
    }

    setupIdlePrefetch() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Prefetch common pages
                const commonPages = [
                    '/training',
                    '/about',
                    '/contact',
                    '/resources'
                ];
                
                commonPages.forEach(page => {
                    if (!this.preloadedResources.has(page)) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.href = page;
                        document.head.appendChild(link);
                        
                        this.preloadedResources.add(page);
                    }
                });
            }, { timeout: 2000 });
        }
    }
}

// ===== SERVICE WORKER MANAGER =====
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
                
                // Check for updates
                this.checkForUpdates();
                
                // Handle updates
                this.handleUpdates();
                
                // Setup message channel
                this.setupMessageChannel();
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    checkForUpdates() {
        if (this.registration) {
            setInterval(() => {
                this.registration.update();
            }, 60000); // Check every minute
        }
    }

    handleUpdates() {
        if (!this.registration) return;
        
        this.registration.addEventListener('updatefound', () => {
            const newWorker = this.registration.installing;
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available
                    this.notifyUpdate();
                }
            });
        });
    }

    notifyUpdate() {
        if (window.app?.notifications) {
            const notificationId = window.app.notifications.show({
                type: 'info',
                message: 'A new version is available! Click to refresh.',
                duration: 0, // Don't auto-dismiss
                dismissible: true
            });
            
            // Add click handler to notification
            setTimeout(() => {
                const notification = document.querySelector(`[data-id="${notificationId}"]`);
                if (notification) {
                    notification.style.cursor = 'pointer';
                    notification.addEventListener('click', () => {
                        window.location.reload();
                    });
                }
            }, 100);
        }
    }

    setupMessageChannel() {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'CACHE_UPDATED') {
                console.log('Cache updated:', event.data.payload);
            }
        });
    }

    // Send message to service worker
    postMessage(message) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        }
    }
}

// ===== UTILITY FUNCTIONS =====
const Utils = {
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
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    },

    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    },

    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        }
        
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        } finally {
            document.body.removeChild(textArea);
        }
    },

    shareContent(data) {
        if (navigator.share) {
            return navigator.share(data);
        }
        
        // Fallback - copy URL
        return this.copyToClipboard(data.url || window.location.href);
    }
};

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.app = new PageantEmpressApp();
    
    // Initialize additional managers
    window.accessibility = new AccessibilityManager();
    window.lazyLoad = new LazyLoadManager();
    window.preloader = new ResourcePreloader();
    window.serviceWorker = new ServiceWorkerManager();
    
    // Initialize forms
    document.querySelectorAll('form[data-validate]').forEach(form => {
        new FormValidator(form);
    });
    
    // Log successful initialization
    console.log('🎉 Pageant Empress initialized successfully!');
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PageantEmpressApp,
        SparkleSystem,
                GeometricShapeSystem,
        HeaderController,
        MobileMenuController,
        SearchController,
        NotificationSystem,
        AnimationController,
        PerformanceMonitor,
        AnalyticsTracker,
        FormValidator,
        AccessibilityManager,
        LazyLoadManager,
        ResourcePreloader,
        ServiceWorkerManager,
        Utils
    };
}

// ===== ADDITIONAL FEATURES =====

// ===== YOUTUBE INTEGRATION =====
class YouTubeIntegration {
    constructor(channelId, apiKey) {
        this.channelId = channelId;
        this.apiKey = apiKey;
        this.player = null;
        this.videos = [];
        this.init();
    }

    async init() {
        await this.loadYouTubeAPI();
        await this.fetchChannelData();
        this.setupVideoGallery();
    }

    loadYouTubeAPI() {
        return new Promise((resolve) => {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = resolve;
        });
    }

    async fetchChannelData() {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=20`);
            const data = await response.json();
            
            this.videos = data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high.url,
                publishedAt: new Date(item.snippet.publishedAt)
            }));
            
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
        }
    }

    setupVideoGallery() {
        const gallery = document.getElementById('youtube-gallery');
        if (!gallery) return;
        
        const videosHTML = this.videos.map(video => `
            <div class="video-card" data-video-id="${video.id}">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p class="video-date">${Utils.formatDate(video.publishedAt)}</p>
                </div>
            </div>
        `).join('');
        
        gallery.innerHTML = videosHTML;
        
        // Add click handlers
        gallery.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.videoId;
                this.playVideo(videoId);
            });
        });
    }

    playVideo(videoId) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <div id="youtube-player"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Create player
        this.player = new YT.Player('youtube-player', {
            videoId: videoId,
            width: '100%',
            height: '100%',
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: (event) => {
                    event.target.playVideo();
                }
            }
        });
        
        // Close modal
        modal.querySelector('.video-modal-close').addEventListener('click', () => {
            this.closeVideoModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeVideoModal();
            }
        });
    }

    closeVideoModal() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
        document.querySelector('.video-modal')?.remove();
    }
}

// ===== PAGEANT TRAINING MODULE =====
class PageantTrainingModule {
    constructor() {
        this.categories = new Map();
        this.userProgress = new Map();
        this.currentModule = null;
        this.init();
    }

    async init() {
        await this.loadTrainingData();
        this.setupTrainingInterface();
        this.loadUserProgress();
    }

    async loadTrainingData() {
        // In production, this would fetch from an API
        this.categories.set('walking', {
            title: 'Runway Walking',
            modules: [
                {
                    id: 'walk-basics',
                    title: 'Basic Runway Walk',
                    duration: '15 min',
                    difficulty: 'Beginner',
                    videoUrl: '/videos/walk-basics.mp4',
                    description: 'Learn the fundamentals of pageant walking'
                },
                {
                    id: 'walk-turns',
                    title: 'Turns and Pivots',
                    duration: '20 min',
                    difficulty: 'Intermediate',
                    videoUrl: '/videos/walk-turns.mp4',
                    description: 'Master elegant turns on the runway'
                }
            ]
        });

        this.categories.set('interview', {
            title: 'Interview Skills',
            modules: [
                {
                    id: 'interview-basics',
                    title: 'Interview Fundamentals',
                    duration: '30 min',
                    difficulty: 'Beginner',
                    videoUrl: '/videos/interview-basics.mp4',
                    description: 'Essential interview techniques'
                },
                {
                    id: 'interview-advanced',
                    title: 'Advanced Q&A Strategies',
                    duration: '45 min',
                    difficulty: 'Advanced',
                    videoUrl: '/videos/interview-advanced.mp4',
                    description: 'Master complex interview scenarios'
                }
            ]
        });
    }

    setupTrainingInterface() {
        const container = document.getElementById('training-modules');
        if (!container) return;

        const categoriesHTML = Array.from(this.categories.entries()).map(([key, category]) => `
            <div class="training-category" data-category="${key}">
                <h2 class="category-title">${category.title}</h2>
                <div class="modules-grid">
                    ${category.modules.map(module => this.createModuleCard(module, key)).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = categoriesHTML;

        // Add event listeners
        container.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                const moduleId = card.dataset.moduleId;
                const category = card.dataset.category;
                this.startModule(category, moduleId);
            });
        });
    }

    createModuleCard(module, category) {
        const progress = this.getUserProgress(module.id);
        const isCompleted = progress >= 100;
        
        return `
            <div class="module-card ${isCompleted ? 'completed' : ''}" 
                 data-module-id="${module.id}" 
                 data-category="${category}">
                <div class="module-thumbnail">
                    <img src="/images/modules/${module.id}.jpg" alt="${module.title}">
                    ${isCompleted ? '<div class="completion-badge"><i class="fas fa-check"></i></div>' : ''}
                </div>
                <div class="module-content">
                    <h3>${module.title}</h3>
                    <p class="module-description">${module.description}</p>
                    <div class="module-meta">
                        <span class="duration"><i class="fas fa-clock"></i> ${module.duration}</span>
                        <span class="difficulty ${module.difficulty.toLowerCase()}">${module.difficulty}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    startModule(category, moduleId) {
        const categoryData = this.categories.get(category);
        const module = categoryData.modules.find(m => m.id === moduleId);
        
        if (!module) return;

        this.currentModule = { category, moduleId, module };
        
        // Create module viewer
        const viewer = document.createElement('div');
        viewer.className = 'module-viewer';
        viewer.innerHTML = `
            <div class="viewer-header">
                <button class="viewer-back"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>${module.title}</h2>
                <button class="viewer-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="viewer-content">
                <video id="module-video" controls>
                    <source src="${module.videoUrl}" type="video/mp4">
                </video>
                <div class="viewer-sidebar">
                    <div class="module-info">
                        <h3>About this module</h3>
                        <p>${module.description}</p>
                        <div class="module-stats">
                            <div class="stat">
                                <i class="fas fa-clock"></i>
                                <span>${module.duration}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-signal"></i>
                                <span>${module.difficulty}</span>
                            </div>
                        </div>
                    </div>
                    <div class="module-actions">
                        <button class="btn btn-primary mark-complete">
                            <i class="fas fa-check"></i> Mark as Complete
                        </button>
                        <button class="btn btn-secondary take-notes">
                            <i class="fas fa-sticky-note"></i> Take Notes
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(viewer);
        
        // Setup video tracking
        const video = document.getElementById('module-video');
        this.trackVideoProgress(video);

        // Event listeners
        viewer.querySelector('.viewer-back').addEventListener('click', () => {
            this.closeModuleViewer();
        });

        viewer.querySelector('.viewer-close').addEventListener('click', () => {
            this.closeModuleViewer();
        });

        viewer.querySelector('.mark-complete').addEventListener('click', () => {
            this.markModuleComplete(moduleId);
        });

        viewer.querySelector('.take-notes').addEventListener('click', () => {
            this.openNotesEditor(moduleId);
        });

        // Track module start
        if (window.app?.analytics) {
            window.app.analytics.track('module_started', {
                category,
                moduleId,
                title: module.title
            });
        }
    }

    trackVideoProgress(video) {
        let lastProgress = 0;
        
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            
            // Update progress every 10%
            if (progress - lastProgress >= 10) {
                this.updateProgress(this.currentModule.moduleId, progress);
                lastProgress = progress;
            }
        });

        video.addEventListener('ended', () => {
            this.updateProgress(this.currentModule.moduleId, 100);
            this.showCompletionModal();
        });
    }

    updateProgress(moduleId, progress) {
        this.userProgress.set(moduleId, progress);
        this.saveUserProgress();
        
        // Update UI
        const progressBar = document.querySelector(`[data-module-id="${moduleId}"] .progress-fill`);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    markModuleComplete(moduleId) {
        this.updateProgress(moduleId, 100);
        
        // Show completion animation
        const moduleCard = document.querySelector(`[data-module-id="${moduleId}"]`);
        if (moduleCard) {
            moduleCard.classList.add('completed');
        }

        // Show notification
        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'success',
                message: 'Module completed! Great job! 🎉',
                duration: 3000
            });
        }

        // Track completion
        if (window.app?.analytics) {
            window.app.analytics.track('module_completed', {
                moduleId,
                category: this.currentModule.category
            });
        }
    }

    showCompletionModal() {
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2>Congratulations!</h2>
                <p>You've completed this training module!</p>
                <div class="completion-actions">
                    <button class="btn btn-primary next-module">Next Module</button>
                    <button class="btn btn-secondary view-progress">View Progress</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add animations
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Event listeners
        modal.querySelector('.next-module').addEventListener('click', () => {
            this.goToNextModule();
            modal.remove();
        });

        modal.querySelector('.view-progress').addEventListener('click', () => {
            this.showProgressDashboard();
            modal.remove();
        });
    }

    goToNextModule() {
        // Find next module in category
        const category = this.categories.get(this.currentModule.category);
        const currentIndex = category.modules.findIndex(m => m.id === this.currentModule.moduleId);
        
        if (currentIndex < category.modules.length - 1) {
            const nextModule = category.modules[currentIndex + 1];
            this.closeModuleViewer();
            this.startModule(this.currentModule.category, nextModule.id);
        } else {
            // No more modules in category
            this.closeModuleViewer();
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'info',
                    message: 'You\'ve completed all modules in this category!',
                    duration: 4000
                });
            }
        }
    }

    closeModuleViewer() {
        document.querySelector('.module-viewer')?.remove();
        this.currentModule = null;
    }

    openNotesEditor(moduleId) {
        const notesModal = document.createElement('div');
        notesModal.className = 'notes-modal';
        notesModal.innerHTML = `
            <div class="notes-content">
                <div class="notes-header">
                    <h3>Module Notes</h3>
                    <button class="notes-close">&times;</button>
                </div>
                <textarea class="notes-textarea" placeholder="Take your notes here..."></textarea>
                <div class="notes-actions">
                    <button class="btn btn-primary save-notes">Save Notes</button>
                </div>
            </div>
        `;

        document.body.appendChild(notesModal);

        // Load existing notes
        const existingNotes = this.getNotes(moduleId);
                if (existingNotes) {
            notesModal.querySelector('.notes-textarea').value = existingNotes;
        }

        // Event listeners
        notesModal.querySelector('.notes-close').addEventListener('click', () => {
            notesModal.remove();
        });

        notesModal.querySelector('.save-notes').addEventListener('click', () => {
            const notes = notesModal.querySelector('.notes-textarea').value;
            this.saveNotes(moduleId, notes);
            notesModal.remove();
            
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'success',
                    message: 'Notes saved successfully!',
                    duration: 2000
                });
            }
        });
    }

    saveNotes(moduleId, notes) {
        const allNotes = JSON.parse(localStorage.getItem('module-notes') || '{}');
        allNotes[moduleId] = notes;
        localStorage.setItem('module-notes', JSON.stringify(allNotes));
    }

    getNotes(moduleId) {
        const allNotes = JSON.parse(localStorage.getItem('module-notes') || '{}');
        return allNotes[moduleId] || '';
    }

    showProgressDashboard() {
        // Implementation for progress dashboard
        console.log('Progress Dashboard - To be implemented');
    }

    getUserProgress(moduleId) {
        return this.userProgress.get(moduleId) || 0;
    }

    loadUserProgress() {
        const savedProgress = localStorage.getItem('training-progress');
        if (savedProgress) {
            const progressData = JSON.parse(savedProgress);
            Object.entries(progressData).forEach(([moduleId, progress]) => {
                this.userProgress.set(moduleId, progress);
            });
        }
    }

    saveUserProgress() {
        const progressData = Object.fromEntries(this.userProgress);
        localStorage.setItem('training-progress', JSON.stringify(progressData));
    }
}

// ===== COMPETITION CALENDAR =====
class CompetitionCalendar {
    constructor() {
        this.competitions = [];
        this.currentView = 'month';
        this.currentDate = new Date();
        this.init();
    }

    async init() {
        await this.loadCompetitions();
        this.renderCalendar();
        this.setupEventListeners();
    }

    async loadCompetitions() {
        // In production, this would fetch from an API
        this.competitions = [
            {
                id: 1,
                title: 'Miss Universe 2024',
                date: new Date('2024-12-15'),
                location: 'Las Vegas, NV',
                category: 'international',
                registrationDeadline: new Date('2024-10-01'),
                entryFee: 500,
                ageRequirements: '18-28',
                description: 'The most prestigious international pageant'
            },
            {
                id: 2,
                title: 'Miss World 2024',
                date: new Date('2024-11-20'),
                location: 'London, UK',
                category: 'international',
                registrationDeadline: new Date('2024-09-15'),
                entryFee: 450,
                ageRequirements: '17-27',
                description: 'Beauty with a purpose'
            },
            {
                id: 3,
                title: 'State Pageant Championship',
                date: new Date('2024-08-10'),
                location: 'Austin, TX',
                category: 'state',
                registrationDeadline: new Date('2024-07-01'),
                entryFee: 250,
                ageRequirements: '16-26',
                description: 'Your gateway to national competitions'
            }
        ];
    }

    renderCalendar() {
        const container = document.getElementById('competition-calendar');
        if (!container) return;

        const calendarHTML = `
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button class="calendar-prev"><i class="fas fa-chevron-left"></i></button>
                    <h2 class="calendar-title">${this.getMonthYear()}</h2>
                    <button class="calendar-next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-views">
                    <button class="view-btn ${this.currentView === 'month' ? 'active' : ''}" data-view="month">Month</button>
                    <button class="view-btn ${this.currentView === 'list' ? 'active' : ''}" data-view="list">List</button>
                </div>
            </div>
            <div class="calendar-body">
                ${this.currentView === 'month' ? this.renderMonthView() : this.renderListView()}
            </div>
        `;

        container.innerHTML = calendarHTML;
        this.attachCalendarEvents();
    }

    renderMonthView() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = '<div class="calendar-grid">';
        
        // Day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Calendar days
        const current = new Date(startDate);
        while (current <= lastDay || current.getDay() !== 0) {
            const isCurrentMonth = current.getMonth() === this.currentDate.getMonth();
            const isToday = this.isToday(current);
            const competitions = this.getCompetitionsForDate(current);

            html += `
                <div class="calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}">
                    <div class="day-number">${current.getDate()}</div>
                    ${competitions.map(comp => `
                        <div class="calendar-event ${comp.category}" data-competition-id="${comp.id}">
                            <span class="event-time">${this.formatTime(comp.date)}</span>
                            <span class="event-title">${comp.title}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            current.setDate(current.getDate() + 1);
        }

        html += '</div>';
        return html;
    }

    renderListView() {
        const upcomingCompetitions = this.competitions
            .filter(comp => comp.date >= new Date())
            .sort((a, b) => a.date - b.date);

        return `
            <div class="competition-list">
                ${upcomingCompetitions.map(comp => `
                    <div class="competition-item" data-competition-id="${comp.id}">
                        <div class="competition-date">
                            <div class="date-month">${this.getMonthShort(comp.date)}</div>
                            <div class="date-day">${comp.date.getDate()}</div>
                        </div>
                        <div class="competition-details">
                            <h3>${comp.title}</h3>
                            <p class="competition-location"><i class="fas fa-map-marker-alt"></i> ${comp.location}</p>
                            <p class="competition-meta">
                                <span class="category-badge ${comp.category}">${comp.category}</span>
                                <span class="entry-fee">Entry: $${comp.entryFee}</span>
                                <span class="age-range">Ages: ${comp.ageRequirements}</span>
                            </p>
                        </div>
                        <div class="competition-actions">
                            <button class="btn btn-primary register-btn">Register</button>
                            <button class="btn btn-secondary details-btn">Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachCalendarEvents() {
        // Navigation
        document.querySelector('.calendar-prev')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.querySelector('.calendar-next')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentView = btn.dataset.view;
                this.renderCalendar();
            });
        });

        // Competition clicks
        document.querySelectorAll('[data-competition-id]').forEach(element => {
            element.addEventListener('click', (e) => {
                const competitionId = parseInt(element.dataset.competitionId);
                if (e.target.classList.contains('register-btn')) {
                    this.openRegistrationModal(competitionId);
                } else if (e.target.classList.contains('details-btn') || !e.target.classList.contains('btn')) {
                    this.showCompetitionDetails(competitionId);
                }
            });
        });
    }

    showCompetitionDetails(competitionId) {
        const competition = this.competitions.find(c => c.id === competitionId);
        if (!competition) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content competition-modal">
                <div class="modal-header">
                    <h2>${competition.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="competition-hero">
                        <img src="/images/competitions/${competition.id}.jpg" alt="${competition.title}">
                        <div class="competition-badge ${competition.category}">${competition.category}</div>
                    </div>
                    <div class="competition-info">
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-calendar"></i>
                                <div>
                                    <h4>Date</h4>
                                    <p>${this.formatFullDate(competition.date)}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Location</h4>
                                    <p>${competition.location}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-dollar-sign"></i>
                                <div>
                                    <h4>Entry Fee</h4>
                                    <p>$${competition.entryFee}</p>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <h4>Age Requirements</h4>
                                    <p>${competition.ageRequirements}</p>
                                </div>
                            </div>
                        </div>
                        <div class="competition-description">
                            <h3>About This Competition</h3>
                            <p>${competition.description}</p>
                        </div>
                        <div class="registration-deadline">
                            <i class="fas fa-exclamation-circle"></i>
                            Registration deadline: ${this.formatFullDate(competition.registrationDeadline)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary register-now">Register Now</button>
                    <button class="btn btn-secondary add-to-calendar">Add to Calendar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('.register-now').addEventListener('click', () => {
            modal.remove();
            this.openRegistrationModal(competitionId);
        });

        modal.querySelector('.add-to-calendar').addEventListener('click', () => {
            this.addToCalendar(competition);
        });
    }

    openRegistrationModal(competitionId) {
        const competition = this.competitions.find(c => c.id === competitionId);
        if (!competition) return;

        // Check if registration is still open
        if (new Date() > competition.registrationDeadline) {
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'error',
                    message: 'Registration deadline has passed for this competition.',
                    duration: 4000
                });
            }
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content registration-modal">
                <div class="modal-header">
                    <h2>Register for ${competition.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="registration-form" data-validate>
                        <div class="form-section">
                            <h3>Personal Information</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" name="firstName" class="form-input" placeholder=" " data-validate="required">
                                    <label class="form-label">First Name</label>
                                </div>
                                <div class="form-group">
                                    <input type="text" name="lastName" class="form-input" placeholder=" " data-validate="required">
                                    <label class="form-label">Last Name</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="email" name="email" class="form-input" placeholder=" " data-validate="required,email">
                                <label class="form-label">Email Address</label>
                            </div>
                            <div class="form-group">
                                <input type="tel" name="phone" class="form-input" placeholder=" " data-validate="required,phone">
                                <label class="form-label">Phone Number</label>
                            </div>
                            <div class="form-group">
                                <input type="date" name="birthdate" class="form-input" data-validate="required">
                                <label class="form-label">Date of Birth</label>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Competition Details</h3>
                            <div class="form-group">
                                <select name="division" class="form-input" data-validate="required">
                                    <option value="">Select Division</option>
                                    <option value="teen">Teen (13-17)</option>
                                    <option value="miss">Miss (18-27)</option>
                                    <option value="ms">Ms. (28+)</option>
                                </select>
                                <label class="form-label">Division</label>
                            </div>
                            <div class="form-group">
                                <textarea name="experience" class="form-input" rows="4" placeholder=" " data-validate="required,minLength:50">
                                </textarea>
                                <label class="form-label">Previous Pageant Experience</label>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h3>Payment Information</h3>
                                                        <div class="payment-summary">
                                <div class="payment-line">
                                    <span>Entry Fee:</span>
                                    <span>$${competition.entryFee}</span>
                                </div>
                                <div class="payment-line">
                                    <span>Processing Fee:</span>
                                    <span>$25</span>
                                </div>
                                <div class="payment-line total">
                                    <span>Total:</span>
                                    <span>$${competition.entryFee + 25}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="payment-methods">
                                    <label class="payment-method">
                                        <input type="radio" name="paymentMethod" value="card" checked>
                                        <span><i class="fas fa-credit-card"></i> Credit/Debit Card</span>
                                    </label>
                                    <label class="payment-method">
                                        <input type="radio" name="paymentMethod" value="paypal">
                                        <span><i class="fab fa-paypal"></i> PayPal</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <label class="checkbox-label">
                                <input type="checkbox" name="terms" data-validate="required">
                                <span>I agree to the competition rules and regulations</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" name="mediaRelease">
                                <span>I consent to media release and photography</span>
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" form="registration-form" class="btn btn-primary">Complete Registration</button>
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize form validation
        new FormValidator(document.getElementById('registration-form'));

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Handle form submission
        document.getElementById('registration-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.processRegistration(competition, new FormData(e.target));
        });
    }

    async processRegistration(competition, formData) {
        // Show loading state
        const submitBtn = document.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success
            document.querySelector('.modal-overlay').remove();
            
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'success',
                    message: `Successfully registered for ${competition.title}! Check your email for confirmation.`,
                    duration: 5000
                });
            }

            // Track registration
            if (window.app?.analytics) {
                window.app.analytics.track('competition_registered', {
                    competitionId: competition.id,
                    competitionTitle: competition.title,
                    category: competition.category
                });
            }

        } catch (error) {
            console.error('Registration error:', error);
            
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'error',
                    message: 'Registration failed. Please try again.',
                    duration: 4000
                });
            }

            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    addToCalendar(competition) {
        const calendarEvent = {
            title: competition.title,
            start: competition.date.toISOString(),
            location: competition.location,
            description: competition.description
        };

        // Create calendar file
        const icsContent = this.generateICS(calendarEvent);
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${competition.title.replace(/\s+/g, '-')}.ics`;
        link.click();
        
        URL.revokeObjectURL(url);

        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'success',
                message: 'Event added to calendar!',
                duration: 2000
            });
        }
    }

    generateICS(event) {
        const formatDate = (date) => {
            return new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        };

        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pageant Empress//Competition Calendar//EN
BEGIN:VEVENT
UID:${Date.now()}@pageantempresss.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.start)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
    }

    getCompetitionsForDate(date) {
        return this.competitions.filter(comp => 
            comp.date.toDateString() === date.toDateString()
        );
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getMonthYear() {
        return this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    }

    getMonthShort(date) {
        return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    }

    formatFullDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        // Add global event listeners for calendar
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('#competition-calendar')) {
                if (e.key === 'ArrowLeft') {
                    document.querySelector('.calendar-prev')?.click();
                } else if (e.key === 'ArrowRight') {
                    document.querySelector('.calendar-next')?.click();
                }
            }
        });
    }
}

// ===== ADVANCED ANIMATION EFFECTS =====
class AdvancedAnimations {
    constructor() {
        this.parallaxElements = [];
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupMagneticButtons();
        this.setupTextAnimations();
        this.setupImageReveal();
        this.setupCursorEffects();
    }

    setupParallax() {
        // Find all parallax elements
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (this.parallaxElements.length === 0) return;

        // Throttled scroll handler
        let ticking = false;
        const updateParallax = () => {
            if (window.disableParallax) {
                ticking = false;
                return;
            }

            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;

            this.parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                
                // Only animate elements in viewport
                if (rect.bottom >= 0 && rect.top <= windowHeight) {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Magnetic effect strength
                const strength = 0.3;
                
                button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupTextAnimations() {
        // Split text animations
        const splitTextElements = document.querySelectorAll('.split-text');
        
        splitTextElements.forEach(element => {
            const text = element.textContent;
            element.innerHTML = '';
            
            // Split into characters
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.className = 'char';
                element.appendChild(span);
            });
        });

        // Typewriter effect
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            element.textContent = '';
            
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    element.classList.add('typing-complete');
                }
            }, 100);
        });
    }

    setupImageReveal() {
        const revealImages = document.querySelectorAll('.reveal-image');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('revealed');
                    
                    // Create reveal overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'reveal-overlay';
                    img.parentElement.appendChild(overlay);
                    
                    // Animate overlay
                    setTimeout(() => {
                        overlay.style.transform = 'translateX(100%)';
                        setTimeout(() => overlay.remove(), 800);
                    }, 100);
                    
                    revealObserver.unobserve(img);
                }
            });
        }, { threshold: 0.3 });

        revealImages.forEach(img => revealObserver.observe(img));
    }

    setupCursorEffects() {
        // Custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate update for dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth follow animation
        const animateCursor = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .interactive');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    }
}

// ===== INITIALIZE ENHANCED FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize YouTube integration
    if (document.getElementById('youtube-gallery')) {
        window.youtubeIntegration = new YouTubeIntegration(
            'YOUR_CHANNEL_ID',
            'YOUR_API_KEY'
        );
    }

    // Initialize training modules
    if (document.getElementById('training-modules')) {
        window.trainingModule = new PageantTrainingModule();
    }

    // Initialize competition calendar
    if (document.getElementById('competition-calendar')) {
        window.competitionCalendar = new CompetitionCalendar();
    }

    // Initialize advanced animations
    window.advancedAnimations = new AdvancedAnimations();
});

// ===== SERVICE WORKER =====
// sw.js content
const CACHE_NAME = 'pageant-empress-v1';
const urlsToCache = [
    '/',
    '/css/styles.css',
    '/js/main.js',
    '/images/logo.png',
    '/fonts/PlayfairDisplay-Bold.woff2',
    '/fonts/Inter-Regular.woff2'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
// ===== COMPLETE SERVICE WORKER IMPLEMENTATION =====
// sw.js (continued)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Advanced caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Network first for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache first for assets
    if (request.destination === 'image' || 
        request.destination === 'style' || 
        request.destination === 'script') {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
        return;
    }

    // Default strategy
    event.respondWith(
        caches.match(request).then(response => {
            return response || fetch(request);
        })
    );
});

// Background sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    const db = await openDB();
    const tx = db.transaction('analytics', 'readonly');
    const store = tx.objectStore('analytics');
    const events = await store.getAll();

    if (events.length > 0) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(events)
            });

            // Clear synced events
            const clearTx = db.transaction('analytics', 'readwrite');
            await clearTx.objectStore('analytics').clear();
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
}

// ===== ADVANCED USER PROFILE SYSTEM =====
class UserProfileSystem {
    constructor() {
        this.user = null;
        this.preferences = new Map();
        this.achievements = new Map();
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupProfileUI();
        this.trackUserActivity();
    }

    async loadUserData() {
        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                this.loadPreferences();
                this.loadAchievements();
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    setupProfileUI() {
        const profileContainer = document.getElementById('user-profile');
        if (!profileContainer || !this.user) return;

        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="${this.user.avatar || '/images/default-avatar.png'}" alt="${this.user.name}">
                    <button class="avatar-edit" aria-label="Change avatar">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
                <div class="profile-info">
                    <h2>${this.user.name}</h2>
                    <p class="profile-title">${this.user.title || 'Pageant Contestant'}</p>
                    <div class="profile-stats">
                        <div class="stat">
                            <span class="stat-value">${this.user.competitionsWon || 0}</span>
                            <span class="stat-label">Wins</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${this.user.trainingHours || 0}</span>
                            <span class="stat-label">Training Hours</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${this.achievements.size}</span>
                            <span class="stat-label">Achievements</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-content">
                <div class="profile-section">
                    <h3>Recent Achievements</h3>
                    <div class="achievements-grid">
                        ${this.renderAchievements()}
                    </div>
                </div>
                <div class="profile-section">
                    <h3>Training Progress</h3>
                    <div class="progress-chart">
                        <canvas id="training-progress-chart"></canvas>
                    </div>
                </div>
                <div class="profile-section">
                    <h3>Upcoming Competitions</h3>
                    <div class="competitions-list">
                        ${this.renderUpcomingCompetitions()}
                    </div>
                </div>
            </div>
        `;

        // Setup interactions
        this.setupAvatarUpload();
        this.renderProgressChart();
    }

    renderAchievements() {
        const recentAchievements = Array.from(this.achievements.values())
            .sort((a, b) => b.unlockedAt - a.unlockedAt)
            .slice(0, 6);

        return recentAchievements.map(achievement => `
            <div class="achievement-card ${achievement.rarity}">
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-date">${Utils.formatDate(achievement.unlockedAt)}</span>
                </div>
            </div>
        `).join('');
    }

    renderUpcomingCompetitions() {
        if (!this.user.upcomingCompetitions || this.user.upcomingCompetitions.length === 0) {
            return '<p class="empty-state">No upcoming competitions</p>';
        }

        return this.user.upcomingCompetitions.map(comp => `
            <div class="competition-item">
                <div class="competition-date">
                    <span class="month">${new Date(comp.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span class="day">${new Date(comp.date).getDate()}</span>
                </div>
                <div class="competition-details">
                    <h4>${comp.title}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${comp.location}</p>
                </div>
                <div class="competition-status">
                    <span class="status-badge ${comp.status}">${comp.status}</span>
                </div>
            </div>
        `).join('');
    }

    setupAvatarUpload() {
        const avatarEdit = document.querySelector('.avatar-edit');
        if (!avatarEdit) return;

        avatarEdit.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.uploadAvatar(file);
                }
            });
            
            input.click();
        });
    }

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                this.user.avatar = data.avatarUrl;
                
                // Update UI
                document.querySelector('.profile-avatar img').src = data.avatarUrl;
                
                if (window.app?.notifications) {
                    window.app.notifications.show({
                        type: 'success',
                        message: 'Profile picture updated successfully!',
                        duration: 3000
                    });
                }
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
            
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'error',
                    message: 'Failed to update profile picture',
                    duration: 4000
                });
            }
        }
    }

    renderProgressChart() {
        const ctx = document.getElementById('training-progress-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Walking', 'Interview', 'Evening Gown', 'Talent', 'Fitness', 'Public Speaking'],
                datasets: [{
                    label: 'Current Progress',
                    data: [85, 70, 90, 65, 80, 75],
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderColor: 'var(--primary-gold)',
                    pointBackgroundColor: 'var(--primary-gold)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'var(--primary-gold)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    trackUserActivity() {
        // Track time spent on platform
        let startTime = Date.now();
        let totalTime = 0;

        const updateTimeSpent = () => {
            const currentTime = Date.now();
            totalTime += (currentTime - startTime) / 1000; // Convert to seconds
            startTime = currentTime;
            
            // Update every 5 minutes
            if (totalTime >= 300) {
                this.updateTrainingHours(totalTime / 3600); // Convert to hours
                totalTime = 0;
            }
        };

        // Update on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                updateTimeSpent();
            } else {
                startTime = Date.now();
            }
        });

        // Update on page unload
        window.addEventListener('beforeunload', updateTimeSpent);
    }

    async updateTrainingHours(hours) {
        try {
            await fetch('/api/user/training-hours', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hours })
            });
        } catch (error) {
            console.error('Failed to update training hours:', error);
        }
    }

    loadPreferences() {
        const savedPreferences = localStorage.getItem('user-preferences');
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);
            Object.entries(prefs).forEach(([key, value]) => {
                this.preferences.set(key, value);
            });
        }
    }

    savePreference(key, value) {
        this.preferences.set(key, value);
        const prefs = Object.fromEntries(this.preferences);
        localStorage.setItem('user-preferences', JSON.stringify(prefs));
    }

    loadAchievements() {
        // Sample achievements
        const achievements = [
            {
                id: 'first-win',
                title: 'First Victory',
                description: 'Won your first pageant competition',
                icon: 'trophy',
                rarity: 'gold',
                unlockedAt: new Date('2024-01-15')
            },
            {
                id: 'training-dedication',
                title: 'Training Dedication',
                description: 'Completed 100 hours of training',
                icon: 'dumbbell',
                rarity: 'silver',
                unlockedAt: new Date('2024-02-20')
            },
            {
                id: 'perfect-walk',
                title: 'Perfect Walk',
                description: 'Achieved a perfect score in runway walking',
                icon: 'star',
                rarity: 'gold',
                unlockedAt: new Date('2024-03-10')
            }
        ];

        achievements.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }

    getAuthToken() {
        return localStorage.getItem('auth-token');
    }
}

// ===== SOCIAL FEATURES =====
class SocialFeatures {
    constructor() {
        this.posts = [];
        this.following = new Set();
        this.init();
    }

    async init() {
        await this.loadSocialFeed();
        this.setupSocialUI();
        this.setupInteractions();
    }

    async loadSocialFeed() {
        try {
            const response = await fetch('/api/social/feed');
            const data = await response.json();
            this.posts = data.posts || [];
        } catch (error) {
            console.error('Failed to load social feed:', error);
            // Use sample data for demo
            this.posts = this.getSamplePosts();
        }
    }

    getSamplePosts() {
        return [
            {
                id: 1,
                author: {
                    name: 'Sarah Johnson',
                    avatar: '/images/avatars/sarah.jpg',
                    title: 'Miss Universe 2023'
                },
                content: 'Just finished an amazing photoshoot for my upcoming competition! Feeling confident and ready! 💫',
                image: '/images/posts/photoshoot.jpg',
                likes: 234,
                comments: 45,
                timestamp: new Date('2024-03-20T10:30:00'),
                liked: false
            },
            {
                id: 2,
                author: {
                    name: 'Emily Davis',
                    avatar: '/images/avatars/emily.jpg',
                    title: 'Pageant Coach'
                },
                content: 'Remember ladies, confidence is your best accessory! Here are my top 5 tips for interview preparation...',
                likes: 567,
                comments: 89,
                timestamp: new Date('2024-03-19T15:45:00'),
                liked: true
            }
        ];
    }

    setupSocialUI() {
        const feedContainer = document.getElementById('social-feed');
        if (!feedContainer) return;

        const feedHTML = `
            <div class="social-header">
                <h2>Community Feed</h2>
                <button class="btn btn-primary create-post">
                    <i class="fas fa-plus"></i> Create Post
                </button>
            </div>
            <div class="posts-container">
                ${this.posts.map(post => this.renderPost(post)).join('')}
            </div>
        `;

        feedContainer.innerHTML = feedHTML;
    }

    renderPost(post) {
        return `
                        <div class="social-post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-author">
                        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                        <div class="author-info">
                            <h4>${post.author.name}</h4>
                            <span class="author-title">${post.author.title}</span>
                        </div>
                    </div>
                    <div class="post-time">
                        ${this.getTimeAgo(post.timestamp)}
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
                </div>
                <div class="post-actions">
                    <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-post-id="${post.id}">
                        <i class="fas fa-heart"></i>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="action-btn comment-btn" data-post-id="${post.id}">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments}</span>
                    </button>
                    <button class="action-btn share-btn" data-post-id="${post.id}">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                <div class="post-comments" id="comments-${post.id}"></div>
            </div>
        `;
    }

    setupInteractions() {
        // Create post
        document.querySelector('.create-post')?.addEventListener('click', () => {
            this.openCreatePostModal();
        });

        // Like posts
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(btn.dataset.postId);
                this.toggleLike(postId, btn);
            });
        });

        // Comment on posts
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(btn.dataset.postId);
                this.toggleComments(postId);
            });
        });

        // Share posts
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(btn.dataset.postId);
                this.sharePost(postId);
            });
        });
    }

    openCreatePostModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content create-post-modal">
                <div class="modal-header">
                    <h2>Create Post</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="create-post-form">
                        <div class="form-group">
                            <textarea 
                                name="content" 
                                class="form-input post-textarea" 
                                placeholder="Share your pageant journey..."
                                rows="5"
                                maxlength="500"
                            ></textarea>
                            <span class="char-count">0/500</span>
                        </div>
                        <div class="media-upload">
                            <input type="file" id="post-image" accept="image/*" hidden>
                            <label for="post-image" class="upload-btn">
                                <i class="fas fa-image"></i> Add Photo
                            </label>
                            <div class="image-preview"></div>
                        </div>
                        <div class="post-options">
                            <label class="checkbox-label">
                                <input type="checkbox" name="allowComments" checked>
                                <span>Allow comments</span>
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="publish-post">Publish</button>
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup character counter
        const textarea = modal.querySelector('.post-textarea');
        const charCount = modal.querySelector('.char-count');
        
        textarea.addEventListener('input', () => {
            charCount.textContent = `${textarea.value.length}/500`;
        });

        // Setup image preview
        const imageInput = modal.querySelector('#post-image');
        const imagePreview = modal.querySelector('.image-preview');
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-image">&times;</button>
                    `;
                    
                    imagePreview.querySelector('.remove-image').addEventListener('click', () => {
                        imageInput.value = '';
                        imagePreview.innerHTML = '';
                    });
                };
                reader.readAsDataURL(file);
            }
        });

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#publish-post').addEventListener('click', async () => {
            await this.publishPost(new FormData(modal.querySelector('#create-post-form')));
            modal.remove();
        });
    }

    async publishPost(formData) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newPost = {
                id: Date.now(),
                author: {
                    name: 'You',
                    avatar: '/images/avatars/default.jpg',
                    title: 'Pageant Contestant'
                },
                content: formData.get('content'),
                likes: 0,
                comments: 0,
                timestamp: new Date(),
                liked: false
            };

            // Add to feed
            this.posts.unshift(newPost);
            this.refreshFeed();

            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'success',
                    message: 'Post published successfully!',
                    duration: 3000
                });
            }

        } catch (error) {
            console.error('Failed to publish post:', error);
            
            if (window.app?.notifications) {
                window.app.notifications.show({
                    type: 'error',
                    message: 'Failed to publish post. Please try again.',
                    duration: 4000
                });
            }
        }
    }

    toggleLike(postId, button) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;

        // Update UI
        button.classList.toggle('liked');
        button.querySelector('.like-count').textContent = post.likes;

        // Animate
        if (post.liked) {
            this.createHeartAnimation(button);
        }

        // Track like
        if (window.app?.analytics) {
            window.app.analytics.track('post_liked', { postId, liked: post.liked });
        }
    }

    createHeartAnimation(button) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        const rect = button.getBoundingClientRect();
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top}px`;
        
        document.body.appendChild(heart);
        
        heart.addEventListener('animationend', () => heart.remove());
    }

    toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (!commentsSection) return;

        if (commentsSection.classList.contains('active')) {
            commentsSection.classList.remove('active');
            commentsSection.innerHTML = '';
        } else {
            commentsSection.classList.add('active');
            this.loadComments(postId, commentsSection);
        }
    }

    async loadComments(postId, container) {
        // Simulate loading comments
        container.innerHTML = '<div class="loading-comments">Loading comments...</div>';

        await new Promise(resolve => setTimeout(resolve, 500));

        const comments = [
            {
                author: 'Jessica Smith',
                avatar: '/images/avatars/jessica.jpg',
                content: 'Amazing! You look stunning! 💕',
                timestamp: new Date('2024-03-20T11:00:00')
            },
            {
                author: 'Maria Garcia',
                avatar: '/images/avatars/maria.jpg',
                content: 'Good luck with your competition!',
                timestamp: new Date('2024-03-20T11:30:00')
            }
        ];

        container.innerHTML = `
            <div class="comments-list">
                ${comments.map(comment => `
                    <div class="comment">
                        <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
                        <div class="comment-content">
                            <h5>${comment.author}</h5>
                            <p>${comment.content}</p>
                            <span class="comment-time">${this.getTimeAgo(comment.timestamp)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="comment-form">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button class="comment-submit">Post</button>
            </div>
        `;

        // Setup comment submission
        const input = container.querySelector('.comment-input');
        const submitBtn = container.querySelector('.comment-submit');
        
        submitBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                this.addComment(postId, input.value);
                input.value = '';
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.addComment(postId, input.value);
                input.value = '';
            }
        });
    }

    addComment(postId, content) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        post.comments++;
        
        // Update comment count
        const commentBtn = document.querySelector(`.comment-btn[data-post-id="${postId}"] span`);
        if (commentBtn) {
            commentBtn.textContent = post.comments;
        }

        // Add comment to list
        const commentsList = document.querySelector(`#comments-${postId} .comments-list`);
        if (commentsList) {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <img src="/images/avatars/default.jpg" alt="You" class="comment-avatar">
                <div class="comment-content">
                    <h5>You</h5>
                    <p>${content}</p>
                    <span class="comment-time">Just now</span>
                </div>
            `;
            commentsList.appendChild(newComment);
        }

        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'success',
                message: 'Comment posted!',
                duration: 2000
            });
        }
    }

    async sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const shareData = {
            title: 'Check out this post from Pageant Empress',
            text: post.content.substring(0, 100) + '...',
            url: `${window.location.origin}/post/${postId}`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback - copy link
                await Utils.copyToClipboard(shareData.url);
                
                if (window.app?.notifications) {
                    window.app.notifications.show({
                        type: 'success',
                        message: 'Link copied to clipboard!',
                        duration: 3000
                    });
                }
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    refreshFeed() {
        const container = document.querySelector('.posts-container');
        if (container) {
            container.innerHTML = this.posts.map(post => this.renderPost(post)).join('');
            this.setupInteractions();
        }
    }
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize user profile system
    if (document.getElementById('user-profile')) {
        window.userProfile = new UserProfileSystem();
    }

    // Initialize social features
    if (document.getElementById('social-feed')) {
        window.socialFeatures = new SocialFeatures();
    }

    // Setup global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + H: Home
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            window.location.href = '/';
        }

        // Ctrl/Cmd + P: Profile
        if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
            e.preventDefault();
            window.location.href = '/profile';
        }
    });

    // Performance optimization for scroll
    let scrollTimer;
    window.addEventListener('scroll', () => {
        document.body.classList.add('is-scrolling');
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });

    console.log('✨ Pageant Empress fully initialized!');
});

// ===== END OF MAIN.JS =====
