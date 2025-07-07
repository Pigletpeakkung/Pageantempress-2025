/* ==========================================================================
   GENERATE SITEMAP - PageantEmpress 2025
   Dynamic sitemap generation with advanced features
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

class SitemapGenerator {
    constructor() {
        this.baseUrl = 'https://pageantempress.com';
        this.outputDir = './public';
        this.lastMod = new Date().toISOString().split('T')[0];
        this.urls = [];
        this.newsUrls = [];
        this.imageUrls = [];
        this.videoUrls = [];
    }

    /**
     * Generate main sitemap
     */
    generateMainSitemap() {
        // Static pages
        this.addUrl('/', 'daily', 1.0);
        this.addUrl('/about', 'monthly', 0.8);
        this.addUrl('/contestants', 'weekly', 0.9);
        this.addUrl('/events', 'weekly', 0.9);
        this.addUrl('/gallery', 'weekly', 0.7);
        this.addUrl('/voting', 'daily', 0.8);
        this.addUrl('/news', 'daily', 0.7);
        this.addUrl('/winners', 'yearly', 0.7);
        this.addUrl('/sponsors', 'monthly', 0.6);
        this.addUrl('/registration', 'monthly', 0.7);
        this.addUrl('/contact', 'monthly', 0.6);
        this.addUrl('/privacy', 'yearly', 0.3);
        this.addUrl('/terms', 'yearly', 0.3);
        this.addUrl('/faq', 'monthly', 0.5);
        this.addUrl('/press', 'monthly', 0.5);

        // Dynamic content
        this.addContestantPages();
        this.addEventPages();
        this.addGalleryPages();
        this.addNewsPages();
        this.addWinnerPages();

        return this.buildSitemap();
    }

    /**
     * Add URL to sitemap
     */
    addUrl(url, changefreq = 'monthly', priority = 0.5, lastmod = null) {
        this.urls.push({
            loc: `${this.baseUrl}${url}`,
            lastmod: lastmod || this.lastMod,
            changefreq,
            priority
        });
    }

    /**
     * Add contestant pages
     */
    addContestantPages() {
        const contestants = [
            'sarah-johnson',
            'maria-rodriguez',
            'emily-chen',
            'aisha-patel',
            'sophia-williams',
            'olivia-taylor',
            'isabella-garcia',
            'mia-thompson',
            'ava-martinez',
            'charlotte-davis',
            'amelia-wilson',
            'harper-anderson'
        ];

        contestants.forEach(slug => {
            this.addUrl(`/contestants/${slug}`, 'weekly', 0.7);
        });
    }

    /**
     * Add event pages
     */
    addEventPages() {
        const events = [
            'opening-ceremony',
            'talent-competition',
            'evening-gown-competition',
            'interview-round',
            'swimsuit-competition',
            'final-crowning-ceremony',
            'red-carpet-gala',
            'charity-fundraiser',
            'meet-and-greet',
            'rehearsal-dinner'
        ];

        events.forEach(slug => {
            this.addUrl(`/events/${slug}`, 'weekly', 0.8);
        });
    }

    /**
     * Add gallery pages
     */
    addGalleryPages() {
        const galleries = [
            'red-carpet',
            'behind-scenes',
            'competition-highlights',
            'rehearsals',
            'interviews',
            'charity-events',
            'press-conferences',
            'award-ceremony',
            'after-party',
            'fan-meetups'
        ];

        galleries.forEach(slug => {
            this.addUrl(`/gallery/${slug}`, 'weekly', 0.6);
        });
    }

    /**
     * Add news pages
     */
    addNewsPages() {
        const news = [
            'pageant-2025-announcement',
            'contestant-selection-process',
            'judging-panel-revealed',
            'venue-and-dates-confirmed',
            'sponsor-partnerships',
            'charity-initiatives',
            'live-streaming-details',
            'winner-prize-package',
            'international-participation',
            'sustainability-efforts'
        ];

        news.forEach(slug => {
            this.addUrl(`/news/${slug}`, 'monthly', 0.6);
            this.addNewsUrl(`/news/${slug}`, 'PageantEmpress News', 'en');
        });
    }

    /**
     * Add winner pages
     */
    addWinnerPages() {
        const years = [2024, 2023, 2022, 2021, 2020];
        
        years.forEach(year => {
            this.addUrl(`/winners/${year}`, 'yearly', 0.6);
        });
    }

    /**
     * Add news URL for news sitemap
     */
    addNewsUrl(url, title, language = 'en') {
        this.newsUrls.push({
            loc: `${this.baseUrl}${url}`,
            news: {
                publication: {
                    name: 'PageantEmpress',
                    language
                },
                publication_date: this.lastMod,
                title
            }
        });
    }

    /**
     * Add image URL for image sitemap
     */
    addImageUrl(pageUrl, imageUrl, title, caption = '') {
        this.imageUrls.push({
            loc: `${this.baseUrl}${pageUrl}`,
            image: {
                loc: `${this.baseUrl}${imageUrl}`,
                title,
                caption
            }
        });
    }

    /**
     * Add video URL for video sitemap
     */
    addVideoUrl(pageUrl, videoUrl, title, description, duration = '') {
        this.videoUrls.push({
            loc: `${this.baseUrl}${pageUrl}`,
            video: {
                thumbnail_loc: `${this.baseUrl}${videoUrl.replace('.mp4', '-thumb.jpg')}`,
                title,
                description,
                content_loc: `${this.baseUrl}${videoUrl}`,
                duration
            }
        });
    }

    /**
     * Build main sitemap XML
     */
    buildSitemap() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

        this.urls.forEach(url => {
            xml += `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>
`;
        });

        xml += `</urlset>`;
        return xml;
    }

    /**
     * Build news sitemap XML
     */
    buildNewsSitemap() {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

        this.newsUrls.forEach(url => {
            xml += `    <url>
        <loc>${url.loc}</loc>
        <news:news>
            <news:publication>
                <news:name>${url.news.publication.name}</news:name>
                <news:language>${url.news.publication.language}</news:language>
            </news:publication>
            <news:publication_date>${url.news.publication_date}</news:publication_date>
            <news:title>${url.news.title}</news:title>
        </news:news>
    </url>
`;
        });

        xml += `</urlset>`;
        return xml;
    }

    /**
     * Build image sitemap XML
     */
    buildImageSitemap() {
        // Add sample images
        this.addImageUrl('/', '/assets/images/hero-background.webp', 'PageantEmpress 2025 Hero Image', 'Main hero image showcasing the elegance of PageantEmpress 2025');
        this.addImageUrl('/contestants', '/assets/images/contestants/contestant-1.webp', 'Contestant Sarah Johnson', 'Professional photo of contestant Sarah Johnson');
        this.addImageUrl('/gallery', '/assets/images/gallery/red-carpet.webp', 'Red Carpet Event', 'Elegant red carpet moments from PageantEmpress 2025');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

        this.imageUrls.forEach(url => {
            xml += `    <url>
        <loc>${url.loc}</loc>
        <image:image>
            <image:loc>${url.image.loc}</image:loc>
            <image:title>${url.image.title}</image:title>
            <image:caption>${url.image.caption}</image:caption>
        </image:image>
    </url>
`;
        });

        xml += `</urlset>`;
        return xml;
    }

    /**
     * Build video sitemap XML
     */
    buildVideoSitemap() {
        // Add sample videos
        this.addVideoUrl('/', '/assets/videos/hero-video.mp4', 'PageantEmpress 2025 Promotional Video', 'Official promotional video for PageantEmpress 2025 competition', '120');
        this.addVideoUrl('/events', '/assets/videos/highlight-reel.mp4', 'Competition Highlights', 'Exciting highlights from previous PageantEmpress competitions', '180');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

        this.videoUrls.forEach(url => {
            xml += `    <url>
        <loc>${url.loc}</loc>
        <video:video>
            <video:thumbnail_loc>${url.video.thumbnail_loc}</video:thumbnail_loc>
            <video:title>${url.video.title}</video:title>
            <video:description>${url.video.description}</video:description>
            <video:content_loc>${url.video.content_loc}</video:content_loc>
            <video:duration>${url.video.duration}</video:duration>
        </video:video>
    </url>
`;
        });

        xml += `</urlset>`;
        return xml;
    }

    /**
     * Build sitemap index
     */
    buildSitemapIndex() {
        const sitemaps = [
            { name: 'sitemap.xml', lastmod: this.lastMod },
            { name: 'sitemap-news.xml', lastmod: this.lastMod },
            { name: 'sitemap-images.xml', lastmod: this.lastMod },
            { name: 'sitemap-videos.xml', lastmod: this.lastMod }
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

        sitemaps.forEach(sitemap => {
            xml += `    <sitemap>
        <loc>${this.baseUrl}/${sitemap.name}</loc>
        <lastmod>${sitemap.lastmod}</lastmod>
    </sitemap>
`;
        });

        xml += `</sitemapindex>`;
        return xml;
    }

    /**
     * Generate all sitemaps
     */
    generateAll() {
        try {
            // Ensure output directory exists
            if (!fs.existsSync(this.outputDir)) {
                fs.mkdirSync(this.outputDir, { recursive: true });
            }

            // Generate main sitemap
            const mainSitemap = this.generateMainSitemap();
            fs.writeFileSync(path.join(this.outputDir, 'sitemap.xml'), mainSitemap);

            // Generate news sitemap
            const newsSitemap = this.buildNewsSitemap();
            fs.writeFileSync(path.join(this.outputDir, 'sitemap-news.xml'), newsSitemap);

            // Generate image sitemap
            const imageSitemap = this.buildImageSitemap();
            fs.writeFileSync(path.join(this.outputDir, 'sitemap-images.xml'), imageSitemap);

            // Generate video sitemap
            const videoSitemap = this.buildVideoSitemap();
            fs.writeFileSync(path.join(this.outputDir, 'sitemap-videos.xml'), videoSitemap);

            // Generate sitemap index
            const sitemapIndex = this.buildSitemapIndex();
            fs.writeFileSync(path.join(this.outputDir, 'sitemap-index.xml'), sitemapIndex);

            console.log('✅ All sitemaps generated successfully!');
            console.log(`📍 Main sitemap: ${this.urls.length} URLs`);
            console.log(`📰 News sitemap: ${this.newsUrls.length} URLs`);
            console.log(`🖼️ Image sitemap: ${this.imageUrls.length} URLs`);
            console.log(`🎥 Video sitemap: ${this.videoUrls.length} URLs`);

        } catch (error) {
            console.error('❌ Error generating sitemaps:', error);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new SitemapGenerator();
    generator.generateAll();
}

module.exports = SitemapGenerator;

