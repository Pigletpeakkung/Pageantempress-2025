// ===== ENHANCED PAGEANT EMPRESS MAIN JAVASCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS with enhanced settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // ===== ENHANCED ANIMATION MANAGER =====
    class EnhancedAnimationManager {
        constructor() {
            this.sparkles = [];
            this.shapes = [];
            this.isAnimating = true;
            this.performanceMode = this.detectPerformanceMode();
            this.init();
        }

                detectPerformanceMode() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isLowEnd = connection && connection.effectiveType && 
                            ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            return {
                highPerformance: !isLowEnd && !isReducedMotion,
                sparkleCount: isLowEnd ? 10 : isReducedMotion ? 0 : 30,
                shapeCount: isLowEnd ? 5 : isReducedMotion ? 0 : 15
            };
        }

        init() {
            this.createAnimatedBackground();
            this.createSparkleSystem();
            this.createGeometricShapes();
            this.createShineOverlay();
            this.setupInteractionEffects();
            this.startAnimationLoop();
        }

        createAnimatedBackground() {
            const existingBg = document.querySelector('.animated-background');
            if (!existingBg) {
                const bg = document.createElement('div');
                bg.className = 'animated-background';
                document.body.insertBefore(bg, document.body.firstChild);
            }
        }

        createSparkleSystem() {
            if (!this.performanceMode.highPerformance || this.performanceMode.sparkleCount === 0) return;

            let container = document.querySelector('.sparkle-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'sparkle-container';
                document.body.appendChild(container);
            }

            // Create initial sparkles
            for (let i = 0; i < this.performanceMode.sparkleCount; i++) {
                setTimeout(() => this.createSparkle(container), i * 200);
            }

            // Continuously create new sparkles
            this.sparkleInterval = setInterval(() => {
                if (this.isAnimating && this.sparkles.length < this.performanceMode.sparkleCount) {
                    this.createSparkle(container);
                }
            }, 800);
        }

        createSparkle(container) {
            const sparkle = document.createElement('div');
            const types = ['sparkle-small', 'sparkle-medium', 'sparkle-large', 'sparkle-star'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            sparkle.className = `sparkle ${type}`;
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            sparkle.style.animationDelay = Math.random() * 2 + 's';

            container.appendChild(sparkle);
            this.sparkles.push(sparkle);

            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
                this.sparkles = this.sparkles.filter(s => s !== sparkle);
            }, 6000);
        }

        createGeometricShapes() {
            if (!this.performanceMode.highPerformance || this.performanceMode.shapeCount === 0) return;

            let container = document.querySelector('.geometric-shapes');
            if (!container) {
                container = document.createElement('div');
                container.className = 'geometric-shapes';
                document.body.appendChild(container);
            }

            const shapeTypes = ['shape-diamond', 'shape-hexagon', 'shape-triangle'];
            
            for (let i = 0; i < this.performanceMode.shapeCount; i++) {
                const shape = document.createElement('div');
                const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
                
                shape.className = `geometric-shape ${shapeType}`;
                shape.style.left = Math.random() * 100 + '%';
                shape.style.top = Math.random() * 100 + '%';
                shape.style.animationDuration = (Math.random() * 10 + 15) + 's';
                shape.style.animationDelay = Math.random() * 5 + 's';

                container.appendChild(shape);
                this.shapes.push(shape);
            }
        }

        createShineOverlay() {
            if (!this.performanceMode.highPerformance) return;

            const existingShine = document.querySelector('.shine-overlay');
            if (!existingShine) {
                const shine = document.createElement('div');
                shine.className = 'shine-overlay';
                document.body.appendChild(shine);
            }
        }

        setupInteractionEffects() {
            // Add glow effects to interactive elements
            const interactiveElements = document.querySelectorAll('button, .nav-link, .card, .interactive-glow');
            
            interactiveElements.forEach(element => {
                if (!element.classList.contains('interactive-glow')) {
                    element.classList.add('interactive-glow');
                }

                element.addEventListener('mouseenter', (e) => {
                    this.createRippleEffect(e);
                });

                element.addEventListener('click', (e) => {
                    this.createClickEffect(e);
                });
            });
        }

        createRippleEffect(event) {
            const element = event.currentTarget;
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: rippleAnimation 0.6s ease-out;
                z-index: 1;
            `;

            if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
                element.style.position = 'relative';
            }

            element.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        }

        createClickEffect(event) {
            if (!this.performanceMode.highPerformance) return;

            const particles = [];
            const rect = event.currentTarget.getBoundingClientRect();
            const centerX = event.clientX - rect.left;
            const centerY = event.clientY - rect.top;

            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                const angle = (i / 8) * Math.PI * 2;
                const velocity = 50 + Math.random() * 30;
                
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: var(--primary-gold);
                    border-radius: 50%;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    pointer-events: none;
                    z-index: 1000;
                `;

                document.body.appendChild(particle);
                particles.push(particle);

                // Animate particle
                const startTime = performance.now();
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / 500, 1);
                    
                    const x = centerX + Math.cos(angle) * velocity * progress;
                    const y = centerY + Math.sin(angle) * velocity * progress;
                    const opacity = 1 - progress;
                    
                    particle.style.transform = `translate(${x - centerX}px, ${y - centerY}px)`;
                    particle.style.opacity = opacity;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                requestAnimationFrame(animate);
            }
        }

        startAnimationLoop() {
            if (!this.performanceMode.highPerformance) return;

            const animateParallax = () => {
                const scrollY = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.parallax-element');
                
                parallaxElements.forEach((element, index) => {
                    const speed = 0.5 + (index * 0.1);
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });

                if (this.isAnimating) {
                    requestAnimationFrame(animateParallax);
                }
            };

            requestAnimationFrame(animateParallax);
        }

        pauseAnimations() {
            this.isAnimating = false;
            if (this.sparkleInterval) {
                clearInterval(this.sparkleInterval);
            }
        }

        resumeAnimations() {
            this.isAnimating = true;
            this.createSparkleSystem();
            this.startAnimationLoop();
        }
    }

    // Initialize Enhanced Animation Manager
    const animationManager = new EnhancedAnimationManager();
    window.animationManager = animationManager;

    // ===== LOADING SCREEN =====
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

    // ===== ENHANCED HEADER FUNCTIONALITY =====
    
    // Enhanced Header Elements
    const header = document.getElementById('mainHeader') || document.querySelector('.main-header');
    const mobileToggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-toggle');
    const mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
    const mobileClose = document.getElementById('mobileClose') || document.querySelector('.mobile-close');
    const mobileOverlay = document.getElementById('mobileOverlay') || document.querySelector('.mobile-overlay');
    const searchToggle = document.getElementById('searchToggle') || document.querySelector('.search-toggle');
    const searchOverlay = document.getElementById('searchOverlay') || document.querySelector('.search-overlay');
    const searchClose = document.getElementById('searchClose') || document.querySelector('.search-close');
    const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
    const themeToggle = document.getElementById('themeToggle') || document.querySelector('.theme-toggle');
    const contactBtn = document.getElementById('contactBtn');
    
    // Create scroll indicator
    createScrollIndicator();
    
    // Enhanced Header Scroll Effect
    let lastScroll = 0;
    let scrollTimeout;
    let ticking = false;

    function updateHeaderOnScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Update scroll indicator
        updateScrollIndicator();

        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header?.classList.add('header-hidden');
        } else {
            header?.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
        ticking = false;

        // Debounced scroll end
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            updateActiveNav();
        }, 50);
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeaderOnScroll);
            ticking = true;
        }
    });

    // ===== ENHANCED MOBILE MENU =====
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    function toggleMobileMenu() {
        if (mobileMenu && mobileOverlay && mobileToggle) {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                mobileMenu.classList.add('active');
                mobileOverlay.classList.add('active');
                mobileToggle.classList.add('active');
                document.body.classList.add('menu-open');
                
                // Animate mobile menu items
                const menuItems = mobileMenu.querySelectorAll('.mobile-nav-link');
                menuItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.style.animation = 'slideInRight 0.4s ease-out forwards';
                });
            }
        }
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileOverlay && mobileToggle) {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    // Enhanced Mobile Menu Links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = link.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ===== ENHANCED SEARCH =====
    if (searchToggle) {
        searchToggle.addEventListener('click', toggleSearchOverlay);
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearchOverlay);
    }

    function toggleSearchOverlay() {
        if (searchOverlay) {
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active') && searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 300);
            }
        }
    }

    function closeSearchOverlay() {
        if (searchOverlay && searchInput) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    }

    // Enhanced Search Functionality
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            searchTimeout = setTimeout(() => {
                if (query.length > 2) {
                    handleSearch(query);
                    showSearchSuggestions(query);
                }
            }, 300);
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    function handleSearch(query) {
        console.log('Searching for:', query);
        
        // Track search if analytics available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                'search_term': query,
                'event_category': 'engagement'
            });
        }
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Performing search for:', query);
            closeSearchOverlay();
            // Implement actual search logic here
        }
    }

    function showSearchSuggestions(query) {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            // Add logic to show relevant suggestions based on query
            const tags = suggestions.querySelectorAll('.tag');
            tags.forEach(tag => {
                const tagText = tag.textContent.toLowerCase();
                if (tagText.includes(query.toLowerCase())) {
                    tag.style.display = 'inline-block';
                    tag.classList.add('highlight');
                } else {
                    tag.style.display = 'none';
                    tag.classList.remove('highlight');
                }
            });
        }
    }

    // ===== ENHANCED THEME TOGGLE =====
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    function toggleTheme() {
        const body = document.body;
        const icon = themeToggle.querySelector('.theme-icon') || themeToggle.querySelector('i');
        const tooltip = themeToggle.querySelector('.button-tooltip');
        
        body.classList.toggle('light-theme');
        
        // Animate theme transition
        body.style.transition = 'all 0.3s ease';
        
        if (body.classList.contains('light-theme')) {
            icon?.classList.remove('fa-moon');
            icon?.classList.add('fa-sun');
            if (tooltip) tooltip.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
            
            // Update sparkles for light theme
            if (window.animationManager) {
                window.animationManager.sparkles.forEach(sparkle => {
                    sparkle.style.filter = 'brightness(0.8)';
                });
            }
        } else {
            icon?.classList.remove('fa-sun');
            icon?.classList.add('fa-moon');
            if (tooltip) tooltip.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
            
                        // Reset sparkles for dark theme
            if (window.animationManager) {
                window.animationManager.sparkles.forEach(sparkle => {
                    sparkle.style.filter = 'none';
                });
            }
        }
        
        // Animate theme toggle button
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon') || themeToggle.querySelector('i');
            const tooltip = themeToggle.querySelector('.button-tooltip');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            if (tooltip) tooltip.textContent = 'Dark Mode';
        }
    }

    // ===== CONTACT BUTTON =====
    if (contactBtn) {
        contactBtn.addEventListener('click', openContact);
    }

    function openContact() {
        // Add click animation
        contactBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            contactBtn.style.transform = '';
            window.location.href = 'contact.html';
        }, 150);
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Escape key - close menus
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeSearchOverlay();
        }
        
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearchOverlay();
        }
        
        // Ctrl/Cmd + M for menu (mobile)
        if ((e.ctrlKey || e.metaKey) && e.key === 'm' && window.innerWidth <= 1024) {
            e.preventDefault();
            toggleMobileMenu();
        }
        
        // Ctrl/Cmd + D for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // ===== WINDOW RESIZE HANDLER =====
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 1024) {
                closeMobileMenu();
            }
            
            // Recalculate scroll indicator
            updateScrollIndicator();
            
            // Update animation manager settings
            if (window.animationManager) {
                window.animationManager.performanceMode = window.animationManager.detectPerformanceMode();
            }
        }, 250);
    });

    // ===== ENHANCED NAVIGATION =====
    function createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<div class="scroll-progress"></div>';
        document.body.appendChild(indicator);
    }

    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        }
    }

    // Enhanced Smooth Scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    // Add smooth scroll animation
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav
                    updateActiveNavLink(this);
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            }
        });
    });

    // Enhanced Active Navigation
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link, .mobile-nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        let currentSection = '';

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    function updateActiveNavLink(activeLink) {
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    function highlightActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === currentPage || 
                (currentPage === 'index.html' && (href === '/' || href === 'index.html')) ||
                (currentPage === '' && (href === '/' || href === 'index.html'))) {
                link.classList.add('active');
            }
        });
    }

    // Call on page load
    highlightActiveNavigation();

    // ===== NOTIFICATION SYSTEM =====
    class NotificationManager {
        constructor() {
            this.notifications = [];
            this.createNotificationStack();
        }

        createNotificationStack() {
            if (!document.querySelector('.notification-stack')) {
                const stack = document.createElement('div');
                stack.className = 'notification-stack';
                document.body.appendChild(stack);
            }
        }

        show(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification-item ${type}`;
            
            const id = Date.now().toString();
            notification.setAttribute('data-id', id);
            
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getIcon(type)}"></i>
                    <span>${message}</span>
                    <button class="notification-close" onclick="window.notificationManager.close('${id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            const stack = document.querySelector('.notification-stack');
            stack.appendChild(notification);
            this.notifications.push({ id, element: notification });

            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Auto remove
            setTimeout(() => {
                this.close(id);
            }, duration);

            return id;
        }

        close(id) {
            const notification = document.querySelector(`[data-id="${id}"]`);
            if (notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    this.notifications = this.notifications.filter(n => n.id !== id);
                }, 300);
            }
        }

        getIcon(type) {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-triangle',
                warning: 'exclamation-circle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        }
    }

    // Initialize notification manager
    window.notificationManager = new NotificationManager();

    // ===== PARTICLE ANIMATION =====
    function createParticles() {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;

        const particleCount = window.innerWidth > 768 ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
    }

    createParticles();

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ===== SWIPER INITIALIZATION =====
    function initializeSwiper() {
        if (typeof Swiper === 'undefined') return;

        // Pageants Swiper
        const pageantsSwiper = new Swiper('.pageants-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                968: {
                    slidesPerView: 3,
                },
            },
        });

        // Testimonials Swiper
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });

        return { pageantsSwiper, testimonialsSwiper };
    }

    const swipers = initializeSwiper();

    // ===== DYNAMIC CONTENT LOADING =====
    
    // Pageant Data
    const pageantData = [
        {
            title: "Miss Universe",
            image: "https://images.unsplash.com/photo-1596567055337-3b9a743cd1fd?w=800&q=80",
            date: "December 2025",
            location: "Las Vegas, USA",
            description: "The most prestigious beauty pageant in the world",
            category: "international"
        },
        {
            title: "Miss World",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
            date: "November 2025",
            location: "London, UK",
            description: "Beauty with a purpose",
            category: "international"
        },
        {
            title: "Miss International",
            image: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=800&q=80",
            date: "October 2025",
            location: "Tokyo, Japan",
            description: "Ambassador of beauty and goodwill",
            category: "international"
        },
        {
            title: "Miss Earth",
            image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&q=80",
            date: "November 2025",
            location: "Manila, Philippines",
            description: "Environmental advocacy through beauty",
            category: "environmental"
        }
    ];

    function loadPageants() {
        const wrapper = document.getElementById('pageantsWrapper');
        if (!wrapper) return;

        pageantData.forEach((pageant, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="pageant-card glass-morphism enhanced-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="pageant-image">
                        <img src="${pageant.image}" alt="${pageant.title}" loading="lazy">
                        <div class="pageant-overlay">
                            <span class="pageant-date">${pageant.date}</span>
                        </div>
                    </div>
                    <div class="pageant-content">
                        <span class="pageant-category">${pageant.category}</span>
                        <h3 class="pageant-title">${pageant.title}</h3>
                        <p class="pageant-location"><i class="fas fa-map-marker-alt"></i> ${pageant.location}</p>
                        <p class="pageant-description">${pageant.description}</p>
                        <a href="#" class="pageant-link enhanced-button">Learn More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        // Update swiper
        if (swipers?.pageantsSwiper) {
            swipers.pageantsSwiper.update();
        }
    }

    loadPageants();

    // ===== ENHANCED NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
            
            const email = newsletterForm.querySelector('.newsletter-input').value;
            const button = newsletterForm.querySelector('.btn-subscribe');
            const originalText = button.innerHTML;
            
            // Validate email
            if (!isValidEmail(email)) {
                window.notificationManager.show('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            button.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success state
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                window.notificationManager.show('Successfully subscribed to newsletter!', 'success');
                
                // Track subscription
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_subscribe', {
                        'event_category': 'engagement',
                        'event_label': 'Newsletter Subscription'
                    });
                }
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    newsletterForm.reset();
                }, 3000);
                
            } catch (error) {
                button.innerHTML = originalText;
                button.disabled = false;
                window.notificationManager.show('Subscription failed. Please try again.', 'error');
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== ENHANCED BACK TO TOP BUTTON =====
    function createBackToTopButton() {
        const backToTop = document.querySelector('.back-to-top') || (() => {
            const button = document.createElement('button');
            button.className = 'back-to-top glass-button';
            button.innerHTML = '<i class="fas fa-arrow-up"></i>';
            button.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(button);
            return button;
        })();
        
        let isVisible = false;
        
        function toggleVisibility() {
            const shouldShow = window.pageYOffset > 500;
            
            if (shouldShow && !isVisible) {
                backToTop.classList.add('visible');
                isVisible = true;
            } else if (!shouldShow && isVisible) {
                backToTop.classList.remove('visible');
                isVisible = false;
            }
        }
        
        window.addEventListener('scroll', throttle(toggleVisibility, 100));
        
        backToTop.addEventListener('click', () => {
            // Add click animation
            backToTop.style.transform = 'scale(0.9)';
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                backToTop.style.transform = '';
            }, 150);
            
            // Track interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'back_to_top_click', {
                    'event_category': 'navigation',
                    'event_label': 'Back to Top Button'
                });
            }
        });

        return backToTop;
    }

    createBackToTopButton();

    // ===== ENHANCED MAGNETIC EFFECTS =====
    function setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('.magnetic-hover, .magnetic-button, .logo, .enhanced-button');
        
        magneticElements.forEach(elem => {
            let isHovering = false;
            
            elem.addEventListener('mouseenter', () => {
                isHovering = true;
                elem.style.transition = 'transform 0.1s ease';
            });
            
            elem.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const intensity = 0.1;
                elem.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
            });
            
            elem.addEventListener('mouseleave', () => {
                isHovering = false;
                elem.style.transition = 'transform 0.3s ease';
                elem.style.transform = '';
            });
        });
    }

    setupMagneticEffects();

    // ===== ENHANCED TILT EFFECTS =====
    function setupTiltEffects() {
        const tiltElements = document.querySelectorAll('.tilt-effect, .enhanced-card');
        
        tiltElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const tiltX = (y - 0.5) * 10;
                const tiltY = (x - 0.5) * -10;
                
                elem.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            
            elem.addEventListener('mouseleave', () => {
                elem.style.transform = '';
            });
        });
    }

    setupTiltEffects();

    // ===== LAZY LOADING ENHANCEMENT =====
    function setupEnhancedLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Handle data-src lazy loading
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add loading animation
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';
                        
                        img.onload = () => {
                            img.style.opacity = '1';
                            img.classList.add('loaded');
                        };
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupEnhancedLazyLoading();

    // ===== PERFORMANCE MONITORING =====
    function setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    const domTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                    
                    console.log('📊 Performance Metrics:', {
                        pageLoadTime: loadTime + 'ms',
                        domLoadTime: domTime + 'ms',
                        totalTime: perfData.loadEventEnd + 'ms'
                    });
                    
                    // Track performance if analytics available
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'page_load_time', {
                            'event_category': 'performance',
                            'value': Math.round(loadTime),
                            'custom_parameter': {
                                'dom_time': Math.round(domTime)
                            }
                        });
                    }
                }, 0);
            });
        }
    }

    setupPerformanceMonitoring();

    // ===== PAGE VISIBILITY API =====
    function setupPageVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause heavy animations when page is hidden
                document.body.classList.add('page-hidden');
                if (window.animationManager) {
                    window.animationManager.pauseAnimations();
                }
            } else {
                // Resume animations when page is visible
                document.body.classList.remove('page-hidden');
                if (window.animationManager) {
                    window.animationManager.resumeAnimations();
                }
            }
        });
    }

    setupPageVisibilityHandler();

    // ===== SERVICE WORKER REGISTRATION =====
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ ServiceWorker registered');
                    
                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => console.log('❌ ServiceWorker registration failed:', error));
        }
    }

    function showUpdateNotification() {
        window.notificationManager.show(
            'New version available! <button onclick="window.location.reload()" style="margin-left: 10px; padding: 5px 10px; background: var(--primary-gold); border: none; border-radius: 4px; color: var(--dark-bg);">Update</button>',
            'info',
            10000
        );
    }

    registerServiceWorker();

    // ===== ERROR HANDLING =====
    function setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            
            // Track errors if analytics available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    'description': e.error.message,
                    'fatal': false,
                    'filename': e.filename,
                    'lineno': e.lineno
                });
            }
            
            // Show user-friendly error message for critical errors
            if (e.error.message.includes('critical')) {
                window.notificationManager.show(
                    'Something went wrong. Please refresh the page.',
                    'error'
                );
            }
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    'description': 'Unhandled Promise Rejection: ' + e.reason,
                    'fatal': false
                });
            }
        });
    }

    setupErrorHandling();

    // ===== UTILITY FUNCTIONS =====
    function throttle(func, limit) {
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

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // ===== INSTAGRAM INTEGRATION =====
    function initializeInstagramFeed() {
        // Try to load Instagram Manager
        if (typeof InstagramManager !== 'undefined') {
            window.instagramManager = new InstagramManager();
        } else {
            // Fallback for basic Instagram functionality
            const instagramSection = document.querySelector('.instagram-section');
            if (instagramSection) {
                const posts = instagramSection.querySelectorAll('.instagram-post');
                posts.forEach(post => {
                    post.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        // Add click animation
                        post.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            post.style.transform = '';
                            
                            // Open Instagram link
                            const link = post.querySelector('a');
                            if (link) {
                                window.open(link.href, '_blank');
                            }
                        }, 150);
                    });
                });
            }
        }
    }

    // Initialize Instagram feed after a delay
    setTimeout(initializeInstagramFeed, 1000);

    // ===== FINAL INITIALIZATION =====
    console.log('✅ PageantEmpress Enhanced Main.js initialized successfully');
    
    // Dispatch custom event for other scripts
    const initEvent = new CustomEvent('pageantempress:initialized', {
        detail: {
            timestamp: Date.now(),
            features: {
                animations: !!window.animationManager,
                notifications: !!window.notificationManager,
                theme: localStorage.getItem('theme') || 'dark',
                performance: window.animationManager?.performanceMode
            }
        }
    });
    
    document.dispatchEvent(initEvent);
    
    // Make key functions globally available
    window.PageantEmpressUtils = {
        toggleTheme,
        toggleMobileMenu,
        toggleSearchOverlay,
        showNotification: (msg, type) => window.notificationManager.show(msg, type),
        throttle,
        debounce
    };
});

// ===== CSS INJECTION FOR DYNAMIC STYLES =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Ripple Animation */
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Slide In Right Animation */
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Enhanced Card Styles */
    .pageant-card {
        height: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .pageant-card:hover {
        transform: translateY(-10px);
    }

    .pageant-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }

    .pageant-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

        .pageant-card:hover .pageant-image img {
        transform: scale(1.1);
    }

    .pageant-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 0%, rgba(10, 10, 10, 0.8) 100%);
        display: flex;
        align-items: flex-end;
        padding: 1rem;
    }

    .pageant-date {
        background: var(--primary-gold);
        color: var(--dark-bg);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .pageant-content {
        padding: 1.5rem;
    }

    .pageant-category {
        display: inline-block;
        background: rgba(212, 175, 55, 0.1);
        color: var(--primary-gold);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
    }

    .pageant-title {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-family: var(--font-primary);
    }

    .pageant-location {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .pageant-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }

    .pageant-link {
        color: var(--primary-gold);
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: gap 0.3s ease;
        background: none;
        border: 1px solid var(--primary-gold);
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        font-size: 0.9rem;
    }

    .pageant-link:hover {
        gap: 1rem;
        background: var(--primary-gold);
        color: var(--dark-bg);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }

    /* Enhanced Loading States */
    .loading-skeleton {
        background: linear-gradient(90deg, var(--glass-bg) 25%, rgba(255,255,255,0.1) 50%, var(--glass-bg) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    /* Notification Enhanced Styles */
    .notification-item {
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .notification-item.success {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
        color: var(--success-color);
    }

    .notification-item.error {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        color: var(--error-color);
    }

    .notification-item.warning {
        background: rgba(245, 158, 11, 0.1);
        border-color: rgba(245, 158, 11, 0.3);
        color: var(--warning-color);
    }

    .notification-item.info {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
        color: #3b82f6;
    }

    /* Form Enhancement */
    .form-input:invalid {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-input:valid {
        border-color: var(--success-color);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    /* Scroll Enhancement */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: var(--surface-bg);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--primary-gold);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--accent-gold);
    }

    /* Selection Enhancement */
    ::selection {
        background: var(--primary-gold);
        color: var(--dark-bg);
    }

    ::-moz-selection {
        background: var(--primary-gold);
        color: var(--dark-bg);
    }

    /* Focus Enhancement */
    *:focus {
        outline: 2px solid var(--primary-gold);
        outline-offset: 2px;
    }

    /* Print Optimization */
    @media print {
        .sparkle-container,
        .shine-overlay,
        .geometric-shapes,
        .animated-background,
        .notification-stack,
        .back-to-top,
        .mobile-menu,
        .search-overlay {
            display: none !important;
        }
        
        body {
            background: white !important;
            color: black !important;
        }
        
        .glass-morphism {
            background: white !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
        }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
        .glass-morphism {
            background: var(--dark-bg) !important;
            border: 2px solid var(--primary-gold) !important;
        }
        
        .nav-link:hover,
        .nav-link.active {
            background: var(--primary-gold) !important;
            color: var(--dark-bg) !important;
        }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .sparkle-container,
        .shine-overlay,
        .geometric-shapes {
            display: none !important;
        }
    }

    /* Dark Mode Image Filters */
    body:not(.light-theme) img {
        filter: brightness(0.9) contrast(1.1);
    }

    body.light-theme img {
        filter: brightness(1) contrast(1);
    }

    /* Enhanced Mobile Styles */
    @media (max-width: 768px) {
        .pageant-card {
            margin-bottom: 2rem;
        }
        
        .pageant-image {
            height: 200px;
        }
        
        .pageant-content {
            padding: 1rem;
        }
        
        .pageant-title {
            font-size: 1.25rem;
        }
    }

    /* Performance Optimization */
    .gpu-accelerated {
        transform: translateZ(0);
        will-change: transform;
    }

    .optimize-animations {
        backface-visibility: hidden;
        perspective: 1000px;
    }

    /* Accessibility Improvements */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* Enhanced Hover States */
    @media (hover: hover) {
        .enhanced-card:hover {
            transform: translateY(-8px) scale(1.02);
        }
        
        .glass-button:hover {
            background: rgba(255, 255, 255, 0.15);
        }
    }

    /* Enhanced Focus States */
    .nav-link:focus-visible,
    .glass-button:focus-visible,
    .enhanced-button:focus-visible {
        outline: 3px solid var(--primary-gold);
        outline-offset: 3px;
        box-shadow: 0 0 0 6px rgba(212, 175, 55, 0.2);
    }

    /* Loading State Enhancements */
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }

    .btn:disabled:hover {
        transform: none !important;
    }

    /* Enhanced Transitions */
    * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Theme Transition */
    body.light-theme * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    }

    /* Enhanced Typography */
    h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 1rem;
    }

    p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    /* Enhanced Links */
    a {
        transition: all 0.3s ease;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
        text-decoration-color: var(--primary-gold);
    }
`;

document.head.appendChild(dynamicStyles);

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init: () => {
            console.log('PageantEmpress main.js loaded as module');
        },
        utils: window.PageantEmpressUtils
    };
}

// ===== FINAL PERFORMANCE CHECK =====
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('🚀 PageantEmpress fully loaded and optimized');
        
        // Check for any performance issues
        const performanceEntries = performance.getEntriesByType('measure');
        if (performanceEntries.length > 0) {
            console.log('📊 Performance measures:', performanceEntries);
        }
        
        // Cleanup any unnecessary elements
        const loadingElements = document.querySelectorAll('[data-loading]');
        loadingElements.forEach(el => el.remove());
        
    }, 100);
});
