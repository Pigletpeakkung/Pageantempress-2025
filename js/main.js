/**
 * PageantEmpress - Simplified Main JavaScript
 * Reliable Loading & Core Features
 * Version: 2.1.0
 */

(function() {
  'use strict';

  // ====================================
  // Core Configuration
  // ====================================
  const CONFIG = {
    animations: {
      duration: { fast: 150, normal: 300, slow: 600 },
      easing: { smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }
    },
    performance: {
      particleCount: { high: 20, medium: 10, low: 5, minimal: 0 }
    }
  };

  // ====================================
  // Simple Utility Functions
  // ====================================
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

    isInViewport(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    showNotification(message, type = 'info', duration = 3000) {
      try {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          z-index: 10000;
          max-width: 300px;
          font-size: 0.9rem;
          animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 300);
          }
        }, duration);
      } catch (error) {
        console.log('Notification error:', error);
      }
    }
  };

  // ====================================
  // Device Detection
  // ====================================
  class SimpleDeviceDetector {
    constructor() {
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      this.isDesktop = window.innerWidth >= 1024;
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.supportsTouch = 'ontouchstart' in window;
      this.isLowEndDevice = this.detectLowEndDevice();
    }

    detectLowEndDevice() {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;
      return hardwareConcurrency < 4 || deviceMemory < 4 || this.isMobile;
    }

    getPerformanceLevel() {
      if (this.isReducedMotion) return 'minimal';
      if (this.isLowEndDevice) return 'low';
      if (this.isMobile) return 'medium';
      return 'high';
    }
  }

  // ====================================
  // Simple Particle System
  // ====================================
  class SimpleParticleSystem {
    constructor(container, deviceDetector) {
      this.container = container;
      this.device = deviceDetector;
      this.particles = [];
      this.maxParticles = this.getMaxParticles();
      this.isActive = this.maxParticles > 0;
      this.spawnTimer = null;
      
      if (this.isActive && this.container) {
        this.init();
      }
    }

    getMaxParticles() {
      const level = this.device.getPerformanceLevel();
      switch (level) {
        case 'high': return CONFIG.performance.particleCount.high;
        case 'medium': return CONFIG.performance.particleCount.medium;
        case 'low': return CONFIG.performance.particleCount.low;
        default: return CONFIG.performance.particleCount.minimal;
      }
    }

    init() {
      try {
        this.container.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        `;

        this.startSpawning();
      } catch (error) {
        console.log('Particle system init error:', error);
        this.isActive = false;
      }
    }

    startSpawning() {
      if (!this.isActive) return;
      
      this.spawnTimer = setInterval(() => {
        if (this.particles.length < this.maxParticles) {
          this.spawnParticle();
        }
      }, 2000);

      // Initial particles
      for (let i = 0; i < Math.min(3, this.maxParticles); i++) {
        setTimeout(() => this.spawnParticle(), i * 500);
      }
    }

    spawnParticle() {
      if (!this.isActive || !this.container) return;

      try {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #ffd700, #ff6b9d);
          border-radius: 50%;
          opacity: 0.7;
          left: ${Math.random() * 100}%;
          top: 100%;
          animation: floatUp ${8 + Math.random() * 4}s linear forwards;
          will-change: transform;
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);

        // Remove after animation
        setTimeout(() => {
          this.removeParticle(particle);
        }, 12000);
      } catch (error) {
        console.log('Particle spawn error:', error);
      }
    }

    removeParticle(particle) {
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
      }
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }

    toggle() {
      this.isActive = !this.isActive;
      if (this.isActive) {
        this.startSpawning();
      } else {
        this.cleanup();
      }
    }

    cleanup() {
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
        this.spawnTimer = null;
      }
      this.particles.forEach(particle => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      this.particles = [];
    }
  }

  // ====================================
  // Simple Scroll Animations
  // ====================================
  class SimpleScrollAnimations {
    constructor(deviceDetector) {
      this.device = deviceDetector;
      this.observer = null;
      this.elements = [];
      
      if (!this.device.isReducedMotion) {
        this.init();
      }
    }

    init() {
      try {
        this.elements = Array.from(document.querySelectorAll('.scroll-reveal, .scroll-reveal-enhanced'));
        
        if (this.elements.length === 0) return;

        const options = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              this.observer.unobserve(entry.target);
            }
          });
        }, options);

        this.elements.forEach(element => {
          this.observer.observe(element);
        });
      } catch (error) {
        console.log('Scroll animations error:', error);
      }
    }

    cleanup() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  // ====================================
  // Theme Manager
  // ====================================
  class SimpleThemeManager {
    constructor() {
      this.themes = ['default', 'royal', 'sunset', 'ocean'];
      this.currentTheme = 'default';
      
      this.loadSavedTheme();
    }

    loadSavedTheme() {
      try {
        const saved = localStorage.getItem('pageant-theme');
        if (saved && this.themes.includes(saved)) {
          this.setTheme(saved);
        }
      } catch (error) {
        console.log('Theme loading error:', error);
      }
    }

    setTheme(themeName) {
      if (!this.themes.includes(themeName)) return;

      this.currentTheme = themeName;
      document.documentElement.setAttribute('data-theme', themeName);
      
      try {
        localStorage.setItem('pageant-theme', themeName);
      } catch (error) {
        console.log('Theme saving error:', error);
      }

      Utils.showNotification(`Theme changed to ${themeName}`, 'success');
    }

    cycleTheme() {
      const currentIndex = this.themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.themes.length;
      this.setTheme(this.themes[nextIndex]);
    }
  }

  // ====================================
  // Main Application Class
  // ====================================
  class PageantEmpress {
    constructor() {
      this.deviceDetector = null;
      this.particleSystem = null;
      this.scrollAnimations = null;
      this.themeManager = null;
      this.isInitialized = false;
      
      console.log('🎭 PageantEmpress starting...');
      this.init();
    }

    async init() {
      try {
        // Initialize core components
        this.deviceDetector = new SimpleDeviceDetector();
        this.themeManager = new SimpleThemeManager();
        
        // Wait for DOM if needed
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
          this.initializeComponents();
        }

        this.setupEventListeners();
        this.isInitialized = true;
        
        console.log('✨ PageantEmpress initialized successfully!');
      } catch (error) {
        console.error('❌ PageantEmpress initialization error:', error);
      }
    }

    initializeComponents() {
      try {
        // Initialize particle system
        const particleContainer = document.querySelector('.particle-system, .particle-system-enhanced');
        if (particleContainer) {
          this.particleSystem = new SimpleParticleSystem(particleContainer, this.deviceDetector);
        }

        // Initialize scroll animations
        this.scrollAnimations = new SimpleScrollAnimations(this.deviceDetector);

        // Initialize forms
        this.initializeNewsletterForm();

        // Initialize demo buttons
        this.initializeDemoButtons();

        // Initialize Swiper if available
        this.initializeSwiper();

        // Initialize AOS if available
        this.initializeAOS();

      } catch (error) {
        console.error('Component initialization error:', error);
      }
    }

    initializeNewsletterForm() {
      try {
        const form = document.querySelector('.newsletter-form, form[data-newsletter]');
        if (!form) return;

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const emailInput = form.querySelector('input[type="email"]');
          if (!emailInput) return;
          
          const email = emailInput.value.trim();
          
          if (!this.isValidEmail(email)) {
            Utils.showNotification('Please enter a valid email address', 'error');
            return;
          }

          const button = form.querySelector('button[type="submit"]');
          if (button) {
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;

            setTimeout(() => {
              Utils.showNotification('Thank you for subscribing!', 'success');
              emailInput.value = '';
              button.textContent = originalText;
              button.disabled = false;
            }, 1500);
          }
        });
      } catch (error) {
        console.log('Newsletter form error:', error);
      }
    }

    initializeDemoButtons() {
      try {
        const buttons = document.querySelectorAll('.demo-buttons button, [data-demo-action]');
        
        buttons.forEach(button => {
          const text = button.textContent.toLowerCase();
          
          if (text.includes('particle') && this.particleSystem) {
            button.addEventListener('click', () => this.toggleParticles());
          }
          
          if (text.includes('theme')) {
            button.addEventListener('click', () => this.themeManager.cycleTheme());
          }
        });
      } catch (error) {
        console.log('Demo buttons error:', error);
      }
    }

    initializeSwiper() {
      try {
        if (typeof Swiper === 'undefined') return;

        const swiperElement = document.querySelector('.swiper');
        if (!swiperElement) return;

        new Swiper('.swiper', {
          loop: true,
          autoplay: { delay: 4000, disableOnInteraction: false },
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }
        });

        console.log('🎠 Swiper initialized');
      } catch (error) {
        console.log('Swiper initialization error:', error);
      }
    }

    initializeAOS() {
      try {
        if (typeof AOS === 'undefined') return;

        AOS.init({
          duration: 800,
          once: true,
          offset: 100,
          disable: this.deviceDetector.isReducedMotion || this.deviceDetector.isLowEndDevice
        });

        console.log('🎬 AOS initialized');
      } catch (error) {
        console.log('AOS initialization error:', error);
      }
    }

    setupEventListeners() {
      try {
        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
          this.handleResize();
        }, 250));

        // Visibility change
        document.addEventListener('visibilitychange', () => {
          if (document.hidden && this.particleSystem) {
            this.particleSystem.cleanup();
          } else if (!document.hidden && this.particleSystem && this.particleSystem.isActive) {
            this.particleSystem.startSpawning();
          }
        });
      } catch (error) {
        console.log('Event listeners error:', error);
      }
    }

    handleResize() {
      try {
        this.deviceDetector.isMobile = window.innerWidth < 768;
        this.deviceDetector.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        this.deviceDetector.isDesktop = window.innerWidth >= 1024;
      } catch (error) {
        console.log('Resize handling error:', error);
      }
    }

    toggleParticles() {
      if (this.particleSystem) {
        this.particleSystem.toggle();
        Utils.showNotification(
          `Particles ${this.particleSystem.isActive ? 'enabled' : 'disabled'}`,
          'info'
        );
      }
    }

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    getStatus() {
      return {
        initialized: this.isInitialized,
        theme: this.themeManager?.currentTheme || 'default',
        device: {
          isMobile: this.deviceDetector?.isMobile || false,
          isLowEnd: this.deviceDetector?.isLowEndDevice || false
        },
        particles: this.particleSystem?.isActive || false
      };
    }

    destroy() {
      try {
        if (this.particleSystem) {
          this.particleSystem.cleanup();
        }
        if (this.scrollAnimations) {
          this.scrollAnimations.cleanup();
        }
        console.log('🧹 PageantEmpress cleaned up');
      } catch (error) {
        console.log('Cleanup error:', error);
      }
    }
  }

  // ====================================
  // Add Required CSS
  // ====================================
  function addRequiredCSS() {
    if (document.getElementById('pageant-core-styles')) return;

    const style = document.createElement('style');
    style.id = 'pageant-core-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      
      @keyframes floatUp {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
      
      .scroll-reveal, .scroll-reveal-enhanced {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease-out;
      }
      
      .scroll-reveal.revealed, .scroll-reveal-enhanced.revealed {
        opacity: 1;
        transform: translateY(0);
      }
      
      .floating-particle {
        pointer-events: none;
      }
      
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .floating-particle {
          display: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // ====================================
  // Initialize Application
  // ====================================
  function initializeApp() {
    try {
      // Add required CSS first
      addRequiredCSS();
      
      // Create and initialize PageantEmpress
      const pageantEmpress = new PageantEmpress();
      
      // Expose to global scope
      window.PageantEmpress = pageantEmpress;
      
      // Development helpers
      if (window.location.hostname === 'localhost') {
        window.pe = {
          status: () => pageantEmpress.getStatus(),
          toggleParticles: () => pageantEmpress.toggleParticles(),
          setTheme: (theme) => pageantEmpress.themeManager.setTheme(theme),
          cycleTheme: () => pageantEmpress.themeManager.cycleTheme()
        };
        console.log('🛠️  Dev tools available: pe.status(), pe.toggleParticles(), pe.cycleTheme()');
      }
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
    }
  }

  // ====================================
  // Start Application
  // ====================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

})();
