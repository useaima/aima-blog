import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getArticlesByTag, getAllTags } from '@/lib/mockData';

/**
 * Tag Page Design Notes:
 * - Tag header with article count
 * - Articles grid filtered by tag
 * - Sidebar with other tags
 */

export default function Tag() {
  const [, params] = useRoute('/tag/:tag');
  const tag = params?.tag as string;
  const tagArticles = tag ? getArticlesByTag(tag) : [];
  const allTags = getAllTags();

  if (!tag || tagArticles.length === 0) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Tag not found</h1>
          <p className="text-muted-foreground mb-8">No articles found with this tag.</p>
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
      {/* Back Button */}
      <div className="border-b border-border bg-secondary">
        <div className="container py-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-accent hover:underline font-semibold">
              <span aria-hidden="true" className="text-base leading-none">←</span>
              Back to Articles
            </a>
          </Link>
        </div>
      </div>

      {/* Tag Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              #{tag}
            </h1>
            <p className="text-lg text-muted-foreground">
              {tagArticles.length} article{tagArticles.length !== 1 ? 's' : ''} tagged with "{tag}"
            </p>
          </div>
          <div className="accent-bar w-24" />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tagArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Other Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags
                  .filter((t) => t !== tag)
                  .map((otherTag) => (
                    <Link key={otherTag} href={`/tag/${otherTag}`}>
                      <a className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm hover:bg-accent/10 hover:text-accent transition-colors border border-border">
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
