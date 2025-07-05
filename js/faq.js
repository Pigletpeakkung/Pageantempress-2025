// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    let faqData = [];
    let currentFilter = 'all';
    
    // Load FAQ data
    loadFAQData();
    
    // Initialize FAQ functionality
    function initializeFAQ() {
        setupToggleButtons();
        setupCategoryFilters();
        setupSearch();
        setupKeyboardNavigation();
    }
    
    // Load FAQ data from JSON
    async function loadFAQData() {
        try {
            const response = await fetch('/data/faq-data.json');
            const data = await response.json();
            faqData = data.categories;
            initializeFAQ();
        } catch (error) {
            console.error('Error loading FAQ data:', error);
            // Fallback to existing HTML content
            initializeFAQ();
        }
    }
    
    // Setup FAQ toggle buttons
    function setupToggleButtons() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            const icon = toggle.querySelector('i');
            
            question.addEventListener('click', function() {
                toggleFAQItem(item, answer, icon);
            });
            
            // Add keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQItem(item, answer, icon);
                }
            });
            
            // Make question focusable
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Toggle FAQ item
    function toggleFAQItem(item, answer, icon) {
        const isOpen = item.classList.contains('active');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-answer').style.maxHeight = null;
                activeItem.querySelector('.faq-toggle i').classList.remove('fa-minus');
                activeItem.querySelector('.faq-toggle i').classList.add('fa-plus');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current item
        if (isOpen) {
            // Close
            item.classList.remove('active');
            answer.style.maxHeight = null;
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        } else {
            // Open
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
            
            // Smooth scroll to item
            setTimeout(() => {
                item.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 300);
        }
    }
    
    // Setup category filters
    function setupCategoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                filterFAQs(category);
                updateActiveFilter(this);
            });
        });
    }
    
    // Filter FAQs by category
    function filterFAQs(category) {
        currentFilter = category;
        const faqCategories = document.querySelectorAll('.faq-category');
        
        faqCategories.forEach(categorySection => {
            const categoryId = categorySection.getAttribute('data-category');
            
            if (category === 'all' || categoryId === category) {
                categorySection.style.display = 'block';
                // Animate in
                categorySection.style.opacity = '0';
                categorySection.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    categorySection.style.transition = 'all 0.3s ease';
                    categorySection.style.opacity = '1';
                    categorySection.style.transform = 'translateY(0)';
                }, 50);
            } else {
                categorySection.style.display = 'none';
            }
        });
        
        // Close all open FAQ items when filtering
        closeAllFAQItems();
    }
    
    // Update active filter button
    function updateActiveFilter(activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    // Setup search functionality
    function setupSearch() {
        const searchInput = document.getElementById('faqSearch');
        const searchButton = document.querySelector('.search-box button');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
        }
    }
    
    // Handle search
    function handleSearch() {
        const searchTerm = document.getElementById('faqSearch').value.toLowerCase().trim();
        const faqItems = document.querySelectorAll('.faq-item');
        const faqCategories = document.querySelectorAll('.faq-category');
        
        if (searchTerm === '') {
            // Show all items if search is empty
            faqItems.forEach(item => {
                item.style.display = 'block';
                removeHighlight(item);
            });
            faqCategories.forEach(category => {
                category.style.display = 'block';
            });
            return;
        }
        
        let hasResults = false;
        
        faqCategories.forEach(category => {
            let categoryHasResults = false;
            const categoryItems = category.querySelectorAll('.faq-item');
            
            categoryItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    highlightSearchTerm(item, searchTerm);
                    categoryHasResults = true;
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                    removeHighlight(item);
                }
            });
                        // Show/hide category based on results
            if (categoryHasResults) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        handleNoResults(hasResults, searchTerm);
    }
    
    // Handle no search results
    function handleNoResults(hasResults, searchTerm) {
        let noResultsMessage = document.querySelector('.no-results-message');
        
        if (!hasResults) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message';
                noResultsMessage.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3>No results found</h3>
                        <p>We couldn't find any FAQs matching "<strong>${searchTerm}</strong>"</p>
                        <p>Try searching with different keywords or <a href="/contact">contact us</a> for personalized help.</p>
                        <button class="btn btn-secondary" onclick="clearSearch()">Clear Search</button>
                    </div>
                `;
                document.querySelector('.faq-grid').appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = 'block';
        } else {
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }
        }
    }
    
    // Clear search
    window.clearSearch = function() {
        const searchInput = document.getElementById('faqSearch');
        if (searchInput) {
            searchInput.value = '';
            handleSearch();
        }
    };
    
    // Highlight search terms
    function highlightSearchTerm(item, searchTerm) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer');
        
        // Remove existing highlights
        removeHighlight(item);
        
        // Highlight in question
        highlightText(question, searchTerm);
        
        // Highlight in answer
        highlightText(answer, searchTerm);
    }
    
    // Remove highlights
    function removeHighlight(item) {
        const highlightedElements = item.querySelectorAll('.highlight');
        highlightedElements.forEach(element => {
            element.outerHTML = element.innerHTML;
        });
    }
    
    // Highlight text helper
    function highlightText(element, searchTerm) {
        const originalText = element.innerHTML;
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
        element.innerHTML = highlightedText;
    }
    
    // Escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Close all FAQ items
    function closeAllFAQItems() {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.maxHeight = null;
            item.querySelector('.faq-toggle i').classList.remove('fa-minus');
            item.querySelector('.faq-toggle i').classList.add('fa-plus');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
    }
    
    // Setup keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('faqSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }
    
    // Debounce function for search
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
    
    // Global search function (called from HTML)
    window.searchFAQ = function() {
        handleSearch();
    };
    
    // URL hash handling for direct FAQ links
    function handleURLHash() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetItem = document.querySelector(`[data-faq-id="${hash}"]`);
            if (targetItem) {
                // Open the FAQ item
                const answer = targetItem.querySelector('.faq-answer');
                const icon = targetItem.querySelector('.faq-toggle i');
                
                setTimeout(() => {
                    toggleFAQItem(targetItem, answer, icon);
                    targetItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 500);
            }
        }
    }
    
    // Add FAQ IDs for deep linking
    function addFAQIds() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            const questionText = item.querySelector('.faq-question h3').textContent;
            const id = questionText.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            item.setAttribute('data-faq-id', id);
        });
    }
    
    // Analytics tracking
    function trackFAQInteraction(action, category, question) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'FAQ',
                event_label: `${category}: ${question}`,
                value: 1
            });
        }
    }
    
    // Enhanced toggle with analytics
    function toggleFAQItemWithAnalytics(item, answer, icon) {
        const question = item.querySelector('.faq-question h3').textContent;
        const category = item.closest('.faq-category').getAttribute('data-category');
        const isOpening = !item.classList.contains('active');
        
        toggleFAQItem(item, answer, icon);
        
        if (isOpening) {
            trackFAQInteraction('faq_opened', category, question);
        }
    }
    
    // Scroll to top functionality
    function addScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollButton);
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        });
    }
    
    // Print functionality
    function setupPrintFAQ() {
        const printButton = document.createElement('button');
        printButton.className = 'print-faq-btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print FAQ';
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        // Add print button to CTA section
        const ctaButtons = document.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.appendChild(printButton);
        }
    }
    
    // FAQ sharing functionality
    function setupFAQSharing() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const shareButton = document.createElement('button');
            shareButton.className = 'share-faq-btn';
            shareButton.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareButton.setAttribute('title', 'Share this FAQ');
            
            shareButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const question = item.querySelector('.faq-question h3').textContent;
                const faqId = item.getAttribute('data-faq-id');
                const url = `${window.location.origin}${window.location.pathname}#${faqId}`;
                
                if (navigator.share) {
                    navigator.share({
                        title: question,
                        text: `Check out this FAQ: ${question}`,
                        url: url
                    });
                } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        showToast('FAQ link copied to clipboard!');
                    });
                }
            });
            
            item.querySelector('.faq-question').appendChild(shareButton);
        });
    }
    
    // Toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // FAQ feedback system
    function setupFAQFeedback() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const answer = item.querySelector('.faq-answer');
            const feedbackHTML = `
                <div class="faq-feedback">
                    <p>Was this helpful?</p>
                    <div class="feedback-buttons">
                        <button class="feedback-btn feedback-yes" data-feedback="yes">
                            <i class="fas fa-thumbs-up"></i> Yes
                        </button>
                        <button class="feedback-btn feedback-no" data-feedback="no">
                            <i class="fas fa-thumbs-down"></i> No
                        </button>
                    </div>
                </div>
            `;
            
            answer.insertAdjacentHTML('beforeend', feedbackHTML);
            
            // Handle feedback clicks
            const feedbackButtons = item.querySelectorAll('.feedback-btn');
            feedbackButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const feedback = this.getAttribute('data-feedback');
                    const question = item.querySelector('.faq-question h3').textContent;
                    
                    // Track feedback
                    trackFAQInteraction('faq_feedback', feedback, question);
                    
                    // Show thank you message
                    const feedbackDiv = this.closest('.faq-feedback');
                    feedbackDiv.innerHTML = '<p class="feedback-thanks">Thanks for your feedback!</p>';
                    
                    // Send feedback to server (if needed)
                    sendFeedback(question, feedback);
                });
            });
        });
    }
    
    // Send feedback to server
    function sendFeedback(question, feedback) {
        // Implement server-side feedback tracking if needed
        console.log('FAQ Feedback:', { question, feedback });
    }
    
    // Initialize all functionality
    function initializeAllFeatures() {
        addFAQIds();
        handleURLHash();
        addScrollToTop();
        setupPrintFAQ();
        setupFAQSharing();
        setupFAQFeedback();
    }
    
    // Call initialization after DOM is ready
    setTimeout(initializeAllFeatures, 100);
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Recalculate heights for open FAQ items
        document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    }, 250));
    
    // Handle visibility change (for performance)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations if page is hidden
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations when page is visible
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.animationPlayState = 'running';
            });
        }
    });
});

// CSS for additional features (add to faq.css)
const additionalStyles = `
    .highlight {
        background-color: #ffd700;
        color: #000;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    .no-results-message {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }
    
    .no-results-message i {
        font-size: 4rem;
        color: var(--primary-gold);
        margin-bottom: 1rem;
    }
    
    .scroll-to-top {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-gold);
        color: var(--dark-bg);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(193, 53, 132, 0.3);
    }
    
    .scroll-to-top.show {
        opacity: 1;
        visibility: visible;
    }
    
    .scroll-to-top:hover {
        background: var(--accent-gold);
        transform: translateY(-2px);
    }
    
    .share-faq-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
        margin-left: 1rem;
    }
    
    .share-faq-btn:hover {
        color: var(--primary-gold);
        background: rgba(193, 53, 132, 0.1);
    }
    
    .faq-feedback {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--glass-border);
        text-align: center;
    }
    
    .feedback-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 0.5rem;
    }
    
    .feedback-btn {
        padding: 0.5rem 1rem;
        border: 1px solid var(--glass-border);
        background: var(--glass-bg);
        color: var(--text-secondary);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .feedback-btn:hover {
        border-color: var(--primary-gold);
        color: var(--primary-gold);
    }
    
    .feedback-thanks {
        color: var(--primary-gold);
        font-weight: 500;
        margin: 1rem 0;
    }
    
    .toast {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--primary-gold);
        color: var(--dark-bg);
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        z-index: 1001;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .print-faq-btn {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
        margin-left: 1rem;
    }
    
    .print-faq-btn:hover {
        background: var(--primary-gold);
        color: var(--dark-bg);
        border-color: var(--primary-gold);
    }
    
    @media print {
        .navbar, .footer, .scroll-to-top, .share-faq-btn, .faq-feedback, .print-faq-btn {
            display: none !important;
        }
        
        .faq-item {
            page-break-inside: avoid;
            border: 1px solid #ddd;
            margin-bottom: 1rem;
        }
        
        .faq-answer {
            max-height: none !important;
        }
        
        .faq-item.active .faq-answer {
            display: block;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
            
