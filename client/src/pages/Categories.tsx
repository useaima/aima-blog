import Layout from '@/components/Layout';
import CategoryGrid from '@/components/CategoryGrid';
import { categories, getArticlesByCategory } from '@/lib/mockData';

/**
 * Categories Page Design Notes:
 * - Display all categories in a grid
 * - Show article count for each category
 * - Link to category detail pages
 */

export default function Categories() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Explore Categories</h1>
          <p className="text-lg text-muted-foreground">
            Browse articles by topic. Each category contains curated content from the aima editorial desk.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const articleCount = getArticlesByCategory(category.slug).length;
            return (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group block p-8 rounded-lg bg-secondary border border-border hover:border-accent transition-colors"
              >
                {/* Category Icon/Color Bar */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {articleCount} article{articleCount !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                {/* Arrow */}
                <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">{categories.length}</p>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">
                {categories.reduce((sum, cat) => sum + getArticlesByCategory(cat.slug).length, 0)}
              </p>
              <p className="text-muted-foreground">Total Articles</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-foreground mb-2">
                {Math.ceil(
                  categories.reduce((sum, cat) => sum + getArticlesByCategory(cat.slug).length, 0) / 5
                )}
              </p>
              <p className="text-muted-foreground">Minutes to Read</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
