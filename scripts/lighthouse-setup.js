// ==========================================================================
// LIGHTHOUSE SETUP SCRIPT - PageantEmpress 2025
// Custom setup for Lighthouse CI testing
// ==========================================================================

/**
 * Custom Puppeteer setup for Lighthouse CI
 * This script runs before each Lighthouse audit
 */
module.exports = async (browser, context) => {
  // Create a new page
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({
    width: 412,
    height: 823,
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true
  });
  
  // Set user agent
  await page.setUserAgent(
    'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36 Chrome-Lighthouse'
  );
  
  // Set extra HTTP headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });
  
  // Block unnecessary resources for faster testing
  await page.setRequestInterception(true);
  
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    const url = request.url();
    
    // Block analytics and tracking scripts during testing
    if (
      url.includes('google-analytics.com') ||
      url.includes('googletagmanager.com') ||
      url.includes('facebook.com/tr') ||
      url.includes('hotjar.com') ||
      url.includes('mixpanel.com') ||
      url.includes('segment.com') ||
      resourceType === 'other' && url.includes('analytics')
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  
  // Add custom JavaScript to simulate user interactions
  await page.evaluateOnNewDocument(() => {
    // Simulate user preferences
    localStorage.setItem('lighthouse-test', 'true');
    localStorage.setItem('preferred-theme', 'light');
    localStorage.setItem('cookies-accepted', 'true');
    
    // Mock voting functionality for testing
    window.mockVoting = true;
    
    // Disable animations for consistent testing
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });
  
  // Wait for page to be ready
  await page.goto(context.url, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  // Additional wait for dynamic content
  await page.waitForTimeout(2000);
  
  // Take a screenshot for debugging
  if (process.env.LIGHTHOUSE_DEBUG === 'true') {
    await page.screenshot({
      path: `./reports/lighthouse/debug-${Date.now()}.png`,
      fullPage: true
    });
  }
  
  return page;
};
