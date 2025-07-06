/* ===== MAIN.JS - LUXURY WEBSITE FUNCTIONALITY ===== */

// ===== GLOBAL VARIABLES =====
const DOM = {
    header: document.querySelector('.main-header'),
    navLinks: document.querySelectorAll('.nav-link'),
    themeToggle: document.querySelector('.theme-toggle'),
    searchToggle: document.querySelector('.search-toggle'),
    searchOverlay: document.querySelector('.search-overlay'),
    mobileToggle: document.querySelector('.mobile-toggle'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileOverlay: document.querySelector('.mobile-overlay'),
    backToTop: document.querySelector('.back-to-top'),
    scrollProgress: document.querySelector('.scroll-progress'),
    sparkleContainer: document.querySelector('.sparkle-container'),
    geometricShapes: document.querySelector('.geometric-shapes'),
    loader: document.querySelector('.about-loader')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeHeader();
    initializeTheme();
    initializeSearch();
    initializeMobileMenu();
    initializeScrollFeatures();
    initializeAnimations();
    initializeSparkles();
    initializeGeometricShapes();
    initializeParallax();
    initializeGallery();
    initializeBlog();
    initializeDashboard();
    initializeCounters();
    initializeCharts();
    initializeTooltips();
    initializeModals();
    initializeTabs();
    initializeNotifications();
    initializeTestimonials();
    initializeLazyLoading();
    initializeFormValidation();
    hideLoader();
});

// ===== LOADER =====
function hideLoader() {
    setTimeout(() => {
        if (DOM.loader) {
            DOM.loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 1500);
}

// ===== HEADER FUNCTIONALITY =====
function initializeHeader() {
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            DOM.header?.classList.add('scrolled');
        } else {
            DOM.header?.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            DOM.header?.classList.add('header-hidden');
        } else {
            DOM.header?.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
    
    // Update active nav link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                DOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== THEME FUNCTIONALITY =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('light-theme', savedTheme === 'light');
    
    DOM.themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        // Animate theme transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    DOM.searchToggle?.addEventListener('click', () => {
        DOM.searchOverlay?.classList.add('active');
        document.body.classList.add('menu-open');
        setTimeout(() => {
            document.querySelector('.search-input')?.focus();
        }, 300);
    });
    
    DOM.searchOverlay?.addEventListener('click', (e) => {
        if (e.target === DOM.searchOverlay || e.target.classList.contains('search-close')) {
            closeSearch();
        }
    });
    
    // Search suggestions
    const searchInput = document.querySelector('.search-input');
    const suggestionTags = document.querySelectorAll('.tag');
    
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = tag.textContent;
                searchInput.focus();
            }
        });
    });
    
    // Search functionality
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value);
        }
    });
}

function closeSearch() {
    DOM.searchOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function performSearch(query) {
    console.log('Searching for:', query);
    // Implement search functionality
    showNotification('Search results for: ' + query, 'success');
    closeSearch();
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    DOM.mobileToggle?.addEventListener('click', () => {
        DOM.mobileToggle.classList.toggle('active');
        DOM.mobileMenu?.classList.toggle('active');
        DOM.mobileOverlay?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    DOM.mobileOverlay?.addEventListener('click', closeMobileMenu);
    
    // Close menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    DOM.mobileToggle?.classList.remove('active');
    DOM.mobileMenu?.classList.remove('active');
    DOM.mobileOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ===== SCROLL FEATURES =====
function initializeScrollFeatures() {
    // Scroll progress
    window.addEventListener('scroll', updateScrollProgress);
    
    // Back to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            DOM.backToTop?.classList.add('visible');
        } else {
            DOM.backToTop?.classList.remove('visible');
        }
    });
    
    DOM.backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 100;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (DOM.scrollProgress) {
        DOM.scrollProgress.style.width = scrollPercent + '%';
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
    
    // Ripple effect
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .enhanced-button, .glass-button')) {
            createRipple(e);
        }
    });
}

function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ===== SPARKLES =====
function initializeSparkles() {
    if (!DOM.sparkleContainer) return;
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        const type = Math.random();
        
        sparkle.classList.add('sparkle');
        
        if (type < 0.3) {
            sparkle.classList.add('sparkle-small');
        } else if (type < 0.6) {
            sparkle.classList.add('sparkle-medium');
        } else if (type < 0.9) {
            sparkle.classList.add('sparkle-large');
        } else {
            sparkle.classList.add('sparkle-star');
        }
        
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkle.style.animationDuration = (3 + Math.random() * 2) + 's';
        
        DOM.sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 5000);
    }
    
    // Create sparkles periodically
    setInterval(createSparkle, 300);
}

// ===== GEOMETRIC SHAPES =====
function initializeGeometricShapes() {
    if (!DOM.geometricShapes) return;
    
    const shapes = ['shape-diamond', 'shape-hexagon', 'shape-triangle'];
    const shapeCount = 6;
    
    for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('geometric-shape', shapes[Math.floor(Math.random() * shapes.length)]);
        
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 15 + 's';
        shape.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        DOM.geometricShapes.appendChild(shape);
    }
}

// ===== PARALLAX =====
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// ===== GALLERY FUNCTIONALITY =====
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox-overlay');
    
    if (!filterButtons.length || !galleryItems.length) return;
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    item.classList.remove('hiding');
                    setTimeout(() => {
                        item.style.animation = 'galleryItemEntry 0.6s ease-out forwards';
                    }, 10);
                } else {
                    item.classList.add('hiding');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Lightbox controls
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

let currentLightboxIndex = 0;
const galleryImages = [];

function openLightbox(index) {
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxImage = document.querySelector('.lightbox-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    currentLightboxIndex = index;
    
    // Populate gallery images array
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-image');
        if (img) {
                        galleryImages.push({
                src: img.src,
                title: item.querySelector('.gallery-info-title')?.textContent || '',
                category: item.querySelector('.gallery-info-category')?.textContent || ''
            });
        }
    });
    
    updateLightboxImage();
    lightbox?.classList.add('active');
    document.body.classList.add('menu-open');
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox-overlay');
    lightbox?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
        currentLightboxIndex = 0;
    }
    
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    
    const currentImage = galleryImages[currentLightboxIndex];
    
    if (lightboxImage && currentImage) {
        lightboxImage.src = currentImage.src;
        if (lightboxTitle) lightboxTitle.textContent = currentImage.title;
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
        }
    }
}

// ===== BLOG FUNCTIONALITY =====
function initializeBlog() {
    // Blog search
    const blogSearchForm = document.querySelector('.blog-search-form');
    blogSearchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = e.target.querySelector('.blog-search-input').value;
        performBlogSearch(query);
    });
    
    // Category filter
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.textContent.trim();
            filterBlogByCategory(category);
        });
    });
    
    // Load more posts
    const loadMoreBtn = document.querySelector('.load-more-posts');
    loadMoreBtn?.addEventListener('click', loadMorePosts);
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', handleNewsletterSubmit);
}

function performBlogSearch(query) {
    console.log('Searching blog for:', query);
    showNotification(`Searching for "${query}"...`, 'info');
}

function filterBlogByCategory(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const cardCategory = card.querySelector('.blog-card-category')?.textContent;
        if (cardCategory === category || category === 'All') {
            card.style.display = '';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
        }
    });
}

function loadMorePosts() {
    // Simulate loading more posts
    showNotification('Loading more posts...', 'info');
    
    setTimeout(() => {
        showNotification('New posts loaded!', 'success');
    }, 1000);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter-input').value;
    
    if (validateEmail(email)) {
        showNotification('Successfully subscribed to newsletter!', 'success');
        e.target.reset();
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
}

// ===== DASHBOARD ANIMATIONS =====
function initializeDashboard() {
    const dashboardSection = document.querySelector('.dashboard-section');
    if (!dashboardSection) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const dashboardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animations
                animateMetrics();
                animateCharts();
                animateActivityFeed();
                dashboardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    dashboardObserver.observe(dashboardSection);
}

function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value.counting');
    
    metricValues.forEach(element => {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            
            if (element.dataset.format === 'currency') {
                element.textContent = '$' + Math.floor(current).toLocaleString();
            } else if (element.dataset.format === 'percentage') {
                element.textContent = Math.floor(current) + '%';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

function animateCharts() {
    // Animate bar chart
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const height = bar.dataset.value + '%';
        setTimeout(() => {
            bar.style.height = height;
        }, index * 100);
    });
    
    // Animate pie chart
    const pieSegments = document.querySelectorAll('.pie-segment');
    pieSegments.forEach((segment, index) => {
        setTimeout(() => {
            segment.style.strokeDasharray = segment.dataset.value + ' 314';
        }, index * 200);
    });
    
    // Animate line chart
    const linePath = document.querySelector('.line-path');
    if (linePath) {
        const pathLength = linePath.getTotalLength();
        linePath.style.strokeDasharray = pathLength;
        linePath.style.strokeDashoffset = pathLength;
        
        setTimeout(() => {
            linePath.style.transition = 'stroke-dashoffset 2s ease-out';
            linePath.style.strokeDashoffset = '0';
        }, 500);
    }
}

function animateActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100);
    });
}

// ===== COUNTERS =====
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
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function startCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== INTERACTIVE CHARTS =====
function initializeCharts() {
    // Chart option toggles
    const chartOptions = document.querySelectorAll('.chart-option');
    chartOptions.forEach(option => {
        option.addEventListener('click', function() {
            const parent = this.closest('.chart-card');
            const options = parent.querySelectorAll('.chart-option');
            
            options.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart based on selected option
            updateChart(parent, this.dataset.period);
        });
    });
    
    // Pie chart interactions
    const pieSegments = document.querySelectorAll('.pie-segment');
    pieSegments.forEach(segment => {
        segment.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.2)';
        });
        
        segment.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Data point tooltips
    const dataPoints = document.querySelectorAll('.data-point');
    dataPoints.forEach(point => {
        point.addEventListener('mouseenter', showDataTooltip);
        point.addEventListener('mouseleave', hideDataTooltip);
    });
}

function updateChart(chartCard, period) {
    console.log('Updating chart for period:', period);
    // Implement chart update logic
    showNotification(`Chart updated to ${period} view`, 'info');
}

function showDataTooltip(e) {
    const tooltip = document.querySelector('.data-tooltip');
    if (!tooltip) return;
    
    const value = e.target.dataset.value;
    const date = e.target.dataset.date;
    
    tooltip.innerHTML = `
        <strong>${value}</strong><br>
        <small>${date}</small>
    `;
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 10 + 'px';
    tooltip.classList.add('show');
}

function hideDataTooltip() {
    const tooltip = document.querySelector('.data-tooltip');
    tooltip?.classList.remove('show');
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = trigger.dataset.tooltip;
        trigger.appendChild(tooltip);
        
        trigger.addEventListener('mouseenter', () => {
            positionTooltip(trigger, tooltip);
        });
    });
}

function positionTooltip(trigger, tooltip) {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Check if tooltip goes off-screen
    if (triggerRect.top - tooltipRect.height < 0) {
        tooltip.style.top = 'auto';
        tooltip.style.bottom = '-125%';
    }
}

// ===== MODALS =====
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalClosers = document.querySelectorAll('.modal-close, .modal-overlay');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });
    
    modalClosers.forEach(closer => {
        closer.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeModal(e.target.closest('.modal-overlay'));
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('menu-open');
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// ===== TABS =====
function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-button');
        const contents = container.querySelectorAll('.tab-content');
        
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Remove active states
                buttons.forEach(btn => btn.classList.remove('active'));
                contents.forEach(content => content.classList.remove('active'));
                
                // Add active states
                button.classList.add('active');
                contents[index]?.classList.add('active');
            });
        });
    });
}

// ===== NOTIFICATIONS =====
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-stack')) {
        const stack = document.createElement('div');
        stack.className = 'notification-stack';
        document.body.appendChild(stack);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const stack = document.querySelector('.notification-stack');
    const notification = document.createElement('div');
    
    notification.className = `notification-item ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    stack.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// ===== TESTIMONIALS =====
function initializeTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    const track = testimonialSlider.querySelector('.testimonial-track');
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const dots = testimonialSlider.querySelectorAll('.testimonial-dot');
    
    let currentSlide = 0;
    
    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    testimonialSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }
        
        if (touchEndX > touchStartX + 50) {
            // Swipe right
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(currentSlide);
        }
    }
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('.validate-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Simulate form submission
        showNotification('Form submitted successfully!', 'success');
        form.reset();
    }
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearError(field);
    
    // Required field validation
    if (required && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        if (!validateEmail(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        if (!validatePhone(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;
    
    formGroup.appendChild(error);
    field.classList.add('error');
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const error = formGroup.querySelector('.form-error');
    if (error) error.remove();
    field.classList.remove('error');
}

// ===== UTILITY FUNCTIONS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+$$$$]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

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

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
    
    // Throttled scroll handler
    const throttledScroll = throttle(() => {
        updateScrollProgress();
    }, 100);
    
    window.addEventListener('scroll', throttledScroll);
    
    // Page visibility API
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });
}

// ===== ADVANCED GALLERY FEATURES =====
function initializeAdvancedGallery() {
    // Masonry layout
    const masonryGrid = document.querySelector('.gallery-masonry');
    if (masonryGrid) {
        arrangeMasonry(masonryGrid);
        window.addEventListener('resize', debounce(() => arrangeMasonry(masonryGrid), 300));
    }
    
    // Infinite scroll
    const infiniteScrollContainer = document.querySelector('.gallery-grid');
    if (infiniteScrollContainer) {
        initializeInfiniteScroll(infiniteScrollContainer);
    }
    
    // Image preloading
    preloadImages();
}

function arrangeMasonry(grid) {
    const items = grid.querySelectorAll('.gallery-item');
    const columns = Math.floor(grid.offsetWidth / 320);
    const columnHeights = new Array(columns).fill(0);
    
    items.forEach(item => {
        const minHeight = Math.min(...columnHeights);
        const columnIndex = columnHeights.indexOf(minHeight);
        
        item.style.position = 'absolute';
        item.style.left = `${(100 / columns) * columnIndex}%`;
        item.style.top = `${minHeight}px`;
        
        columnHeights[columnIndex] += item.offsetHeight + 20;
    });
    
    grid.style.height = `${Math.max(...columnHeights)}px`;
}

function initializeInfiniteScroll(container) {
    const loader = document.querySelector('.infinite-scroll-loader');
    let isLoading = false;
    let page = 1;
    
    const loadMoreItems = async () => {
        if (isLoading) return;
        
        isLoading = true;
        loader?.classList.add('active');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add new items
        const newItems = createGalleryItems(6);
        newItems.forEach(item => container.appendChild(item));
        
        loader?.classList.remove('active');
        isLoading = false;
        page++;
    };
    
    // Intersection Observer for infinite scroll
    const scrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreItems();
        }
    }, { rootMargin: '100px' });
    
    if (loader) scrollObserver.observe(loader);
}

function createGalleryItems(count) {
    const items = [];
    
    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-item fade-in';
        item.innerHTML = `
            <div class="gallery-image-container">
                <img class="gallery-image" src="https://picsum.photos/400/300?random=${Date.now() + i}" alt="Gallery Image">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3 class="gallery-info-title">New Artwork ${Date.now() + i}</h3>
                        <p class="gallery-info-category">Digital Art</p>
                    </div>
                </div>
                <div class="gallery-actions">
                    <button class="gallery-action-btn"><i class="fas fa-heart"></i></button>
                    <button class="gallery-action-btn"><i class="fas fa-expand"></i></button>
                </div>
            </div>
        `;
        items.push(item);
    }
    
    return items;
}

function preloadImages() {
    const images = document.querySelectorAll('.gallery-image');
    const imagePromises = [];
    
    images.forEach(img => {
        const promise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = img.dataset.highres || img.src;
        });
        imagePromises.push(promise);
    });
    
    Promise.all(imagePromises).then(() => {
        console.log('All images preloaded');
    });
}

// ===== REAL-TIME FEATURES =====
function initializeRealTimeFeatures() {
    // Simulate real-time updates
    setInterval(updateRealTimeCounters, 5000);
    setInterval(updateActivityFeed, 10000);
    
    // WebSocket simulation
    simulateWebSocket();
}

function updateRealTimeCounters() {
    const counters = document.querySelectorAll('.realtime-number');
    
    counters.forEach(counter => {
        const current = parseInt(counter.textContent.replace(/\D/g, ''));
        const change = Math.floor(Math.random() * 10) - 5;
        const newValue = Math.max(0, current + change);
        
        animateCounterChange(counter, current, newValue);
    });
}

function animateCounterChange(element, from, to) {
    const duration = 500;
    const start = performance.now();
    
    function update() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = from + (to - from) * easeOutQuad(progress);
        
        element.textContent = Math.floor(current).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function updateActivityFeed() {
    const feed = document.querySelector('.activity-feed');
    if (!feed) return;
    
    const activities = [
        { icon: 'fa-user', user: 'John Doe', action: 'completed a new project', time: 'just now' },
        { icon: 'fa-chart-line', user: 'System', action: 'generated monthly report', time: '2 min ago' },
        { icon: 'fa-bell', user: 'Sarah Smith', action: 'updated dashboard metrics', time: '5 min ago' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const newItem = createActivityItem(randomActivity);
    
    feed.insertBefore(newItem, feed.firstChild);
    
    // Remove old items
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
}

function createActivityItem(data) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <div class="activity-dot"></div>
        <div class="activity-content">
            <div class="activity-meta">
                <div class="activity-icon">
                    <i class="fas ${data.icon}"></i>
                </div>
                <span class="activity-user">${data.user}</span>
                <span class="activity-time">${data.time}</span>
            </div>
            <p class="activity-description">${data.action}</p>
        </div>
    `;
    
    setTimeout(() => item.classList.add('visible'), 10);
    
    return item;
}

function simulateWebSocket() {
    // Simulate WebSocket notifications
    const events = [
        'New user registration',
        'Payment received',
        'New order placed',
        'Support ticket created'
    ];
    
    setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        showNotification(event, 'info');
    }, 30000);
}

// ===== KEYBOARD SHORTCUTS =====
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            DOM.searchOverlay?.classList.add('active');
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showNotification('Keyboard shortcuts: Ctrl+K for search, Esc to close', 'info', 5000);
        }
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred.', 'error');
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    // Save user preferences
    const preferences = {
        theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
        lastVisit: new Date().toISOString()
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
});

// ===== INITIALIZE EVERYTHING =====
window.addEventListener('load', () => {
    initializePerformanceOptimizations();
    initializeAdvancedGallery();
    initializeRealTimeFeatures();
    initializeKeyboardShortcuts();
    
    // Remove loading class
    document.body.classList.remove('loading');
    
    // Log initialization
    console.log('✨ Luxury website initialized successfully!');
});

// ===== EXPORT FUNCTIONS =====
window.LuxuryWebsite = {
    showNotification,
    openModal,
    closeModal,
    openLightbox,
    closeLightbox,
    updateChart,
    showError,
    clearError
};
