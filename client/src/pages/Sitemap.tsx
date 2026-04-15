import { useEffect } from 'react';
import { generateSitemapXML } from '@/lib/sitemap';

/**
 * Sitemap Page
 * Serves dynamic XML sitemap for search engines
 * Route: /sitemap.xml
 */

export default function Sitemap() {
  useEffect(() => {
    // Generate sitemap XML
    const sitemapXml = generateSitemapXML();

    // Create blob and download
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Sitemap</h1>
        <p className="text-muted-foreground">Generating sitemap.xml...</p>
      </div>
    </div>
  );
}
