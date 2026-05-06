import Layout from '@/components/Layout';
import { getArticlesForCategory, useBlogIndex } from '@/lib/contentApi';

export default function Categories() {
  const { data: index } = useBlogIndex();
  const categories = index?.categories ?? [];
  const totalArticles = categories.reduce((sum, category) => sum + (index ? getArticlesForCategory(index, category.slug).length : 0), 0);

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Explore Categories</h1>
          <p className="text-lg text-muted-foreground">
            Browse articles by topic. Each category contains curated content from the aima editorial desk.
          </p>
          <div className="accent-bar mt-8 w-24" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const articleCount = index ? getArticlesForCategory(index, category.slug).length : 0;
            return (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group block rounded-lg border border-border bg-secondary p-8 transition-colors hover:border-accent"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: category.color }} />
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                    {articleCount} article{articleCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>
                <div className="text-accent opacity-0 transition-opacity group-hover:opacity-100">→</div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="container py-12 text-center md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <p className="mb-2 text-4xl font-bold text-foreground">{categories.length}</p>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold text-foreground">{totalArticles}</p>
              <p className="text-muted-foreground">Total Articles</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold text-foreground">{Math.ceil(totalArticles / 5) || 0}</p>
              <p className="text-muted-foreground">Approx. Reading Sessions</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
