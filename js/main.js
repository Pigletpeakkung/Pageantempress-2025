// PageantEmpress Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
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

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

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

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    let isDarkMode = true;

    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('light-mode');
        
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        isDarkMode = false;
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Particle Animation
    function createParticles() {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;

        const particleCount = 50;
        
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
            `;
            particleContainer.appendChild(particle);
        }
    }

    createParticles();

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5
    };

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
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Initialize Swiper
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

    // Dynamic Content Loading
    const pageantData = [
        {
            title: "Miss Universe",
            image: "https://images.unsplash.com/photo-1596567055337-3b9a743cd1fd?w=800&q=80",
            date: "December 2025",
            location: "Las Vegas, USA",
            description: "The most prestigious beauty pageant in the world"
        },
        {
            title: "Miss World",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
            date: "November 2025",
            location: "London, UK",
            description: "Beauty with a purpose"
        },
        {
            title: "Miss International",
            image: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?w=800&q=80",
            date: "October 2025",
            location: "Tokyo, Japan",
            description: "Ambassador of beauty and goodwill"
        },
        {
            title: "Miss Earth",
            image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&q=80",
            date: "November 2025",
            location: "Manila, Philippines",
            description: "Environmental advocacy through beauty"
        }
    ];

    function loadPageants() {
        const wrapper = document.getElementById('pageantsWrapper');
        if (!wrapper) return;

        pageantData.forEach(pageant => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="pageant-card glass-morphism">
                    <div class="pageant-image">
                        <img src="${pageant.image}" alt="${pageant.title}" loading="lazy">
                        <div class="pageant-overlay">
                            <span class="pageant-date">${pageant.date}</span>
                        </div>
                    </div>
                    <div class="pageant-content">
                        <h3 class="pageant-title">${pageant.title}</h3>
                        <p class="pageant-location"><i class="fas fa-map-marker-alt"></i> ${pageant.location}</p>
                        <p class="pageant-description">${pageant.description}</p>
                        <a href="#" class="pageant-link">Learn More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        pageantsSwiper.update();
    }

    loadPageants();

    // Fashion Grid
    const fashionData = [
        {
            image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
            title: "Evening Gown Trends 2025",
            category: "Gowns",
            tags: ["Elegant", "Luxury", "Trends"]
        },
        {
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
            title: "Swimsuit Competition Guide",
            category: "Swimwear",
            tags: ["Fitness", "Style", "Competition"]
        },
        {
            image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
            title: "National Costume Inspirations",
            category: "Costumes",
            tags: ["Culture", "Creative", "Heritage"]
        },
        {
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
            title: "Interview Outfit Essentials",
            category: "Interview",
            tags: ["Professional", "Chic", "Smart"]
        }
    ];

    function loadFashion() {
        const grid = document.getElementById('fashionGrid');
        if (!grid) return;

        fashionData.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'fashion-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', index * 100);
            card.innerHTML = `
                <div class="fashion-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="fashion-overlay">
                        <button class="fashion-action">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="fashion-content">
                    <span class="fashion-category">${item.category}</span>
                    <h3 class="fashion-title">${item.title}</h3>
                    <div class="fashion-tags">
                        ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    loadFashion();

    // Video Playlist
    const videoData = [
        {
            thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&q=80",
            title: "Evening Gown Perfection",
            duration: "8:45",
            views: "23K",
            age: "2 days ago"
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
            title: "Interview Techniques",
            duration: "15:20",
            views: "18K",
            age: "1 week ago"
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1580894908361-967195033215?w=200&q=80",
            title: "Runway Walk Masterclass",
            duration: "10:15",
            views: "31K",
            age: "2 weeks ago"
        },
        {
            thumbnail: "https://images.unsplash.com/photo-1513673054901-2b5f51551112?w=200&q=80",
            title: "Makeup Tutorial: Stage Ready",
            duration: "22:30",
            views: "45K",
            age: "3 weeks ago"
        }
    ];

    function loadVideoPlaylist() {
        const playlist = document.getElementById('videoPlaylist');
        if (!playlist) return;

        videoData.forEach(video => {
            const item = document.createElement('div');
            item.className = 'playlist-item glass-morphism';
            item.innerHTML = `
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <span class="duration">${video.duration}</span>
                    <div class="thumbnail-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-details">
                    <h4>${video.title}</h4>
                    <div class="video-meta">
                        <span class="views">${video.views} views</span>
                        <span class="age">${video.age}</span>
                    </div>
                </div>
            `;
            playlist.appendChild(item);
        });
    }

    loadVideoPlaylist();

    // Gallery
    const galleryData = [
        {
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            title: "Crown Moment",
            category: "pageants"
        },
        {
            image: "https://images.unsplash.com/photo-1533900369644-89538c396821?w=800&q=80",
            title: "Fashion Show",
            category: "fashion"
        },
        {
            image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
            title: "Red Carpet",
            category: "events"
        },
        {
            image: "https://images.unsplash.com/photo-1597248374161-426f0d6d2fc9?w=800&q=80",
            title: "Stage Performance",
            category: "pageants"
        },
        {
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
            title: "Beauty Portrait",
            category: "fashion"
        },
        {
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
            title: "Gala Event",
            category: "events"
        }
    ];

    function loadGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        galleryData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.setAttribute('data-aos', 'zoom-in');
            galleryItem.setAttribute('data-aos-delay', index * 50);
            galleryItem.innerHTML = `
                <div class="gallery-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <h3 class="gallery-title">${item.title}</h3>
                        <div class="gallery-actions">
                            <button class="gallery-btn">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="gallery-btn">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(galleryItem);
        });
    }

    loadGallery();

    // Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Testimonials
    const testimonialData = [
        {
            name: "Sarah Johnson",
            title: "Miss Universe 2024 Top 10",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                        text: "PageantEmpress has been instrumental in my pageant journey. The tips and guidance provided helped me reach the Top 10 at Miss Universe!",
            rating: 5
        },
        {
            name: "Maria Rodriguez",
            title: "Miss World 2024 Winner",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
            text: "The comprehensive training videos and fashion advice from George G. transformed my approach to pageantry. Forever grateful!",
            rating: 5
        },
        {
            name: "Ashley Chen",
            title: "Miss International 2024 Finalist",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
            text: "From runway walk to interview prep, PageantEmpress covered it all. The platform is a goldmine for aspiring pageant queens!",
            rating: 5
        }
    ];

    function loadTestimonials() {
        const wrapper = document.getElementById('testimonialsWrapper');
        if (!wrapper) return;

        testimonialData.forEach(testimonial => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="testimonial-card glass-morphism">
                    <div class="testimonial-header">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-avatar">
                        <div class="testimonial-info">
                            <h4 class="testimonial-name">${testimonial.name}</h4>
                            <p class="testimonial-title">${testimonial.title}</p>
                        </div>
                    </div>
                    <div class="testimonial-rating">
                        ${Array(testimonial.rating).fill('').map(() => '<i class="fas fa-star"></i>').join('')}
                    </div>
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-decoration">
                        <i class="fas fa-quote-right"></i>
                    </div>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        testimonialsSwiper.update();
    }

    loadTestimonials();

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('.newsletter-input').value;
        const button = newsletterForm.querySelector('.btn-subscribe');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
                newsletterForm.reset();
            }, 3000);
        }, 1500);
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
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

    // Magnetic Effect
    const magneticElements = document.querySelectorAll('.magnetic-hover, .magnetic-button');
    
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            elem.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = '';
        });
    });

    // Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
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

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(error => console.log('ServiceWorker registration failed:', error));
    }

    // Lazy Loading for Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Additional CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    /* Particle Float Animation */
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
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

    /* Pageant Card Styles */
    .pageant-card {
        height: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: transform 0.3s;
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
        transition: transform 0.5s;
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

    .pageant-title {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
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
    }

    .pageant-link {
        color: var(--primary-gold);
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: gap 0.3s;
    }

    .pageant-link:hover {
        gap: 1rem;
    }

    /* Fashion Card Styles */
    .fashion-card {
        background: var(--glass-bg);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: transform 0.3s;
    }

    .fashion-card:hover {
        transform: translateY(-5px);
    }

    .fashion-image {
        position: relative;
        height: 300px;
        overflow: hidden;
    }

    .fashion-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }

    .fashion-card:hover .fashion-image img {
        transform: scale(1.05);
    }

    .fashion-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 10, 10, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .fashion-card:hover .fashion-overlay {
        opacity: 1;
    }

    .fashion-action {
        width: 50px;
        height: 50px;
        background: var(--primary-gold);
        border: none;
        border-radius: 50%;
        color: var(--dark-bg);
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.3s;
    }

    .fashion-action:hover {
        transform: scale(1.1);
    }

    .fashion-content {
        padding: 1.5rem;
    }

    .fashion-category {
        color: var(--primary-gold);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .fashion-title {
        font-size: 1.25rem;
        margin: 0.5rem 0 1rem;
    }

    .fashion-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    /* Gallery Item Styles */
    .gallery-item {
        position: relative;
        border-radius: var(--border-radius);
        overflow: hidden;
        cursor: pointer;
    }

    .gallery-image {
        position: relative;
        height: 300px;
    }

    .gallery-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }

    .gallery-item:hover .gallery-image img {
        transform: scale(1.1);
    }

    .gallery-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.9) 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.5rem;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .gallery-item:hover .gallery-overlay {
        opacity: 1;
    }

    .gallery-title {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    .gallery-actions {
        display: flex;
        gap: 1rem;
    }

    .gallery-btn {
        width: 40px;
        height: 40px;
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: 50%;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s;
    }

    .gallery-btn:hover {
        background: var(--primary-gold);
        color: var(--dark-bg);
        transform: scale(1.1);
    }

    /* Testimonial Card Styles */
    .testimonial-card {
        padding: 2.5rem;
        border-radius: var(--border-radius);
        position: relative;
        overflow: hidden;
    }

    .testimonial-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .testimonial-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--primary-gold);
    }

    .testimonial-name {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
    }

    .testimonial-title {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .testimonial-rating {
        color: var(--primary-gold);
        margin-bottom: 1rem;
    }

    .testimonial-text {
        font-size: 1.1rem;
        line-height: 1.8;
        color: var(--text-secondary);
        font-style: italic;
    }

    .testimonial-decoration {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 3rem;
        color: var(--primary-gold);
        opacity: 0.1;
    }

    /* Light Mode Styles */
    body.light-mode {
        --dark-bg: #ffffff;
        --light-bg: #f5f5f5;
        --text-primary: #1a1a1a;
        --text-secondary: #666666;
        --glass-bg: rgba(0, 0, 0, 0.05);
        --glass-border: rgba(0, 0, 0, 0.1);
    }

    /* Image Load Animation */
    img {
        opacity: 0;
        transition: opacity 0.5s;
    }

    img.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(style);
