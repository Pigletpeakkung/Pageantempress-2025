// Instagram Stories Implementation
class InstagramStories {
    constructor() {
        this.storiesContainer = document.createElement('div');
        this.storiesContainer.className = 'instagram-stories-section';
        this.stories = [
            {
                id: 1,
                username: 'pageantempress',
                avatar: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=100&q=80',
                hasNewStory: true,
                stories: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1542140372-de3e121eb11e?w=1080&q=80',
                        duration: 5000
                    },
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1080&q=80',
                        duration: 5000
                    }
                ]
            }
        ];
        
        this.init();
    }

    init() {
        this.createStoriesSection();
        this.setupStoryViewer();
    }

    createStoriesSection() {
        const instagramSection = document.querySelector('.instagram-section .container');
        
        this.storiesContainer.innerHTML = `
            <div class="stories-header" data-aos="fade-up">
                <h3 class="stories-title">Instagram Stories</h3>
                <div class="stories-controls">
                    <button class="story-nav prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="story-nav next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            <div class="stories-wrapper">
                <div class="instagram-stories">
                    ${this.stories.map(story => this.createStoryItem(story)).join('')}
                </div>
            </div>
        `;
        
        // Insert before the feed
        const feedElement = instagramSection.querySelector('.instagram-feed');
        instagramSection.insertBefore(this.storiesContainer, feedElement);
    }

    createStoryItem(story) {
        return `
            <div class="story-item" data-story-id="${story.id}">
                <div class="story-avatar ${story.hasNewStory ? 'has-story' : ''}">
                    <img src="${story.avatar}" alt="${story.username}">
                </div>
                <span class="story-name">${story.username}</span>
            </div>
        `;
    }

    setupStoryViewer() {
        // Story viewer modal
        const modal = document.createElement('div');
        modal.className = 'story-viewer-modal';
        modal.innerHTML = `
            <div class="story-viewer">
                <div class="story-header">
                    <div class="story-user-info">
                        <img src="" alt="" class="story-user-avatar">
                        <span class="story-username"></span>
                        <span class="story-time">2h ago</span>
                    </div>
                    <button class="story-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="story-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="story-content">
                    <img src="" alt="Story" class="story-image">
                </div>
                <div class="story-controls">
                    <button class="story-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="story-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.querySelectorAll('.story-item').forEach(item => {
            item.addEventListener('click', () => {
                const storyId = item.dataset.storyId;
                this.openStory(storyId);
            });
        });
    }

    openStory(storyId) {
        // Implementation for opening and displaying stories
        const modal = document.querySelector('.story-viewer-modal');
        modal.classList.add('active');
        
        // Story viewing logic here
    }
}

// Initialize Stories
document.addEventListener('DOMContentLoaded', function() {
    new InstagramStories();
});
