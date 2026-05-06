import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Search, X } from 'lucide-react';
import { searchArticles, useBlogIndex } from '@/lib/contentApi';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: index } = useBlogIndex();

  const results = useMemo(() => {
    if (!index || !query.trim()) return [];
    return searchArticles(index, query).slice(0, 8);
  }, [index, query]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search articles, authors, protocols..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a
                    onClick={() => handleClear()}
                    className="block p-3 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-12 w-12 flex-shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {article.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
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
              <p className="mt-2 text-xs">Try a product name, protocol term, or author.</p>
            </div>
          ) : null}

          {results.length > 0 && (
            <div className="border-t border-border bg-secondary p-3">
              <Link href={`/archive?search=${encodeURIComponent(query)}`}>
                <a
                  onClick={() => handleClear()}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  View all results →
                </a>
              </Link>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
