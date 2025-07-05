<?php
function generateSEOMeta($page = 'home', $data = []) {
    $siteUrl = 'https://pageantempress.com';
    $siteName = 'Pageant Empress';
    $siteDescription = 'Your ultimate destination for pageant training, beauty tips, fashion advice, and exclusive behind-the-scenes content. Transform your pageant journey with expert guidance.';
    
    $pages = [
        'home' => [
            'title' => 'Pageant Empress - Your Ultimate Pageant Training & Beauty Destination',
            'description' => 'Master pageant competitions with expert training, beauty tips, fashion advice, and exclusive content. Join thousands of successful contestants at Pageant Empress.',
            'keywords' => 'pageant training, beauty pageant, pageant tips, beauty contest, pageant coach, pageant preparation, beauty tips, fashion advice, pageant contestants',
            'image' => $siteUrl . '/assets/images/pageant-empress-og.jpg',
            'type' => 'website'
        ],
        'about' => [
            'title' => 'About Pageant Empress - Expert Pageant Training & Coaching',
            'description' => 'Learn about our expert pageant coaching team, training methodology, and success stories. Discover why Pageant Empress is the #1 choice for pageant preparation.',
            'keywords' => 'pageant coach, pageant training expert, pageant preparation, beauty pageant coaching, pageant success stories',
            'image' => $siteUrl . '/assets/images/about-pageant-empress.jpg',
            'type' => 'website'
        ],
        'blog' => [
            'title' => 'Pageant Blog - Latest Tips, Trends & Beauty Advice | Pageant Empress',
            'description' => 'Stay updated with the latest pageant tips, beauty trends, fashion advice, and industry insights. Expert articles to help you succeed in pageant competitions.',
            'keywords' => 'pageant blog, beauty tips, pageant advice, pageant trends, beauty contest tips, pageant preparation guide',
            'image' => $siteUrl . '/assets/images/pageant-blog-og.jpg',
            'type' => 'website'
        ],
        'contact' => [
            'title' => 'Contact Pageant Empress - Get Expert Pageant Coaching',
            'description' => 'Ready to start your pageant journey? Contact our expert coaching team for personalized training, beauty tips, and pageant preparation guidance.',
            'keywords' => 'pageant coaching contact, pageant training inquiry, beauty pageant coach, pageant preparation consultation',
            'image' => $siteUrl . '/assets/images/contact-pageant-empress.jpg',
            'type' => 'website'
        ]
    ];
    
    $meta = $pages[$page] ?? $pages['home'];
    
    // Override with custom data if provided
    if (!empty($data)) {
        $meta = array_merge($meta, $data);
    }
    
    echo generateMetaTags($meta, $siteUrl, $siteName);
}

function generateMetaTags($meta, $siteUrl, $siteName) {
    $currentUrl = $siteUrl . $_SERVER['REQUEST_URI'];
    
    return "
    <!-- Primary Meta Tags -->
    <title>{$meta['title']}</title>
    <meta name=\"title\" content=\"{$meta['title']}\">
    <meta name=\"description\" content=\"{$meta['description']}\">
    <meta name=\"keywords\" content=\"{$meta['keywords']}\">
    <meta name=\"author\" content=\"{$siteName}\">
    <meta name=\"robots\" content=\"index, follow\">
    <meta name=\"language\" content=\"English\">
    <meta name=\"revisit-after\" content=\"7 days\">
    
    <!-- Open Graph / Facebook -->
    <meta property=\"og:type\" content=\"{$meta['type']}\">
    <meta property=\"og:url\" content=\"{$currentUrl}\">
    <meta property=\"og:title\" content=\"{$meta['title']}\">
    <meta property=\"og:description\" content=\"{$meta['description']}\">
    <meta property=\"og:image\" content=\"{$meta['image']}\">
    <meta property=\"og:image:width\" content=\"1200\">
    <meta property=\"og:image:height\" content=\"630\">
    <meta property=\"og:site_name\" content=\"{$siteName}\">
    <meta property=\"og:locale\" content=\"en_US\">
    
    <!-- Twitter -->
    <meta property=\"twitter:card\" content=\"summary_large_image\">
    <meta property=\"twitter:url\" content=\"{$currentUrl}\">
    <meta property=\"twitter:title\" content=\"{$meta['title']}\">
    <meta property=\"twitter:description\" content=\"{$meta['description']}\">
    <meta property=\"twitter:image\" content=\"{$meta['image']}\">
    <meta property=\"twitter:creator\" content=\"@pageantempress\">
    <meta property=\"twitter:site\" content=\"@pageantempress\">
    
    <!-- Additional SEO Tags -->
    <meta name=\"theme-color\" content=\"#C13584\">
    <meta name=\"msapplication-TileColor\" content=\"#C13584\">
    <meta name=\"msapplication-config\" content=\"{$siteUrl}/browserconfig.xml\">
    
    <!-- Canonical URL -->
    <link rel=\"canonical\" href=\"{$currentUrl}\">
    
    <!-- Preconnect for performance -->
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link rel=\"preconnect\" href=\"https://cdnjs.cloudflare.com\">
    <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\">
    
    <!-- DNS Prefetch -->
    <link rel=\"dns-prefetch\" href=\"//www.google-analytics.com\">
    <link rel=\"dns-prefetch\" href=\"//www.googletagmanager.com\">
    <link rel=\"dns-prefetch\" href=\"//instagram.com\">
    <link rel=\"dns-prefetch\" href=\"//youtube.com\">
    ";
}
?>
