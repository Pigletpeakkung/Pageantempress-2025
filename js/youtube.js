// youtube.js - YouTube Page Specific JavaScript

class YouTubePage {
    constructor() {
        this.videos = [];
        this.currentPage = 1;
        this.videosPerPage = 6;
        this.isLoading = false;
        this.channelId = 'YOUR_CHANNEL_ID';
        this.apiKey = 'YOUR_API_KEY';
        this.init();
    }

    async init() {
        // Initialize animations
        this.initAnimations();
        
        // Load initial videos
        await this.loadVideos();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Animate statistics
        this.animateStats();
        
        // Initialize video player
        this.initVideoPlayer();
        
        // Setup notification form
        this.setupNotificationForm();
    }

    initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    async loadVideos() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            // In production, this would fetch from YouTube API
            const newVideos = await this.fetchVideosFromAPI();
            this.videos = [...this.videos, ...newVideos];
            this.renderVideos(newVideos);
        } catch (error) {
            console.error('Error loading videos:', error);
            this.showErrorState();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async fetchVideosFromAPI() {
        // Simulated API response - replace with actual YouTube API call
        const sampleVideos = [
            {
                id: 'video1',
                title: 'How to Perfect Your Pageant Walk - Complete Guide',
                thumbnail: '/images/videos/walk-guide.jpg',
                duration: '15:42',
                views: '125K',
                uploaded: '2 days ago'
            },
            {
                id: 'video2',
                title: 'Miss Universe 2024 Winner Interview - Exclusive',
                thumbnail: '/images/videos/winner-interview.jpg',
                duration: '22:15',
                views: '250K',
                uploaded: '1 week ago'
            },
            {
                id: 'video3',
                title: 'Evening Gown Selection Tips from Expert Stylists',
                thumbnail: '/images/videos/gown-tips.jpg',
                duration: '18:30',
                views: '89K',
                uploaded: '3 days ago'
            },
            {
                id: 'video4',
                title: 'Interview Question Practice - Top 50 Questions',
                thumbnail: '/images/videos/interview-practice.jpg',
                duration: '35:20',
                views: '156K',
                uploaded: '5 days ago'
            },
            {
                id: 'video5',
                title: 'Fitness Routine for Pageant Contestants',
                thumbnail: '/images/videos/fitness-routine.jpg',
                duration: '28:45',
                views: '98K',
                uploaded: '1 week ago'
            },
            {
                id: 'video6',
                title: 'Behind the Scenes - Miss World 2024',
                thumbnail: '/images/videos/behind-scenes.jpg',
                duration: '45:10',
                views: '312K',
                uploaded: '2 weeks ago'
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return videos for current page
        const startIndex = (this.currentPage - 1) * this.videosPerPage;
        const endIndex = startIndex + this.videosPerPage;
        return sampleVideos.slice(startIndex, endIndex);
    }

    renderVideos(videos) {
        const videoGrid = document.getElementById('video-grid');
        
        videos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video);
            videoCard.style.opacity = '0';
            videoCard.style.transform = 'translateY(20px)';
            videoGrid.appendChild(videoCard);
            
            // Animate in
            setTimeout(() => {
                videoCard.style.transition = 'all 0.5s ease';
                videoCard.style.opacity = '1';
                videoCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoId = video.id;
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <div class="video-stats">
                        <span><i class="fas fa-eye"></i> ${video.views} views</span>
                        <span><i class="fas fa-clock"></i> ${video.uploaded}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => this.playVideo(video));
        
        return card;
    }

    playVideo(video) {
        // Create modal player
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <button class="video-modal-close">&times;</button>
                <div class="video-player">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.id}?autoplay=1" 
                        title="${video.title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="video-details">
                    <h2>${video.title}</h2>
                    <div class="video-actions">
                        <button class="action-btn like-btn">
                            <i class="fas fa-thumbs-up"></i> Like
                        </button>
                        <button class="action-btn share-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                        <a href="https://youtube.com/watch?v=${video.id}" target="_blank" class="action-btn youtube-btn">
                            <i class="fab fa-youtube"></i> Watch on YouTube
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close handlers
        modal.querySelector('.video-modal-close').addEventListener('click', () => {
            this.closeVideoModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeVideoModal(modal);
            }
        });
        
        // Share handler
        modal.querySelector('.share-btn').addEventListener('click', () => {
            this.shareVideo(video);
        });
        
        // Track video play
        if (window.app?.analytics) {
            window.app.analytics.track('video_played', {
                videoId: video.id,
                videoTitle: video.title
            });
        }
    }

    closeVideoModal(modal) {
        modal.classList.add('closing');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    async shareVideo(video) {
        const shareData = {
            title: video.title,
            text: `Check out this video from Pageant Empress: ${video.title}`,
            url: `https://youtube.com/watch?v=${video.id}`
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback - copy link
                await navigator.clipboard.writeText(shareData.url);
                
                if (window.app?.notifications) {
                    window.app.notifications.show({
                        type: 'success',
                        message: 'Video link copied to clipboard!',
                        duration: 3000
                    });
                }
            }
        } catch (error) {
            console.error('Share failed:', error);
        }
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const animateNumber = (element) => {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number
                let displayValue = Math.floor(current);
                if (target >= 1000000) {
                    displayValue = (current / 1000000).toFixed(1) + 'M';
                } else if (target >= 1000) {
                    displayValue = (current / 1000).toFixed(0) + 'K';
                }
                
                element.textContent = displayValue;
            }, 16);
        };
        
        // Animate when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    setupEventListeners() {
        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        loadMoreBtn?.addEventListener('click', () => {
            this.currentPage++;
            this.loadVideos();
        });
        
        // Notification button
        document.querySelector('.notification-btn')?.addEventListener('click', () => {
            this.showNotificationModal();
        });
        
        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.querySelector('h3').textContent;
                this.filterByCategory(category);
            });
        });
        
        // Pageant cards
        document.querySelectorAll('.pageant-card').forEach(card => {
            card.addEventListener('click', () => {
                const pageantName = card.querySelector('.pageant-name').textContent;
                this.showPageantDetails(pageantName);
            });
        });
    }

    showNotificationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content notification-modal">
                <div class="modal-header">
                    <h2>Get YouTube Notifications</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="notification-options">
                        <label class="notification-option">
                            <input type="checkbox" name="all" checked>
                            <span>All new videos</span>
                        </label>
                        <label class="notification-option">
                            <input type="checkbox" name="training" checked>
                            <span>Training tutorials</span>
                        </label>
                        <label class="notification-option">
                            <input type="checkbox" name="interviews" checked>
                            <span>Winner interviews</span>
                        </label>
                        <label class="notification-option">
                            <input type="checkbox" name="competitions">
                            <span>Competition coverage</span>
                        </label>
                    </div>
                    <p class="notification-info">
                        <i class="fas fa-info-circle"></i>
                        You'll receive notifications through your YouTube account when we upload new content in your selected categories.
                    </p>
                </div>
                <div class="modal-footer">
                    <a href="https://youtube.com/@PageantEmpress?sub_confirmation=1" target="_blank" class="btn btn-primary">
                        Enable on YouTube
                    </a>
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    setupNotificationForm() {
        const form = document.getElementById('notification-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                               // Success
                form.reset();
                
                if (window.app?.notifications) {
                    window.app.notifications.show({
                        type: 'success',
                        message: 'Successfully subscribed! Check your email for confirmation.',
                        duration: 5000
                    });
                }
                
                // Track subscription
                if (window.app?.analytics) {
                    window.app.analytics.track('youtube_notification_subscribed', {
                        email: email
                    });
                }
                
            } catch (error) {
                console.error('Subscription error:', error);
                
                if (window.app?.notifications) {
                    window.app.notifications.show({
                        type: 'error',
                        message: 'Subscription failed. Please try again.',
                        duration: 4000
                    });
                }
            } finally {
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    filterByCategory(category) {
        // Show loading state
        this.showLoadingState();
        
        // Navigate to filtered view
        window.location.href = `/videos?category=${encodeURIComponent(category)}`;
    }

    showPageantDetails(pageantName) {
        const pageantData = {
            'Miss Universe': {
                description: 'Miss Universe is an annual international beauty pageant that is run by the Miss Universe Organization. It is one of the most watched pageants in the world with an estimated audience of over 500 million viewers across 190 territories.',
                founded: '1952',
                headquarters: 'New York City, USA',
                motto: 'Confidently Beautiful',
                currentTitleholder: 'R\'Bonney Gabriel (USA)',
                website: 'https://www.missuniverse.com'
            },
            'Miss World': {
                description: 'Miss World is the oldest-running international beauty pageant. It was created in the United Kingdom by Eric Morley in 1951. Since his death in 2000, Morley\'s widow, Julia Morley, has co-chaired the pageant.',
                founded: '1951',
                headquarters: 'London, UK',
                motto: 'Beauty With A Purpose',
                currentTitleholder: 'Karolina Bielawska (Poland)',
                website: 'https://www.missworld.com'
            },
            'Miss International': {
                description: 'Miss International is a Tokyo-based international beauty pageant organized by the International Culture Association. The pageant aims to promote world peace, goodwill, and understanding.',
                founded: '1960',
                headquarters: 'Tokyo, Japan',
                motto: 'Cheer All Women',
                currentTitleholder: 'Alba Riquelme (Paraguay)',
                website: 'https://www.miss-international.org'
            },
            'Miss Earth': {
                description: 'Miss Earth is an annual international environmental-themed beauty pageant promoting environmental awareness. The pageant is one of the four largest international beauty pageants.',
                founded: '2001',
                headquarters: 'Manila, Philippines',
                motto: 'Beauties For A Cause',
                currentTitleholder: 'Mina Sue Choi (South Korea)',
                website: 'https://www.missearth.tv'
            }
        };

        const data = pageantData[pageantName];
        if (!data) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content pageant-details-modal">
                <div class="modal-header">
                    <h2>${pageantName}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pageant-hero-image">
                        <img src="/images/pageants/${pageantName.toLowerCase().replace(/\s+/g, '-')}-hero.jpg" alt="${pageantName}">
                    </div>
                    <div class="pageant-details">
                        <p class="pageant-description">${data.description}</p>
                        
                        <div class="detail-grid">
                            <div class="detail-item">
                                <i class="fas fa-calendar-alt"></i>
                                <div>
                                    <h4>Founded</h4>
                                    <p>${data.founded}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Headquarters</h4>
                                    <p>${data.headquarters}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-quote-left"></i>
                                <div>
                                    <h4>Motto</h4>
                                    <p>${data.motto}</p>
                                </div>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-crown"></i>
                                <div>
                                    <h4>Current Titleholder</h4>
                                    <p>${data.currentTitleholder}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pageant-videos">
                            <h3>Related Videos</h3>
                            <div class="related-videos-grid">
                                ${this.getRelatedVideos(pageantName)}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="${data.website}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> Official Website
                    </a>
                    <button class="btn btn-secondary view-videos">
                        <i class="fas fa-play-circle"></i> View All Videos
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('.view-videos').addEventListener('click', () => {
            modal.remove();
            this.filterByPageant(pageantName);
        });
    }

    getRelatedVideos(pageantName) {
        // Simulated related videos
        const videos = [
            { id: '1', title: `${pageantName} 2024 Highlights`, views: '45K' },
            { id: '2', title: `${pageantName} Winner Interview`, views: '32K' },
            { id: '3', title: `Behind the Scenes - ${pageantName}`, views: '28K' }
        ];

        return videos.map(video => `
            <div class="related-video-card" data-video-id="${video.id}">
                <div class="video-thumb">
                    <img src="/images/videos/thumb-${video.id}.jpg" alt="${video.title}">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <span>${video.views} views</span>
                </div>
            </div>
        `).join('');
    }

    filterByPageant(pageantName) {
        window.location.href = `/videos?pageant=${encodeURIComponent(pageantName)}`;
    }

    showLoadingState() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    }

    hideLoadingState() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Videos';
        }
    }

    showErrorState() {
        if (window.app?.notifications) {
            window.app.notifications.show({
                type: 'error',
                message: 'Failed to load videos. Please try again.',
                duration: 4000
            });
        }
    }

    initVideoPlayer() {
        // Initialize featured video player with custom controls
        const featuredVideo = document.querySelector('.featured-video iframe');
        if (!featuredVideo) return;

        // Add custom play button overlay
        const videoContainer = featuredVideo.parentElement;
        const playOverlay = document.createElement('div');
        playOverlay.className = 'featured-play-overlay';
        playOverlay.innerHTML = `
            <button class="featured-play-btn">
                <i class="fas fa-play"></i>
                <span>Play Featured Video</span>
            </button>
        `;

        videoContainer.appendChild(playOverlay);

        playOverlay.addEventListener('click', () => {
            playOverlay.style.display = 'none';
            // Auto-play featured video
            featuredVideo.src += '&autoplay=1';
        });
    }
}

// Initialize YouTube page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.youtubePage = new YouTubePage();
});

// Additional CSS for video modal and animations
const modalStyles = `
<style>
.video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: modalFadeIn 0.3s ease;
}

.video-modal.closing {
    animation: modalFadeOut 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes modalFadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.video-modal-content {
    width: 90%;
    max-width: 1200px;
    background: var(--dark-bg);
    border-radius: 20px;
    overflow: hidden;
    animation: modalSlideIn 0.3s ease;
}

.video-modal.closing .video-modal-content {
    animation: modalSlideOut 0.3s ease;
}

@keyframes modalSlideIn {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes modalSlideOut {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(50px);
        opacity: 0;
    }
}

.video-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 10;
}

.video-modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

.video-player {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
}

.video-player iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}

.video-details {
    padding: 2rem;
    background: var(--surface-bg);
}

.video-details h2 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
}

.video-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.action-btn {
    padding: 0.8rem 1.5rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-primary);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.action-btn:hover {
    background: var(--primary-gold);
    color: var(--dark-bg);
    transform: translateY(-2px);
}

.action-btn.youtube-btn {
    background: var(--youtube-red);
    color: white;
    border-color: var(--youtube-red);
}

.action-btn.youtube-btn:hover {
    background: var(--youtube-hover);
    transform: translateY(-2px);
}

/* Featured video overlay */
.featured-play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.featured-play-overlay:hover {
    background: rgba(0, 0, 0, 0.7);
}

.featured-play-btn {
    background: var(--youtube-red);
    color: white;
    border: none;
    padding: 1.5rem 3rem;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
}

.featured-play-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 0, 0, 0.4);
}

.featured-play-btn i {
    font-size: 1.5rem;
}

/* Animation classes */
.animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
}

/* Responsive */
@media (max-width: 768px) {
    .video-modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .video-details {
        padding: 1.5rem;
    }
    
    .video-details h2 {
        font-size: 1.5rem;
    }
    
    .video-actions {
        flex-direction: column;
    }
    
    .action-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);
