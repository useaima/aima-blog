import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import { categories, getArticlesByCategory } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';

/**
 * Category Page Design Notes:
 * - Category header with description
 * - Articles grid filtered by category
 * - Sidebar with other categories
 */

export default function Category() {
  const [, params] = useRoute('/category/:slug');
  const slug = params?.slug as string;
  const category = categories.find((c) => c.slug === slug);
  const categoryArticles = category ? getArticlesByCategory(slug) : [];

  if (!category) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Category not found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/">
            <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Back to Home
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border bg-secondary">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Categories', href: '/categories' },
              { label: category.name },
            ]}
          />
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="flex items-start gap-6 mb-6">
            <div
              className="w-16 h-16 rounded-lg flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{category.name}</h1>
              <p className="text-lg text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <div className="accent-bar w-24" />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            {categoryArticles.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-8">
                  {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''} in this category
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {categoryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="featured" />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No articles found in this category yet.</p>
                <Link href="/">
                  <a className="text-accent font-semibold hover:underline">
                    Browse all articles →
                  </a>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Other Categories</h3>
              <div className="space-y-3">
                {categories
                  .filter((c) => c.id !== category.id)
                  .map((otherCategory) => (
                    <Link key={otherCategory.id} href={`/category/${otherCategory.slug}`}>
                      <a className="block p-4 rounded-lg bg-secondary border border-border hover:border-accent transition-colors group">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded flex-shrink-0 mt-1"
                            style={{ backgroundColor: otherCategory.color }}
                          />
                          <div>
                            <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {otherCategory.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getArticlesByCategory(otherCategory.slug).length} articles
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
