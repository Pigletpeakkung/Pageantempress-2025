// ==========================================================================
// SECURITY HEADERS - PageantEmpress 2025
// Edge function for enhanced security headers
// ==========================================================================

export default async (request, context) => {
  const response = await context.next();
  
  // Security headers configuration
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://apis.google.com https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://api.pageantempress.com https://*.supabase.co https://www.google-analytics.com https://analytics.google.com",
      "frame-src 'self' https://www.google.com https://www.youtube.com https://player.vimeo.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'"
    ].join('; '),
    
    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // X-Frame-Options
    'X-Frame-Options': 'DENY',
    
    // X-Content-Type-Options
    'X-Content-Type-Options': 'nosniff',
    
    // X-XSS-Protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': [
      'camera=*',
      'microphone=*',
      'geolocation=(self)',
      'gyroscope=()',
      'magnetometer=()',
      'payment=(self)',
      'usb=()'
    ].join(', '),
    
    // Cross-Origin Embedder Policy
    'Cross-Origin-Embedder-Policy': 'credentialless',
    
    // Cross-Origin Opener Policy
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    
    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'same-site'
  };
  
  // Add security headers to response
  const newHeaders = new Headers(response.headers);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  // Add custom headers for PageantEmpress
  newHeaders.set('X-Powered-By', 'PageantEmpress 2025');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-DNS-Prefetch-Control', 'on');
  
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
};

export const config = {
  path: ["/*"]
};
