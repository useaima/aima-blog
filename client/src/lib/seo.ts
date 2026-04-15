/**
 * SEO Optimization Utilities
 * Provides structured data, meta tags, and SEO helpers
 */

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'article' | 'website' | 'person';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleSchema(article: {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: { name: string; image?: string };
  publishedAt: Date;
  updatedAt?: Date;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt?.toISOString() || article.publishedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      image: article.author.image,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aima Editorial Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blog.useaima.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aima',
    url: 'https://useaima.com',
    logo: 'https://useaima.com/logo.png',
    description: 'AI agents for personal finance and financial systems',
    sameAs: [
      'https://twitter.com/aima',
      'https://github.com/useaima',
      'https://instagram.com/aima.ai123',
      'https://youtube.com/@aima',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'help@useaima.com',
      url: 'https://support.useaima.com',
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumb navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(seo: SEOMetaTags): Record<string, string> {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', ') || '',
    'og:title': seo.title,
    'og:description': seo.description,
    'og:image': seo.image || '',
    'og:url': seo.url || '',
    'og:type': seo.type || 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': seo.title,
    'twitter:description': seo.description,
    'twitter:image': seo.image || '',
    'article:author': seo.author || '',
    'article:published_time': seo.publishedDate || '',
    'article:modified_time': seo.modifiedDate || '',
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `https://blog.useaima.com${path}`;
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(
  url: string,
  lastModified: Date = new Date(),
  priority: number = 0.8,
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
) {
  return {
    url,
    lastModified: lastModified.toISOString().split('T')[0],
    changeFreq,
    priority,
  };
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://blog.useaima.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;
}

/**
 * AEO (Answer Engine Optimization) - Optimize for AI search engines
 */
export function generateAEOContent(article: {
  title: string;
  excerpt: string;
  content: string;
  keyQuestions: string[];
}) {
  return {
    // Direct answers to common questions
    qaFormat: article.keyQuestions.map((q) => ({
      question: q,
      answer: article.excerpt,
    })),
    // Structured content for AI parsing
    summary: article.excerpt,
    fullContent: article.content,
    // Entity extraction for knowledge graphs
    entities: extractEntities(article.content),
  };
}

/**
 * Extract entities from content for knowledge graphs
 */
function extractEntities(content: string): string[] {
  // Simple entity extraction - in production use NLP library
  const patterns = [
    /(?:^|\s)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g, // Proper nouns
    /\$[\d,]+(?:\.\d{2})?/g, // Currency
    /\d{1,2}%/g, // Percentages
  ];

  const entities: Set<string> = new Set();
  patterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach((match) => entities.add(match.trim()));
    }
  });

  return Array.from(entities);
}

/**
 * GEO (Geographic SEO) - Optimize for location-based searches
 */
export function generateGEOMetaTags(location?: {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}) {
  if (!location) return {};

  return {
    'geo.placename': location.city || 'Global',
    'geo.country': location.country || 'Global',
    ...(location.latitude && location.longitude && {
      'geo.position': `${location.latitude};${location.longitude}`,
    }),
    'ICBM': location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : undefined,
  };
}
