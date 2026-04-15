import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { articles, getLatestArticles } from '@/lib/mockData';
import { Search } from 'lucide-react';

/**
 * Archive Page Design Notes:
 * - Timeline view of articles grouped by month/year
 * - Search functionality to filter articles
 * - Vertical card layout for archive exploration
 */

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Group articles by month
  const groupedArticles = useMemo(() => {
    const groups: Record<string, typeof articles> = {};

    articles.forEach((article) => {
      const monthKey = article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(article);
    });

    return groups;
  }, []);

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      const monthKey = article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const matchesMonth = !selectedMonth || monthKey === selectedMonth;

      return matchesSearch && matchesMonth;
    });
  }, [searchQuery, selectedMonth]);

  const months = Object.keys(groupedArticles).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Article Archive</h1>
          <p className="text-lg text-muted-foreground">
            Explore all articles from the aima editorial desk. Search by title, author, category, or browse by date.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles, authors, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Articles List */}
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No articles found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedMonth(null);
                  }}
                  className="text-accent font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Filter by Month</h3>

              <div className="space-y-2 mb-8">
                <button
                  onClick={() => setSelectedMonth(null)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedMonth === null
                      ? 'bg-accent text-accent-foreground font-semibold'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  All Articles ({articles.length})
                </button>

                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedMonth === month
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {month} ({groupedArticles[month].length})
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Archive Stats</h4>
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
                      {articles[0]?.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
