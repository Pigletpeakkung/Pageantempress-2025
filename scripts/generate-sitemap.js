const fs = require('fs');

const baseUrl = 'https://pageantempress.com';
const currentDate = new Date().toISOString().split('T')[0];

// Check which HTML files actually exist
const possiblePages = [
  { file: 'index.html', url: '', priority: '1.0', changefreq: 'daily' },
  { file: 'about.html', url: 'about.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'registration.html', url: 'registration.html', priority: '0.9', changefreq: 'weekly' },
  { file: 'contact.html', url: 'contact.html', priority: '0.7', changefreq: 'monthly' },
  { file: 'contestants.html', url: 'contestants.html', priority: '0.9', changefreq: 'weekly' },
  { file: 'events.html', url: 'events.html', priority: '0.8', changefreq: 'weekly' },
  { file: 'gallery.html', url: 'gallery.html', priority: '0.7', changefreq: 'weekly' }
];

// Only include pages that exist
const existingPages = possiblePages.filter(page => {
  const exists = fs.existsSync(page.file);
  if (exists) {
    console.log(`✅ Found: ${page.file}`);
  }
  return exists;
});

if (existingPages.length === 0) {
  console.log('❌ No HTML files found! Make sure you have index.html');
  process.exit(1);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${existingPages.map(page => `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log(`🎉 Sitemap generated with ${existingPages.length} pages!`);
