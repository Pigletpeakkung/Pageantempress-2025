// Instagram Feed Integration
class InstagramFeed {
    constructor() {
        this.feedContainer = document.getElementById('instagramFeed');
        this.instagramPosts = [
            {
                id: '1',
                permalink: 'https://www.instagram.com/p/DLT_RR-zDLT/',
                embedCode: 'DLT_RR-zDLT',
                type: 'post'
            },
            {
                id: '2',
                permalink: 'https://www.instagram.com/p/DLsOJ9zBFXM/',
                embedCode: 'DLsOJ9zBFXM',
                type: 'post'
            },
            {
                id: '3',
                permalink: 'https://www.instagram.com/p/DLrK-t1BO7Y/',
                embedCode: 'DLrK-t1BO7Y',
                type: 'post'
            },
            {
                id: '4',
                permalink: 'https://www.instagram.com/p/DLpuGlNB2MZ/',
                embedCode: 'DLpuGlNB2MZ',
                type: 'post'
            },
            {
                id: '5',
                permalink: 'https://www.instagram.com/p/DLnGXS3zGVy/',
                embedCode: 'DLnGXS3zGVy',
                type: 'post'
            },
            {
                id: '6',
                permalink: 'https://www.instagram.com/p/DLmBQ_gztpb/',
                embedCode: 'DLmBQ_gztpb',
                type: 'post'
            }
        ];
        
        this.init();
    }

    init() {
        // Clear loading message
        this.feedContainer.innerHTML = '';
        
        // Choose loading method
        // Method 1: Instagram oEmbed API (Recommended)
        this.loadOEmbedPosts();
        
        // Method 2: Direct iframe embeds (Alternative)
        // this.loadIframePosts();
        
        // Method 3: Custom preview cards (Fastest)
        // this.loadCustomPosts();
    }

    // Method 1: Using Instagram oEmbed API
    async loadOEmbedPosts() {
        const posts = await Promise.all(
            this.instagramPosts.map(post => this.fetchOEmbed(post))
        );
        
        posts.forEach((postData, index) => {
            if (postData) {
                this.renderOEmbedPost(postData, index);
            }
        });
        
        // Load Instagram embed script
        this.loadInstagramScript();
    }

    async fetchOEmbed(post) {
        try {
            const response = await fetch(
                `https://api.instagram.com/oembed?url=${post.permalink}&omitscript=true`
            );
            const data = await response.json();
            return { ...data, ...post };
        } catch (error) {
            console.error('Error fetching Instagram oEmbed:', error);
            return null;
        }
    }

    renderOEmbedPost(postData, index) {
        const postElement = document.createElement('div');
        postElement.className = 'instagram-post';
        postElement.style.animationDelay = `${index * 0.1}s`;
        postElement.innerHTML = postData.html;
        
        this.feedContainer.appendChild(postElement);
    }

    // Method 2: Direct iframe embeds
    loadIframePosts() {
        this.instagramPosts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'instagram-post instagram-iframe-wrapper';
            postElement.style.animationDelay = `${index * 0.1}s`;
            
            postElement.innerHTML = `
                <iframe 
                    src="https://www.instagram.com/p/${post.embedCode}/embed" 
                    frameborder="0" 
                    scrolling="no" 
                    allowtransparency="true"
                    width="100%" 
                    height="100%">
                </iframe>
            `;
            
            this.feedContainer.appendChild(postElement);
        });
    }

    // Method 3: Custom preview cards (fastest loading)
    loadCustomPosts() {
        // First, load placeholder images
        const placeholderPosts = [
            {
                image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=80',
                caption: 'Crown moments and pageant highlights',
                likes: '5.4K',
                comments: '234'
            },
            {
                image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
                caption: 'Fashion trends and style tips',
                likes: '3.8K',
                comments: '156'
            },
            {
                image: 'https://images.unsplash.com/photo-1542140372-de3e121eb11e?w=400&q=80',
                caption: 'Exclusive interviews and behind the scenes',
                likes: '8.7K',
                comments: '432'
            },
            {
                image: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=400&q=80',
                caption: 'Pageant preparation and training',
                likes: '6.5K',
                comments: '287'
            },
            {
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                caption: 'Beauty tips and makeup tutorials',
                likes: '4.2K',
                comments: '198'
            },
            {
                image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
                caption: 'Pageant news and updates',
                likes: '7.1K',
                comments: '345'
            }
        ];

        this.instagramPosts.forEach((post, index) => {
            const placeholder = placeholderPosts[index] || placeholderPosts[0];
            const postElement = this.createCustomPost(post, placeholder, index);
            this.feedContainer.appendChild(postElement);
        });
    }

    createCustomPost(post, placeholder, index) {
        const postElement = document.createElement('a');
        postElement.href = post.permalink;
        postElement.target = '_blank';
        postElement.rel = 'noopener noreferrer';
        postElement.className = 'instagram-post';
        postElement.style.animationDelay = `${index * 0.1}s`;
        
        postElement.innerHTML = `
            <img src="${placeholder.image}" alt="Instagram post" loading="lazy">
            <div class="instagram-overlay">
                <div class="instagram-stats-overlay">
                    <span class="ig-stat">
                        <i class="fas fa-heart"></i>
                        <span>${placeholder.likes}</span>
                    </span>
                    <span class="ig-stat">
                        <i class="fas fa-comment"></i>
                        <span>${placeholder.comments}</span>
                    </span>
                </div>
                <p class="ig-caption">${placeholder.caption}</p>
            </div>
            <div class="ig-logo-overlay">
                <i class="fab fa-instagram"></i>
            </div>
        `;
        
        return postElement;
    }

    // Load Instagram embed script
    loadInstagramScript() {
        if (!window.instgrm) {
            const script = document.createElement('script');
            script.async = true;
            script.src = '//www.instagram.com/embed.js';
            document.body.appendChild(script);
        } else {
            window.instgrm.Embeds.process();
        }
    }

    // Update stats (can be connected to Instagram API)
    updateStats() {
        // These would be fetched from Instagram API
        const stats = {
            followers: '125K',
            posts: '1,234',
            following: '567'
        };
        
        document.getElementById('igFollowers').textContent = stats.followers;
        document.getElementById('igPosts').textContent = stats.posts;
        document.getElementById('igFollowing').textContent = stats.following;
    }
}

// Initialize Instagram feed when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const instagramFeed = new InstagramFeed();
    
    // Optional: Add intersection observer for lazy loading
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const instagramSection = document.querySelector('.instagram-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load Instagram feed when section is visible
                instagramFeed.updateStats();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (instagramSection) {
        observer.observe(instagramSection);
    }
});

// Add custom styling for iframe posts
const iframeStyles = document.createElement('style');
iframeStyles.textContent = `
    .instagram-iframe-wrapper {
        background: var(--glass-bg);
        border-radius: var(--border-radius);
        overflow: hidden;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .instagram-iframe-wrapper iframe {
        width: 100%;
        min-height: 400px;
        border: none;
    }
    
    .ig-logo-overlay {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 35px;
        height: 35px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
    }
    
    /* Responsive iframe sizing */
    @media (max-width: 768px) {
        .instagram-iframe-wrapper iframe {
            min-height: 350px;
        }
    }
    
    @media (max-width: 480px) {
        .instagram-iframe-wrapper iframe {
            min-height: 300px;
        }
    }
`;
document.head.appendChild(iframeStyles);
