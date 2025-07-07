/**
 * PageantEmpress - Main JavaScript
 * Advanced Animation & Interaction System
 * Version: 2.0.0
 */

(function() {
  'use strict';

  // ====================================
  // Global Configuration
  // ====================================
  const CONFIG = {
    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 600,
        ultraSlow: 1200
      },
      easing: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        dramatic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        bounce: 'cubic-bezier(0.28, 0.84, 0.42, 1)'
      }
    },
    performance: {
      particleCount: {
        high: 30,
        medium: 15,
        low: 5,
        minimal: 1
      },
      rafThrottle: 16, // ~60fps
      scrollThrottle: 10
    },
    themes: {
      default: {
        primaryGold: '#ffd700',
        secondaryPurple: '#9b59b6',
        accentPink: '#ff338d',
        accentBlue: '#3498db'
      },
      royal: {
        primaryGold: '#8B4513',
        secondaryPurple: '#4B0082',
        accentPink: '#DC143C',
        accentBlue: '#191970'
      },
      sunset: {
        primaryGold: '#FF6347',
        secondaryPurple: '#FF4500',
        accentPink: '#FFD700',
        accentBlue: '#FF8C00'
      },
      ocean: {
        primaryGold: '#20B2AA',
        secondaryPurple: '#4169E1',
        accentPink: '#00CED1',
        accentBlue: '#1E90FF'
      }
    }
  };

  // ====================================
  // Utility Functions
  // ====================================
  const Utils = {
    /**
     * Debounce function calls
     */
    debounce(func, wait, immediate) {
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
    },

    /**
     * Throttle function calls
     */
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

    /**
     * Request Animation Frame with fallback
     */
    raf(callback) {
      return (window.requestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame ||
              function(callback) {
                return window.setTimeout(callback, 1000 / 60);
              })(callback);
    },

    /**
     * Get random number between min and max
     */
    random(min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
     * Get random integer between min and max
     */
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Linear interpolation
     */
    lerp(start, end, factor) {
      return start + (end - start) * factor;
    },

    /**
     * Clamp value between min and max
     */
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0.1) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      return (
        rect.top < windowHeight * (1 + threshold) &&
        rect.bottom > windowHeight * -threshold &&
        rect.left < windowWidth * (1 + threshold) &&
        rect.right > windowWidth * -threshold
      );
    },

    /**
     * Get element's position relative to viewport
     */
    getElementPosition(element) {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.left + window.pageXOffset,
        y: rect.top + window.pageYOffset,
        width: rect.width,
        height: rect.height
      };
    },

    /**
     * Create element with attributes
     */
    createElement(tag, attributes = {}, textContent = '') {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      if (textContent) element.textContent = textContent;
      return element;
    },

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 3000) {
      const notification = this.createElement('div', {
        class: `notification notification-${type}`,
        role: 'alert',
        'aria-live': 'polite'
      }, message);

      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        font-family: var(--font-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
  };

  // ====================================
  // Device Detection & Performance
  // ====================================
  class DeviceDetector {
    constructor() {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      this.isMobile = window.innerWidth < 768;
      this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      this.isDesktop = window.innerWidth >= 1024;
      this.isLowEndDevice = this.detectLowEndDevice();
      this.devicePixelRatio = window.devicePixelRatio || 1;
      this.maxTouchPoints = navigator.maxTouchPoints || 0;
      this.supportsTouch = 'ontouchstart' in window || this.maxTouchPoints > 0;
      this.supportsHover = window.matchMedia('(hover: hover)').matches;
      this.connectionType = this.getConnectionType();
      this.batteryLevel = null;
      this.isCharging = null;
      
      this.init();
    }

    detectLowEndDevice() {
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isOldChrome = /Chrome\/[0-5][0-9]/.test(navigator.userAgent);
      
      return hardwareConcurrency < 4 || 
             deviceMemory < 4 || 
             (isAndroid && isOldChrome) ||
             window.screen.width < 1024;
    }

    getConnectionType() {
      const connection = navigator.connection || 
                        navigator.mozConnection || 
                        navigator.webkitConnection;
      
      if (!connection) return 'unknown';
      
      if (connection.effectiveType) {
        return connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'
      }
      
      return connection.type || 'unknown';
    }

    async init() {
      // Battery API (deprecated but still useful)
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          this.batteryLevel = battery.level;
          this.isCharging = battery.charging;
          
          battery.addEventListener('levelchange', () => {
            this.batteryLevel = battery.level;
          });
          
          battery.addEventListener('chargingchange', () => {
            this.isCharging = battery.charging;
          });
        } catch (error) {
          console.log('Battery API not available');
        }
      }

      // Listen for media query changes
      this.setupMediaQueryListeners();
    }

    setupMediaQueryListeners() {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      
      reducedMotionQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
        document.dispatchEvent(new CustomEvent('motionPreferenceChange', {
          detail: { reducedMotion: this.isReducedMotion }
        }));
      });

      highContrastQuery.addEventListener('change', (e) => {
        this.prefersHighContrast = e.matches;
        document.dispatchEvent(new CustomEvent('contrastPreferenceChange', {
          detail: { highContrast: this.prefersHighContrast }
        }));
      });
    }

    getPerformanceLevel() {
      if (this.isReducedMotion) return 'minimal';
      if (this.isLowEndDevice) return 'low';
      if (this.isMobile) return 'medium';
      if (this.connectionType === 'slow-2g' || this.connectionType === '2g') return 'low';
      if (this.batteryLevel !== null && this.batteryLevel < 0.2 && !this.isCharging) return 'low';
      return 'high';
    }

    getAnimationQuality() {
      const level = this.getPerformanceLevel();
      switch (level) {
        case 'minimal': return 0;
        case 'low': return 0.3;
        case 'medium': return 0.6;
        case 'high': return 1;
        default: return 0.8;
      }
    }

    getParticleCount() {
      const level = this.getPerformanceLevel();
      switch (level) {
        case 'minimal': return CONFIG.performance.particleCount.minimal;
        case 'low': return CONFIG.performance.particleCount.low;
        case 'medium': return CONFIG.performance.particleCount.medium;
        case 'high': return CONFIG.performance.particleCount.high;
        default: return CONFIG.performance.particleCount.medium;
      }
    }
  }

  // ====================================
  // Animation Manager
  // ====================================
  class AnimationManager {
    constructor(deviceDetector) {
      this.device = deviceDetector;
      this.animations = new Map();
      this.observers = new Map();
      this.isRunning = false;
      this.lastTime = 0;
      this.deltaTime = 0;
      
      this.setupAnimationFrame();
    }

    setupAnimationFrame() {
      const animate = (currentTime) => {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (this.isRunning) {
          this.update();
        }

        Utils.raf(animate);
      };

      Utils.raf(animate);
    }

    start() {
      this.isRunning = true;
    }

    stop() {
      this.isRunning = false;
    }

    update() {
      this.animations.forEach((animation, key) => {
        if (animation.update) {
          animation.update(this.deltaTime);
        }
      });
    }

    addAnimation(key, animation) {
      this.animations.set(key, animation);
    }

    removeAnimation(key) {
      this.animations.delete(key);
    }

    addObserver(key, observer) {
      this.observers.set(key, observer);
    }

    removeObserver(key) {
      const observer = this.observers.get(key);
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
      this.observers.delete(key);
    }

    cleanup() {
      this.animations.clear();
      this.observers.forEach(observer => {
        if (observer.disconnect) observer.disconnect();
      });
      this.observers.clear();
      this.stop();
    }
  }

  // ====================================
  // Particle System
  // ====================================
  class ParticleSystem {
    constructor(container, deviceDetector) {
      this.container = container;
      this.device = deviceDetector;
      this.particles = [];
      this.maxParticles = this.device.getParticleCount();
      this.types = ['particle-gold', 'particle-purple', 'particle-pink'];
      this.isActive = true;
      this.spawnRate = 0.5; // particles per second
      this.timeSinceLastSpawn = 0;
      
      this.init();
    }

    init() {
      if (this.maxParticles === 0) {
        this.isActive = false;
        return;
      }

      this.container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
      `;

      // Initial particle burst
      this.createInitialParticles();
    }

    createInitialParticles() {
      for (let i = 0; i < Math.min(this.maxParticles, 5); i++) {
        setTimeout(() => {
          this.spawnParticle();
        }, i * 400);
      }
    }

    spawnParticle() {
      if (!this.isActive || this.particles.length >= this.maxParticles) return;

      const type = this.types[Utils.randomInt(0, this.types.length - 1)];
      const particle = this.createParticle(type);
      
      this.particles.push(particle);
      this.container.appendChild(particle.element);

      // Schedule removal
      setTimeout(() => {
        this.removeParticle(particle);
      }, particle.lifetime);
    }

    createParticle(type) {
      const element = Utils.createElement('div', {
        class: `${type} gpu-accelerated`,
        'aria-hidden': 'true'
      });

      const particle = {
        element,
        type,
        x: Utils.random(0, 100),
        y: 100,
        vx: Utils.random(-0.5, 0.5),
        vy: Utils.random(-2, -1),
        life: 0,
        lifetime: Utils.random(8000, 12000),
        size: this.getParticleSize(type),
        rotation: Utils.random(0, 360),
        rotationSpeed: Utils.random(-2, 2)
      };

      element.style.cssText = `
        position: absolute;
        left: ${particle.x}%;
        top: ${particle.y}%;
        width: ${particle.size}px;
        height: ${particle.size}px;
        transform: rotate(${particle.rotation}deg);
        animation-delay: ${Utils.random(0, 2)}s;
        animation-duration: ${particle.lifetime / 1000}s;
        will-change: transform;
      `;

      return particle;
    }

    getParticleSize(type) {
      switch (type) {
        case 'particle-gold': return Utils.random(4, 8);
        case 'particle-purple': return Utils.random(3, 6);
        case 'particle-pink': return Utils.random(2, 5);
        default: return 4;
      }
    }

    removeParticle(particle) {
      const index = this.particles.indexOf(particle);
      if (index > -1) {
        this.particles.splice(index, 1);
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      }
    }

    update(deltaTime) {
      if (!this.isActive) return;

      this.timeSinceLastSpawn += deltaTime;
      
      if (this.timeSinceLastSpawn >= (1000 / this.spawnRate)) {
        this.spawnParticle();
        this.timeSinceLastSpawn = 0;
      }
    }

    toggle() {
      this.isActive = !this.isActive;
      if (!this.isActive) {
        this.cleanup();
      } else {
        this.createInitialParticles();
      }
    }

    cleanup() {
      this.particles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      this.particles = [];
    }

    updateQuality(level) {
      this.maxParticles = level === 'high' ? CONFIG.performance.particleCount.high :
                         level === 'medium' ? CONFIG.performance.particleCount.medium :
                         level === 'low' ? CONFIG.performance.particleCount.low :
                         CONFIG.performance.particleCount.minimal;
      
      if (this.particles.length > this.maxParticles) {
        const excess = this.particles.length - this.maxParticles;
        for (let i = 0; i < excess; i++) {
          this.removeParticle(this.particles[0]);
        }
      }
    }
  }

  // ====================================
  // Magnetic Button Effects
  // ====================================
  class MagneticButtons {
    constructor(deviceDetector) {
      this.device = deviceDetector;
      this.buttons = [];
      this.isActive = this.device.supportsHover && !this.device.isReducedMotion;
      
      this.init();
    }

    init() {
      if (!this.isActive) return;

      this.buttons = Array.from(document.querySelectorAll('.magnetic-button-enhanced'));
      this.buttons.forEach(button => this.setupButton(button));
    }

    setupButton(button) {
      let isHovering = false;
      let animationId = null;

      const handleMouseEnter = () => {
        isHovering = true;
        button.style.transition = 'transform 0.1s ease-out';
      };

      const handleMouseMove = Utils.throttle((e) => {
        if (!isHovering || this.device.isReducedMotion) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height);
        const strength = Math.min(distance / maxDistance, 1);

        const intensity = (1 - strength) * this.device.getAnimationQuality() * 0.15;
        const scale = 1 + intensity * 0.3;

        if (animationId) {
          cancelAnimationFrame(animationId);
        }

        animationId = requestAnimationFrame(() => {
          button.style.transform = `translate(${x * intensity}px, ${y * intensity}px) scale(${scale})`;
        });
      }, 16);

      const handleMouseLeave = () => {
        isHovering = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
        button.style.transition = 'transform 0.3s var(--ease-spring)';
        button.style.transform = 'translate(0, 0) scale(1)';
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      // Store cleanup function
      button._magneticCleanup = () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }

    cleanup() {
      this.buttons.forEach(button => {
        if (button._magneticCleanup) {
          button._magneticCleanup();
        }
      });
    }
  }

  // ====================================
  // Scroll Animations
  // ====================================
  class ScrollAnimations {
    constructor(deviceDetector) {
      this.device = deviceDetector;
      this.observer = null;
      this.elements = [];
      this.isActive = !this.device.isReducedMotion;
      
      this.init();
    }

    init() {
      if (!this.isActive) return;

      this.elements = Array.from(document.querySelectorAll('.scroll-reveal-enhanced'));
      
      if (this.elements.length === 0) return;

      this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.revealElement(entry.target);
          }
        });
      }, options);

      this.elements.forEach(element => {
        this.observer.observe(element);
      });
    }

    revealElement(element) {
      element.classList.add('revealed');

      // Handle staggered elements
      const staggerElements = element.querySelectorAll('[class*="scroll-stagger-"]');
      staggerElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('revealed');
        }, index * 100);
      });

      // Handle morphing cards
      if (element.classList.contains('morph-card-scroll')) {
        setTimeout(() => {
          element.classList.add('scrolled');
        }, 300);
      }

      // Stop observing once revealed
      this.observer.unobserve(element);
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
  class ThemeManager {
    constructor() {
      this.currentTheme = 'default';
      this.themes = Object.keys(CONFIG.themes);
      this.root = document.documentElement;
      
      this.loadSavedTheme();
    }

    loadSavedTheme() {
      const savedTheme = localStorage.getItem('pageant-theme');
      if (savedTheme && this.themes.includes(savedTheme)) {
        this.setTheme(savedTheme);
      }
    }

    setTheme(themeName) {
      if (!this.themes.includes(themeName)) return;

      this.currentTheme = themeName;
      const theme = CONFIG.themes[themeName];

      // Update CSS custom properties
      Object.entries(theme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        this.root.style.setProperty(cssVar, value);
      });

      // Update data attribute
      this.root.setAttribute('data-theme', themeName);

      // Save to localStorage
      localStorage.setItem('pageant-theme', themeName);

      // Dispatch event
      document.dispatchEvent(new CustomEvent('themeChange', {
        detail: { theme: themeName }
      }));

      Utils.showNotification(`Theme changed to ${themeName}`, 'success');
    }

    getNextTheme() {
      const currentIndex = this.themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % this.themes.length;
      return this.themes[nextIndex];
    }

    cycleTheme() {
      const nextTheme = this.getNextTheme();
      this.setTheme(nextTheme);
    }
  }

  // ====================================
  // Performance Monitor
  // ====================================
  class PerformanceMonitor {
    constructor() {
      this.metrics = {
        fps: 0,
        frameTime: 0,
        memoryUsage: 0
      };
      this.frameCount = 0;
      this.lastTime = performance.now();
      this.isMonitoring = false;
    }

    start() {
      this.isMonitoring = true;
      this.monitor();
    }

    stop() {
      this.isMonitoring = false;
    }

    monitor() {
      if (!this.isMonitoring) return;

      const currentTime = performance.now();
      this.frameCount++;

      if (currentTime - this.lastTime >= 1000) {
        this.metrics.fps = this.frameCount;
        this.metrics.frameTime = (currentTime - this.lastTime) / this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;

        // Memory usage (if available)
        if (performance.memory) {
          this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
        }

        // Emit performance update
        document.dispatchEvent(new CustomEvent('performanceUpdate', {
          detail: this.metrics
        }));
      }

      requestAnimationFrame(() => this.monitor());
    }

    getMetrics() {
      return { ...this.metrics };
    }
  }

  // ====================================
  // Main PageantEmpress Class
  // ====================================
  class PageantEmpress {
    constructor() {
      this.deviceDetector = new DeviceDetector();
      this.animationManager = new AnimationManager(this.deviceDetector);
      this.themeManager = new ThemeManager();
      this.performanceMonitor = new PerformanceMonitor();
      this.particleSystem = null;
      this.magneticButtons = null;
      this.scrollAnimations = null;
      this.swiper = null;
      this.isInitialized = false;
      
      this.init();
    }

    async init() {
      console.log('🎭 PageantEmpress initializing...');

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
      } else {
        this.initializeComponents();
      }

      // Setup global event listeners
      this.setupEventListeners();
      
      console.log('✨ PageantEmpress initialized successfully!');
      this.isInitialized = true;
    }

    initializeComponents() {
      // Initialize particle system
      const particleContainer = document.querySelector('.particle-system-enhanced');
      if (particleContainer) {
        this.particleSystem = new ParticleSystem(particleContainer, this.deviceDetector);
        this.animationManager.addAnimation('particles', this.particleSystem);
      }

      // Initialize magnetic buttons
      this.magneticButtons = new MagneticButtons(this.deviceDetector);

      // Initialize scroll animations
      this.scrollAnimations = new ScrollAnimations(this.deviceDetector);

      // Initialize Swiper
      this.initializeSwiper();

      // Initialize newsletter form
      this.initializeNewsletterForm();

      // Initialize demo buttons
      this.initializeDemoButtons();

      // Initialize AOS if available
      this.initializeAOS();

      // Start animation manager
      this.animationManager.start();

      // Start performance monitoring in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.performanceMonitor.start();
      }
    }

    initializeSwiper() {
      if (typeof Swiper === 'undefined') return;

      const swiperElement = document.querySelector('.swiper');
      if (!swiperElement) return;

      this.swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
          renderBullet: function(index, className) {
            return `<span class="${className}" aria-label="Go to slide ${index + 1}"></span>`;
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        a11y: {
          enabled: true,
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
        },
        on: {
          init: () => {
            console.log('🎠 Swiper initialized');
          },
          slideChange: () => {
            // Add any slide change animations here
          }
        }
      });
    }

    initializeNewsletterForm() {
      const form = document.querySelector('.newsletter-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
                if (!this.isValidEmail(email)) {
          Utils.showNotification('Please enter a valid email address', 'error');
          emailInput.focus();
          return;
        }

        // Simulate newsletter subscription
        const button = form.querySelector('button');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Subscribing...';
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
          Utils.showNotification('Thank you for subscribing to our royal court!', 'success');
          emailInput.value = '';
          button.innerHTML = originalText;
          button.disabled = false;
          
          // Fire analytics event
          this.trackEvent('newsletter_signup', { email_domain: email.split('@')[1] });
        }, 2000);
      });
    }

    initializeDemoButtons() {
      const demoButtons = document.querySelectorAll('.demo-buttons .magnetic-button-enhanced');
      
      demoButtons.forEach(button => {
        if (button.textContent.includes('Particle Magic')) {
          button.addEventListener('click', () => this.toggleParticles());
        }
        
        if (button.textContent.includes('Animation Quality')) {
          button.addEventListener('click', () => this.toggleAnimationQuality());
        }
        
        if (button.textContent.includes('Color Theme')) {
          button.addEventListener('click', () => this.themeManager.cycleTheme());
        }
      });
    }

    initializeAOS() {
      if (typeof AOS === 'undefined') return;

      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic',
        disable: () => this.deviceDetector.isReducedMotion || this.deviceDetector.isLowEndDevice
      });

      console.log('🎬 AOS initialized');
    }

    setupEventListeners() {
      // Window resize handler
      window.addEventListener('resize', Utils.debounce(() => {
        this.handleResize();
      }, 250));

      // Visibility change handler
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.animationManager.stop();
        } else {
          this.animationManager.start();
        }
      });

      // Performance monitoring
      document.addEventListener('performanceUpdate', (e) => {
        const { fps, memoryUsage } = e.detail;
        
        // Auto-adjust quality based on performance
        if (fps < 30 && memoryUsage > 100) {
          this.autoAdjustPerformance();
        }
      });

      // Theme change listener
      document.addEventListener('themeChange', (e) => {
        console.log('🎨 Theme changed to:', e.detail.theme);
      });

      // Motion preference change
      document.addEventListener('motionPreferenceChange', (e) => {
        if (e.detail.reducedMotion) {
          this.disableAnimations();
        } else {
          this.enableAnimations();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        this.handleKeydown(e);
      });

      // Touch events for mobile
      if (this.deviceDetector.supportsTouch) {
        this.setupTouchEvents();
      }

      // Scroll performance optimization
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    handleResize() {
      const wasMobile = this.deviceDetector.isMobile;
      this.deviceDetector.isMobile = window.innerWidth < 768;
      this.deviceDetector.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      this.deviceDetector.isDesktop = window.innerWidth >= 1024;

      // Update particle count if device type changed
      if (wasMobile !== this.deviceDetector.isMobile && this.particleSystem) {
        this.particleSystem.updateQuality(this.deviceDetector.getPerformanceLevel());
      }

      // Reinitialize Swiper if needed
      if (this.swiper) {
        this.swiper.update();
      }

      console.log('📱 Window resized, device updated');
    }

    handleScroll() {
      const scrollY = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / documentHeight;

      // Update parallax elements
      document.querySelectorAll('.parallax-enhanced').forEach(element => {
        const speed = parseFloat(element.dataset.speed) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      // Update scroll progress indicator if exists
      const indicator = document.querySelector('.scroll-progress');
      if (indicator) {
        indicator.style.transform = `scaleX(${scrollProgress})`;
      }

      // Fire scroll event for other components
      document.dispatchEvent(new CustomEvent('optimizedScroll', {
        detail: { scrollY, scrollProgress }
      }));
    }

    handleKeydown(e) {
      // Accessibility keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.themeManager.setTheme('default');
            break;
          case '2':
            e.preventDefault();
            this.themeManager.setTheme('royal');
            break;
          case '3':
            e.preventDefault();
            this.themeManager.setTheme('sunset');
            break;
          case '4':
            e.preventDefault();
            this.themeManager.setTheme('ocean');
            break;
          case 'p':
            e.preventDefault();
            this.toggleParticles();
            break;
          case 'q':
            e.preventDefault();
            this.toggleAnimationQuality();
            break;
        }
      }

      // ESC to close modals/notifications
      if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(notification => {
          notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
    }

    setupTouchEvents() {
      let touchStartY = 0;
      let touchStartX = 0;

      document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      document.addEventListener('touchmove', Utils.throttle((e) => {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchY - touchStartY;
        const deltaX = touchX - touchStartX;

        // Add touch-based interactions here
        document.dispatchEvent(new CustomEvent('touchMove', {
          detail: { deltaX, deltaY, touchY, touchX }
        }));
      }, 16), { passive: true });
    }

    // ====================================
    // Feature Toggle Methods
    // ====================================
    toggleParticles() {
      if (this.particleSystem) {
        this.particleSystem.toggle();
        const isActive = this.particleSystem.isActive;
        Utils.showNotification(
          `Particles ${isActive ? 'enabled' : 'disabled'}`,
          'info'
        );
        this.trackEvent('toggle_particles', { enabled: isActive });
      }
    }

    toggleAnimationQuality() {
      const qualities = ['high', 'medium', 'low', 'minimal'];
      const current = this.getCurrentQuality();
      const currentIndex = qualities.indexOf(current);
      const nextIndex = (currentIndex + 1) % qualities.length;
      const newQuality = qualities[nextIndex];

      this.setAnimationQuality(newQuality);
      
      Utils.showNotification(
        `Animation quality: ${newQuality}`,
        'info'
      );
      
      this.trackEvent('change_animation_quality', { quality: newQuality });
    }

    getCurrentQuality() {
      const intensity = getComputedStyle(document.documentElement)
        .getPropertyValue('--effect-intensity').trim();
      
      if (intensity === '0') return 'minimal';
      if (parseFloat(intensity) <= 0.3) return 'low';
      if (parseFloat(intensity) <= 0.6) return 'medium';
      return 'high';
    }

    setAnimationQuality(quality) {
      const root = document.documentElement;
      let intensity, particleCount;

      switch (quality) {
        case 'high':
          intensity = '1';
          particleCount = CONFIG.performance.particleCount.high;
          break;
        case 'medium':
          intensity = '0.6';
          particleCount = CONFIG.performance.particleCount.medium;
          break;
        case 'low':
          intensity = '0.3';
          particleCount = CONFIG.performance.particleCount.low;
          break;
        case 'minimal':
          intensity = '0';
          particleCount = CONFIG.performance.particleCount.minimal;
          break;
        default:
          intensity = '1';
          particleCount = CONFIG.performance.particleCount.high;
      }

      root.style.setProperty('--effect-intensity', intensity);
      root.style.setProperty('--particle-count', particleCount.toString());

      // Update particle system
      if (this.particleSystem) {
        this.particleSystem.updateQuality(quality);
      }

      // Update reduced motion state
      if (quality === 'minimal') {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    }

    autoAdjustPerformance() {
      console.log('⚡ Auto-adjusting performance due to low FPS');
      
      const currentQuality = this.getCurrentQuality();
      const qualities = ['high', 'medium', 'low', 'minimal'];
      const currentIndex = qualities.indexOf(currentQuality);
      
      if (currentIndex < qualities.length - 1) {
        const newQuality = qualities[currentIndex + 1];
        this.setAnimationQuality(newQuality);
        
        Utils.showNotification(
          `Performance adjusted to ${newQuality} quality`,
          'info',
          5000
        );
      }
    }

    disableAnimations() {
      this.animationManager.stop();
      if (this.particleSystem) {
        this.particleSystem.isActive = false;
      }
      document.body.classList.add('reduced-motion');
      console.log('🚫 Animations disabled due to motion preference');
    }

    enableAnimations() {
      this.animationManager.start();
      if (this.particleSystem) {
        this.particleSystem.isActive = true;
      }
      document.body.classList.remove('reduced-motion');
      console.log('✅ Animations enabled');
    }

    // ====================================
    // Utility Methods
    // ====================================
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    trackEvent(eventName, properties = {}) {
      // Analytics tracking placeholder
      console.log('📊 Track Event:', eventName, properties);
      
      // Example: Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
          custom_parameter_1: properties,
          timestamp: Date.now()
        });
      }

      // Example: Custom analytics
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track(eventName, properties);
      }
    }

    // ====================================
    // Public API Methods
    // ====================================
    getStatus() {
      return {
        initialized: this.isInitialized,
        device: {
          isMobile: this.deviceDetector.isMobile,
          isTablet: this.deviceDetector.isTablet,
          isDesktop: this.deviceDetector.isDesktop,
          isLowEnd: this.deviceDetector.isLowEndDevice,
          supportsTouch: this.deviceDetector.supportsTouch,
          connectionType: this.deviceDetector.connectionType,
          batteryLevel: this.deviceDetector.batteryLevel
        },
        theme: this.themeManager.currentTheme,
        performance: this.performanceMonitor.getMetrics(),
        animations: {
          particlesActive: this.particleSystem ? this.particleSystem.isActive : false,
          quality: this.getCurrentQuality()
        }
      };
    }

    setTheme(themeName) {
      this.themeManager.setTheme(themeName);
    }

    getAvailableThemes() {
      return this.themeManager.themes;
    }

    // ====================================
    // Cleanup Methods
    // ====================================
    destroy() {
      console.log('🧹 Cleaning up PageantEmpress...');
      
      // Stop animation manager
      this.animationManager.stop();
      
      // Cleanup components
      if (this.particleSystem) {
        this.particleSystem.cleanup();
      }
      
      if (this.magneticButtons) {
        this.magneticButtons.cleanup();
      }
      
      if (this.scrollAnimations) {
        this.scrollAnimations.cleanup();
      }
      
      if (this.swiper) {
        this.swiper.destroy(true, true);
      }
      
      // Stop performance monitoring
      this.performanceMonitor.stop();
      
      // Clean up animation manager
      this.animationManager.cleanup();
      
      console.log('✅ PageantEmpress cleanup complete');
    }
  }

  // ====================================
  // Initialize Application
  // ====================================
  let pageantEmpress = null;

  // Auto-initialize when DOM is ready
  const init = () => {
    try {
      pageantEmpress = new PageantEmpress();
      
      // Expose to global scope for debugging
      window.PageantEmpress = pageantEmpress;
      
      // Add CSS animations for notifications
      if (!document.getElementById('pageant-animations')) {
        const style = document.createElement('style');
        style.id = 'pageant-animations';
        style.textContent = `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .notification {
            transition: all 0.3s ease;
          }
          
          .notification-success {
            border-left: 4px solid var(--primary-gold);
          }
          
          .notification-error {
            border-left: 4px solid var(--accent-pink);
          }
          
          .notification-info {
            border-left: 4px solid var(--accent-blue);
          }
          
          .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-gold), var(--secondary-purple));
            transform-origin: 0 0;
            z-index: 10000;
            transition: transform 0.1s ease-out;
          }
        `;
        document.head.appendChild(style);
      }
      
      // Add scroll progress indicator
      if (!document.querySelector('.scroll-progress')) {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        scrollProgress.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scrollProgress);
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize PageantEmpress:', error);
    }
  };

  // Initialize immediately if DOM is ready, otherwise wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (pageantEmpress) {
      pageantEmpress.destroy();
    }
  });

  // Hot reload support for development
  if (module && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      if (pageantEmpress) {
        pageantEmpress.destroy();
      }
    });
  }

})();

// ====================================
// Service Worker Registration
// ====================================
if ('serviceWorker' in navigator && 'caches' in window) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('📱 Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            Utils.showNotification(
              'New content available! Refresh to update.',
              'info',
              10000
            );
          }
        });
      });
      
    } catch (error) {
      console.log('❌ Service Worker registration failed:', error);
    }
  });
}

// ====================================
// Global Error Handling
// ====================================
window.addEventListener('error', (event) => {
  console.error('💥 Global error:', event.error);
  
  // Report to analytics if available
  if (window.PageantEmpress) {
    window.PageantEmpress.trackEvent('javascript_error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
  
  // Report to analytics if available
  if (window.PageantEmpress) {
    window.PageantEmpress.trackEvent('promise_rejection', {
      reason: event.reason?.toString() || 'Unknown'
    });
  }
});

// ====================================
// Development Helpers
// ====================================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Development console commands
  window.pe = {
    status: () => window.PageantEmpress?.getStatus(),
    setTheme: (theme) => window.PageantEmpress?.setTheme(theme),
    toggleParticles: () => window.PageantEmpress?.toggleParticles(),
    toggleQuality: () => window.PageantEmpress?.toggleAnimationQuality(),
    themes: () => window.PageantEmpress?.getAvailableThemes()
  };
  
  console.log(`
🎭 PageantEmpress Development Mode
👑 Available commands:
   pe.status() - Get current status
   pe.setTheme(name) - Set theme
   pe.toggleParticles() - Toggle particles
   pe.toggleQuality() - Toggle quality
   pe.themes() - Get available themes
  `);
}
