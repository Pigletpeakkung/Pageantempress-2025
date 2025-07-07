/* ===== ABOUT.JS - ENHANCED ABOUT PAGE FUNCTIONALITY ===== */

// ===== ABOUT PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeAboutHero();
        initializeStorySection();
        initializeMissionCards();
        initializeTeamSection();
        initializeDashboardSection();
        initializeProcessTimeline();
        initializeTestimonialSlider();
        initializeAwardsSection();
        initializeAboutAnimations();
        initializeVideoBackground();
        initializeParticles();
        initializeAboutCounters();
        initializeChartAnimations();
        initializeActivityFeed();
        initializeRealTimeMetrics();
        initializeAdvancedFeatures();
        
        console.log('✨ About page initialized successfully!');
    } catch (error) {
        console.error('Error initializing About page:', error);
    }
});

// ===== ENHANCED HERO SECTION =====
function initializeAboutHero() {
    const heroContent = document.querySelector('.about-hero-content');
    const scrollIndicator = document.querySelector('.about-scroll-indicator');
    
    if (!heroContent) return;
    
    // Animate hero content on load with staggered animation
    setTimeout(() => {
        heroContent.classList.add('animated');
        
        // Animate child elements with delay
        const childElements = heroContent.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-cta');
        childElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('slide-in-up');
            }, index * 200);
        });
    }, 300);
    
    // Scroll indicator functionality
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.about-story, .story-section, .mission-section');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Animate scroll indicator
        scrollIndicator.classList.add('bounce-animation');
    }
    
    // Enhanced parallax effect with throttling
    let ticking = false;
    function updateParallax() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.parallax-bg');
                
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.speed) || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateParallax, { passive: true });
    
    // Mouse move parallax effect
    const hero = document.querySelector('.about-hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            const parallaxBg = hero.querySelector('.parallax-bg');
            if (parallaxBg) {
                parallaxBg.style.transform = `translateX(${xPercent * 20}px) translateY(${yPercent * 20}px)`;
            }
        });
    }
}

// ===== ENHANCED VIDEO BACKGROUND =====
function initializeVideoBackground() {
    const video = document.querySelector('.about-hero-video');
    if (!video) return;
    
    // Video loading and error handling
    video.addEventListener('loadstart', () => {
        video.classList.add('loading');
    });
    
    video.addEventListener('loadeddata', () => {
        video.classList.remove('loading');
        video.classList.add('loaded');
    });
    
    video.addEventListener('error', () => {
        console.warn('Video failed to load, falling back to static background');
        video.style.display = 'none';
        const fallbackBg = document.querySelector('.video-fallback');
        if (fallbackBg) {
            fallbackBg.style.display = 'block';
        }
    });
    
    // Ensure video plays with fallback
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Video autoplay failed:', error);
            // Add play button overlay
            createVideoPlayButton(video);
        });
    }
    
    // Optimize video performance with Intersection Observer
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(e => console.log('Video play failed:', e));
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });
    
    videoObserver.observe(video);
    
    // Video controls
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}

function createVideoPlayButton(video) {
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.setAttribute('aria-label', 'Play video');
    
    video.parentNode.insertBefore(playButton, video.nextSibling);
    
    playButton.addEventListener('click', () => {
        video.play().then(() => {
            playButton.style.display = 'none';
        }).catch(e => console.log('Manual video play failed:', e));
    });
}

// ===== ENHANCED PARTICLES SYSTEM =====
function initializeParticles() {
    const particlesContainer = document.querySelector('.about-hero-particles');
    if (!particlesContainer) return;
    
    const particleConfig = {
        count: window.innerWidth < 768 ? 30 : 50,
        colors: ['#D4AF37', '#FFD700', '#FFA500', '#FF6B35'],
        shapes: ['circle', 'star', 'triangle'],
        sizes: [1, 2, 3, 4],
        speeds: [10, 15, 20, 25]
    };
    
    for (let i = 0; i < particleConfig.count; i++) {
        createEnhancedParticle(particlesContainer, particleConfig);
    }
    
    // Resize handler
    window.addEventListener('resize', () => {
        const currentCount = particlesContainer.querySelectorAll('.particle').length;
        const newCount = window.innerWidth < 768 ? 30 : 50;
        
        if (newCount !== currentCount) {
            particlesContainer.innerHTML = '';
            for (let i = 0; i < newCount; i++) {
                createEnhancedParticle(particlesContainer, particleConfig);
            }
        }
    });
}

function createEnhancedParticle(container, config) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = config.sizes[Math.floor(Math.random() * config.sizes.length)];
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
    const speed = config.speeds[Math.floor(Math.random() * config.speeds.length)];
    const duration = speed + Math.random() * 10;
    const delay = Math.random() * 10;
    const startX = Math.random() * 100;
    const opacity = 0.3 + Math.random() * 0.7;
    
    // Apply styles
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + '%';
    particle.style.backgroundColor = color;
    particle.style.opacity = opacity;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    // Shape-specific styles
    if (shape === 'circle') {
        particle.style.borderRadius = '50%';
    } else if (shape === 'star') {
        particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    } else if (shape === 'triangle') {
        particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    }
    
    container.appendChild(particle);
    
    // Recreate particle when animation ends
    particle.addEventListener('animationend', () => {
        particle.remove();
        createEnhancedParticle(container, config);
    });
}

// ===== ENHANCED STORY SECTION =====
function initializeStorySection() {
    const storySection = document.querySelector('.about-story, .story-section');
    if (!storySection) return;
    
    const storyStats = document.querySelectorAll('.stat-number[data-count]');
    const storyCards = document.querySelectorAll('.story-card');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-number')) {
                    animateStatNumber(entry.target);
                } else if (entry.target.classList.contains('story-card')) {
                    entry.target.classList.add('animated');
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    storyStats.forEach(stat => statsObserver.observe(stat));
    storyCards.forEach(card => statsObserver.observe(card));
    
    // Floating cards animation with improved timing
    const floatingCards = document.querySelectorAll('.story-floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = (index * 2 + Math.random() * 2) + 's';
        card.style.animationDuration = (8 + Math.random() * 4) + 's';
    });
    
    // Interactive story timeline
    initializeStoryTimeline();
}

function initializeStoryTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    item.classList.add('active');
                    
                    // Animate timeline line
                    const line = item.querySelector('.timeline-line');
                    if (line) {
                        line.style.transform = 'scaleY(1)';
                    }
                }, index * 200);
                observer.unobserve(item);
            }
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
}

function animateStatNumber(element) {
    const target = parseInt(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = parseInt(element.dataset.duration) || 2000;
    const useEasing = element.dataset.easing !== 'false';
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing if enabled
        const easedProgress = useEasing ? easeOutCubic(progress) : progress;
        const current = Math.floor(target * easedProgress);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Add completion effect
            element.classList.add('stat-complete');
            element.style.animation = 'statPulse 0.5s ease-out';
        }
    }
    
    requestAnimationFrame(update);
}

// ===== ENHANCED MISSION CARDS =====
function initializeMissionCards() {
    const cards = document.querySelectorAll('.mission-card');
    if (!cards.length) return;
    
    cards.forEach((card, index) => {
        // Staggered animation on scroll
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    card.classList.add('animated');
                    
                    // Animate card content
                    const content = card.querySelectorAll('.mission-icon, .mission-title, .mission-description');
                    content.forEach((element, contentIndex) => {
                        setTimeout(() => {
                            element.classList.add('slide-in-up');
                        }, contentIndex * 100);
                    });
                }, index * 150);
                observer.unobserve(card);
            }
        }, { threshold: 0.3 });
        
        observer.observe(card);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
            
            // Add glow effect
            card.classList.add('glowing');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('glowing');
        });
        
        // Click interaction
        card.addEventListener('click', () => {
            const title = card.querySelector('.mission-title')?.textContent;
            const description = card.querySelector('.mission-description')?.textContent;
            const icon = card.querySelector('.mission-icon')?.innerHTML;
            
            if (title && description) {
                showMissionDetail({ title, description, icon });
            }
        });
    });
}

function showMissionDetail(data) {
    const modal = document.createElement('div');
    modal.className = 'mission-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-header">
                <div class="modal-icon">${data.icon}</div>
                <h2>${data.title}</h2>
            </div>
            <div class="modal-body">
                <p>${data.description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ===== ENHANCED TEAM SECTION =====
function initializeTeamSection() {
    const teamMembers = document.querySelectorAll('.team-member');
    if (!teamMembers.length) return;
    
    teamMembers.forEach((member, index) => {
        // Staggered entrance animation
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    member.classList.add('animated');
                }, index * 100);
                observer.unobserve(member);
            }
        }, { threshold: 0.3 });
        
        observer.observe(member);
        
        // Enhanced 3D tilt effect
        member.addEventListener('mousemove', (e) => {
            const rect = member.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            member.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Click to view detailed profile
        member.addEventListener('click', () => {
            const memberData = extractMemberData(member);
            if (memberData) {
                showTeamMemberModal(memberData);
            }
        });
        
        // Keyboard support
        member.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                member.click();
            }
        });
    });
}

function extractMemberData(memberElement) {
    const name = memberElement.querySelector('.team-member-name, .member-name, .name')?.textContent;
    const role = memberElement.querySelector('.team-member-role, .member-role, .role')?.textContent;
    const bio = memberElement.querySelector('.team-member-bio, .member-bio, .bio')?.textContent;
    const image = memberElement.querySelector('img')?.src;
    const email = memberElement.dataset.email || '';
    const linkedin = memberElement.dataset.linkedin || '';
    const twitter = memberElement.dataset.twitter || '';
    
    if (!name || !role) return null;
    
    return {
        name,
        role,
        bio: bio || 'No bio available.',
        image: image || '/images/default-avatar.jpg',
        email,
        linkedin,
        twitter
    };
}

function showTeamMemberModal(memberData) {
    const modal = document.createElement('div');
    modal.className = 'team-member-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="member-profile">
                <div class="member-avatar">
                    <img src="${memberData.image}" alt="${memberData.name}" loading="lazy">
                </div>
                <div class="member-info">
                    <h2>${memberData.name}</h2>
                    <p class="member-role">${memberData.role}</p>
                    <p class="member-bio">${memberData.bio}</p>
                    <div class="member-social">
                        ${memberData.email ? `<a href="mailto:${memberData.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                        ${memberData.linkedin ? `<a href="${memberData.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${memberData.twitter ? `<a href="${memberData.twitter}" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ===== ENHANCED DASHBOARD SECTION =====
function initializeDashboardSection() {
    const dashboardSection = document.querySelector('.dashboard-section');
    if (!dashboardSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startDashboardAnimations();
            observer.unobserve(dashboardSection);
        }
    }, { threshold: 0.3 });
    
    observer.observe(dashboardSection);
    
    // Initialize dashboard controls
    initializeDashboardControls();
}

function initializeDashboardControls() {
    // Filter controls
    const filterBtns = document.querySelectorAll('.dashboard-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterDashboardData(filter);
        });
    });
    
    // Period controls
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const period = btn.dataset.period;
            updateDashboardPeriod(period);
        });
    });
    
    // Refresh button
    const refreshBtn = document.querySelector('.dashboard-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshDashboard();
        });
    }
}

function filterDashboardData(filter) {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach(card => {
        const cardType = card.dataset.type;
        
        if (filter === 'all' || cardType === filter) {
            card.style.display = '';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

function updateDashboardPeriod(period) {
    showNotification(`Dashboard updated to ${period} view`, 'info');
    
    // Update all metrics
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        metric.classList.add('updating');
        
        setTimeout(() => {
            // Simulate new data
            const currentValue = parseInt(metric.textContent.replace(/\D/g, ''));
            const change = Math.floor(Math.random() * 100) - 50;
            const newValue = Math.max(0, currentValue + change);
            
            metric.textContent = newValue.toLocaleString();
            metric.classList.remove('updating');
            metric.classList.add('updated');
        }, 500);
    });
}

function refreshDashboard() {
    const dashboard = document.querySelector('.dashboard-section');
    if (!dashboard) return;
    
    dashboard.classList.add('refreshing');
    
    setTimeout(() => {
        dashboard.classList.remove('refreshing');
        startDashboardAnimations();
        showNotification('Dashboard refreshed successfully', 'success');
    }, 1000);
}

function startDashboardAnimations() {
    animateMetricCards();
    animateCharts();
    startActivityFeed();
}

// ===== ENHANCED METRIC CARDS ANIMATION =====
function animateMetricCards() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated');
            
            const value = card.querySelector('.metric-value');
            if (value && value.dataset.target) {
                animateMetricValue(value);
            }
            
            const sparkline = card.querySelector('.metric-sparkline');
            if (sparkline) {
                createSparkline(sparkline);
            }
        }, index * 100);
    });
}

function animateMetricValue(element) {
    const target = parseInt(element.dataset.target);
    const format = element.dataset.format || 'number';
    const duration = parseInt(element.dataset.duration) || 2000;
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * easeOutCubic(progress));
        
        element.textContent = formatMetricValue(current, format);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.classList.add('complete');
        }
    }
    
    requestAnimationFrame(update);
}

function formatMetricValue(value, format) {
    switch (format) {
        case 'currency':
            return '$' + value.toLocaleString();
        case 'percentage':
            return value + '%';
        case 'k':
            return (value / 1000).toFixed(1) + 'K';
        case 'm':
            return (value / 1000000).toFixed(1) + 'M';
        default:
            return value.toLocaleString();
    }
}

function createSparkline(container) {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const points = 12;
    
    // Clear existing content
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Generate data points
    const values = [];
    for (let i = 0; i < points; i++) {
        const trend = Math.sin(i * 0.5) * 0.3 + 0.5;
        const noise = (Math.random() - 0.5) * 0.3;
        values.push(Math.max(0.1, Math.min(0.9, trend + noise)));
    }
    
    // Create path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const xStep = width / (points - 1);
    
    let d = `M 0 ${height - values[0] * height}`;
    for (let i = 1; i < points; i++) {
        const x = i * xStep;
        const y = height - values[i] * height;
        d += ` L ${x} ${y}`;
    }
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'var(--primary-gold)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    container.appendChild(svg);
    
    // Animate path
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 1.5s ease-out';
        path.style.strokeDashoffset = '0';
    }, 200);
}

// ===== ENHANCED CHARTS ANIMATION =====
function animateCharts() {
    const charts = document.querySelectorAll('.chart-container');
    
    charts.forEach((chart, index) => {
        setTimeout(() => {
            const chartType = chart.dataset.type;
            
            switch (chartType) {
                case 'bar':
                    animateBarChart(chart);
                    break;
                case 'pie':
                    animatePieChart(chart);
                    break;
                case 'line':
                    animateLineChart(chart);
                    break;
                case 'doughnut':
                    animateDoughnutChart(chart);
                    break;
                default:
                    chart.classList.add('animated');
            }
        }, index * 300);
    });
}

function animateBarChart(container) {
    const bars = container.querySelectorAll('.bar');
    
    bars.forEach((bar, index) => {
        const value = parseInt(bar.dataset.value);
        const maxHeight = parseInt(bar.dataset.max) || 100;
        const height = (value / maxHeight) * 100;
        
        setTimeout(() => {
            bar.style.height = height + '%';
            bar.classList.add('animated');
            
            // Show value label
            const label = bar.querySelector('.bar-label');
            if (label) {
                setTimeout(() => {
                    label.style.opacity = '1';
                    label.style.transform = 'translateY(0)';
                }, 200);
            }
        }, index * 100);
    });
}

function animatePieChart(container) {
    const segments = container.querySelectorAll('.pie-segment');
    const total = Array.from(segments).reduce((sum, segment) => sum + parseInt(segment.dataset.value), 0);
    
    let currentOffset = 0;
    
    segments.forEach((segment, index) => {
        const value = parseInt(segment.dataset.value);
        const percentage = (value / total) * 100;
        const circumference = 2 * Math.PI * 40; // radius = 40
        const strokeDasharray = (percentage / 100) * circumference;
        const strokeDashoffset = circumference - strokeDasharray;
        
        setTimeout(() => {
            segment.style.strokeDasharray = `${strokeDasharray} ${circumference}`;
            segment.style.strokeDashoffset = -currentOffset;
            segment.style.transform = `rotate(${(currentOffset / circumference) * 360}deg)`;
            
            currentOffset += strokeDasharray;
        }, index * 200);
    });
}

function animateLineChart(container) {
    const lines = container.querySelectorAll('.line-path');
    
    lines.forEach((line, index) => {
        const length = line.getTotalLength();
        
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;
        
        setTimeout(() => {
            line.style.transition = 'stroke-dashoffset 2s ease-out';
            line.style.strokeDashoffset = '0';
        }, index * 300);
    });
}

// ===== ENHANCED ACTIVITY FEED =====
function startActivityFeed() {
    const activityFeed = document.querySelector('.activity-feed');
    if (!activityFeed) return;
    
    // Sample activities
    const activities = [
        { icon: 'fa-chart-line', user: 'Analytics System', action: 'Updated comprehensive dashboard metrics', time: '2 min ago', type: 'system', priority: 'high' },
        { icon: 'fa-user-plus', user: 'HR Department', action: 'New senior team member joined the organization', time: '15 min ago', type: 'hr', priority: 'medium' },
        { icon: 'fa-trophy', user: 'Achievement', action: 'Reached 10,000 satisfied customers milestone', time: '1 hour ago', type: 'achievement', priority: 'high' },
        { icon: 'fa-code-branch', user: 'Development Team', action: 'Successfully deployed new platform features', time: '2 hours ago', type: 'dev', priority: 'medium' },
        { icon: 'fa-handshake', user: 'Sales Team', action: 'Closed major partnership deal worth $500K', time: '3 hours ago', type: 'sales', priority: 'high' }
    ];
    
    // Clear existing content
    activityFeed.innerHTML = '';
    
    // Render activities with staggered animation
    activities.forEach((activity, index) => {
        setTimeout(() => {
            const item = createActivityItem(activity);
            activityFeed.appendChild(item);
        }, index * 150);
    });
    
    // Start real-time updates
    setInterval(() => {
        addNewActivity(activityFeed);
    }, 10000 + Math.random() * 10000);
}

function createActivityItem(data) {
    const item = document.createElement('div');
    item.className = `activity-item ${data.type} priority-${data.priority}`;
    
    item.innerHTML = `
        <div class="activity-timeline">
            <div class="activity-dot"></div>
            <div class="activity-line"></div>
        </div>
        <div class="activity-content">
            <div class="activity-header">
                <div class="activity-icon ${data.type}">
                    <i class="fas ${data.icon}"></i>
                </div>
                <div class="activity-meta">
                    <span class="activity-user">${data.user}</span>
                    <span class="activity-time">${data.time}</span>
                </div>
            </div>
            <p class="activity-description">${data.action}</p>
        </div>
    `;
    
    return item;
}

function addNewActivity(feed) {
    const newActivities = [
        { icon: 'fa-bell', user: 'System Alert', action: 'Automated backup completed successfully', time: 'just now', type: 'system', priority: 'low' },
        { icon: 'fa-star', user: 'Customer Review', action: 'Received outstanding 5-star service rating', time: 'just now', type: 'review', priority: 'medium' },
        { icon: 'fa-shopping-cart', user: 'E-commerce', action: 'High-value order received from premium client', time: 'just now', type: 'sales', priority: 'high' },
        { icon: 'fa-shield-alt', user: 'Security', action: 'Security scan completed - all systems secure', time: 'just now', type: 'security', priority: 'medium' }
    ];
    
    const activity = newActivities[Math.floor(Math.random() * newActivities.length)];
    const item = createActivityItem(activity);
    
    item.style.opacity = '0';
    item.style.transform = 'translateY(-20px)';
    feed.insertBefore(item, feed.firstChild);
    
    // Animate entry
    setTimeout(() => {
        item.style.transition = 'all 0.3s ease-out';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.classList.add('new-activity');
    }, 10);
    
    // Remove old activities
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 8) {
        const lastItem = items[items.length - 1];
        lastItem.style.opacity = '0';
        lastItem.style.transform = 'translateY(20px)';
        setTimeout(() => lastItem.remove(), 300);
    }
}

// ===== ENHANCED REAL-TIME METRICS =====
function initializeRealTimeMetrics() {
    const realtimeCards = document.querySelectorAll('.realtime-card');
    
    realtimeCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated');
            
            const number = card.querySelector('.realtime-number');
            if (number) {
                const target = parseInt(number.dataset.target);
                animateNumber(number, 0, target, 2000);
                
                // Start periodic updates
                setInterval(() => {
                    updateRealtimeMetric(card);
                }, 3000 + Math.random() * 4000);
            }
        }, index * 200);
    });
}

function updateRealtimeMetric(card) {
    const number = card.querySelector('.realtime-number');
    const trend = card.querySelector('.realtime-trend');
    
    if (!number) return;
    
    const current = parseInt(number.textContent.replace(/\D/g, ''));
    const changePercent = (Math.random() - 0.5) * 0.1; // ±5% change
    const change = Math.floor(current * changePercent);
    const newValue = Math.max(0, current + change);
    
    // Animate number change
    animateNumber(number, current, newValue, 800);
    
    // Update trend indicator
    if (trend) {
        updateTrendIndicator(trend, change);
    }
    
    // Add pulse effect
    card.classList.add('updated');
    setTimeout(() => card.classList.remove('updated'), 1000);
}

function animateNumber(element, from, to, duration) {
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = from + (to - from) * easeOutCubic(progress);
        
        let displayValue = Math.floor(current);
        
        // Format based on value size
        if (displayValue >= 1000000) {
            displayValue = (displayValue / 1000000).toFixed(1) + 'M';
        } else if (displayValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(1) + 'K';
        } else {
            displayValue = displayValue.toLocaleString();
        }
        
        element.innerHTML = `${prefix}${displayValue}${suffix}`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.classList.add('number-complete');
        }
    }
    
    requestAnimationFrame(update);
}

function updateTrendIndicator(trendElement, change) {
    const changePercent = ((change / parseInt(trendElement.closest('.realtime-card').querySelector('.realtime-number').textContent.replace(/\D/g, ''))) * 100).toFixed(1);
    
    trendElement.classList.remove('positive', 'negative', 'neutral');
    
    if (change > 0) {
        trendElement.classList.add('positive');
        trendElement.innerHTML = `<i class="fas fa-arrow-up"></i> +${Math.abs(changePercent)}%`;
    } else if (change < 0) {
        trendElement.classList.add('negative');
        trendElement.innerHTML = `<i class="fas fa-arrow-down"></i> -${Math.abs(changePercent)}%`;
    } else {
        trendElement.classList.add('neutral');
        trendElement.innerHTML = `<i class="fas fa-minus"></i> 0%`;
    }
    
    // Add animation effect
    trendElement.style.animation = 'trendUpdate 0.5s ease-out';
    setTimeout(() => {
        trendElement.style.animation = '';
    }, 500);
}

// ===== ENHANCED PROCESS TIMELINE =====
function initializeProcessTimeline() {
    const processItems = document.querySelectorAll('.process-item');
    const processLine = document.querySelector('.process-line');
    
    if (!processItems.length) return;
    
    // Animate process line
    if (processLine) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                processLine.style.transform = 'scaleY(1)';
                observer.unobserve(processLine);
            }
        }, { threshold: 0.1 });
        
        observer.observe(processLine);
    }
    
    // Animate process items
    processItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    item.classList.add('animated');
                    
                    // Animate content elements
                    const elements = item.querySelectorAll('.process-icon, .process-title, .process-description');
                    elements.forEach((element, elementIndex) => {
                        setTimeout(() => {
                            element.classList.add('slide-in');
                        }, elementIndex * 100);
                    });
                }, index * 200);
                observer.unobserve(item);
            }
        }, { threshold: 0.5 });
        
        observer.observe(item);
        
        // Add interactive effects
        const iconWrapper = item.querySelector('.process-icon-wrapper');
        if (iconWrapper) {
            iconWrapper.addEventListener('click', () => {
                const processData = extractProcessData(item);
                if (processData) {
                    showProcessDetail(processData);
                }
            });
            
            // Add hover effects
            iconWrapper.addEventListener('mouseenter', () => {
                item.classList.add('process-hover');
            });
            
            iconWrapper.addEventListener('mouseleave', () => {
                item.classList.remove('process-hover');
            });
        }
    });
}

function extractProcessData(processItem) {
    const title = processItem.querySelector('.process-title')?.textContent;
    const description = processItem.querySelector('.process-description')?.textContent;
    const icon = processItem.querySelector('.process-icon')?.innerHTML;
    const details = processItem.dataset.details || '';
    const step = processItem.dataset.step || '';
    
    return { title, description, icon, details, step };
}

function showProcessDetail(data) {
    const modal = document.createElement('div');
    modal.className = 'process-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <div class="process-modal-icon">${data.icon}</div>
                <h3>${data.title}</h3>
                ${data.step ? `<span class="process-step">Step ${data.step}</span>` : ''}
            </div>
            <div class="modal-body">
                <p class="process-description">${data.description}</p>
                ${data.details ? `<div class="process-details">${data.details}</div>` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary process-modal-close">Got it</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.process-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// ===== ENHANCED TESTIMONIAL SLIDER =====
function initializeTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.testimonial-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let isTransitioning = false;
    
    // Initialize slider
    function initSlider() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
        });
        
        goToSlide(0);
        startAutoPlay();
    }
    
    function goToSlide(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        
        // Update track position
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
        
        // Animate slide content
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
            if (i === currentIndex) {
                setTimeout(() => {
                    animateTestimonialContent(slide);
                }, 300);
            }
        });
        
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    function animateTestimonialContent(slide) {
        const elements = slide.querySelectorAll('.testimonial-quote, .testimonial-author, .testimonial-avatar, .testimonial-rating');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    function nextSlide() {
        if (currentIndex < slides.length - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(slides.length - 1);
        }
    }
    
    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, 6000);
        }
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            isAutoPlaying = false;
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
        });
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    // Touch events
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
        
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 10) {
            track.style.transform = `translateX(-${currentIndex * 100}%) translateX(${-diff}px)`;
        }
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (diff > threshold) {
            nextSlide();
        } else if (diff < -threshold) {
            prevSlide();
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        isDragging = false;
        
        if (isAutoPlaying) {
            setTimeout(startAutoPlay, 3000);
        }
    });
    
    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        isDragging = true;
        slider.style.cursor = 'grabbing';
        stopAutoPlay();
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        touchEndX = e.clientX;
        
        const diff = touchStartX - touchEndX;
        track.style.transform = `translateX(-${currentIndex * 100}%) translateX(${-diff}px)`;
    });
    
    slider.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (diff > threshold) {
            nextSlide();
        } else if (diff < -threshold) {
            prevSlide();
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        isDragging = false;
        slider.style.cursor = 'grab';
        
        if (isAutoPlaying) {
            setTimeout(startAutoPlay, 3000);
        }
    });
    
    slider.addEventListener('mouseleave', () => {
        if (isDragging) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            isDragging = false;
            slider.style.cursor = 'grab';
        }
        
        if (isAutoPlaying) {
            setTimeout(startAutoPlay, 1000);
        }
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!slider.matches(':hover')) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
        }
    });
    
    // Initialize
    initSlider();
}

// ===== ENHANCED AWARDS SECTION =====
function initializeAwardsSection() {
    const awards = document.querySelectorAll('.award-item');
    const awardGrid = document.querySelector('.awards-grid');
    
    if (!awards.length) return;
    
    // Staggered animation observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // Animate award elements
                    const elements = entry.target.querySelectorAll('.award-icon, .award-title, .award-description, .award-year');
                    elements.forEach((element, elementIndex) => {
                        setTimeout(() => {
                            element.classList.add('slide-in');
                        }, elementIndex * 100);
                    });
                    
                    // Add special effects
                    const icon = entry.target.querySelector('.award-icon');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.animation = 'awardBounce 0.8s ease-out';
                        }, 300);
                    }
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    awards.forEach(award => {
        observer.observe(award);
        
        // Enhanced hover effects
        award.addEventListener('mouseenter', () => {
            award.classList.add('award-hover');
            
            // Shine effect
            const shine = award.querySelector('.award-shine');
            if (shine) {
                shine.style.animation = 'awardShine 1.2s ease-out';
            }
            
            // Icon animation
            const icon = award.querySelector('.award-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        award.addEventListener('mouseleave', () => {
            award.classList.remove('award-hover');
            
            const icon = award.querySelector('.award-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click to view award details
        award.addEventListener('click', () => {
            const awardData = extractAwardData(award);
            if (awardData) {
                showAwardDetail(awardData);
            }
        });
    });
    
    // Award filter functionality
    initializeAwardFilters();
}

function extractAwardData(awardElement) {
    const title = awardElement.querySelector('.award-title')?.textContent;
    const description = awardElement.querySelector('.award-description')?.textContent;
    const year = awardElement.querySelector('.award-year')?.textContent;
    const icon = awardElement.querySelector('.award-icon')?.innerHTML;
    const category = awardElement.dataset.category || '';
    const details = awardElement.dataset.details || '';
    
    return { title, description, year, icon, category, details };
}

function showAwardDetail(data) {
    const modal = document.createElement('div');
    modal.className = 'award-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="award-modal-header">
                <div class="award-modal-icon">${data.icon}</div>
                <div class="award-modal-info">
                    <h3>${data.title}</h3>
                    <p class="award-modal-year">${data.year}</p>
                    ${data.category ? `<span class="award-category">${data.category}</span>` : ''}
                </div>
            </div>
            <div class="award-modal-body">
                <p class="award-modal-description">${data.description}</p>
                ${data.details ? `<div class="award-details">${data.details}</div>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function initializeAwardFilters() {
    const filterButtons = document.querySelectorAll('.award-filter-btn');
    const awards = document.querySelectorAll('.award-item');
    
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter awards
            awards.forEach(award => {
                const category = award.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    award.style.display = '';
                    award.classList.add('filter-show');
                } else {
                    award.style.display = 'none';
                    award.classList.remove('filter-show');
                }
            });
        });
    });
}

// ===== ENHANCED ABOUT ANIMATIONS =====
function initializeAboutAnimations() {
    // Scroll-triggered animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animate;
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    element.classList.add(animation);
                    element.classList.add('animated');
                    
                    // Trigger custom animation events
                    element.dispatchEvent(new CustomEvent('animationTriggered', {
                        detail: { animation, element }
                    }));
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    // Initialize other animation effects
    initializeParallaxEffects();
    initializeMouseMoveEffects();
    initializeScrollEffects();
}

// ===== ENHANCED PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (!parallaxElements.length) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = parseFloat(element.dataset.parallaxOffset) || 0;
            const direction = element.dataset.parallaxDirection || 'vertical';
            
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                const movement = (progress - 0.5) * speed * 100;
                
                if (direction === 'horizontal') {
                    element.style.transform = `translateX(${movement + offset}px)`;
                } else {
                    element.style.transform = `translateY(${movement + offset}px)`;
                }
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    
    // Initial call
    updateParallax();
}

// ===== ENHANCED MOUSE MOVE EFFECTS =====
function initializeMouseMoveEffects() {
    const mouseElements = document.querySelectorAll('[data-mouse-move]');
    
    if (!mouseElements.length) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(updateMouseEffects);
        }
    });
    
    function updateMouseEffects() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        mouseElements.forEach(element => {
            const speed = parseFloat(element.dataset.mouseMove) || 1;
            const reverse = element.dataset.mouseReverse === 'true';
            const rect = element.getBoundingClientRect();
            
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (mouseX - centerX) / windowWidth;
            const percentY = (mouseY - centerY) / windowHeight;
            
            const moveX = percentX * speed * (reverse ? -30 : 30);
            const moveY = percentY * speed * (reverse ? -30 : 30);
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        isMoving = false;
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const scrollElements = document.querySelectorAll('[data-scroll-effect]');
    
    if (!scrollElements.length) return;
    
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        scrollElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const effect = element.dataset.scrollEffect;
            const speed = parseFloat(element.dataset.scrollSpeed) || 1;
            
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                
                switch (effect) {
                    case 'fade':
                        element.style.opacity = Math.max(0, Math.min(1, progress * 2));
                        break;
                    case 'scale':
                        const scale = 0.8 + (progress * 0.2);
                        element.style.transform = `scale(${scale})`;
                        break;
                    case 'rotate':
                        const rotation = progress * 360 * speed;
                        element.style.transform = `rotate(${rotation}deg)`;
                        break;
                    case 'slide-left':
                        const slideX = (1 - progress) * 100 * speed;
                        element.style.transform = `translateX(-${slideX}px)`;
                        break;
                    case 'slide-right':
                        const slideXRight = (1 - progress) * 100 * speed;
                        element.style.transform = `translateX(${slideXRight}px)`;
                        break;
                }
            }
        });
        
        ticking = false;
    }
    
    function requestScrollTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollTick, { passive: true });
    updateScrollEffects();
}

// ===== ENHANCED ABOUT COUNTERS =====
function initializeAboutCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    if (!counters.length) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAboutCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function startAboutCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = parseInt(element.dataset.duration) || 2000;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const decimals = parseInt(element.dataset.decimals) || 0;
    const useEasing = element.dataset.easing !== 'false';
    
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = useEasing ? easeOutCubic(progress) : progress;
        const current = target * easedProgress;
        
        let displayValue = current.toFixed(decimals);
        if (decimals === 0) {
            displayValue = Math.floor(current).toLocaleString();
        }
        
        element.textContent = prefix + displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Add completion effect
            element.classList.add('counter-complete');
            element.style.animation = 'counterPulse 0.6s ease-out';
            
            // Trigger completion event
            element.dispatchEvent(new CustomEvent('counterComplete', {
                detail: { value: target, element }
            }));
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ===== CHART ANIMATIONS =====
function initializeChartAnimations() {
    // Enhanced filter functionality
    const filterBtns = document.querySelectorAll('.chart-filter-btn, .filter-pill');
    const chartContainers = document.querySelectorAll('.chart-container');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterGroup = btn.closest('.filter-group');
            const siblings = filterGroup ? filterGroup.querySelectorAll('.chart-filter-btn, .filter-pill') : filterBtns;
            
            // Update active state
            siblings.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter || btn.textContent.toLowerCase();
            filterChartData(filter);
        });
    });
    
    // Chart period toggles
    const chartOptions = document.querySelectorAll('.chart-option');
    chartOptions.forEach(option => {
        option.addEventListener('click', function() {
            const container = this.closest('.chart-card, .dashboard-card');
            const siblings = container.querySelectorAll('.chart-option');
            
            siblings.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.dataset.period || this.textContent.toLowerCase();
            updateChartPeriod(container, period);
        });
    });
    
    // Chart refresh functionality
    const refreshBtns = document.querySelectorAll('.chart-refresh');
    refreshBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.chart-card, .dashboard-card');
            refreshChart(container);
        });
    });
}

function filterChartData(filter) {
    const items = document.querySelectorAll('.activity-item, .chart-item');
    
    items.forEach(item => {
        const itemType = item.dataset.type;
        const shouldShow = filter === 'all' || itemType === filter;
        
        if (shouldShow) {
            item.style.display = '';
            item.classList.add('filter-show');
        } else {
            item.style.display = 'none';
            item.classList.remove('filter-show');
        }
    });
    
    // Update chart displays
    updateChartDisplays(filter);
}

function updateChartPeriod(container, period) {
    if (!container) return;
    
    container.classList.add('updating');
    
    setTimeout(() => {
        container.classList.remove('updating');
        
        // Re-trigger chart animations
        const chartType = container.dataset.type;
        if (chartType) {
            animateChartByType(container, chartType);
        }
        
        showNotification(`Chart updated to ${period} period`, 'success');
    }, 800);
}

function refreshChart(container) {
    if (!container) return;
    
    container.classList.add('refreshing');
    
    setTimeout(() => {
        container.classList.remove('refreshing');
        
        // Re-trigger animations
        const chartType = container.dataset.type;
        if (chartType) {
            animateChartByType(container, chartType);
        }
        
        showNotification('Chart refreshed successfully', 'success');
    }, 1000);
}

function animateChartByType(container, type) {
    switch (type) {
        case 'bar':
            animateBarChart(container);
            break;
        case 'pie':
            animatePieChart(container);
            break;
        case 'line':
            animateLineChart(container);
            break;
        case 'doughnut':
            animateDoughnutChart(container);
            break;
        default:
            container.classList.add('animated');
    }
}

function updateChartDisplays(filter) {
    const charts = document.querySelectorAll('.chart-container');
    
    charts.forEach(chart => {
        const chartFilter = chart.dataset.filter;
        
        if (filter === 'all' || chartFilter === filter) {
            chart.style.display = '';
            chart.classList.add('chart-visible');
            
            // Re-animate chart when it becomes visible
            setTimeout(() => {
                const chartType = chart.dataset.type;
                if (chartType) {
                    animateChartByType(chart, chartType);
                }
            }, 100);
        } else {
            chart.style.display = 'none';
            chart.classList.remove('chart-visible');
        }
    });
}

// ===== ADVANCED FEATURES =====
function initializeAdvancedFeatures() {
    initializeKeyboardNavigation();
    initializeAccessibilityFeatures();
    initializePerformanceOptimizations();
    initializeLocalStorage();
    initializeNotificationSystem();
    initializeSearchFunctionality();
    initializeImageLazyLoading();
}

// ===== KEYBOARD NAVIGATION =====
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                scrollToSection('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                scrollToSection('down');
                break;
            case 'Home':
                e.preventDefault();
                scrollToTop();
                break;
            case 'End':
                e.preventDefault();
                scrollToBottom();
                break;
            case 'Escape':
                closeAllModals();
                break;
        }
    });
}

function scrollToSection(direction) {
    const sections = document.querySelectorAll('section, .section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    let targetIndex;
    if (direction === 'up') {
        targetIndex = Math.max(0, currentIndex - 1);
    } else {
        targetIndex = Math.min(sections.length - 1, currentIndex + 1);
    }
    
    if (sections[targetIndex]) {
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section, .section');
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    
    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            return section;
        }
    }
    
    return sections[0];
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal, .modal-overlay');
    modals.forEach(modal => {
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// ===== ACCESSIBILITY FEATURES =====
function initializeAccessibilityFeatures() {
    // Add ARIA labels and roles
    addAriaLabels();
    
    // Initialize skip links
    initializeSkipLinks();
    
    // Add focus management
    initializeFocusManagement();
    
    // Add screen reader announcements
    initializeScreenReaderAnnouncements();
}

function addAriaLabels() {
    // Add aria-labels to interactive elements without text
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            const context = element.closest('[data-section]')?.dataset.section || 'page';
            element.setAttribute('aria-label', `${role} in ${context}`);
        }
    });
    
    // Add aria-describedby for form elements
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        const helpText = element.parentElement.querySelector('.help-text, .error-text');
        if (helpText && !helpText.id) {
            const id = 'help-' + Math.random().toString(36).substr(2, 9);
            helpText.id = id;
            element.setAttribute('aria-describedby', id);
        }
    });
}

function initializeSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-gold);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
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

function initializeFocusManagement() {
    let lastFocusedElement = null;
    
    // Save focus when modal opens
    document.addEventListener('focusin', (e) => {
        if (!e.target.closest('.modal')) {
            lastFocusedElement = e.target;
        }
    });
    
    // Restore focus when modal closes
    document.addEventListener('modalClosed', () => {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    });
    
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.active');
            if (modal) {
                trapFocus(e, modal);
            }
        }
    });
}

function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

function initializeScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Announce page changes
    window.announceToScreenReader = (message) => {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Throttle scroll events
    const throttledScrollHandler = throttle(() => {
        updateScrollProgress();
        updateActiveSection();
    }, 16); // 60fps
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Debounce resize events
    const debouncedResizeHandler = debounce(() => {
        updateLayoutOnResize();
    }, 250);
    
    window.addEventListener('resize', debouncedResizeHandler);
    
    // Optimize animations
    initializeAnimationOptimizations();
}

function updateScrollProgress() {
    const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
}

function updateActiveSection() {
    const currentSection = getCurrentSection();
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            link.classList.toggle('active', targetSection === currentSection);
        }
    });
}

function updateLayoutOnResize() {
    // Recalculate particle systems
    const particlesContainer = document.querySelector('.about-hero-particles');
    if (particlesContainer) {
        initializeParticles();
    }
    
    // Update chart dimensions
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
        const chartType = chart.dataset.type;
        if (chartType) {
            setTimeout(() => {
                animateChartByType(chart, chartType);
            }, 100);
        }
    });
}

function initializeAnimationOptimizations() {
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
        const animations = document.querySelectorAll('[style*="animation"]');
        
        if (document.hidden) {
            animations.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animations.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
    
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
        document.documentElement.style.setProperty('--transition-duration', '0.01s');
    }
}

// ===== LOCAL STORAGE =====
function initializeLocalStorage() {
    // Save user preferences
    const preferences = {
        theme: 'luxury',
        animationsEnabled: true,
        autoplay: true,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // Load saved preferences
    const savedPreferences = localStorage.getItem('aboutPagePreferences');
    if (savedPreferences) {
        Object.assign(preferences, JSON.parse(savedPreferences));
    }
    
    // Apply preferences
    applyPreferences(preferences);
    
    // Save preferences when they change
    window.savePreferences = (newPreferences) => {
        Object.assign(preferences, newPreferences);
        localStorage.setItem('aboutPagePreferences', JSON.stringify(preferences));
        applyPreferences(preferences);
    };
}

function applyPreferences(preferences) {
    document.documentElement.classList.toggle('animations-disabled', !preferences.animationsEnabled);
    document.documentElement.classList.toggle('reduced-motion', preferences.reducedMotion);
    
    // Update autoplay settings
    if (!preferences.autoplay) {
        const videos = document.querySelectorAll('video[autoplay]');
        videos.forEach(video => {
            video.removeAttribute('autoplay');
            video.pause();
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function initializeNotificationSystem() {
    // Create notification container
    const container = document.createElement('div');
    container.className = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
    `;
    document.body.appendChild(container);
    
    window.showNotification = (message, type = 'info', duration = 4000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 10px;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icon}" style="color: var(--primary-gold);"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto dismiss
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    };
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.about-search-input');
    if (!searchInput) return;
    
    const searchResults = document.querySelector('.about-search-results');
    const searchableElements = document.querySelectorAll('[data-searchable]');
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length > 2) {
                performSearch(query, searchableElements, searchResults);
            } else {
                clearSearchResults(searchResults);
            }
        }, 300);
    });
    
    // Clear results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.about-search')) {
            clearSearchResults(searchResults);
        }
    });
}

function performSearch(query, elements, resultsContainer) {
    const results = [];
    
    elements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const title = element.dataset.searchTitle || element.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '';
        
        if (text.includes(query) || title.toLowerCase().includes(query)) {
            results.push({
                element,
                title: title || 'Untitled',
                snippet: getSearchSnippet(text, query),
                score: calculateSearchScore(text, title.toLowerCase(), query)
            });
        }
    });
    
    // Sort by relevance
    results.sort((a, b) => b.score - a.score);
    
    displaySearchResults(results.slice(0, 5), resultsContainer);
}

function getSearchSnippet(text, query) {
    const index = text.indexOf(query);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
}

function calculateSearchScore(text, title, query) {
    let score = 0;
    
    // Title matches score higher
    if (title.includes(query)) score += 10;
    
    // Exact phrase matches
    const exactMatches = (text.match(new RegExp(query, 'gi')) || []).length;
    score += exactMatches * 5;
    
    // Word matches
    const words = query.split(' ');
    words.forEach(word => {
        const wordMatches = (text.match(new RegExp(word, 'gi')) || []).length;
        score += wordMatches * 2;
    });
    
    return score;
}

function displaySearchResults(results, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No results found</div>';
        container.style.display = 'block';
        return;
    }
    
    const list = document.createElement('ul');
    list.className = 'search-results-list';
    
    results.forEach(result => {
        const item = document.createElement('li');
        item.className = 'search-result-item';
        item.innerHTML = `
            <h4 class="result-title">${result.title}</h4>
            <p class="result-snippet">${result.snippet}</p>
        `;
        
        item.addEventListener('click', () => {
            result.element.scrollIntoView({ behavior: 'smooth' });
            result.element.classList.add('highlight');
            setTimeout(() => {
                result.element.classList.remove('highlight');
            }, 3000);
            clearSearchResults(container);
        });
        
        list.appendChild(item);
    });
    
    container.appendChild(list);
    container.style.display = 'block';
}

function clearSearchResults(container) {
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

// ===== IMAGE LAZY LOADING =====
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    
    const tempImg = new Image();
    tempImg.onload = () => {
        img.src = src;
        img.style.opacity = '1';
        img.classList.add('loaded');
    };
    
    tempImg.onerror = () => {
        img.alt = 'Image failed to load';
        img.classList.add('error');
    };
    
    tempImg.src = src;
}

// ===== UTILITY FUNCTIONS =====
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function throttle(func, limit) {
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

// ===== SMOOTH SCROLL IMPLEMENTATION =====
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80; // Account for fixed header
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering navigation
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== ERROR HANDLING =====
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('About page error:', e.error);
        
        // Show user-friendly error message
        if (window.showNotification) {
            showNotification('An error occurred. Please refresh the page.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Prevent default browser behavior
        e.preventDefault();
        
        if (window.showNotification) {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    });
}

// ===== FINAL INITIALIZATION =====
window.addEventListener('load', () => {
    initializeSmoothScroll();
    initializeErrorHandling();
    
    // Announce page load to screen readers
    if (window.announceToScreenReader) {
        announceToScreenReader('About page loaded successfully');
    }
    
    console.log('✨ About page fully loaded and initialized!');
});

// ===== EXPORTS FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAboutHero,
        initializeStorySection,
        initializeMissionCards,
        initializeTeamSection,
        initializeDashboardSection,
        initializeProcessTimeline,
        initializeTestimonialSlider,
        initializeAwardsSection,
        showNotification,
        easeOutCubic,
        easeInOutCubic,
        throttle,
        debounce
    };
}

