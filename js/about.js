/* ===== ABOUT.JS - ABOUT PAGE SPECIFIC FUNCTIONALITY ===== */

// ===== ABOUT PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
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
});

// ===== HERO SECTION =====
function initializeAboutHero() {
    const heroContent = document.querySelector('.about-hero-content');
    const scrollIndicator = document.querySelector('.about-scroll-indicator');
    
    // Animate hero content on load
    setTimeout(() => {
        heroContent?.classList.add('animated');
    }, 300);
    
    // Scroll indicator click
    scrollIndicator?.addEventListener('click', () => {
        const nextSection = document.querySelector('.about-story');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== VIDEO BACKGROUND =====
function initializeVideoBackground() {
    const video = document.querySelector('.about-hero-video');
    if (!video) return;
    
    // Ensure video plays
    video.play().catch(error => {
        console.log('Video autoplay failed:', error);
    });
    
    // Add loading state
    video.addEventListener('loadeddata', () => {
        video.classList.add('loaded');
    });
    
    // Optimize video performance
    let ticking = false;
    function optimizeVideo() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = video.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    video.pause();
                } else {
                    video.play();
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', optimizeVideo);
}

// ===== PARTICLES SYSTEM =====
function initializeParticles() {
    const particlesContainer = document.querySelector('.about-hero-particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    const startX = Math.random() * 100;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    container.appendChild(particle);
    
    // Recreate particle when animation ends
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container);
    });
}

// ===== STORY SECTION =====
function initializeStorySection() {
    const storyStats = document.querySelectorAll('.stat-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    storyStats.forEach(stat => statsObserver.observe(stat));
    
    // Floating cards animation
    const floatingCards = document.querySelectorAll('.story-floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = index * 3 + 's';
    });
}

function animateStatNumber(element) {
    const target = parseInt(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, stepDuration);
}

// ===== MISSION CARDS =====
function initializeMissionCards() {
    const cards = document.querySelectorAll('.mission-card');
    
    cards.forEach((card, index) => {
        // Stagger animation on scroll
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    card.classList.add('animated');
                }, index * 100);
                observer.unobserve(card);
            }
        }, { threshold: 0.3 });
        
        observer.observe(card);
        
        // Interactive hover effect
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

// ===== TEAM SECTION =====
function initializeTeamSection() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // 3D tilt effect on hover
        member.addEventListener('mousemove', (e) => {
            const rect = member.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            member.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
        
        // Click to view profile
        member.addEventListener('click', () => {
            const name = member.querySelector('.team-member-name').textContent;
            const role = member.querySelector('.team-member-role').textContent;
            const bio = member.querySelector('.team-member-bio').textContent;
            const image = member.querySelector('img').src;
            
            showTeamMemberModal({ name, role, bio, image });
        });
    });
}

function showTeamMemberModal(memberData) {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal-overlay team-modal active';
    modal.innerHTML = `
        <div class="modal-content team-modal-content">
            <button class="modal-close">&times;</button>
            <div class="team-modal-header">
                <img src="${memberData.image}" alt="${memberData.name}">
                <div class="team-modal-info">
                    <h2>${memberData.name}</h2>
                    <p class="team-modal-role">${memberData.role}</p>
                </div>
            </div>
            <div class="team-modal-body">
                <p>${memberData.bio}</p>
                <div class="team-modal-social">
                    <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// ===== DASHBOARD SECTION =====
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
}

function startDashboardAnimations() {
    animateMetricCards();
    animateBarChart();
    animatePieChart();
    animateLineGraph();
    startActivityFeed();
}

// ===== METRIC CARDS ANIMATION =====
function animateMetricCards() {
    const metricValues = document.querySelectorAll('.metric-value.counting');
    
    metricValues.forEach(value => {
        const target = parseInt(value.dataset.target);
        const format = value.dataset.format;
        const duration = 2500;
        const steps = 50;
        const increment = target / steps;
        const stepDuration = duration / steps;
        
        let current = 0;
        
        const counter = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(counter);
                
                // Add completion animation
                value.parentElement.classList.add('complete');
            }
            
            // Format the number
            let displayValue = Math.floor(current);
            
            if (format === 'currency') {
                displayValue = '$' + displayValue.toLocaleString();
            } else if (format === 'percentage') {
                displayValue = displayValue + '%';
            } else if (format === 'k') {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            } else {
                displayValue = displayValue.toLocaleString();
            }
            
            value.textContent = displayValue;
        }, stepDuration);
    });
    
    // Animate sparklines
    const sparklines = document.querySelectorAll('.metric-sparkline');
    sparklines.forEach((sparkline, index) => {
        setTimeout(() => {
            createSparkline(sparkline);
        }, index * 200);
    });
}

function createSparkline(container) {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const points = 20;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    const values = Array.from({ length: points }, () => Math.random() * height * 0.8 + height * 0.1);
    const path = createSVGPath(values, width, height);
    
    path.style.stroke = 'var(--primary-gold)';
    path.style.strokeWidth = '2';
    path.style.fill = 'none';
    path.style.opacity = '0.5';
    
    svg.appendChild(path);
    container.appendChild(svg);
    
    // Animate the path
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    
    setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 2s ease-out';
        path.style.strokeDashoffset = '0';
    }, 100);
}

function createSVGPath(values, width, height) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const xStep = width / (values.length - 1);
    
    let d = `M 0 ${height - values[0]}`;
    
    for (let i = 1; i < values.length; i++) {
        const x = i * xStep;
        const y = height - values[i];
        const prevX = (i - 1) * xStep;
        const prevY = height - values[i - 1];
        
        const cp1x = prevX + xStep / 2;
        const cp1y = prevY;
        const cp2x = x - xStep / 2;
        const cp2y = y;
        
        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }
    
    path.setAttribute('d', d);
    return path;
}

// ===== BAR CHART ANIMATION =====
function animateBarChart() {
    const bars = document.querySelectorAll('.bar');
    const barGroups = document.querySelectorAll('.bar-group');
    
    bars.forEach((bar, index) => {
        const value = parseInt(bar.dataset.value);
        const delay = index * 100;
        
        setTimeout(() => {
            bar.style.height = value + '%';
            
            // Show value after bar animation
            setTimeout(() => {
                const valueLabel = bar.querySelector('.bar-value');
                if (valueLabel) {
                    valueLabel.classList.add('visible');
                }
            }, 500);
        }, delay);
    });
    
    // Add hover interactions
    barGroups.forEach(group => {
        group.addEventListener('mouseenter', () => {
            bars.forEach(bar => {
                if (bar.parentElement !== group) {
                    bar.style.opacity = '0.3';
                }
            });
        });
        
        group.addEventListener('mouseleave', () => {
            bars.forEach(bar => {
                bar.style.opacity = '1';
            });
        });
    });
}

// ===== PIE CHART ANIMATION =====
function animatePieChart() {
    const pieSegments = document.querySelectorAll('.pie-segment');
    const legendItems = document.querySelectorAll('.legend-item');
    
        let totalPercentage = 0;
    const pieData = [];
    
    pieSegments.forEach((segment, index) => {
        const value = parseInt(segment.dataset.value);
        const percentage = (value / 314) * 100;
        totalPercentage += percentage;
        
        pieData.push({
            segment,
            value,
            percentage,
            color: getComputedStyle(segment).stroke
        });
        
        // Animate segment
        setTimeout(() => {
            segment.style.strokeDasharray = value + ' 314';
        }, index * 200);
        
        // Interactive hover
        segment.addEventListener('mouseenter', () => {
            segment.style.transform = 'scale(1.05)';
            segment.style.filter = 'brightness(1.2)';
            
            // Highlight corresponding legend item
            if (legendItems[index]) {
                legendItems[index].style.background = 'rgba(212, 175, 55, 0.1)';
                legendItems[index].style.transform = 'translateX(10px)';
            }
            
            // Update center display
            updatePieCenter(pieData[index]);
        });
        
        segment.addEventListener('mouseleave', () => {
            segment.style.transform = 'scale(1)';
            segment.style.filter = 'brightness(1)';
            
            if (legendItems[index]) {
                legendItems[index].style.background = '';
                legendItems[index].style.transform = '';
            }
            
            resetPieCenter();
        });
    });
    
    // Legend interactions
    legendItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            if (pieSegments[index]) {
                pieSegments[index].style.transform = 'scale(1.05)';
                pieSegments[index].style.filter = 'brightness(1.2)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (pieSegments[index]) {
                pieSegments[index].style.transform = 'scale(1)';
                pieSegments[index].style.filter = 'brightness(1)';
            }
        });
    });
}

function updatePieCenter(data) {
    const pieTotal = document.querySelector('.pie-total');
    const pieLabel = document.querySelector('.pie-label');
    
    if (pieTotal && pieLabel) {
        pieTotal.textContent = Math.round(data.percentage) + '%';
        pieLabel.textContent = 'of total';
    }
}

function resetPieCenter() {
    const pieTotal = document.querySelector('.pie-total');
    const pieLabel = document.querySelector('.pie-label');
    
    if (pieTotal && pieLabel) {
        pieTotal.textContent = '100%';
        pieLabel.textContent = 'Total';
    }
}

// ===== LINE GRAPH ANIMATION =====
function animateLineGraph() {
    const lineGraph = document.querySelector('.line-graph');
    if (!lineGraph) return;
    
    const data = generateLineGraphData();
    const svg = createLineGraphSVG(data);
    
    lineGraph.appendChild(svg);
    
    // Animate the line
    const linePath = svg.querySelector('.line-path');
    const pathLength = linePath.getTotalLength();
    
    linePath.style.strokeDasharray = pathLength;
    linePath.style.strokeDashoffset = pathLength;
    
    setTimeout(() => {
        linePath.style.transition = 'stroke-dashoffset 2s ease-out';
        linePath.style.strokeDashoffset = '0';
        
        // Show data points after line animation
        setTimeout(() => {
            animateDataPoints(svg);
        }, 1500);
    }, 500);
}

function generateLineGraphData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = [65, 72, 68, 85, 90, 95];
    
    return months.map((month, index) => ({
        month,
        value: values[index],
        x: (index / (months.length - 1)) * 100,
        y: 100 - values[index]
    }));
}

function createLineGraphSVG(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('line-chart-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Create gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'lineGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'var(--primary-gold)');
    stop1.setAttribute('stop-opacity', '0.3');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', 'var(--primary-gold)');
    stop2.setAttribute('stop-opacity', '0');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    // Create area fill
    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPath.classList.add('line-gradient');
    
    let areaD = `M ${data[0].x} ${data[0].y}`;
    data.forEach(point => {
        areaD += ` L ${point.x} ${point.y}`;
    });
    areaD += ` L ${data[data.length - 1].x} 100 L ${data[0].x} 100 Z`;
    
    areaPath.setAttribute('d', areaD);
    svg.appendChild(areaPath);
    
    // Create line
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePath.classList.add('line-path');
    
    let lineD = `M ${data[0].x} ${data[0].y}`;
    
    for (let i = 1; i < data.length; i++) {
        const cp1x = data[i - 1].x + (data[i].x - data[i - 1].x) / 2;
        const cp1y = data[i - 1].y;
        const cp2x = data[i - 1].x + (data[i].x - data[i - 1].x) / 2;
        const cp2y = data[i].y;
        
        lineD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${data[i].x},${data[i].y}`;
    }
    
    linePath.setAttribute('d', lineD);
    svg.appendChild(linePath);
    
    // Create data points
    data.forEach((point, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.classList.add('data-point');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('data-value', point.value);
        circle.setAttribute('data-month', point.month);
        circle.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover tooltip
        circle.addEventListener('mouseenter', (e) => showGraphTooltip(e, point));
        circle.addEventListener('mouseleave', hideGraphTooltip);
        
        svg.appendChild(circle);
    });
    
    return svg;
}

function animateDataPoints(svg) {
    const points = svg.querySelectorAll('.data-point');
    points.forEach((point, index) => {
        setTimeout(() => {
            point.style.r = '5';
        }, index * 100);
    });
}

function showGraphTooltip(event, data) {
    let tooltip = document.querySelector('.graph-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'graph-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-value">${data.value}%</div>
        <div class="tooltip-label">${data.month}</div>
    `;
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top - 10 + 'px';
    tooltip.classList.add('visible');
}

function hideGraphTooltip() {
    const tooltip = document.querySelector('.graph-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

// ===== ACTIVITY FEED =====
function startActivityFeed() {
    const activityFeed = document.querySelector('.activity-feed');
    if (!activityFeed) return;
    
    // Initial activities
    const activities = [
        { icon: 'fa-chart-line', user: 'Analytics System', action: 'Updated dashboard metrics', time: '2 min ago', type: 'system' },
        { icon: 'fa-user-plus', user: 'HR Department', action: 'New team member joined', time: '15 min ago', type: 'hr' },
        { icon: 'fa-trophy', user: 'Achievement', action: 'Reached 10K customers milestone', time: '1 hour ago', type: 'achievement' },
        { icon: 'fa-code-branch', user: 'Development', action: 'Deployed new features', time: '2 hours ago', type: 'dev' },
        { icon: 'fa-handshake', user: 'Sales Team', action: 'Closed major deal', time: '3 hours ago', type: 'sales' }
    ];
    
    // Render initial activities
    activities.forEach((activity, index) => {
        setTimeout(() => {
            const item = createActivityItem(activity);
            activityFeed.appendChild(item);
        }, index * 200);
    });
    
    // Simulate real-time updates
    setInterval(() => {
        addNewActivity(activityFeed);
    }, 15000);
}

function createActivityItem(data) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.dataset.type = data.type;
    
    item.innerHTML = `
        <div class="activity-dot"></div>
        <div class="activity-content">
            <div class="activity-meta">
                <div class="activity-icon ${data.type}">
                    <i class="fas ${data.icon}"></i>
                </div>
                <span class="activity-user">${data.user}</span>
                <span class="activity-time">${data.time}</span>
            </div>
            <p class="activity-description">${data.action}</p>
        </div>
    `;
    
    return item;
}

function addNewActivity(feed) {
    const newActivities = [
        { icon: 'fa-bell', user: 'Notification', action: 'System maintenance completed', time: 'just now', type: 'system' },
        { icon: 'fa-star', user: 'Customer', action: 'Left a 5-star review', time: 'just now', type: 'review' },
        { icon: 'fa-shopping-cart', user: 'E-commerce', action: 'New order received', time: 'just now', type: 'sales' }
    ];
    
    const activity = newActivities[Math.floor(Math.random() * newActivities.length)];
    const item = createActivityItem(activity);
    
    item.style.opacity = '0';
    feed.insertBefore(item, feed.firstChild);
    
    // Animate entry
    setTimeout(() => {
        item.style.opacity = '1';
        item.classList.add('new-activity');
    }, 10);
    
    // Remove old activities
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 10) {
        const lastItem = items[items.length - 1];
        lastItem.style.opacity = '0';
        setTimeout(() => lastItem.remove(), 300);
    }
}

// ===== REAL-TIME METRICS =====
function initializeRealTimeMetrics() {
    const realtimeNumbers = document.querySelectorAll('.realtime-number');
    
    realtimeNumbers.forEach(number => {
        // Initial animation
        const target = parseInt(number.dataset.target);
        animateNumber(number, 0, target, 2000);
        
        // Periodic updates
        setInterval(() => {
            const current = parseInt(number.textContent.replace(/\D/g, ''));
            const change = Math.floor(Math.random() * 20) - 10;
            const newValue = Math.max(0, current + change);
            
            animateNumber(number, current, newValue, 500);
            
            // Update trend indicator
            updateTrendIndicator(number, change);
        }, 5000 + Math.random() * 5000);
    });
}

function animateNumber(element, from, to, duration) {
    const startTime = performance.now();
    const suffix = element.querySelector('.counter-suffix')?.textContent || '';
    
    function update() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = from + (to - from) * easeOutCubic(progress);
        
        // Format number
        let display = Math.floor(current).toLocaleString();
        if (suffix) {
            element.innerHTML = display + `<span class="counter-suffix">${suffix}</span>`;
        } else {
            element.textContent = display;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function updateTrendIndicator(element, change) {
    const card = element.closest('.realtime-card');
    const trend = card.querySelector('.realtime-trend');
    
    if (trend) {
        const icon = trend.querySelector('.trend-icon');
        
        if (change > 0) {
            trend.classList.remove('negative');
            trend.classList.add('positive');
            icon.className = 'fas fa-arrow-up trend-icon';
            trend.innerHTML = `<i class="fas fa-arrow-up trend-icon"></i> +${Math.abs(change)}`;
        } else if (change < 0) {
            trend.classList.remove('positive');
            trend.classList.add('negative');
            icon.className = 'fas fa-arrow-down trend-icon';
            trend.innerHTML = `<i class="fas fa-arrow-down trend-icon"></i> -${Math.abs(change)}`;
        }
    }
}

// ===== PROCESS TIMELINE =====
function initializeProcessTimeline() {
    const processItems = document.querySelectorAll('.process-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    processItems.forEach(item => observer.observe(item));
    
    // Add interactive effects
    processItems.forEach(item => {
        const iconWrapper = item.querySelector('.process-icon-wrapper');
        
        iconWrapper.addEventListener('click', () => {
            const title = item.querySelector('.process-title').textContent;
            const description = item.querySelector('.process-description').textContent;
            
            showProcessDetail(title, description);
        });
    });
}

function showProcessDetail(title, description) {
    const modal = document.createElement('div');
    modal.className = 'process-modal';
    modal.innerHTML = `
        <div class="process-modal-content">
            <h3>${title}</h3>
            <p>${description}</p>
            <button class="process-modal-close">Got it</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.process-modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

// ===== TESTIMONIAL SLIDER =====
function initializeTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const track = slider.querySelector('.testimonial-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.testimonial-dot');
    
    let currentIndex = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Animate current slide
        slides.forEach((slide, i) => {
            if (i === currentIndex) {
                slide.classList.add('active');
                animateTestimonialContent(slide);
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    function animateTestimonialContent(slide) {
        const quote = slide.querySelector('.testimonial-quote');
        const author = slide.querySelector('.testimonial-author');
        
        quote.style.opacity = '0';
        quote.style.transform = 'translateY(20px)';
        author.style.opacity = '0';
        author.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            quote.style.transition = 'all 0.6s ease';
            quote.style.opacity = '1';
            quote.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                author.style.transition = 'all 0.6s ease';
                author.style.opacity = '1';
                author.style.transform = 'translateY(0)';
            }, 200);
        }, 100);
    }
    
    function nextSlide() {
        goToSlide((currentIndex + 1) % slides.length);
    }
    
    function prevSlide() {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }
    
    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            isAutoPlaying = false;
        });
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd);
    
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseUp);
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            track.style.transform = `translateX(-${currentIndex * 100}% - ${diff}px)`;
        }
    }
    
    function handleTouchEnd() {
        if (!isDragging) return;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (diff > threshold) {
            nextSlide();
        } else if (diff < -threshold) {
            prevSlide();
        } else {
            goToSlide(currentIndex);
        }
        
        isDragging = false;
        startAutoPlay();
    }
    
    function handleMouseDown(e) {
        touchStartX = e.clientX;
        isDragging = true;
        slider.style.cursor = 'grabbing';
        stopAutoPlay();
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        touchEndX = e.clientX;
        
        const diff = touchStartX - touchEndX;
        track.style.transform = `translateX(-${currentIndex * 100}% - ${diff}px)`;
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (diff > threshold) {
            nextSlide();
        } else if (diff < -threshold) {
            prevSlide();
        } else {
            goToSlide(currentIndex);
        }
        
        isDragging = false;
        slider.style.cursor = 'grab';
        startAutoPlay();
    }
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', () => {
        if (isAutoPlaying) startAutoPlay();
    });
    
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
    goToSlide(0);
    startAutoPlay();
}

// ===== AWARDS SECTION =====
function initializeAwardsSection() {
    const awards = document.querySelectorAll('.award-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // Animate icon
                    const icon = entry.target.querySelector('.award-icon');
                    if (icon) {
                        icon.style.animation = 'awardBounce 0.6s ease-out';
                    }
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    awards.forEach(award => {
        observer.observe(award);
        
        // Add hover effect
        award.addEventListener('mouseenter', () => {
            const shine = award.querySelector('.award-shine');
            if (shine) {
                shine.style.animation = 'awardShine 1s ease-out';
            }
        });
    });
}

// ===== ABOUT ANIMATIONS =====
function initializeAboutAnimations() {
    // Scroll-triggered animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animate;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add(animation);
                    element.classList.add('animated');
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    // Parallax scrolling
    initializeParallaxEffects();
    
    // Mouse move effects
    initializeMouseMoveEffects();
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = element.dataset.parallaxOffset || 0;
            
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const yPos = -(scrolled - element.offsetTop + offset) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);
    
    // Initial call
    updateParallax();
}

// ===== MOUSE MOVE EFFECTS =====
function initializeMouseMoveEffects() {
    const mouseElements = document.querySelectorAll('[data-mouse-move]');
    
    if (mouseElements.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        mouseElements.forEach(element => {
            const speed = parseFloat(element.dataset.mouseMove) || 1;
            const rect = element.getBoundingClientRect();
            
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const percentX = (mouseX - centerX) / windowWidth;
            const percentY = (mouseY - centerY) / windowHeight;
            
            const moveX = percentX * speed * 50;
            const moveY = percentY * speed * 50;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// ===== ABOUT COUNTERS =====
function initializeAboutCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startAboutCounter(counter);
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

function startAboutCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = parseInt(element.dataset.duration) || 2000;
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const decimals = parseInt(element.dataset.decimals) || 0;
    
    let current = 0;
    const increment = target / (duration / 16);
    const startTime = performance.now();
    
    function updateCounter() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        current = target * easeOutCubic(progress);
        
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
            
            // Pulse effect
            element.style.animation = 'counterPulse 0.4s ease-out';
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// ===== UTILITY FUNCTIONS =====
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ===== CHART ANIMATIONS =====
function initializeChartAnimations() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-pill');
    const activityItems = document.querySelectorAll('.activity-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.textContent.toLowerCase();
            
            // Filter activity items
            activityItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = '';
                    item.style.animation = 'fadeIn 0.3s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Chart period toggles
    const chartOptions = document.querySelectorAll('.chart-option');
    
    chartOptions.forEach(option => {
        option.addEventListener('click', function() {
            const siblings = this.parentElement.querySelectorAll('.chart-option');
            siblings.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data
            const period = this.textContent.toLowerCase();
            updateChartData(this.closest('.chart-card'), period);
        });
    });
}

function updateChartData(chartCard, period) {
    // Simulate data update
    const chartType = chartCard.querySelector('.bar-chart') ? 'bar' : 
                     chartCard.querySelector('.pie-chart') ? 'pie' : 'line';
    
    console.log(`Updating ${chartType} chart for ${period} period`);
    
    // Add loading state
    chartCard.classList.add('loading');
    
    setTimeout(() => {
        chartCard.classList.remove('loading');
        
        // Trigger re-animation
        if (chartType === 'bar') {
            animateBarChart();
        } else if (chartType === 'pie') {
            animatePieChart();
        } else if (chartType === 'line') {
            animateLineGraph();
        }
        
        // Show notification
        showNotification(`Chart updated to ${period} view`, 'success');
    }, 500);
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NOTIFICATION HELPER =====
function showNotification(message, type = 'info') {
    // Use the main notification system from main.js
    if (window.LuxuryWebsite && window.LuxuryWebsite.showNotification) {
        window.LuxuryWebsite.showNotification(message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    initializeSmoothScroll();
    initializeChartAnimations();
    
    console.log('✨ About page initialized successfully!');
});
