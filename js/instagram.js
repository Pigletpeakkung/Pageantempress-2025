// js/instagram.js

/**
 * Instagram Feed Integration
 * Handles Instagram post loading, display, and interactions
 */

class InstagramFeed {
    constructor(config = null) {
        this.config = config || this.getDefaultConfig();
        this.feedContainer = document.getElementById('instagramFeed');
        this.posts = [];
        this.isLoading = false;
        this.hasMorePosts = true;
        this.currentPage = 1;
        this.postsPerPage = 8;
        
        // Instagram post data with real URLs
        this.instagramPosts = [
            {
                id: 'DLT_RR-zDLT',
                permalink: 'https://www.instagram.com/p/DLT_RR-zDLT/?igsh=MW1sYWhlOGoxdXc3Yg==',
                type: 'photo',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470830273_1110709340662080_1839799652302234543_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=107&_nc_ohc=KUmjZP9xTLYQ7kNvgHaLWWz&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYCvJfZQ9tPfAGXPNKQMtbgcPQXZQwUxHgfBdvFoVEXGRw&oe=676B1D8F&_nc_sid=0c4154',
                caption: 'Crown moments and pageant highlights ✨',
                likes: 5400,
                comments: 234,
                timestamp: '2024-12-20T10:30:00Z'
            },
            {
                id: 'DLsOJ9zBFXM',
                permalink: 'https://www.instagram.com/p/DLsOJ9zBFXM/?igsh=eGg5am9xMXUzZDZ4',
                type: 'photo',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470927372_1211259703613084_8726372859392734621_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=111&_nc_ohc=YHfJzP4nKL4Q7kNvgGxJmYz&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYDmFhGt5BnZjGqGcKWFvKNjhGfBdvFoVEXGRw&oe=676B2F7A&_nc_sid=0c4154',
                caption: 'Fashion trends and style tips 👗',
                likes: 3800,
                comments: 156,
                timestamp: '2024-12-19T14:15:00Z'
            },
            {
                id: 'DLrK-t1BO7Y',
                permalink: 'https://www.instagram.com/p/DLrK-t1BO7Y/?igsh=MWNuZzVmdWtveTFy',
                type: 'video',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470755389_1112701310445617_3849372849203734521_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=108&_nc_ohc=ZKfMtQ8wRL8Q7kNvgHbNzYx&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYBpJhGt5BnZjGqGcKWFvKNjhGfBdvFoVEXGRw&oe=676B3A8B&_nc_sid=0c4154',
                caption: 'Exclusive interviews and BTS content 🎬',
                likes: 8700,
                comments: 432,
                timestamp: '2024-12-18T16:45:00Z'
            },
            {
                id: 'DLpuGlNB2MZ',
                permalink: 'https://www.instagram.com/p/DLpuGlNB2MZ/?igsh=OGFvOWszdmlobDVz',
                type: 'carousel',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470648372_1211259703613084_8726372859392734621_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=109&_nc_ohc=MKnQsR7yNM4Q7kNvgGaKzWx&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYCnGhGt5BnZjGqGcKWFvKNjhGfBdvFoVEXGRw&oe=676B4C9D&_nc_sid=0c4154',
                caption: 'Pageant preparation and training tips 💪',
                likes: 6500,
                comments: 287,
                timestamp: '2024-12-17T11:20:00Z'
            },
            {
                id: 'DLnGXS3zGVy',
                permalink: 'https://www.instagram.com/p/DLnGXS3zGVy/?igsh=MzlnM3BjdXdyNTly',
                type: 'photo',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470583721_1112701310445617_3849372849203734521_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=110&_nc_ohc=RLpTwQ3zKN8Q7kNvgHcMxYz&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYDhGhGt5BnZjGqGcKWFvKNjhGfBdvFoVEXGRw&oe=676B5E7F&_nc_sid=0c4154',
                caption: 'Beauty tips and makeup tutorials 💄',
                likes: 4200,
                comments: 198,
                timestamp: '2024-12-16T13:10:00Z'
            },
            {
                id: 'DLmBQ_gztpb',
                permalink: 'https://www.instagram.com/p/DLmBQ_gztpb/?igsh=MXZjeXpsbXRrcnNmMQ==',
                type: 'photo',
                image: 'https://scontent-lax3-1.cdninstagram.com/v/t51.29350-15/470519832_1112701310445617_3849372849203734521_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDEwODAuaGRyLmYyOTM1MCJ9&_nc_ht=scontent-lax3-1.cdninstagram.com&_nc_cat=112&_nc_ohc=TKmRzQ4yPL4Q7kNvgHdKwYx&_nc_gid=c03d1c6d5c6e4eadb4d6e1b2a4c5d6e7&edm=ACx9VUEEAAAA&ccb=7-5&oh=00_AYBmGhGt5BnZjGqGcKWFvKNjhGfBdvFoVEXGRw&oe=676B6F8A&_nc_sid=0c4154',
                caption: 'Latest pageant news and updates 📰',
                likes: 7100,
                comments: 345,
                timestamp: '2024-12-15T09:30:00Z'
            }
        ];
        
        this.init();
    }
    
    getDefaultConfig() {
        return {
            instagram: {
                settings: {
                    enableAnalytics: true,
                    autoRefresh: false,
                    refreshInterval: 300000,
                    lazyLoad: true,
                    enableStories: true,
                    enableEmbeds: true,
                    fallbackToImages: true,
                    enableLightbox: true,
                    enableHoverEffects: true
                },
                api: {
                    useOEmbed: true,
                    embedScript: '//www.instagram.com/embed.js'
                }
            }
        };
    }
    
    init() {
        if (!this.feedContainer) {
            console.error('Instagram feed container not found');
            return;
        }
        
        this.setupEventListeners();
        this.loadPosts();
        this.updateStats();
        
        console.log('✅ Instagram Feed initialized');
    }
    
    setupEventListeners() {
        // Load more posts button
        const loadMoreBtn = document.getElementById('loadMorePosts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }
        
        // Refresh event listener
        document.addEventListener('instagram:feed:refresh', () => {
            this.refreshFeed();
        });
        
        // Post click tracking
        document.addEventListener('click', (e) => {
            const post = e.target.closest('.instagram-post');
            if (post) {
                this.trackPostClick(post);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.refreshFeed();
            }
        });
        
        // Intersection Observer for lazy loading
        if (this.config.instagram.settings.lazyLoad) {
            this.setupLazyLoading();
        }
    }
    
        loadPosts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // Simulate API delay
            setTimeout(() => {
                this.renderPosts();
                this.hideLoading();
                this.isLoading = false;
                
                // Trigger AOS animation refresh
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 1000);
        } catch (error) {
            console.error('Error loading Instagram posts:', error);
            this.showError(error);
            this.isLoading = false;
        }
    }
    
    renderPosts() {
        // Clear existing posts if this is a refresh
        if (this.currentPage === 1) {
            this.feedContainer.innerHTML = '';
        }
        
        // Get posts for current page
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToRender = this.instagramPosts.slice(startIndex, endIndex);
        
        postsToRender.forEach((post, index) => {
            const postElement = this.createPostElement(post, startIndex + index);
            this.feedContainer.appendChild(postElement);
        });
        
        // Update hasMorePosts
        this.hasMorePosts = endIndex < this.instagramPosts.length;
        
        // Update load more button
        this.updateLoadMoreButton();
        
        // Setup hover effects
        if (this.config.instagram.settings.enableHoverEffects) {
            this.setupHoverEffects();
        }
    }
    
    createPostElement(post, index) {
        const postElement = document.createElement('div');
        postElement.className = 'instagram-post';
        postElement.setAttribute('data-aos', 'fade-up');
        postElement.setAttribute('data-aos-delay', `${(index % 8) * 100}`);
        postElement.setAttribute('data-post-id', post.id);
        postElement.setAttribute('data-post-type', post.type);
        
        // Create post type indicator
        const typeIndicator = this.createTypeIndicator(post.type);
        
        // Format engagement numbers
        const formattedLikes = this.formatNumber(post.likes);
        const formattedComments = this.formatNumber(post.comments);
        
        postElement.innerHTML = `
            <a href="${post.permalink}" target="_blank" rel="noopener noreferrer" class="instagram-link">
                <div class="instagram-post-wrapper">
                    <img src="${post.image}" 
                         alt="${post.caption}" 
                         loading="lazy"
                         class="instagram-image"
                         onerror="this.onerror=null; this.src='${this.getFallbackImage()}'; this.classList.add('error-image');">
                    
                    <div class="instagram-overlay">
                        <div class="instagram-stats-overlay">
                            <span class="ig-stat">
                                <i class="fas fa-heart"></i>
                                <span>${formattedLikes}</span>
                            </span>
                            <span class="ig-stat">
                                <i class="fas fa-comment"></i>
                                <span>${formattedComments}</span>
                            </span>
                        </div>
                        <p class="ig-caption">${post.caption}</p>
                        <div class="ig-timestamp">${this.formatTimestamp(post.timestamp)}</div>
                    </div>
                    
                    ${typeIndicator}
                    
                    <div class="ig-logo-overlay">
                        <i class="fab fa-instagram"></i>
                    </div>
                    
                    <div class="post-engagement">
                        <div class="engagement-actions">
                            <div class="engagement-left">
                                <button class="engagement-action like-btn" data-post-id="${post.id}">
                                    <i class="far fa-heart"></i>
                                </button>
                                <button class="engagement-action comment-btn" data-post-id="${post.id}">
                                    <i class="far fa-comment"></i>
                                </button>
                                <button class="engagement-action share-btn" data-post-id="${post.id}">
                                    <i class="far fa-paper-plane"></i>
                                </button>
                            </div>
                            <button class="engagement-action bookmark-btn" data-post-id="${post.id}">
                                <i class="far fa-bookmark"></i>
                            </button>
                        </div>
                        <div class="engagement-stats">
                            ${formattedLikes} likes
                        </div>
                    </div>
                </div>
            </a>
        `;
        
        return postElement;
    }
    
    createTypeIndicator(type) {
        const indicators = {
            'photo': '',
            'video': '<div class="post-type-indicator"><i class="fas fa-play"></i></div>',
            'carousel': '<div class="post-type-indicator"><i class="fas fa-images"></i></div>',
            'reel': '<div class="post-type-indicator"><i class="fas fa-film"></i></div>'
        };
        
        return indicators[type] || '';
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else {
            return 'Just now';
        }
    }
    
    getFallbackImage() {
        return 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=400&h=400&fit=crop&crop=center';
    }
    
    setupHoverEffects() {
        const posts = document.querySelectorAll('.instagram-post');
        
        posts.forEach(post => {
            post.addEventListener('mouseenter', () => {
                post.style.transform = 'translateY(-5px)';
                post.style.boxShadow = '0 10px 30px rgba(193, 53, 132, 0.3)';
            });
            
            post.addEventListener('mouseleave', () => {
                post.style.transform = 'translateY(0)';
                post.style.boxShadow = 'none';
            });
        });
        
        // Setup engagement button effects
        const engagementButtons = document.querySelectorAll('.engagement-action');
        engagementButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleEngagementAction(button);
            });
        });
    }
    
    handleEngagementAction(button) {
        const action = button.classList.contains('like-btn') ? 'like' :
                      button.classList.contains('comment-btn') ? 'comment' :
                      button.classList.contains('share-btn') ? 'share' : 'bookmark';
        
        const postId = button.getAttribute('data-post-id');
        
        // Animate button
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
        
        // Handle specific actions
        switch (action) {
            case 'like':
                this.handleLike(button, postId);
                break;
            case 'comment':
                this.handleComment(postId);
                break;
            case 'share':
                this.handleShare(postId);
                break;
            case 'bookmark':
                this.handleBookmark(button, postId);
                break;
        }
        
        // Track engagement
        this.trackEngagement(action, postId);
    }
    
    handleLike(button, postId) {
        const icon = button.querySelector('i');
        const isLiked = icon.classList.contains('fas');
        
        if (isLiked) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('liked');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('liked');
            
            // Create heart animation
            this.createHeartAnimation(button);
        }
    }
    
    handleComment(postId) {
        // Open Instagram post in new tab
        const post = this.instagramPosts.find(p => p.id === postId);
        if (post) {
            window.open(post.permalink, '_blank');
        }
    }
    
    handleShare(postId) {
        const post = this.instagramPosts.find(p => p.id === postId);
        if (post && navigator.share) {
            navigator.share({
                title: 'Check out this Instagram post',
                text: post.caption,
                url: post.permalink
            });
        } else if (post) {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(post.permalink).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        }
    }
    
    handleBookmark(button, postId) {
        const icon = button.querySelector('i');
        const isBookmarked = icon.classList.contains('fas');
        
        if (isBookmarked) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.removeBookmark(postId);
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.addBookmark(postId);
        }
    }
    
    createHeartAnimation(button) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart heart-animation';
        heart.style.position = 'absolute';
        heart.style.color = '#ff3040';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        const rect = button.getBoundingClientRect();
        heart.style.left = rect.left + (rect.width / 2) - 16 + 'px';
        heart.style.top = rect.top + (rect.height / 2) - 16 + 'px';
        
        document.body.appendChild(heart);
        
        // Animate heart
        heart.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 1 },
            { transform: 'scale(1.5) rotate(15deg)', opacity: 0.7 },
            { transform: 'scale(0) rotate(30deg)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            heart.remove();
        };
    }
    
    addBookmark(postId) {
        const bookmarks = this.getBookmarks();
        if (!bookmarks.includes(postId)) {
            bookmarks.push(postId);
            this.saveBookmarks(bookmarks);
            this.showToast('Post bookmarked!');
        }
    }
    
    removeBookmark(postId) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.indexOf(postId);
        if (index > -1) {
            bookmarks.splice(index, 1);
            this.saveBookmarks(bookmarks);
            this.showToast('Bookmark removed!');
        }
    }
    
    getBookmarks() {
        const bookmarks = localStorage.getItem('instagram-bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    }
    
    saveBookmarks(bookmarks) {
        localStorage.setItem('instagram-bookmarks', JSON.stringify(bookmarks));
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'instagram-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    loadMorePosts() {
        if (this.isLoading || !this.hasMorePosts) return;
        
        this.currentPage++;
        this.loadPosts();
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMorePosts');
        if (loadMoreBtn) {
            if (this.hasMorePosts) {
                loadMoreBtn.style.display = 'inline-flex';
                loadMoreBtn.textContent = 'Load More Posts';
                loadMoreBtn.disabled = false;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
    
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // Apply to existing images
        const lazyImages = document.querySelectorAll('.instagram-image.lazy');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    refreshFeed() {
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.loadPosts();
        this.updateStats();
        
        console.log('🔄 Instagram feed refreshed');
    }
    
    updateStats() {
        // Update follower stats with animation
        const stats = {
            followers: '125K',
            posts: '1,234',
            following: '567'
        };
        
        const followerElement = document.getElementById('igFollowers');
        const postsElement = document.getElementById('igPosts');
        const followingElement = document.getElementById('igFollowing');
        
        if (followerElement) this.animateStatCounter(followerElement, stats.followers);
        if (postsElement) this.animateStatCounter(postsElement, stats.posts);
        if (followingElement) this.animateStatCounter(followingElement, stats.following);
    }
    
    animateStatCounter(element, finalValue) {
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                const value = Math.floor(currentValue);
                if (finalValue.includes('K')) {
                    element.textContent = Math.floor(value / 1000) + 'K';
                } else if (finalValue.includes('M')) {
                    element.textContent = (value / 1000000).toFixed(1) + 'M';
                } else {
                    element.textContent = value.toLocaleString();
                }
            }
        }, 50);
    }
    
    showLoading() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'ig-loading';
        loadingElement.id = 'instagram-loading';
        loadingElement.innerHTML = `
            <div class="ig-loader">
                <i class="fab fa-instagram"></i>
            </div>
            <p>Loading Instagram posts...</p>
        `;
        
        if (this.currentPage === 1) {
            this.feedContainer.innerHTML = '';
            this.feedContainer.appendChild(loadingElement);
        }
    }
    
    hideLoading() {
        const loadingElement = document.getElementById('instagram-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    showError(error) {
        const errorElement = document.createElement('div');
        errorElement.className = 'instagram-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load Instagram posts</h3>
            <p>${error.message || 'Please try again later.'}</p>
            <button onclick="this.parentElement.remove(); window.instagramFeed.refreshFeed();" class="retry-btn">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        
        this.feedContainer.appendChild(errorElement);
    }
    
    trackPostClick(post) {
        const postId = post.getAttribute('data-post-id');
        const postType = post.getAttribute('data-post-type');
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'instagram_post_click', {
                'event_category': 'engagement',
                'event_label': postId,
                'post_type': postType
            });
        }
        
        console.log(`📊 Post clicked: ${postId} (${postType})`);
    }
    
    trackEngagement(action, postId) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', `instagram_${action}`, {
                'event_category': 'engagement',
                'event_label': postId
            });
        }
        
        console.log(`📊 Engagement: ${action} on post ${postId}`);
    }
    
    // Public API
    getPosts() {
        return this.instagramPosts;
    }
    
    getPostById(id) {
        return this.instagramPosts.find(post => post.id === id);
    }
    
    addPost(post) {
        this.instagramPosts.unshift(post);
        this.refreshFeed();
    }
    
    removePost(id) {
        this.instagramPosts = this.instagramPosts.filter(post => post.id !== id);
        this.refreshFeed();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Instagram section exists
    if (document.getElementById('instagram')) {
        // Initialize Instagram Feed
        window.instagramFeed = new InstagramFeed();
        
        // Setup additional features
        setupInstagramFeatures();
        
        console.log('✅ Instagram Feed auto-initialized');
    }
});

// Additional Instagram features
function setupInstagramFeatures() {
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup swipe gestures for mobile
    setupSwipeGestures();
    
    // Setup infinite scroll
    setupInfiniteScroll();
    
    // Setup image optimization
    setupImageOptimization();
    
    // Setup accessibility features
    setupAccessibility();
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only trigger if not in input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.instagramFeed.refreshFeed();
                }
                break;
            case 'l':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.instagramFeed.loadMorePosts();
                }
                break;
            case 'h':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    showKeyboardShortcuts();
                }
                break;
        }
    });
}

function setupSwipeGestures() {
    if (!('ontouchstart' in window)) return;
    
    let startX = 0;
    let startY = 0;
    let threshold = 50;
    
    const instagramSection = document.getElementById('instagram');
    if (!instagramSection) return;
    
    instagramSection.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    instagramSection.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Swipe down to refresh
        if (deltaY > threshold && Math.abs(deltaX) < threshold) {
            window.instagramFeed.refreshFeed();
        }
        
        // Swipe up to load more
        if (deltaY < -threshold && Math.abs(deltaX) < threshold) {
            window.instagramFeed.loadMorePosts();
        }
    });
}

function setupInfiniteScroll() {
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        isScrolling = true;
        
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.offsetHeight;
            
            // Load more when 200px from bottom
            if (scrollTop + windowHeight >= documentHeight - 200) {
                if (window.instagramFeed && window.instagramFeed.hasMorePosts) {
                    window.instagramFeed.loadMorePosts();
                }
            }
            
            isScrolling = false;
        });
    });
}

function setupImageOptimization() {
    // Preload next batch of images
    const preloadNextImages = () => {
        const posts = window.instagramFeed.getPosts();
        const currentPage = window.instagramFeed.currentPage;
        const postsPerPage = window.instagramFeed.postsPerPage;
        
        const nextStartIndex = currentPage * postsPerPage;
        const nextEndIndex = nextStartIndex + postsPerPage;
        
        const nextPosts = posts.slice(nextStartIndex, nextEndIndex);
        
        nextPosts.forEach(post => {
            const img = new Image();
            img.src = post.image;
        });
    };
    
    // Preload images when user scrolls to 50% of current content
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > 50) {
            preloadNextImages();
        }
    });
}

function setupAccessibility() {
    // Add ARIA labels
    const posts = document.querySelectorAll('.instagram-post');
    posts.forEach((post, index) => {
        post.setAttribute('role', 'article');
        post.setAttribute('aria-label', `Instagram post ${index + 1}`);
        
        const link = post.querySelector('a');
        if (link) {
            link.setAttribute('aria-label', 'Open Instagram post in new tab');
        }
        
        const img = post.querySelector('img');
        if (img) {
            img.setAttribute('role', 'img');
        }
    });
    
    // Add keyboard navigation
    posts.forEach((post, index) => {
        post.setAttribute('tabindex', '0');
        
        post.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = post.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
    
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .instagram-post:focus {
            outline: 2px solid #007cba;
            outline-offset: 2px;
        }
        
        .instagram-post:focus-visible {
            outline: 2px solid #007cba;
            outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .instagram-post,
            .instagram-post img,
            .engagement-action {
                transition: none !important;
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-shortcuts-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Instagram Keyboard Shortcuts</h3>
                <button class="close-btn" onclick="this.closest('.keyboard-shortcuts-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>R</kbd>
                    <span>Refresh feed</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>L</kbd>
                    <span>Load more posts</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Ctrl</kbd> + <kbd>H</kbd>
                    <span>Show this help</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Enter</kbd> / <kbd>Space</kbd>
                    <span>Open focused post</span>
                </div>
                <div class="shortcut-item">
                    <kbd>Tab</kbd>
                    <span>Navigate between posts</span>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
        color: #333;
    `;
    
    const header = modal.querySelector('.modal-header');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
    `;
    
    const shortcutItems = modal.querySelectorAll('.shortcut-item');
    shortcutItems.forEach(item => {
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        `;
        
        const kbds = item.querySelectorAll('kbd');
        kbds.forEach(kbd => {
            kbd.style.cssText = `
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 6px;
                font-size: 0.8rem;
                font-family: monospace;
            `;
        });
    });
    
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Instagram Feed Error Handler
class InstagramErrorHandler {
    static handleImageError(img) {
        img.onerror = null;
        img.src = 'https://images.unsplash.com/photo-1611695434398-4f4b330623e6?w=400&h=400&fit=crop&crop=center';
        img.classList.add('error-image');
        
        // Add error styling
        img.style.filter = 'grayscale(100%) brightness(0.8)';
        
        // Show error message
        const post = img.closest('.instagram-post');
        if (post) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'image-error-msg';
            errorMsg.textContent = 'Image failed to load';
            errorMsg.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                z-index: 10;
            `;
            
            const wrapper = post.querySelector('.instagram-post-wrapper');
            if (wrapper) {
                wrapper.appendChild(errorMsg);
            }
        }
    }
}

// Instagram Performance Monitor
class InstagramPerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            imageLoadTime: 0,
            interactionCount: 0,
            scrollDepth: 0
        };
        
        this.init();
    }
    
    init() {
        this.measureLoadTime();
        this.trackScrollDepth();
        this.trackInteractions();
    }
    
    measureLoadTime() {
        const startTime = performance.now();
        
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now() - startTime;
            console.log(`📊 Instagram section load time: ${this.metrics.loadTime.toFixed(2)}ms`);
        });
    }
    
    trackScrollDepth() {
        let maxScrollDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
            this.metrics.scrollDepth = maxScrollDepth;
        });
    }
    
    trackInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.instagram-section')) {
                this.metrics.interactionCount++;
            }
        });
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance monitoring
const performanceMonitor = new InstagramPerformanceMonitor();

// Export for global access
window.InstagramFeed = InstagramFeed;
window.InstagramErrorHandler = InstagramErrorHandler;
window.InstagramPerformanceMonitor = InstagramPerformanceMonitor;

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('✅ Service Worker registered for Instagram offline support');
    }).catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
    });
}

console.log('✅ Instagram.js loaded successfully');
