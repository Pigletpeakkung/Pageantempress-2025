/* ==========================================================================
   ANIMATIONS.JS - PageantEmpress 2025
   Advanced Animation Controllers and Effects
   ========================================================================== */

class PageantAnimations {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.particleSystems = new Map();
        this.timeline = null;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.performance = {
            fps: 60,
            frameTime: 16.67,
            lastFrame: 0
        };
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParticleEffects();
        this.setupMouseEffects();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupPageTransitions();
        this.setupMagneticEffects();
        this.setupTextAnimations();
        this.setupPerformanceMonitoring();
        this.setupAnimationObserver();
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        if (this.isReducedMotion) return;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all scroll-animated elements
        document.querySelectorAll('.scroll-animate, .scroll-scale, .scroll-slide-left, .scroll-slide-right, .scroll-stagger').forEach(el => {
            scrollObserver.observe(el);
        });

        this.observers.set('scroll', scrollObserver);
    }

    // Trigger scroll animation
    triggerScrollAnimation(element) {
        const animationType = this.getAnimationType(element);
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            switch (animationType) {
                case 'crown-entrance':
                    this.playCrownEntrance(element);
                    break;
                case 'sparkle-reveal':
                    this.playSparkleReveal(element);
                    break;
                case 'royal-fade':
                    this.playRoyalFade(element);
                    break;
                case 'pageant-slide':
                    this.playPageantSlide(element);
                    break;
                default:
                    this.playDefaultAnimation(element);
            }
        }, delay);
    }

    // Get animation type from element
    getAnimationType(element) {
        const classes = element.classList;
        if (classes.contains('crown-entrance')) return 'crown-entrance';
        if (classes.contains('sparkle-reveal')) return 'sparkle-reveal';
        if (classes.contains('royal-fade')) return 'royal-fade';
        if (classes.contains('pageant-slide')) return 'pageant-slide';
        return 'default';
    }

    // Play crown entrance animation
    playCrownEntrance(element) {
        const crown = element.querySelector('.crown-icon') || element;
        
        crown.style.transform = 'translateY(-100px) rotate(10deg) scale(0.5)';
        crown.style.opacity = '0';
        
        crown.animate([
            { transform: 'translateY(-100px) rotate(10deg) scale(0.5)', opacity: 0 },
            { transform: 'translateY(10px) rotate(-5deg) scale(1.1)', opacity: 0.8, offset: 0.6 },
            { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 }
        ], {
            duration: 1200,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            fill: 'forwards'
        });

        // Add sparkle effect
        this.createSparkleEffect(crown);
    }

    // Play sparkle reveal animation
    playSparkleReveal(element) {
        const sparkles = this.createSparkles(element, 8);
        
        sparkles.forEach((sparkle, index) => {
            sparkle.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 0 },
                { transform: 'scale(1) rotate(180deg)', opacity: 1, offset: 0.5 },
                { transform: 'scale(0) rotate(360deg)', opacity: 0 }
            ], {
                duration: 1500,
                delay: index * 100,
                easing: 'ease-out'
            });
        });

        // Clean up sparkles
        setTimeout(() => {
            sparkles.forEach(sparkle => sparkle.remove());
        }, 2000);
    }

    // Play royal fade animation
    playRoyalFade(element) {
        element.animate([
            { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });

        // Add glow effect
        this.addGlowEffect(element);
    }

    // Play pageant slide animation
    playPageantSlide(element) {
        const direction = element.dataset.direction || 'left';
        const distance = direction === 'left' ? '-100px' : '100px';
        
        element.animate([
            { transform: `translateX(${distance})`, opacity: 0 },
            { transform: 'translateX(0)', opacity: 1 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });
    }

    // Play default animation
    playDefaultAnimation(element) {
        element.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 600,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }

    // Setup particle effects
    setupParticleEffects() {
        if (this.isReducedMotion) return;

        // Create floating particles
        this.createFloatingParticles();
        
        // Create sparkle trails
        this.setupSparkleTrails();
        
        // Create crown particle system
        this.createCrownParticles();
    }

    // Create floating particles
    createFloatingParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;

        const particleCount = window.innerWidth < 768 ? 10 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--component-primary);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.3};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticles ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * -20}s;
            `;
            
            particleContainer.appendChild(particle);
        }
    }

    // Setup sparkle trails
    setupSparkleTrails() {
        let lastX = 0;
        let lastY = 0;
        let throttleTimer = null;

        document.addEventListener('mousemove', (e) => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 50) {
                    this.createSparkleTrail(e.clientX, e.clientY);
                    lastX = e.clientX;
                    lastY = e.clientY;
                }
                
                throttleTimer = null;
            }, 100);
        });
    }

    // Create sparkle trail
    createSparkleTrail(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-trail';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--component-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1, offset: 0.2 },
            { transform: 'scale(0)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            sparkle.remove();
        });
    }

    // Create crown particles
    createCrownParticles() {
        const crownElements = document.querySelectorAll('.crown-icon, .fa-crown');
        
        crownElements.forEach(crown => {
            crown.addEventListener('mouseenter', () => {
                this.createSparkleEffect(crown);
            });
        });
    }

    // Create sparkle effect
    createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const sparkleCount = 6;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'crown-sparkle';
            sparkle.style.cssText = `
                position: fixed;
                                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 6px;
                height: 6px;
                background: var(--component-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(sparkle);
            
            const angle = (360 / sparkleCount) * i;
            const distance = 30 + Math.random() * 20;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            sparkle.animate([
                { transform: 'translate(0, 0) scale(0)', opacity: 0 },
                { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: 0.5 },
                { transform: `translate(${x * 1.5}px, ${y * 1.5}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1200,
                delay: i * 100,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).addEventListener('finish', () => {
                sparkle.remove();
            });
        }
    }

    // Setup mouse effects
    setupMouseEffects() {
        if (this.isReducedMotion) return;

        // Magnetic effect for buttons
        document.querySelectorAll('.magnetic-button, .magnetic-hover').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.activateMagneticEffect(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.deactivateMagneticEffect(element);
            });
        });

        // Cursor effects
        this.setupCustomCursor();
    }

    // Activate magnetic effect
    activateMagneticEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const handleMouseMove = (e) => {
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
        };
        
        element.addEventListener('mousemove', handleMouseMove);
        element._magneticHandler = handleMouseMove;
    }

    // Deactivate magnetic effect
    deactivateMagneticEffect(element) {
        if (element._magneticHandler) {
            element.removeEventListener('mousemove', element._magneticHandler);
            delete element._magneticHandler;
        }
        
        element.style.transform = '';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transition = '';
        }, 300);
    }

    // Setup custom cursor
    setupCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(212, 175, 55, 0.3);
            border: 2px solid var(--component-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = `${cursorX - 10}px`;
            cursor.style.top = `${cursorY - 10}px`;
            
            requestAnimationFrame(animateCursor);
        };
        
        animateCursor();
        
        // Cursor interactions
        document.querySelectorAll('a, button, .btn').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(212, 175, 55, 0.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(212, 175, 55, 0.3)';
            });
        });
    }

    // Setup hover animations
    setupHoverAnimations() {
        // 3D card effects
        document.querySelectorAll('.featured-card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.handle3DMouseMove(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.reset3DCard(card);
            });
        });

        // Hover lift effects
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverLiftAnimation(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetHoverLiftAnimation(element);
            });
        });

        // Glow effects
        document.querySelectorAll('.glow-hover, .hover-glow').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.activateGlowEffect(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.deactivateGlowEffect(element);
            });
        });
    }

    // Handle 3D mouse move
    handle3DMouseMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 10;
        const rotateY = (centerX - x) / centerX * 10;
        
        const cardContent = card.querySelector('.card-3d-content') || card;
        cardContent.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Update shine effect
        const shine = cardContent.querySelector('.card-shine');
        if (shine) {
            shine.style.background = `linear-gradient(${Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90}deg, transparent, rgba(255, 255, 255, 0.3), transparent)`;
        }
    }

    // Reset 3D card
    reset3DCard(card) {
        const cardContent = card.querySelector('.card-3d-content') || card;
        cardContent.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        cardContent.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            cardContent.style.transition = '';
        }, 300);
    }

    // Play hover lift animation
    playHoverLiftAnimation(element) {
        element.animate([
            { transform: 'translateY(0) scale(1)', boxShadow: 'var(--shadow-card)' },
            { transform: 'translateY(-8px) scale(1.02)', boxShadow: 'var(--shadow-hover)' }
        ], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-out'
        });
    }

    // Reset hover lift animation
    resetHoverLiftAnimation(element) {
        element.animate([
            { transform: 'translateY(-8px) scale(1.02)', boxShadow: 'var(--shadow-hover)' },
            { transform: 'translateY(0) scale(1)', boxShadow: 'var(--shadow-card)' }
        ], {
            duration: 200,
            fill: 'forwards',
            easing: 'ease-out'
        });
    }

    // Activate glow effect
    activateGlowEffect(element) {
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = 'var(--shadow-glow)';
    }

    // Deactivate glow effect
    deactivateGlowEffect(element) {
        element.style.boxShadow = '';
    }

    // Setup loading animations
    setupLoadingAnimations() {
        // Crown loader
        this.createCrownLoader();
        
        // Progress animations
        this.setupProgressAnimations();
        
        // Skeleton loaders
        this.setupSkeletonLoaders();
    }

    // Create crown loader
    createCrownLoader() {
        const loaders = document.querySelectorAll('.crown-loader-3d');
        
        loaders.forEach(loader => {
            if (!loader.querySelector('.crown-base')) {
                this.buildCrownLoader(loader);
            }
        });
    }

    // Build crown loader
    buildCrownLoader(container) {
        container.innerHTML = `
            <div class="crown-base"></div>
            <div class="crown-peak"></div>
            <div class="crown-jewel jewel-1"></div>
            <div class="crown-jewel jewel-2"></div>
            <div class="crown-jewel jewel-3"></div>
            <div class="sparkle-container">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
            </div>
        `;
    }

    // Setup progress animations
    setupProgressAnimations() {
        document.querySelectorAll('.loading-progress').forEach(progress => {
            const bar = progress.querySelector('.progress-bar');
            if (bar) {
                bar.style.width = '0%';
                bar.animate([
                    { width: '0%' },
                    { width: '100%' }
                ], {
                    duration: 2000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    iterations: Infinity
                });
            }
        });
    }

    // Setup skeleton loaders
    setupSkeletonLoaders() {
        document.querySelectorAll('.skeleton-loader').forEach(skeleton => {
            skeleton.style.background = `
                linear-gradient(90deg, 
                    var(--glass-bg-light) 25%, 
                    var(--glass-bg-medium) 50%, 
                    var(--glass-bg-light) 75%)
            `;
            skeleton.style.backgroundSize = '200% 100%';
            skeleton.style.animation = 'shimmer 2s infinite';
        });
    }

    // Setup page transitions
    setupPageTransitions() {
        // Handle page transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"], a[href^="./"], a[href^="../"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                this.performPageTransition(link.href);
            }
        });
    }

    // Perform page transition
    async performPageTransition(url) {
        // Exit animation
        document.body.classList.add('page-transition-exit');
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate
        window.location.href = url;
    }

    // Setup text animations
    setupTextAnimations() {
        // Typewriter effect
        this.setupTypewriterEffect();
        
        // Text reveal
        this.setupTextReveal();
        
        // Gradient text animations
        this.setupGradientTextAnimations();
    }

    // Setup typewriter effect
    setupTypewriterEffect() {
        document.querySelectorAll('.typewriter-text').forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--component-primary)';
            
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                
                if (i >= text.length) {
                    clearInterval(timer);
                    // Blinking cursor
                    setInterval(() => {
                        element.style.borderRightColor = 
                            element.style.borderRightColor === 'transparent' ? 
                            'var(--component-primary)' : 'transparent';
                    }, 530);
                }
            }, 100);
        });
    }

    // Setup text reveal
    setupTextReveal() {
        document.querySelectorAll('.text-reveal').forEach(element => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateTextReveal(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Animate text reveal
    animateTextReveal(element) {
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            element.appendChild(span);
            
            span.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 600,
                delay: index * 100,
                fill: 'forwards',
                easing: 'ease-out'
            });
        });
    }

    // Setup gradient text animations
    setupGradientTextAnimations() {
        document.querySelectorAll('.shimmer-text').forEach(element => {
            element.style.backgroundSize = '200% 100%';
            element.style.animation = 'shimmer 3s ease-in-out infinite';
        });
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.performance.fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Adjust animation quality based on performance
                this.adjustAnimationQuality();
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    // Adjust animation quality
    adjustAnimationQuality() {
        const isLowPerformance = this.performance.fps < 30;
        
        if (isLowPerformance) {
            document.body.classList.add('low-performance');
            // Reduce particles
            document.querySelectorAll('.floating-particle').forEach((particle, index) => {
                if (index % 2 === 0) particle.style.display = 'none';
            });
        } else {
            document.body.classList.remove('low-performance');
            // Restore particles
            document.querySelectorAll('.floating-particle').forEach(particle => {
                particle.style.display = '';
            });
        }
    }

    // Setup animation observer
    setupAnimationObserver() {
        // Observe animations for performance
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log('Animation performance:', entry.name, entry.duration);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    // Create sparkles
    createSparkles(parent, count = 5) {
        const sparkles = [];
        const rect = parent.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'dynamic-sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--component-primary);
                border-radius: 50%;
                left: ${Math.random() * rect.width}px;
                top: ${Math.random() * rect.height}px;
                pointer-events: none;
            `;
            
            parent.appendChild(sparkle);
            sparkles.push(sparkle);
        }
        
        return sparkles;
    }

    // Add glow effect
    addGlowEffect(element) {
        element.style.boxShadow = 'var(--shadow-glow)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.transition = 'box-shadow 0.5s ease';
        }, 1000);
    }

    // Play button ripple effect
    playButtonRipple(button, e) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            ripple.remove();
        });
    }

    // Stop all animations
    stopAllAnimations() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.animations.forEach(animation => {
            animation.cancel();
        });
        
        document.querySelectorAll('.floating-particle, .sparkle-trail, .crown-sparkle, .dynamic-sparkle').forEach(element => {
            element.remove();
        });
    }

    // Resume animations
    resumeAnimations() {
        this.setupScrollAnimations();
        this.setupParticleEffects();
    }

    // Get current FPS
    getCurrentFPS() {
        return this.performance.fps;
    }

    // Check if reduced motion is preferred
    isReducedMotionPreferred() {
        return this.isReducedMotion;
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.pageantAnimations = new PageantAnimations();
    
    // Setup button ripple effects
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn, button')) {
            const button = e.target.closest('.btn, button');
            if (button.style.position !== 'relative') {
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
            }
            window.pageantAnimations.playButtonRipple(button, e);
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageantAnimations;
}

