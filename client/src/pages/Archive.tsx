import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { Search } from 'lucide-react';
import { groupArticlesByMonth, useBlogIndex } from '@/lib/contentApi';

export default function Archive() {
  const { data: index } = useBlogIndex();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get('search') ?? '';
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, []);

  const groupedArticles = useMemo(() => groupArticlesByMonth(index ?? { articles: [], authors: [], categories: [], tags: [] }), [index]);
  const articles = index?.articles ?? [];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const haystack = [
        article.title,
        article.excerpt,
        article.author.name,
        article.category.name,
        article.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = haystack.includes(searchQuery.toLowerCase());
      const monthKey = article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const matchesMonth = !selectedMonth || monthKey === selectedMonth;
      return matchesSearch && matchesMonth;
    });
  }, [articles, searchQuery, selectedMonth]);

  const months = Object.keys(groupedArticles).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Article Archive</h1>
          <p className="text-lg text-muted-foreground">
            Explore all articles from the aima editorial desk. Search by title, author, category, or browse by date.
          </p>
          <div className="accent-bar mt-8 w-24" />
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles, authors, categories..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-border bg-background py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">No articles found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMonth(null);
                  }}
                  className="font-semibold text-accent hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="mb-6 text-lg font-bold text-foreground">Filter by Month</h3>

              <div className="mb-8 space-y-2">
                <button
                  onClick={() => setSelectedMonth(null)}
                  className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                    selectedMonth === null
                      ? 'bg-accent font-semibold text-accent-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  All Articles ({articles.length})
                </button>

                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                      selectedMonth === month
                        ? 'bg-accent font-semibold text-accent-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {month} ({groupedArticles[month].length})
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-border bg-secondary p-6">
                <h4 className="mb-4 font-semibold text-foreground">Archive Stats</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Articles</span>
                    <span className="font-semibold text-foreground">{articles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Months</span>
                    <span className="font-semibold text-foreground">{months.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latest</span>
                    <span className="font-semibold text-foreground">
                      {articles[0]?.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ?? '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
