import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import { getArticlesForCategory, useBlogIndex } from '@/lib/contentApi';

export default function Category() {
  const [, params] = useRoute('/category/:slug');
  const slug = params?.slug as string | undefined;
  const { data: index } = useBlogIndex();
  const category = index?.categories.find((entry) => entry.slug === slug);
  const categoryArticles = category && index ? getArticlesForCategory(index, category.slug) : [];

  if (!category) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Category not found</h1>
          <p className="mb-8 text-muted-foreground">The category you're looking for doesn't exist.</p>
          <Link href="/">
            <a className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              Back to Home
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  const otherCategories = (index?.categories ?? []).filter((entry) => entry.id !== category.id);

  return (
    <Layout>
      <div className="border-b border-border bg-secondary">
        <div className="container">
          <Breadcrumb items={[{ label: 'Categories', href: '/categories' }, { label: category.name }]} />
        </div>
      </div>

      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <div className="mb-6 flex items-start gap-6">
            <div className="h-16 w-16 flex-shrink-0 rounded-lg" style={{ backgroundColor: category.color }} />
            <div className="flex-1">
              <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">{category.name}</h1>
              <p className="text-lg text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <div className="accent-bar w-24" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {categoryArticles.length > 0 ? (
              <>
                <p className="mb-8 text-muted-foreground">
                  {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''} in this category
                </p>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {categoryArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="featured" />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">No articles found in this category yet.</p>
                <Link href="/">
                  <a className="font-semibold text-accent hover:underline">Browse all articles →</a>
                </Link>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="mb-6 text-lg font-bold text-foreground">Other Categories</h3>
              <div className="space-y-3">
                {otherCategories.map((otherCategory) => {
                  const count = index ? getArticlesForCategory(index, otherCategory.slug).length : 0;
                  return (
                    <Link key={otherCategory.id} href={`/category/${otherCategory.slug}`}>
                      <a className="group block rounded-lg border border-border bg-secondary p-4 transition-colors hover:border-accent">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-8 w-8 flex-shrink-0 rounded" style={{ backgroundColor: otherCategory.color }} />
                          <div>
                            <h4 className="font-semibold text-foreground transition-colors group-hover:text-accent">
                              {otherCategory.name}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground">{count} articles</p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
