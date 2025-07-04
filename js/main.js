// PageantEmpress 2025 - Main JavaScript
// Enhanced with video and animation features

document.addEventListener('DOMContentLoaded', function() {
    
    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
        }, 1000);
    });

    // Header Scroll Effect
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    mobileClose.addEventListener('click', closeMobileMenu);

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Search Overlay
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');

    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Video Play Buttons
    const playButtons = document.querySelectorAll('.play-button, .play-btn-large');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Placeholder for video functionality
            alert('Video player integration coming soon!');
            // In production, this would open a video modal or redirect to video page
        });
    });

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            
            // Placeholder for newsletter subscription
            alert(`Thank you for subscribing with email: ${email}`);
            this.reset();
            
            // In production, this would send data to your newsletter service
        });
    }

    // Intersection Observer for Animations
    const animatedElements = document.querySelectorAll('.featured-card, .about-text, .about-image, .video-showcase > *');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });

    // Glitter Effect Enhancement
    const glitterOverlays = document.querySelectorAll('.glitter-overlay');
    
    glitterOverlays.forEach(overlay => {
        overlay.addEventListener('mousemove', (e) => {
            const rect = overlay.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            overlay.style.background = `
                radial-gradient(circle at ${x}% ${y}%, 
                rgba(212, 175, 55, 0.3) 0%, 
                transparent 50%),
                linear-gradient(45deg, 
                transparent 30%, 
                rgba(212, 175, 55, 0.1) 50%, 
                transparent 70%)
            `;
        });
    });

    // Search Suggestions
    const searchSuggestions = document.querySelectorAll('.tag');
    
    searchSuggestions.forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.textContent;
            searchInput.focus();
        });
    });

    // Playlist Item Hover Effect
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            playlistItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Placeholder for video switching
            const videoTitle = this.querySelector('h4').textContent;
            console.log(`Playing: ${videoTitle}`);
        });
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        });
    }

    // Performance Optimization - Lazy Loading
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(image => imageObserver.observe(image));
});
