import { authors, articles, categories } from './mockData';

/**
 * Sitemap Generator
 * Generates XML sitemaps for SEO optimization
 * Includes author profiles, articles, and category pages
 */

const BASE_URL = 'https://blog.useaima.com';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate author sitemap entries
 */
export function generateAuthorSitemapEntries(): SitemapEntry[] {
  return authors.map((author) => ({
    loc: `${BASE_URL}/author/${author.id}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.7,
  }));
}

/**
 * Generate article sitemap entries
 */
export function generateArticleSitemapEntries(): SitemapEntry[] {
  return articles.map((article) => ({
    loc: `${BASE_URL}/article/${article.slug}`,
    lastmod: article.publishedAt.toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));
}

/**
 * Generate category sitemap entries
 */
export function generateCategorySitemapEntries(): SitemapEntry[] {
  return categories.map((category) => ({
    loc: `${BASE_URL}/category/${category.slug}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.6,
  }));
}

/**
 * Generate main pages sitemap entries
 */
export function generateMainPagesSitemapEntries(): SitemapEntry[] {
  return [
    {
      loc: BASE_URL,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: 1.0,
    },
    {
      loc: `${BASE_URL}/authors`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/categories`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily' as const,
      priority: 0.7,
    },
    {
      loc: `${BASE_URL}/guest-authors`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.6,
    },
    {
      loc: `${BASE_URL}/contribute`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly' as const,
      priority: 0.5,
    },
  ];
}

/**
 * Generate complete sitemap XML
 */
export function generateSitemapXML(): string {
  const entries = [
    ...generateMainPagesSitemapEntries(),
    ...generateArticleSitemapEntries(),
    ...generateAuthorSitemapEntries(),
    ...generateCategorySitemapEntries(),
  ];

  const xmlEntries = entries
    .map(
      (entry) => `
  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

/**
 * Generate sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(): string {
  const sitemaps = [
    {
      loc: `${BASE_URL}/sitemap-main.xml`,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      loc: `${BASE_URL}/sitemap-articles.xml`,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      loc: `${BASE_URL}/sitemap-authors.xml`,
      lastmod: new Date().toISOString().split('T')[0],
    },
  ];

  const xmlEntries = sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</sitemapindex>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml

# Crawl delay for bots
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /
`;
}
