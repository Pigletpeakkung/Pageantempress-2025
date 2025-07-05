<?php
header('Content-Type: application/xml; charset=utf-8');

$baseUrl = 'https://pageantempress.com';
$lastmod = date('Y-m-d');

// Static pages
$staticPages = [
    ['url' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
    ['url' => '/about', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['url' => '/blog', 'priority' => '0.9', 'changefreq' => 'daily'],
    ['url' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['url' => '/services', 'priority' => '0.8', 'changefreq' => 'monthly'],
    ['url' => '/gallery', 'priority' => '0.7', 'changefreq' => 'weekly'],
    ['url' => '/testimonials', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ['url' => '/media-kit', 'priority' => '0.6', 'changefreq' => 'monthly'],
    ['url' => '/privacy-policy', 'priority' => '0.3', 'changefreq' => 'yearly'],
    ['url' => '/terms-of-service', 'priority' => '0.3', 'changefreq' => 'yearly']
];

// Dynamic blog posts (you can load these from your blog system)
$blogPosts = [
    ['slug' => 'pageant-training-tips-2025', 'date' => '2024-12-20'],
    ['slug' => 'beauty-pageant-preparation-guide', 'date' => '2024-12-18'],
    ['slug' => 'pageant-interview-techniques', 'date' => '2024-12-15'],
    ['slug' => 'evening-gown-selection-tips', 'date' => '2024-12-12'],
    ['slug' => 'pageant-fitness-routines', 'date' => '2024-12-10']
];

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    
    <?php foreach ($staticPages as $page): ?>
    <url>
        <loc><?php echo $baseUrl . $page['url']; ?></loc>
        <lastmod><?php echo $lastmod; ?></lastmod>
        <changefreq><?php echo $page['changefreq']; ?></changefreq>
        <priority><?php echo $page['priority']; ?></priority>
    </url>
    <?php endforeach; ?>
    
    <?php foreach ($blogPosts as $post): ?>
    <url>
        <loc><?php echo $baseUrl . '/blog/' . $post['slug']; ?></loc>
        <lastmod><?php echo $post['date']; ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
        <image:image>
            <image:loc><?php echo $baseUrl . '/assets/images/blog/' . $post['slug'] . '.jpg'; ?></image:loc>
            <image:title><?php echo ucwords(str_replace('-', ' ', $post['slug'])); ?></image:title>
        </image:image>
    </url>
    <?php endforeach; ?>
    
</urlset>
