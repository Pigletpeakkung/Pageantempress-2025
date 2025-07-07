// ==========================================================================
// SITEMAP INDEX GENERATOR - PageantEmpress 2025
// Netlify Function for generating sitemap index with multiple sitemaps
// ==========================================================================

exports.handler = async (event, context) => {
  try {
    const baseUrl = 'https://pageantempress.com';
    const lastmod = new Date().toISOString().split('T')[0];

    // Define sitemap sections
    const sitemaps = [
      {
        url: `${baseUrl}/sitemap-main.xml`,
        lastmod: lastmod,
        description: 'Main pages and static content'
      },
      {
        url: `${baseUrl}/sitemap-contestants.xml`,
        lastmod: lastmod,
        description: 'Contestant profiles and categories'
      },
      {
        url: `${baseUrl}/sitemap-events.xml`,
        lastmod: lastmod,
        description: 'Events and competition schedules'
      },
      {
        url: `${baseUrl}/sitemap-gallery.xml`,
        lastmod: lastmod,
        description: 'Photo galleries and albums'
      },
      {
        url: `${baseUrl}/sitemap-news.xml`,
        lastmod: lastmod,
        description: 'News articles and press releases'
      },
      {
        url: `${baseUrl}/sitemap-voting.xml`,
        lastmod: lastmod,
        description: 'Voting pages and results'
      }
    ];

    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemaps.forEach(sitemap => {
      sitemapIndex += `
    <sitemap>
        <loc>${sitemap.url}</loc>
        <lastmod>${sitemap.lastmod}</lastmod>
    </sitemap>`;
    });

    sitemapIndex += `
</sitemapindex>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
        'X-Robots-Tag': 'index, follow'
      },
      body: sitemapIndex
    };

  } catch (error) {
    console.error('Error generating sitemap index:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate sitemap index' })
    };
  }
};
