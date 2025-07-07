/* ==========================================================================
   GENERATE META TAGS - PageantEmpress 2025
   Dynamic meta tag generation for all pages
   ========================================================================== */

const fs = require('fs');
const path = require('path');

class MetaTagGenerator {
    constructor() {
        this.baseUrl = 'https://pageantempress.com';
        this.siteName = 'PageantEmpress';
        this.defaultImage = '/assets/images/og-image.jpg';
        this.twitterHandle = '@PageantEmpress';
        this.fbAppId = '1234567890';
        this.organization = {
            name: 'PageantEmpress',
            logo: '/assets/images/logo.png',
            url: 'https://pageantempress.com'
        };
    }

    /**
     * Generate meta tags for homepage
     */
    generateHomeMeta() {
        return this.generateMetaTags({
            title: 'PageantEmpress 2025 - Premier Beauty Pageant Competition',
            description: 'Join the most prestigious beauty pageant competition of 2025. Celebrate elegance, talent, and empowerment with PageantEmpress.',
            keywords: ['beauty pageant', 'competition', 'crown', 'elegance', 'talent', 'empowerment', 'miss universe', 'beauty contest', 'pageant 2025'],
            image: this.defaultImage,
            url: '/',
            type: 'website',
            structuredData: this.generateOrganizationSchema()
        });
    }

    /**
     * Generate meta tags for about page
     */
    generateAboutMeta() {
        return this.generateMetaTags({
            title: 'About PageantEmpress 2025 - Our Mission and Vision',
            description: 'Learn about PageantEmpress mission to celebrate elegance, talent, and empowerment. Discover our commitment to empowering women through beauty pageants.',
            keywords: ['about pageant', 'mission', 'vision', 'empowerment', 'women', 'beauty standards', 'confidence'],
            image: '/assets/images/about-hero.jpg',
            url: '/about',
            type: 'website'
        });
    }

    /**
     * Generate meta tags for contestants page
     */
    generateContestantsMeta() {
        return this.generateMetaTags({
            title: 'Meet the Contestants - PageantEmpress 2025',
            description: 'Meet the talented and inspiring contestants competing in PageantEmpress 2025. Learn about their backgrounds, talents, and aspirations.',
            keywords: ['contestants', 'participants', 'beauty queens', 'talent', 'profiles', 'biographies'],
            image: '/assets/images/contestants-showcase.jpg',
            url: '/contestants',
            type: 'website'
        });
    }

    /**
     * Generate meta tags for individual contestant
     */
    generateContestantMeta(contestant) {
        return this.generateMetaTags({
            title: `${contestant.name} - PageantEmpress 2025 Contestant`,
            description: `Meet ${contestant.name}, a talented contestant in PageantEmpress 2025. Learn about her background, talents, and journey to the crown.`,
            keywords: ['contestant', contestant.name, 'biography', 'talent', 'beauty queen', 'pageant'],
            image: contestant.image || this.defaultImage,
            url: `/contestants/${contestant.slug}`,
            type: 'profile',
            structuredData: this.generatePersonSchema(contestant)
        });
    }

    /**
     * Generate meta tags for events page
     */
    generateEventsMeta() {
        return this.generateMetaTags({
            title: 'Events Schedule - PageantEmpress 2025',
            description: 'Stay updated with the complete schedule of PageantEmpress 2025 events. From opening ceremony to final crowning, don\'t miss any moment.',
            keywords: ['events', 'schedule', 'calendar', 'ceremony', 'competition', 'timeline'],
            image: '/assets/images/events-schedule.jpg',
            url: '/events',
            type: 'website'
        });
    }

    /**
     * Generate meta tags for voting page
     */
    generateVotingMeta() {
        return this.generateMetaTags({
            title: 'Vote for Your Favorite - PageantEmpress 2025',
            description: 'Cast your vote for your favorite contestant in PageantEmpress 2025. Your voice matters in crowning the next beauty queen.',
            keywords: ['vote', 'voting', 'favorite contestant', 'support', 'crown', 'winner'],
            image: '/assets/images/voting-crown.jpg',
            url: '/voting',
            type: 'website'
        });
    }

    /**
     * Generate comprehensive meta tags
     */
    generateMetaTags(options) {
        const {
            title,
            description,
            keywords = [],
            image = this.defaultImage,
            url = '/',
            type = 'website',
            structuredData = null
        } = options;

        const fullUrl = `${this.baseUrl}${url}`;
        const fullImageUrl = image.startsWith('http') ? image : `${this.baseUrl}${image}`;

        return `
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords.join(', ')}">
<meta name="robots" content="index, follow">
<meta name="language" content="English">
<meta name="author" content="PageantEmpress Team">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#d4af37">
<meta name="msapplication-TileColor" content="#d4af37">
<meta name="msapplication-TileImage" content="/assets/images/icons/icon-144x144.png">
<link rel="canonical" href="${fullUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}">
<meta property="og:url" content="${fullUrl}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${fullImageUrl}">
<meta property="og:image:alt" content="${title}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="${this.siteName}">
<meta property="og:locale" content="en_US">
<meta property="fb:app_id" content="${this.fbAppId}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${fullUrl}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${fullImageUrl}">
<meta property="twitter:image:alt" content="${title}">
<meta property="twitter:site" content="${this.twitterHandle}">
<meta property="twitter:creator" content="${this.twitterHandle}">

<!-- Additional Meta Tags -->
<meta name="application-name" content="${this.siteName}">
<meta name="apple-mobile-web-app-title" content="${this.siteName}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">

<!-- Favicon and Icons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/icon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/icon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">

<!-- Preconnect for Performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.google-analytics.com">
<link rel="preconnect" href="https://www.googletagmanager.com">

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//connect.facebook.net">
<link rel="dns-prefetch" href="//platform.twitter.com">

<!-- Structured Data -->
${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
        `.trim();
    }

    /**
     * Generate Organization Schema
     */
    generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": this.organization.name,
            "alternateName": "PageantEmpress 2025",
            "url": this.organization.url,
            "logo": `${this.baseUrl}${this.organization.logo}`,
            "description": "Premier beauty pageant competition celebrating elegance, talent, and empowerment",
            "foundingDate": "2020",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-PAGEANT",
                "contactType": "customer service",
                "email": "info@pageantempress.com",
                "availableLanguage": ["English", "Spanish", "French"]
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Pageant Avenue",
                "addressLocality": "Beauty City",
                "addressRegion": "CA",
                "postalCode": "90210",
                "addressCountry": "US"
            },
            "sameAs": [
                "https://facebook.com/pageantempress",
                "https://instagram.com/pageantempress",
                "https://twitter.com/pageantempress",
                "https://youtube.com/pageantempress",
                "https://tiktok.com/@pageantempress",
                "https://linkedin.com/company/pageantempress"
            ],
            "event": {
                "@type": "Event",
                "name": "PageantEmpress 2025",
                "startDate": "2025-03-15T19:00:00",
                "endDate": "2025-03-17T22:00:00",
                "eventStatus": "https://schema.org/EventScheduled",
                "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
                "location": {
                    "@type": "Place",
                    "name": "Grand Ballroom Convention Center",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "123 Pageant Avenue",
                        "addressLocality": "Beauty City",
                        "addressRegion": "CA",
                        "postalCode": "90210",
                        "addressCountry": "US"
                    }
                },
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": `${this.baseUrl}/events`
                }
            }
        };
    }

    /**
     * Generate Person Schema for contestants
     */
    generatePersonSchema(contestant) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": contestant.name,
            "alternateName": contestant.nickname || "",
            "image": `${this.baseUrl}${contestant.image}`,
            "description": contestant.description,
            "birthPlace": contestant.birthPlace || "",
            "nationality": contestant.nationality || "",
            "occupation": contestant.occupation || "",
            "award": contestant.awards || [],
            "knows": contestant.languages || [],
            "hasOccupation": {
                "@type": "Occupation",
                "name": contestant.occupation || "Model"
            },
            "memberOf": {
                "@type": "Organization",
                "name": "PageantEmpress 2025"
            }
        };
    }

    /**
     * Generate Event Schema
     */
    generateEventSchema(event) {
        return {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.name,
            "description": event.description,
            "startDate": event.startDate,
            "endDate": event.endDate,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
            "location": {
                "@type": "Place",
                "name": event.venue,
                "address": event.address
            },
            "organizer": {
                "@type": "Organization",
                "name": "PageantEmpress",
                "url": this.baseUrl
            },
            "offers": {
                "@type": "Offer",
                "price": event.price || "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        };
    }

    /**
     * Generate WebPage Schema
     */
    generateWebPageSchema(options) {
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": options.title,
            "description": options.description,
            "url": `${this.baseUrl}${options.url}`,
            "inLanguage": "en-US",
            "isPartOf": {
                "@type": "WebSite",
                "name": this.siteName,
                "url": this.baseUrl
            },
            "about": {
                "@type": "Organization",
                "name": this.organization.name
            },
            "mainEntity": options.mainEntity || null
        };
    }

    /**
     * Generate FAQ Schema
     */
    generateFAQSchema(faqs) {
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    }

    /**
     * Generate Breadcrumb Schema
     */
    generateBreadcrumbSchema(breadcrumbs) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": `${this.baseUrl}${item.url}`
            }))
        };
    }

    /**
     * Generate all meta tags for pages
     */
    generateAllMetaTags() {
        const metaTags = {
            'index.html': this.generateHomeMeta(),
            'about.html': this.generateAboutMeta(),
            'contestants.html': this.generateContestantsMeta(),
            'events.html': this.generateEventsMeta(),
            'voting.html': this.generateVotingMeta()
        };

        // Save to files
        Object.entries(metaTags).forEach(([filename, content]) => {
            fs.writeFileSync(`./meta-tags/${filename}`, content);
        });

        console.log('✅ All meta tags generated successfully!');
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new MetaTagGenerator();
    generator.generateAllMetaTags();
}

module.exports = MetaTagGenerator;
