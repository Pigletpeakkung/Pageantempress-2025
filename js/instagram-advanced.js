// Advanced Instagram Integration with Analytics and Interactions
class AdvancedInstagramFeed {
    constructor() {
        this.feedContainer = document.getElementById('instagramFeed');
        this.likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        this.viewedPosts = new Set();
        
        this.init();
        this.setupInteractions();
    }

    init() {
        // Show skeleton loader first
        this.showSkeletonLoader();
        
        // Load posts with stagger animation
        setTimeout(() => {
            this.loadCustomPosts();
            this.trackAnalytics();
        }, 1000);
    }

    showSkeletonLoader() {
        this.feedContainer.innerHTML = `
            <div class="instagram-skeleton">
                ${[...Array(8)].map(() => '<div class="skeleton-post"></div>').join('')}
            </div>
        `;
    }

    setupInteractions() {
        // Double tap to like
        this.feedContainer.addEventListener('dblclick', (e) => {
            const post = e.target.closest('.instagram-post');
            if (post) {
                this.handleDoubleTap(post);
            }
        });

        // Intersection Observer for view tracking
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const postId = entry.target.dataset.postId;
                    if (!this.viewedPosts.has(postId)) {
                        this.viewedPosts.add(postId);
                        this.trackPostView(postId);
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe all posts
        setTimeout(() => {
            document.querySelectorAll('.instagram-post').forEach(post => {
                observer.observe(post);
            });
        }, 1500);
    }

    handleDoubleTap(post) {
        const postId = post.dataset.postId;
        const heart = document.createElement('div');
        heart.className = 'double-tap-heart';
        heart.innerHTML = '❤️';
        post.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => heart.remove(), 800);

        // Update like status
        if (!this.likedPosts.includes(postId)) {
            this.likedPosts.push(postId);
            localStorage.setItem('likedPosts', JSON.stringify(this.likedPosts));
            this.updateLikeCount(post);
        }
    }

    updateLikeCount(post) {
        const likeCount = post.querySelector('.like-count');
        if (likeCount) {
            const currentCount = parseInt(likeCount.textContent.replace(/[^0-9]/g, ''));
            likeCount.textContent = this.formatNumber(currentCount + 1);
            likeCount.classList.add('liked-animation');
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    trackPostView(postId) {
        // Send analytics data
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_instagram_post', {
                'post_id': postId,
                'timestamp': new Date().toISOString()
            });
        }
    }

    trackAnalytics() {
        // Track section view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_instagram_section', {
                'posts_count': document.querySelectorAll('.instagram-post').length
            });
        }
    }
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    new AdvancedInstagramFeed();
});
