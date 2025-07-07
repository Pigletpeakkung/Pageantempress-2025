// ==========================================================================
// DYNAMIC SITEMAP GENERATOR - PageantEmpress 2025
// Netlify Function for generating XML sitemap with dynamic content
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (or your database connection)
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'your-anon-key'
);

exports.handler = async (event, context) => {
  try {
    const baseUrl = 'https://pageantempress.com';
    const lastmod = new Date().toISOString().split('T')[0];

    // Static pages with PageantEmpress-specific content
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/contestants', priority: '0.9', changefreq: 'daily' },
      { url: '/events', priority: '0.9', changefreq: 'weekly' },
      { url: '/voting', priority: '0.95', changefreq: 'daily' },
      { url: '/gallery', priority: '0.8', changefreq: 'weekly' },
      { url: '/news', priority: '0.8', changefreq: 'daily' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/sponsors', priority: '0.6', changefreq: 'monthly' },
      { url: '/faq', priority: '0.6', changefreq: 'monthly' },
      { url: '/apply', priority: '0.8', changefreq: 'monthly' },
      { url: '/results', priority: '0.9', changefreq: 'weekly' },
      { url: '/coaching', priority: '0.7', changefreq: 'monthly' },
      { url: '/merchandise', priority: '0.6', changefreq: 'monthly' },
      { url: '/causes', priority: '0.7', changefreq: 'monthly' },
      { url: '/judges', priority: '0.6', changefreq: 'monthly' },
      { url: '/regulations', priority: '0.5', changefreq: 'yearly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
      { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' }
    ];

    // Category pages for contestants
    const contestantCategories = [
      'miss-universe',
      'miss-world',
      'miss-earth',
      'miss-international',
      'teen-miss',
      'plus-size',
      'senior-miss'
    ];

    // Gallery categories
    const galleryCategories = [
      'evening-gown',
      'swimsuit',
      'talent',
      'interview',
      'backstage',
      'red-carpet',
      'preliminary',
      'finals',
      'crowning-moment',
      'behind-scenes'
    ];

    // Event categories
    const eventCategories = [
      'preliminary',
      'finals',
      'rehearsal',
      'training',
      'workshops',
      'charity-events',
      'meet-and-greet',
      'photo-shoots'
    ];

    // News categories
    const newsCategories = [
      'announcements',
      'winners',
      'press-releases',
      'media-coverage',
      'interviews',
      'updates',
      'behind-scenes'
    ];

    // Fetch dynamic content from database
    let contestants = [];
    let events = [];
    let newsArticles = [];
    let galleryAlbums = [];

    try {
      // Fetch contestants
      const { data: contestantsData, error: contestantsError } = await supabase
        .from('contestants')
        .select('id, name, slug, category, updated_at, status')
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (!contestantsError) {
        contestants = contestantsData || [];
      }

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, slug, category, event_date, updated_at, status')
        .eq('status', 'active')
        .order('event_date', { ascending: false });

      if (!eventsError) {
        events = eventsData || [];
      }

      // Fetch news articles
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id, title, slug, category, published_at, updated_at, status')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!newsError) {
        newsArticles = newsData || [];
      }

      // Fetch gallery albums
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_albums')
        .select('id, title, slug, category, created_at, updated_at, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!galleryError) {
        galleryAlbums = galleryData || [];
      }

    } catch (dbError) {
      console.warn('Database connection failed, using static content only:', dbError);
    }

    // Start building sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
    <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
    });

    // Add contestant category pages
    contestantCategories.forEach(category => {
      sitemap += `
    <url>
        <loc>${baseUrl}/contestants/${category}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    // Add gallery category pages
    galleryCategories.forEach(category => {
      sitemap += `
    <url>
        <loc>${baseUrl}/gallery/${category}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    // Add event category pages
    eventCategories.forEach(category => {
      sitemap += `
    <url>
        <loc>${baseUrl}/events/${category}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    // Add news category pages
    newsCategories.forEach(category => {
      sitemap += `
    <url>
        <loc>${baseUrl}/news/${category}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    // Add individual contestants
    contestants.forEach(contestant => {
      const lastModified = contestant.updated_at ? 
        new Date(contestant.updated_at).toISOString().split('T')[0] : lastmod;
      
      sitemap += `
    <url>
        <loc>${baseUrl}/contestants/${contestant.slug || contestant.id}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc>${baseUrl}/assets/images/contestants/${contestant.slug || contestant.id}/avatar.jpg</image:loc>
            <image:title>${contestant.name} - ${contestant.category}</image:title>
            <image:caption>Official contestant photo for ${contestant.name}</image:caption>
        </image:image>
    </url>`;
    });

    // Add individual events
    events.forEach(event => {
      const lastModified = event.updated_at ? 
        new Date(event.updated_at).toISOString().split('T')[0] : lastmod;
      
      sitemap += `
    <url>
        <loc>${baseUrl}/events/${event.slug || event.id}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc>${baseUrl}/assets/images/events/${event.slug || event.id}/banner.jpg</image:loc>
            <image:title>${event.title}</image:title>
            <image:caption>Event details for ${event.title}</image:caption>
        </image:image>
    </url>`;
    });

    // Add news articles
    newsArticles.forEach(article => {
      const lastModified = article.updated_at ? 
        new Date(article.updated_at).toISOString().split('T')[0] : lastmod;
      const publishedDate = article.published_at ? 
        new Date(article.published_at).toISOString().split('T')[0] : lastmod;
      
      sitemap += `
    <url>
        <loc>${baseUrl}/news/${article.slug || article.id}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
        <news:news>
            <news:publication>
                <news:name>PageantEmpress 2025</news:name>
                <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${publishedDate}</news:publication_date>
            <news:title>${article.title}</news:title>
        </news:news>
        <image:image>
            <image:loc>${baseUrl}/assets/images/news/${article.slug || article.id}/featured.jpg</image:loc>
            <image:title>${article.title}</image:title>
            <image:caption>Featured image for ${article.title}</image:caption>
        </image:image>
    </url>`;
    });

    // Add gallery albums
    galleryAlbums.forEach(album => {
      const lastModified = album.updated_at ? 
        new Date(album.updated_at).toISOString().split('T')[0] : lastmod;
      
      sitemap += `
    <url>
        <loc>${baseUrl}/gallery/${album.slug || album.id}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
        <image:image>
            <image:loc>${baseUrl}/assets/images/gallery/${album.slug || album.id}/cover.jpg</image:loc>
            <image:title>${album.title}</image:title>
            <image:caption>Photo gallery: ${album.title}</image:caption>
        </image:image>
    </url>`;
    });

    // Add voting pages for active periods
    const votingPages = [
      'current',
      'results',
      'leaderboard',
      'rules',
      'history'
    ];

    votingPages.forEach(page => {
      sitemap += `
    <url>
        <loc>${baseUrl}/voting/${page}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
    });

    // Add special pages
    const specialPages = [
      { url: '/apply/contestant', priority: '0.8', changefreq: 'monthly' },
      { url: '/apply/judge', priority: '0.6', changefreq: 'monthly' },
      { url: '/apply/sponsor', priority: '0.7', changefreq: 'monthly' },
      { url: '/apply/volunteer', priority: '0.6', changefreq: 'monthly' },
      { url: '/coaching/individual', priority: '0.7', changefreq: 'monthly' },
      { url: '/coaching/group', priority: '0.7', changefreq: 'monthly' },
      { url: '/coaching/online', priority: '0.7', changefreq: 'monthly' },
      { url: '/merchandise/clothing', priority: '0.6', changefreq: 'monthly' },
      { url: '/merchandise/accessories', priority: '0.6', changefreq: 'monthly' },
      { url: '/merchandise/books', priority: '0.6', changefreq: 'monthly' },
      { url: '/winners/2024', priority: '0.8', changefreq: 'yearly' },
      { url: '/winners/2023', priority: '0.7', changefreq: 'yearly' },
      { url: '/winners/2022', priority: '0.6', changefreq: 'yearly' },
      { url: '/winners/hall-of-fame', priority: '0.7', changefreq: 'yearly' }
    ];

    specialPages.forEach(page => {
      sitemap += `
    <url>
        <loc>${baseUrl}${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
    });

    // Add language-specific pages if multilingual
    const languages = ['en', 'es', 'fr'];
    const mainPages = ['/', '/contestants', '/events', '/voting', '/gallery'];

    languages.forEach(lang => {
      if (lang !== 'en') { // English is default
        mainPages.forEach(page => {
          sitemap += `
    <url>
        <loc>${baseUrl}/${lang}${page === '/' ? '' : page}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });
      }
    });

    // Add API documentation pages
    const apiPages = [
      '/api/docs',
      '/api/docs/contestants',
      '/api/docs/events',
      '/api/docs/voting',
      '/api/docs/gallery'
    ];

    apiPages.forEach(page => {
      sitemap += `
    <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
    </url>`;
    });

    // Close sitemap
    sitemap += `
</urlset>`;

    // Log sitemap generation
    console.log(`Sitemap generated successfully with ${contestants.length} contestants, ${events.length} events, ${newsArticles.length} news articles, and ${galleryAlbums.length} gallery albums`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Robots-Tag': 'index, follow',
        'Vary': 'Accept-Encoding',
        'Last-Modified': new Date().toUTCString()
      },
      body: sitemap
    };

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://pageantempress.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://pageantempress.com/contestants</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://pageantempress.com/events</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://pageantempress.com/voting</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.95</priority>
    </url>
</urlset>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800'
      },
      body: basicSitemap
    };
  }
};
