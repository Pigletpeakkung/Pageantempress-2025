// ===== FIXED MAIN APPLICATION CONTROLLER =====
// INSTANT FIX - Add this line
setTimeout(() => document.getElementById('loadingScreen').style.display = 'none', 3000);

class PageantEmpressApp {
    constructor() {
        this.theme = this.loadTheme() || 'dark';
        this.isInitialized = false;
        
        // Initialize with error handling
        this.initializeApp();
    }

    async initializeApp() {
        try {
            console.log('Starting Pageant Empress initialization...');
            
            // Apply theme immediately
            this.applyTheme();
            
            // Initialize core components with error handling
            await this.initializeComponents();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Remove loading screen
            this.hideLoadingScreen();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✨ Pageant Empress initialized successfully!');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.handleInitError(error);
        }
    }

    async initializeComponents() {
        // Initialize components only if they exist in DOM
        const components = [];
        
        // Only initialize components that have their containers in the DOM
        if (document.querySelector('.sparkle-container') || document.body) {
            this.sparkles = new SparkleSystem();
            components.push(this.sparkles.init().catch(e => console.warn('Sparkles init failed:', e)));
        }
        
        if (document.querySelector('.geometric-shapes') || document.body) {
            this.geometricShapes = new GeometricShapeSystem();
            components.push(this.geometricShapes.init().catch(e => console.warn('Shapes init failed:', e)));
        }
        
        if (document.querySelector('.main-header')) {
            this.header = new HeaderController();
            components.push(this.header.init().catch(e => console.warn('Header init failed:', e)));
        }
        
        if (document.querySelector('.search-overlay')) {
            this.search = new SearchController();
            components.push(this.search.init().catch(e => console.warn('Search init failed:', e)));
        }
        
        // Always initialize these
        this.notifications = new NotificationSystem();
        this.animations = new AnimationController();
        
        components.push(
            this.notifications.init().catch(e => console.warn('Notifications init failed:', e)),
            this.animations.init().catch(e => console.warn('Animations init failed:', e))
        );
        
        // Wait for all components to initialize
        await Promise.allSettled(components);
    }

    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            // Fade out animation
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.remove('loading');
                
                // Show welcome notification after loading screen is removed
                if (this.notifications) {
                    setTimeout(() => {
                        this.notifications.show({
                            type: 'success',
                            message: 'Welcome to Pageant Empress! ✨',
                            duration: 3000
                        });
                    }, 500);
                }
            }, 500);
        } else {
            // If no loading screen, just remove loading class
            document.body.classList.remove('loading');
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        this.smoothScroll(target);
                    }
                }
            });
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveTheme();
        
        if (this.animations) {
            this.animations.playThemeTransition();
        }
    }

    applyTheme() {
        document.body.classList.toggle('light-theme', this.theme === 'light');
    }

    loadTheme() {
        try {
            return localStorage.getItem('pageant-empress-theme') || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    saveTheme() {
        try {
            localStorage.setItem('pageant-empress-theme', this.theme);
        } catch (e) {
            console.warn('Failed to save theme preference');
        }
    }

    smoothScroll(target) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    handleInitError(error) {
        console.error('App initialization failed:', error);
        
        // Remove loading screen even on error
        this.hideLoadingScreen();
        
        // Show error message if notifications are available
        if (this.notifications) {
            this.notifications.show({
                type: 'error',
                message: 'Some features may not be available. Please refresh the page.',
                duration: 5000
            });
        }
    }
}

// ===== SIMPLIFIED SPARKLE SYSTEM =====
class SparkleSystem {
    constructor() {
        this.container = null;
        this.sparkles = [];
        this.maxSparkles = window.innerWidth < 768 ? 20 : 50;
        this.isActive = true;
    }

    async init() {
        try {
            this.createContainer();
            this.generateInitialSparkles();
            return Promise.resolve();
        } catch (error) {
            console.warn('SparkleSystem init error:', error);
            return Promise.reject(error);
        }
    }

    createContainer() {
        // Check if container already exists
        if (document.querySelector('.sparkle-container')) {
            this.container = document.querySelector('.sparkle-container');
            return;
        }
        
        this.container = document.createElement('div');
        this.container.className = 'sparkle-container';
        this.container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.container);
    }

    generateInitialSparkles() {
        // Create fewer sparkles initially for better performance
        for (let i = 0; i < Math.min(10, this.maxSparkles); i++) {
            setTimeout(() => this.createSparkle(), i * 200);
        }
    }

    createSparkle() {
        if (!this.isActive || !this.container) return;
        
        const sparkle = document.createElement('div');
        const types = ['sparkle-small', 'sparkle-medium', 'sparkle-large'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        sparkle.className = `sparkle ${type}`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 5}s`;
        sparkle.style.animationDuration = `${3 + Math.random() * 4}s`;
        
        this.container.appendChild(sparkle);
        this.sparkles.push(sparkle);
        
        // Remove sparkle after animation
        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
            this.sparkles = this.sparkles.filter(s => s !== sparkle);
            
            // Create new sparkle to maintain count
            if (this.isActive && this.sparkles.length < this.maxSparkles) {
                setTimeout(() => this.createSparkle(), Math.random() * 3000);
            }
        });
    }
}

// ===== SIMPLIFIED GEOMETRIC SHAPE SYSTEM =====
class GeometricShapeSystem {
    constructor() {
        this.container = null;
        this.shapes = [];
        this.maxShapes = 10;
    }

    async init() {
        try {
            this.createContainer();
            this.generateShapes();
            return Promise.resolve();
        } catch (error) {
            console.warn('GeometricShapeSystem init error:', error);
            return Promise.reject(error);
        }
    }

    createContainer() {
        // Check if container already exists
        if (document.querySelector('.geometric-shapes')) {
            this.container = document.querySelector('.geometric-shapes');
            return;
        }
        
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
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animationDelay = `${Math.random() * 10}s`;
            shape.style.animationDuration = `${15 + Math.random() * 15}s`;
            
            this.container.appendChild(shape);
            this.shapes.push(shape);
        }
    }
}

// ===== SIMPLIFIED HEADER CONTROLLER =====
class HeaderController {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.lastScrollY = 0;
    }

    async init() {
        if (!this.header) return Promise.resolve();
        
        try {
            this.setupScrollBehavior();
            this.setupMobileMenu();
            return Promise.resolve();
        } catch (error) {
            console.warn('HeaderController init error:', error);
            return Promise.reject(error);
        }
    }

    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        if (currentScrollY > 500) {
            if (currentScrollY > this.lastScrollY) {
                this.header.classList.add('header-hidden');
            } else {
                this.header.classList.remove('header-hidden');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        
        if (!mobileToggle || !mobileMenu) return;
        
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileOverlay?.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        mobileOverlay?.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
}

// ===== SIMPLIFIED SEARCH CONTROLLER =====
class SearchController {
    constructor() {
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchInput = document.querySelector('.search-input');
        this.isOpen = false;
    }

    async init() {
        if (!this.searchToggle || !this.searchOverlay) return Promise.resolve();
        
        try {
            this.setupEventListeners();
            return Promise.resolve();
        } catch (error) {
            console.warn('SearchController init error:', error);
            return Promise.reject(error);
        }
    }

    setupEventListeners() {
        this.searchToggle.addEventListener('click', () => this.openSearch());
        
        const closeBtn = this.searchOverlay.querySelector('.search-close');
        closeBtn?.addEventListener('click', () => this.closeSearch());
        
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.closeSearch();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
        });
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
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}

// ===== SIMPLIFIED NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = new Map();
    }

    async init() {
        try {
            this.createContainer();
            return Promise.resolve();
        } catch (error) {
            console.warn('NotificationSystem init error:', error);
            return Promise.reject(error);
        }
    }

    createContainer() {
        if (document.querySelector('.notification-stack')) {
            this.container = document.querySelector('.notification-stack');
            return;
        }
        
        this.container = document.createElement('div');
        this.container.className = 'notification-stack';
        document.body.appendChild(this.container);
    }

    show(options) {
        if (!this.container) return;
        
        const defaults = {
            type: 'info',
            message: '',
            duration: 5000,
            dismissible: true
        };
        
        const config = { ...defaults, ...options };
        const id = Date.now().toString();
        
        const notification = this.createNotification(id, config);
        this.notifications.set(id, notification);
        
        if (config.duration > 0) {
            setTimeout(() => this.dismiss(id), config.duration);
        }
        
        return id;
    }

    createNotification(id, config) {
        const notification = document.createElement('div');
        notification.className = `notification-item ${config.type}`;
        notification.dataset.id = id;
        
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
                        'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        
        const icon = icons[config.type] || 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${config.message}</span>
            </div>
            ${config.dismissible ? '<button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>' : ''}
        `;
        
        if (config.dismissible) {
            notification.querySelector('.notification-close')?.addEventListener('click', () => {
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

    dismiss(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.classList.remove('show');
        
        notification.addEventListener('transitionend', () => {
            notification.remove();
            this.notifications.delete(id);
        });
    }
}

// ===== SIMPLIFIED ANIMATION CONTROLLER =====
class AnimationController {
    constructor() {
        this.observers = new Map();
    }

    async init() {
        try {
            this.setupScrollAnimations();
            this.setupHoverEffects();
            return Promise.resolve();
        } catch (error) {
            console.warn('AnimationController init error:', error);
            return Promise.reject(error);
        }
    }

    setupScrollAnimations() {
        const animationOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, animationOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll, [data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
        
        this.observers.set('scroll', animationObserver);
    }

    setupHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn, .enhanced-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                ripple.addEventListener('animationend', () => {
                    ripple.remove();
                });
            });
        });
    }

    playThemeTransition() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// ===== LOADING SCREEN HTML =====
const loadingScreenHTML = `
<div class="loading-screen">
    <div class="loading-content">
        <div class="loading-logo">
            <i class="fas fa-crown"></i>
        </div>
        <h2 class="loading-title">Pageant Empress</h2>
        <p class="loading-text">Preparing Your Royal Experience...</p>
        <div class="loading-progress">
            <div class="loading-progress-bar"></div>
        </div>
    </div>
</div>
`;

// ===== LOADING SCREEN STYLES =====
const loadingScreenStyles = `
<style>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--dark-bg, #0a0a0a);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s ease;
}

.loading-content {
    text-align: center;
    max-width: 400px;
}

.loading-logo {
    font-size: 5rem;
    color: var(--primary-gold, #d4af37);
    margin-bottom: 2rem;
    animation: crownFloat 2s ease-in-out infinite;
}

@keyframes crownFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.loading-title {
    font-size: 2.5rem;
    font-family: 'Playfair Display', serif;
    color: var(--text-primary, #ffffff);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #d4af37, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.loading-text {
    color: var(--text-secondary, #b0b0b0);
    font-size: 1.1rem;
    margin-bottom: 2rem;
}

.loading-progress {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
}

.loading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #d4af37, #ffd700);
    border-radius: 2px;
    animation: loadingProgress 2s ease-in-out;
}

@keyframes loadingProgress {
    0% { width: 0%; }
    100% { width: 100%; }
}

body.loading {
    overflow: hidden;
}
</style>
`;

// ===== INITIALIZATION =====
// Add loading screen styles immediately
document.head.insertAdjacentHTML('beforeend', loadingScreenStyles);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Add loading screen if not already present
    if (!document.querySelector('.loading-screen')) {
        document.body.insertAdjacentHTML('afterbegin', loadingScreenHTML);
        document.body.classList.add('loading');
    }
    
    // Initialize the app with a small delay to ensure all resources are loaded
    setTimeout(() => {
        try {
            window.app = new PageantEmpressApp();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            // Remove loading screen even on error
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                    document.body.classList.remove('loading');
                }, 500);
            }
        }
    }, 100);
}

// ===== FALLBACK FOR STUCK LOADING SCREEN =====
// If loading screen is still visible after 5 seconds, force remove it
setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen && loadingScreen.style.opacity !== '0') {
        console.warn('Loading screen timeout - forcing removal');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
            document.body.classList.remove('loading');
        }, 500);
    }
}, 5000);

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
    }
};

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PageantEmpressApp,
        SparkleSystem,
        GeometricShapeSystem,
        HeaderController,
        SearchController,
        NotificationSystem,
        AnimationController,
        Utils
    };
}

// ===== CONSOLE MESSAGE =====
console.log('%c🎉 Pageant Empress %c\nEmpowering Beauty, Inspiring Confidence', 
    'color: #d4af37; font-size: 24px; font-weight: bold; font-family: "Playfair Display", serif;',
    'color: #b0b0b0; font-size: 14px; font-style: italic;'
);
