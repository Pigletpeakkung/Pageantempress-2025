// YouTube Page JavaScript
class YouTubePageManager {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.initCounterAnimations();
        this.initVideoHandlers();
        this.initNotificationForm();
        this.initPageantCards();
        this.initLoadMore();
        this.trackAnalytics();
        this.initIntersectionObserver();
    }

    // Initialize AOS (Animate On Scroll)
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    // Initialize counter animations for stats
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                counter.textContent = this.formatNumber(Math.floor(current));
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Format numbers with appropriate suffixes
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    }

    // Initialize video click handlers
    initVideoHandlers() {
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = card.getAttribute('onclick')?.match(/openVideo$$'([^']+)'$$/)?.[1];
                if (videoUrl) {
                    this.openVideo(videoUrl);
                }
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.playHoverEffect(card);
            });
        });
    }

    // Open video in new tab and track analytics
    openVideo(url) {
        try {
            // Track video click
            this.trackEvent('video_click', {
                video_url: url,
                source: 'youtube_page'
            });

            // Open video
            window.open(url, '_blank', 'noopener,noreferrer');
            
            // Show notification
            this.showNotification('Opening video...', 'success');
        } catch (error) {
            console.error('Error opening video:', error);
            this.showNotification('Failed to open video', 'error');
        }
    }

    // Initialize pageant card handlers
    initPageantCards() {
        const pageantCards = document.querySelectorAll('.pageant-card');
        
        pageantCards.forEach(card => {
            card.addEventListener('click', () => {
                const onclick = card.getAttribute('onclick');
                if (onclick) {
                    const url = onclick.match(/openPageantLink$$'([^']+)'$$/)?.[1];
                    if (url) {
                        this.openPageantLink(url);
                    }
                }
            });

            // Add ripple effect
            card.addEventListener('click', (e) => {
                this.createRipple(e, card);
            });
        });
    }

    // Open pageant official website
    openPageantLink(url) {
        try {
            // Track pageant click
            this.trackEvent('pageant_click', {
                pageant_url: url,
                source: 'youtube_page'
            });

            window.open(url, '_blank', 'noopener,noreferrer');
            this.showNotification('Opening pageant website...', 'success');
        } catch (error) {
            console.error('Error opening pageant link:', error);
            this.showNotification('Failed to open pageant website', 'error');
        }
    }

    // Initialize notification form
    initNotificationForm() {
        const form = document.getElementById('videoNotificationForm');
        const emailInput = document.getElementById('notificationEmail');
        const submitBtn = form?.querySelector('.submit-btn');

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            if (!this.validateEmail(email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Disable form during submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

            try {
                // Simulate API call
                await this.subscribeToNotifications(email);
                
                this.showNotification('Successfully subscribed to video notifications!', 'success');
                form.reset();
                
                // Track subscription
                this.trackEvent('notification_subscribe', {
                    email: email,
                    source: 'youtube_page'
                });

            } catch (error) {
                console.error('Subscription error:', error);
                this.showNotification('Failed to subscribe. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
            }
        });

        // Real-time email validation
        emailInput?.addEventListener('input', (e) => {
            const isValid = this.validateEmail(e.target.value);
            e.target.style.borderColor = isValid ? 'var(--primary-gold)' : 'var(--error-color)';
        });
    }

    // Initialize load more functionality
    initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!loadMoreBtn) return;

        loadMoreBtn.addEventListener('click', async () => {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

            try {
                await this.loadMoreVideos();
                this.trackEvent('load_more_videos', { source: 'youtube_page' });
            } catch (error) {
                console.error('Error loading more videos:', error);
                this.showNotification('Failed to load more videos', 'error');
            } finally {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Videos';
            }
        });
    }

    // Load more videos (simulate API call)
    async loadMoreVideos() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate loading more videos
                const videoGrid = document.getElementById('videoGrid');
                const newVideos = this.generateVideoCards(6);
                
                newVideos.forEach((videoHTML, index) => {
                    setTimeout(() => {
                        const videoElement = document.createElement('div');
                        videoElement.innerHTML = videoHTML;
                        const videoCard = videoElement.firstElementChild;
                        videoCard.style.opacity = '0';
                        videoCard.style.transform = 'translateY(30px)';
                        
                        videoGrid.appendChild(videoCard);
                        
                        // Animate in
                        setTimeout(() => {
                            videoCard.style.transition = 'all 0.6s ease';
                            videoCard.style.opacity = '1';
                            videoCard.style.transform = 'translateY(0)';
                        }, 50);
                        
                        // Add event listeners
                        this.addVideoCardListeners(videoCard);
                    }, index * 100);
                });
                
                resolve();
            }, 1000);
        });
    }

    // Generate sample video cards
    generateVideoCards(count) {
        const sampleVideos = [
            {
                id: 'sample1',
                title: 'Advanced Interview Techniques for Pageants',
                duration: '13:45',
                views: '8.2K',
                likes: '456',
                date: '3 days ago'
            },
            {
                id: 'sample2',
                title: 'Perfect Pageant Posing Tutorial',
                duration: '9:30',
                views: '12.1K',
                likes: '789',
                date: '1 week ago'
            },
            // Add more sample videos as needed
        ];

        return Array.from({ length: count }, (_, index) => {
            const video = sampleVideos[index % sampleVideos.length];
            return `
                <div class="video-card" onclick="openVideo('https://youtube.com/watch?v=${video.id}')">
                    <div class="video-thumbnail">
                        <img src="https://via.placeholder.com/400x225/1a1a1a/d4af37?text=Video+Thumbnail" alt="${video.title}" loading="lazy">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="video-duration">${video.duration}</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">${video.title}</h3>
                        <div class="video-meta">
                            <span class="video-date">${video.date}</span>
                            <div class="video-stats">
                                <span><i class="fas fa-eye"></i> ${video.views}</span>
                                <span><i class="fas fa-thumbs-up"></i> ${video.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
                        `;
        });
    }

    // Add event listeners to newly created video cards
    addVideoCardListeners(videoCard) {
        videoCard.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = videoCard.getAttribute('onclick')?.match(/openVideo$$'([^']+)'$$/)?.[1];
            if (videoUrl) {
                this.openVideo(videoUrl);
            }
        });

        videoCard.addEventListener('mouseenter', () => {
            this.playHoverEffect(videoCard);
        });
    }

    // Subscribe to notifications (simulate API call)
    async subscribeToNotifications(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate API response
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, message: 'Subscribed successfully' });
                } else {
                    reject(new Error('Subscription failed'));
                }
            }, 1500);
        });
    }

    // Email validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Create ripple effect on click
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Play hover effect
    playHoverEffect(element) {
        const playButton = element.querySelector('.play-button');
        if (playButton) {
            playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
            setTimeout(() => {
                playButton.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notificationStack = document.getElementById('notificationStack') || this.createNotificationStack();
        
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notificationStack.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Create notification stack if it doesn't exist
    createNotificationStack() {
        const stack = document.createElement('div');
        stack.id = 'notificationStack';
        stack.className = 'notification-stack';
        document.body.appendChild(stack);
        return stack;
    }

    // Initialize intersection observer for animations
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    
                    // Add staggered animations for grid items
                    if (entry.target.classList.contains('video-card') || 
                        entry.target.classList.contains('category-card') ||
                        entry.target.classList.contains('pageant-card')) {
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll(
            '.video-card, .category-card, .pageant-card, .community-card'
        );
        
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    // Track analytics events
    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'YouTube Page',
                ...parameters
            });
        }

        // Custom analytics
        console.log(`Analytics Event: ${eventName}`, parameters);
    }

    // Track analytics for page interactions
    trackAnalytics() {
        // Track page view
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                    this.trackEvent('scroll_depth', {
                        scroll_percent: scrollPercent
                    });
                }
            }
        });

        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', {
                duration_seconds: timeOnPage
            });
        });

        // Track CTA clicks
        document.querySelectorAll('.subscribe-btn, .cta-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('cta_click', {
                    button_text: btn.textContent.trim(),
                    button_location: this.getElementLocation(btn)
                });
            });
        });
    }

    // Get element location for analytics
    getElementLocation(element) {
        const section = element.closest('section');
        return section?.className || 'unknown';
    }

    // Initialize notification bell functionality
    initNotificationBell() {
        const notificationBtn = document.getElementById('notificationBtn');
        
        if (!notificationBtn) return;

        notificationBtn.addEventListener('click', () => {
            this.requestNotificationPermission();
        });
    }

    // Request browser notification permission
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            this.showNotification('Browser notifications not supported', 'error');
            return;
        }

        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            this.showNotification('Notifications enabled! You\'ll get notified of new videos.', 'success');
            this.trackEvent('notification_permission', { granted: true });
            
            // Show sample notification
            setTimeout(() => {
                new Notification('Pageant Empress TV', {
                    body: 'Thanks for enabling notifications! You\'ll be the first to know about new videos.',
                    icon: '/assets/images/icon-192x192.png'
                });
            }, 1000);
        } else {
            this.showNotification('Notification permission denied', 'warning');
            this.trackEvent('notification_permission', { granted: false });
        }
    }

    // Handle video sharing
    shareVideo(videoUrl, title) {
        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: title,
                url: videoUrl
            }).then(() => {
                this.trackEvent('video_share', {
                    video_url: videoUrl,
                    method: 'native'
                });
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(videoUrl).then(() => {
                this.showNotification('Video link copied to clipboard!', 'success');
                this.trackEvent('video_share', {
                    video_url: videoUrl,
                    method: 'clipboard'
                });
            });
        }
    }

    // Initialize keyboard navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle escape key to close modals/overlays
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }

            // Handle enter key on focusable elements
            if (e.key === 'Enter') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('video-card') ||
                    focusedElement.classList.contains('pageant-card')) {
                    focusedElement.click();
                }
            }
        });

        // Make cards focusable
        document.querySelectorAll('.video-card, .pageant-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid var(--primary-gold)';
            });
            
            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });
        });
    }

    // Performance monitoring
    initPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                
                this.trackEvent('page_performance', {
                    load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                    dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                    first_byte: Math.round(perfData.responseStart - perfData.fetchStart)
                });
            }, 0);
        });

        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('web_vital_lcp', {
                    value: Math.round(lastEntry.startTime)
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                this.trackEvent('web_vital_fid', {
                    value: Math.round(firstInput.processingStart - firstInput.startTime)
                });
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    // Error handling
    initErrorHandling() {
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('promise_rejection', {
                reason: event.reason?.toString() || 'Unknown error'
            });
        });
    }
}

// Global functions for inline handlers
window.openVideo = (url) => {
    if (window.youtubePageManager) {
        window.youtubePageManager.openVideo(url);
    }
};

window.openPageantLink = (url) => {
    if (window.youtubePageManager) {
        window.youtubePageManager.openPageantLink(url);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.youtubePageManager = new YouTubePageManager();
});

// Additional utility functions
const Utils = {
    // Debounce function for performance
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

    // Throttle function for performance
    throttle(func, limit) {
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
    },

    // Format large numbers
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
              return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Get random number between min and max
    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },

    // Check if device is mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Get browser info
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Opera')) browser = 'Opera';
        
        return {
            name: browser,
            isMobile: this.isMobile(),
            language: navigator.language
        };
    }
};

// YouTube API integration (if needed)
class YouTubeAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    async getChannelInfo(channelId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/channels?part=statistics,snippet&id=${channelId}&key=${this.apiKey}`
            );
            const data = await response.json();
            return data.items[0];
        } catch (error) {
            console.error('Error fetching channel info:', error);
            return null;
        }
    }

    async getChannelVideos(channelId, maxResults = 12) {
        try {
            const response = await fetch(
                `${this.baseUrl}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${this.apiKey}`
            );
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    }

    async getVideoStatistics(videoIds) {
        try {
            const response = await fetch(
                `${this.baseUrl}/videos?part=statistics&id=${videoIds.join(',')}&key=${this.apiKey}`
            );
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('Error fetching video statistics:', error);
            return [];
        }
    }
}

// Enhanced video player functionality
class VideoPlayer {
    constructor() {
        this.currentVideo = null;
        this.playlist = [];
        this.currentIndex = 0;
    }

    // Create custom video modal
    createVideoModal(videoUrl, title) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-overlay" onclick="this.parentElement.remove()">
                <div class="video-modal-content" onclick="event.stopPropagation()">
                    <div class="video-modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="this.closest('.video-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="video-modal-body">
                        <iframe src="${this.getEmbedUrl(videoUrl)}" 
                                title="${title}" 
                                allowfullscreen
                                loading="lazy"></iframe>
                    </div>
                    <div class="video-modal-actions">
                        <button onclick="this.closest('.video-modal').remove()" class="btn btn-secondary">
                            <i class="fas fa-times"></i> Close
                        </button>
                        <button onclick="window.open('${videoUrl}', '_blank')" class="btn btn-primary">
                            <i class="fab fa-youtube"></i> Watch on YouTube
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Clean up on close
        modal.addEventListener('remove', () => {
            document.body.style.overflow = '';
        });

        return modal;
    }

    // Convert YouTube URL to embed URL
    getEmbedUrl(url) {
        const videoId = this.extractVideoId(url);
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // Extract video ID from YouTube URL
    extractVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

// Social sharing functionality
class SocialShare {
    constructor() {
        this.platforms = {
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            twitter: 'https://twitter.com/intent/tweet?url=',
            linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=',
            pinterest: 'https://pinterest.com/pin/create/button/?url=',
            whatsapp: 'https://wa.me/?text='
        };
    }

    share(platform, url, text = '') {
        const shareUrl = this.platforms[platform];
        if (!shareUrl) return;

        const fullUrl = platform === 'twitter' || platform === 'whatsapp' 
            ? `${shareUrl}${encodeURIComponent(text + ' ' + url)}`
            : `${shareUrl}${encodeURIComponent(url)}`;

        window.open(fullUrl, '_blank', 'width=600,height=400');
        
        // Track sharing
        if (window.youtubePageManager) {
            window.youtubePageManager.trackEvent('social_share', {
                platform: platform,
                url: url
            });
        }
    }

    addShareButtons(element, url, text) {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-buttons';
        shareContainer.innerHTML = `
            <span class="share-label">Share:</span>
            <button onclick="socialShare.share('facebook', '${url}')" class="share-btn facebook">
                <i class="fab fa-facebook-f"></i>
            </button>
            <button onclick="socialShare.share('twitter', '${url}', '${text}')" class="share-btn twitter">
                <i class="fab fa-twitter"></i>
            </button>
            <button onclick="socialShare.share('linkedin', '${url}')" class="share-btn linkedin">
                <i class="fab fa-linkedin-in"></i>
            </button>
            <button onclick="socialShare.share('whatsapp', '${url}', '${text}')" class="share-btn whatsapp">
                <i class="fab fa-whatsapp"></i>
            </button>
        `;
        
        element.appendChild(shareContainer);
    }
}

// Initialize global instances
const socialShare = new SocialShare();
const videoPlayer = new VideoPlayer();

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Lazy loading for images
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            });

            this.observeImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.imageObserver.observe(img));
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }

    // Add new images to observer
    observe(img) {
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        } else {
            this.loadImage(img);
        }
    }
}

// Initialize lazy loader
const lazyLoader = new LazyLoader();

// Accessibility enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addARIALabels();
        this.enhanceKeyboardNavigation();
        this.addSkipLinks();
        this.manageReducedMotion();
    }

    addARIALabels() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('.video-card').forEach((card, index) => {
            card.setAttribute('aria-label', `Video ${index + 1}: ${card.querySelector('.video-title')?.textContent}`);
            card.setAttribute('role', 'button');
        });

        document.querySelectorAll('.pageant-card').forEach((card, index) => {
            const name = card.querySelector('.pageant-name')?.textContent;
            card.setAttribute('aria-label', `Learn about ${name} pageant`);
            card.setAttribute('role', 'button');
        });
    }

    enhanceKeyboardNavigation() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .video-card:focus,
            .pageant-card:focus,
            .category-card:focus {
                outline: 3px solid var(--primary-gold);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-gold);
            color: var(--dark-bg);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    manageReducedMotion() {
        // Respect user's reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                // Disable or reduce animations
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
        };

        mediaQuery.addListener(handleMotionPreference);
        handleMotionPreference(mediaQuery);
    }
}

// Initialize accessibility manager
const accessibilityManager = new AccessibilityManager();

// Error boundary for React-like error handling
class ErrorBoundary {
    constructor() {
        this.setupErrorHandling();
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, event.filename, event.lineno);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection(event.reason);
        });
    }

    handleError(error, filename, line) {
        console.error('JavaScript Error:', {
            message: error.message,
            filename: filename,
            line: line,
            stack: error.stack
        });

        // Show user-friendly error message
        this.showErrorMessage('Something went wrong. Please refresh the page and try again.');
        
        // Track error for analytics
        if (window.youtubePageManager) {
            window.youtubePageManager.trackEvent('javascript_error', {
                message: error.message,
                filename: filename,
                line: line
            });
        }
    }

    handlePromiseRejection(reason) {
        console.error('Unhandled Promise Rejection:', reason);
        
        // Track promise rejection
        if (window.youtubePageManager) {
            window.youtubePageManager.trackEvent('promise_rejection', {
                reason: reason.toString()
            });
        }
    }

    showErrorMessage(message) {
        if (window.youtubePageManager) {
            window.youtubePageManager.showNotification(message, 'error');
        }
    }
}

// Initialize error boundary
const errorBoundary = new ErrorBoundary();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        YouTubePageManager,
        Utils,
        VideoPlayer,
        SocialShare,
        LazyLoader,
        AccessibilityManager,
        ErrorBoundary
    };
          }
