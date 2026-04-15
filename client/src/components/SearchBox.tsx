import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, X } from 'lucide-react';
import { articles, authors } from '@/lib/mockData';

/**
 * Real-time Search Component
 * Provides instant search results for articles and authors
 * Filters by title, content, author, and tags
 */

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Real-time search filtering
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const searchResults = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.author.name.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        article.category.name.toLowerCase().includes(lowerQuery)
    );

    return searchResults.slice(0, 8); // Limit to 8 results
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search articles, authors, topics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a
                    onClick={() => handleClear()}
                    className="block p-3 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.author.name} • {article.category.name}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No articles found for "{query}"</p>
              <p className="text-xs mt-2">Try searching with different keywords</p>
            </div>
          ) : null}

          {/* View All Results Link */}
          {results.length > 0 && (
            <div className="p-3 border-t border-border bg-secondary">
              <Link href={`/archive?search=${encodeURIComponent(query)}`}>
                <a
                  onClick={() => handleClear()}
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  View all results →
                </a>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
