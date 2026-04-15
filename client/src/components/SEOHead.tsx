import { useEffect } from 'react';
import { generateMetaTags, generateCanonicalUrl, generateArticleSchema, generateOrganizationSchema } from '@/lib/seo';

/**
 * SEO Head Component
 * Manages meta tags, canonical URLs, and structured data
 */

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'article' | 'website' | 'person';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  articleData?: {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: { name: string; image?: string };
    publishedAt: Date;
    updatedAt?: Date;
    url: string;
  };
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedDate,
  modifiedDate,
  articleData,
}: SEOHeadProps) {
  useEffect(() => {
    // Update page title
    document.title = title;

    // Generate and set meta tags
    const metaTags = generateMetaTags({
      title,
      description,
      keywords,
      image,
      url: url || generateCanonicalUrl(window.location.pathname),
      type,
      author,
      publishedDate,
      modifiedDate,
    });

    // Set meta tags
    Object.entries(metaTags).forEach(([key, value]) => {
      if (!value) return;

      let element = document.querySelector(`meta[name="${key}"]`) || document.querySelector(`meta[property="${key}"]`);

      if (!element) {
        element = document.createElement('meta');
        if (key.startsWith('og:') || key.startsWith('article:') || key.startsWith('twitter:')) {
          element.setAttribute('property', key);
        } else {
          element.setAttribute('name', key);
        }
        document.head.appendChild(element);
      }

      element.setAttribute('content', value);
    });

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || generateCanonicalUrl(window.location.pathname));

    // Add structured data for articles
    if (articleData) {
      const schema = generateArticleSchema(articleData);
      let scriptElement = document.querySelector('script[type="application/ld+json"][data-type="article"]');

      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        scriptElement.setAttribute('data-type', 'article');
        document.head.appendChild(scriptElement);
      }

      scriptElement.textContent = JSON.stringify(schema);
    }

    // Add organization schema once
    if (!document.querySelector('script[type="application/ld+json"][data-type="organization"]')) {
      const orgSchema = generateOrganizationSchema();
      const orgScript = document.createElement('script');
      orgScript.setAttribute('type', 'application/ld+json');
      orgScript.setAttribute('data-type', 'organization');
      orgScript.textContent = JSON.stringify(orgSchema);
      document.head.appendChild(orgScript);
    }
  }, [title, description, keywords, image, url, type, author, publishedDate, modifiedDate, articleData]);

  return null; // This component doesn't render anything
}
