import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getArticlesForTag, useBlogIndex } from '@/lib/contentApi';

export default function Tag() {
  const [, params] = useRoute('/tag/:tag');
  const tag = params?.tag as string | undefined;
  const { data: index } = useBlogIndex();
  const tagArticles = tag && index ? getArticlesForTag(index, tag) : [];
  const allTags = index?.tags ?? [];

  if (!tag || tagArticles.length === 0) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Tag not found</h1>
          <p className="mb-8 text-muted-foreground">No articles found with this tag.</p>
          <Link href="/">
            <a className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              Back to Home
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="border-b border-border bg-secondary">
        <div className="container py-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 font-semibold text-accent hover:underline">
              <span aria-hidden="true" className="text-base leading-none">←</span>
              Back to Articles
            </a>
          </Link>
        </div>
      </div>

      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <div className="mb-6">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">#{tag}</h1>
            <p className="text-lg text-muted-foreground">
              {tagArticles.length} article{tagArticles.length !== 1 ? 's' : ''} tagged with "{tag}"
            </p>
          </div>
          <div className="accent-bar w-24" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {tagArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="mb-6 text-lg font-bold text-foreground">Other Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags
                  .filter((entry) => entry !== tag)
                  .map((otherTag) => (
                    <Link key={otherTag} href={`/tag/${otherTag}`}>
                      <a className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground transition-colors hover:bg-accent/10 hover:text-accent">
                        #{otherTag}
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
