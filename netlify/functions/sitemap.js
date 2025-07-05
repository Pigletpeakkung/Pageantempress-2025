exports.handler = async (event, context) => {
    const baseUrl = 'https://pageantempress.com';
    const lastmod = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/services', priority: '0.8', changefreq: 'monthly' },
        { url: '/gallery', priority: '0.7', changefreq: 'weekly' },
        { url: '/testimonials', priority: '0.7', changefreq: 'monthly' },
        { url: '/media-kit', priority: '0.6', changefreq: 'monthly' },
        { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
    ];

    // Blog posts (you can make this dynamic)
    const blogPosts = [
        { slug: 'pageant-training-tips-2025', date: '2024-12-20' },
        { slug: 'beauty-pageant-preparation-guide', date: '2024-12-18' },
        { slug: 'pageant-interview-techniques', date: '2024-12-15' },
        { slug: 'evening-gown-selection-tips', date: '2024-12-12' },
        { slug: 'pageant-fitness-routines', date: '2024-12-10' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

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

    // Add blog posts
    blogPosts.forEach(post => {
        sitemap += `
    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${post.date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc>${baseUrl}/assets/images/blog/${post.slug}.jpg</image:loc>
            <image:title>${post.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</image:title>
        </image:image>
    </url>`;
    });

    sitemap += `
</urlset>`;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600'
        },
        body: sitemap
    };
};
