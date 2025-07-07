// ==========================================================================
// DYNAMIC ROBOTS.TXT GENERATOR - PageantEmpress 2025
// Netlify Function for generating robots.txt with environment-specific rules
// ==========================================================================

exports.handler = async (event, context) => {
  try {
    const baseUrl = 'https://pageantempress.com';
    const environment = process.env.CONTEXT || 'production';
    const isProduction = environment === 'production';

    let robotsTxt = '';

    if (isProduction) {
      // Production robots.txt
      robotsTxt = `# PageantEmpress 2025 - Production Robots.txt
User-agent: *
Allow: /

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Block admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /temp/
Disallow: /cache/
Disallow: /logs/
Disallow: /backup/
Disallow: /config/
Disallow: /database/
Disallow: /scripts/
Disallow: /tests/
Disallow: /vendor/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /.env
Disallow: /.htaccess
Disallow: /composer.json
Disallow: /composer.lock
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /webpack.config.js
Disallow: /gulpfile.js
Disallow: /Gruntfile.js

# Block dynamic URLs with parameters
Disallow: /*?*utm_
Disallow: /*?*session_
Disallow: /*?*sid=
Disallow: /*?*debug=
Disallow: /*?*test=
Disallow: /*&*utm_
Disallow: /*&*session_
Disallow: /*&*sid=
Disallow: /*&*debug=
Disallow: /*&*test=

# Block duplicate content
Disallow: /*?sort=
Disallow: /*?order=
Disallow: /*?view=
Disallow: /*?layout=
Disallow: /*?theme=
Disallow: /*&sort=
Disallow: /*&order=
Disallow: /*&view=
Disallow: /*&layout=
Disallow: /*&theme=

# Block printing and email versions
Disallow: /*/print/
Disallow: /*/email/
Disallow: /*?print=
Disallow: /*?email=

# Block search result pages
Disallow: /search?
Disallow: /search/*

# Block user-specific content
Disallow: /user/
Disallow: /profile/
Disallow: /account/
Disallow: /dashboard/
Disallow: /settings/

# Block voting in progress (to prevent manipulation)
Disallow: /voting/cast/
Disallow: /voting/submit/
Disallow: /api/voting/

# Block temporary or testing pages
Disallow: /staging/
Disallow: /dev/
Disallow: /test/
Disallow: /demo/
Disallow: /preview/
Disallow: /beta/

# Block error pages
Disallow: /404/
Disallow: /500/
Disallow: /error/

# Block feeds and APIs from being indexed
Disallow: /feed/
Disallow: /rss/
Disallow: /json/
Disallow: /xml/
Disallow: /api/

# Allow important assets
Allow: /assets/css/
Allow: /assets/js/
Allow: /assets/images/
Allow: /assets/fonts/

# Allow social media verification files
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /sitemap-index.xml
Allow: /favicon.ico
Allow: /apple-touch-icon.png
Allow: /manifest.json
Allow: /browserconfig.xml
Allow: /.well-known/

# Host information
Host: ${baseUrl}`;

    } else {
      // Development/staging robots.txt - block all crawlers
      robotsTxt = `# PageantEmpress 2025 - Development/Staging Robots.txt
User-agent: *
Disallow: /

# This is a development/staging environment
# Please visit the production site at ${baseUrl}

Sitemap: ${baseUrl}/sitemap.xml`;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // 24 hours
        'X-Robots-Tag': 'noindex, nofollow'
      },
      body: robotsTxt
    };

  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Fallback robots.txt
    const fallbackRobots = `User-agent: *
Disallow: /admin/
Disallow: /api/
Sitemap: https://pageantempress.com/sitemap.xml`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600'
      },
      body: fallbackRobots
    };
  }
};
