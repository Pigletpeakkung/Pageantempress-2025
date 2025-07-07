// ==========================================================================
// PERFORMANCE MONITOR - PageantEmpress 2025
// Edge function for real-time performance monitoring
// ==========================================================================

export default async (request, context) => {
  const startTime = Date.now();
  
  try {
    // Get the original response
    const response = await context.next();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Performance metrics
    const performanceData = {
      url: request.url,
      method: request.method,
      responseTime: responseTime,
      timestamp: new Date().toISOString(),
      statusCode: response.status,
      contentLength: response.headers.get('content-length'),
      cacheHit: response.headers.get('cf-cache-status') === 'HIT',
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      country: context.geo?.country,
      region: context.geo?.region,
      city: context.geo?.city
    };
    
    // Log slow requests
    if (responseTime > 1000) {
      console.warn('Slow request detected:', performanceData);
    }
    
    // Add performance headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Response-Time', `${responseTime}ms`);
    newHeaders.set('X-Edge-Location', context.geo?.country || 'Unknown');
    newHeaders.set('X-Performance-Score', getPerformanceScore(responseTime));
    
    // For HTML responses, inject performance monitoring script
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const html = await response.text();
      
      const performanceScript = `
        <script>
          // Performance monitoring
          window.pageantPerformance = {
            serverResponseTime: ${responseTime},
            
            // Monitor Core Web Vitals
            monitorWebVitals: function() {
              // LCP (Largest Contentful Paint)
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.reportMetric('LCP', lastEntry.startTime);
              }).observe({ entryTypes: ['largest-contentful-paint'] });
              
              // FID (First Input Delay)
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                  this.reportMetric('FID', entry.processingStart - entry.startTime);
                });
              }).observe({ entryTypes: ['first-input'] });
              
              // CLS (Cumulative Layout Shift)
              let clsScore = 0;
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                  if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                  }
                });
                this.reportMetric('CLS', clsScore);
              }).observe({ entryTypes: ['layout-shift'] });
              
              // TTFB (Time to First Byte)
              const navEntry = performance.getEntriesByType('navigation')[0];
              if (navEntry) {
                this.reportMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
              }
              
              // FCP (First Contentful Paint)
              new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                  this.reportMetric('FCP', entry.startTime);
                });
              }).observe({ entryTypes: ['paint'] });
            },
            
            // Report metrics
            reportMetric: function(name, value) {
              const metric = {
                name: name,
                value: value,
                url: window.location.href,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                connection: navigator.connection ? {
                  effectiveType: navigator.connection.effectiveType,
                  downlink: navigator.connection.downlink,
                  rtt: navigator.connection.rtt
                } : null
              };
              
              // Send to analytics
              if (typeof gtag !== 'undefined') {
                gtag('event', 'web_vitals', {
                  metric_name: name,
                  metric_value: Math.round(value),
                  custom_parameter: JSON.stringify(metric)
                });
              }
              
              // Send to performance API
              fetch('/.netlify/functions/performance-analytics', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(metric)
              }).catch(err => console.warn('Performance reporting failed:', err));
            },
            
            // Monitor resource loading
            monitorResources: function() {
              const resourceEntries = performance.getEntriesByType('resource');
              const slowResources = resourceEntries.filter(entry => entry.duration > 1000);
              
              slowResources.forEach(resource => {
                this.reportMetric('SLOW_RESOURCE', resource.duration, {
                  url: resource.name,
                  type: resource.initiatorType,
                  size: resource.transferSize
                });
              });
            },
            
            // Monitor JavaScript errors
            monitorErrors: function() {
              window.addEventListener('error', (event) => {
                const errorData = {
                  message: event.message,
                  filename: event.filename,
                  lineno: event.lineno,
                  colno: event.colno,
                  stack: event.error ? event.error.stack : null,
                  timestamp: Date.now(),
                  url: window.location.href
                };
                
                // Send error to monitoring service
                fetch('/.netlify/functions/error-tracking', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(errorData)
                }).catch(err => console.warn('Error reporting failed:', err));
              });
              
              // Monitor unhandled promise rejections
              window.addEventListener('unhandledrejection', (event) => {
                const errorData = {
                  message: event.reason.message || 'Unhandled Promise Rejection',
                  stack: event.reason.stack,
                  timestamp: Date.now(),
                  url: window.location.href
                };
                
                fetch('/.netlify/functions/error-tracking', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(errorData)
                }).catch(err => console.warn('Error reporting failed:', err));
              });
            },
            
            // Initialize monitoring
            init: function() {
              if (typeof PerformanceObserver === 'function') {
                this.monitorWebVitals();
              }
              
              window.addEventListener('load', () => {
                setTimeout(() => {
                  this.monitorResources();
                }, 1000);
              });
              
              this.monitorErrors();
            }
          };
          
          // Start monitoring
          window.pageantPerformance.init();
        </script>
      `;
      
      const modifiedHtml = html.replace('</head>', `${performanceScript}</head>`);
      
      return new Response(modifiedHtml, {
        status: response.status,
        headers: newHeaders
      });
    }
    
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
    
  } catch (error) {
    console.error('Performance monitor error:', error);
    return context.next();
  }
};

// Calculate performance score
function getPerformanceScore(responseTime) {
  if (responseTime < 200) return 'Excellent';
  if (responseTime < 500) return 'Good';
  if (responseTime < 1000) return 'Fair';
  if (responseTime < 2000) return 'Poor';
  return 'Critical';
}

export const config = {
  path: ["/*"]
};
