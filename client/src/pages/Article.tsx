import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { getArticleBySlug, getArticlesByCategory, getLatestArticles } from '@/lib/mockData';
import { ArrowLeft, Share2, BookmarkPlus } from 'lucide-react';

/**
 * Article Detail Page Design Notes:
 * - Full-width article with centered content
 * - Featured image at top
 * - Article metadata (author, date, read time) prominently displayed
 * - Related articles sidebar
 * - Newsletter signup at bottom
 * - Author bio section
 */

export default function Article() {
  const [, params] = useRoute('/article/:slug');
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/">
            <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Back to Home
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedArticles = getArticlesByCategory(article.category.slug).filter((a) => a.id !== article.id).slice(0, 3);
  const recentArticles = getLatestArticles(3);

  return (
    <Layout>
      {/* Back Button */}
      <div className="border-b border-border bg-secondary">
        <div className="container py-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-accent hover:underline font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </a>
          </Link>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-full h-96 md:h-[500px] overflow-hidden bg-secondary">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Content */}
      <article className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Category Badge */}
            <div className="category-badge mb-4">{article.category.name}</div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border mb-8">
              {/* Author */}
              <Link href={`/author/${article.author.id}`}>
                <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-accent">{article.author.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{article.author.name}</p>
                    <p className="text-xs text-muted-foreground">{article.author.title}</p>
                  </div>
                </a>
              </Link>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-border" />

              {/* Date & Read Time */}
              <div className="text-sm text-muted-foreground">
                <p>{article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>{article.readTime} min read</p>
              </div>

              {/* Share & Bookmark */}
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Share article">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Bookmark article">
                  <BookmarkPlus className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">{article.excerpt}</p>
              <p className="text-base text-foreground leading-relaxed">{article.content}</p>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="py-8 border-t border-b border-border mb-8">
                <p className="text-sm font-semibold text-muted-foreground mb-4">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Link key={tag} href={`/tag/${tag}`}>
                      <a className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm hover:bg-accent/10 hover:text-accent transition-colors">
                        #{tag}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Card */}
            <div className="bg-secondary rounded-lg p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">{article.author.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{article.author.name}</h3>
                  <p className="text-sm text-accent font-semibold mb-3">{article.author.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">{article.author.bio}</p>
                  <Link href={`/author/${article.author.id}`}>
                    <a className="text-accent font-semibold text-sm hover:underline">
                      View author page →
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-lg font-bold text-foreground mb-6">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <ArticleCard key={relatedArticle.id} article={relatedArticle} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h4 className="font-bold text-foreground mb-2">Stay Updated</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get new articles delivered to your inbox every week.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* More from Category Section */}
      {relatedArticles.length > 0 && (
        <section className="bg-secondary border-y border-border">
          <div className="container py-12 md:py-16">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              More from {article.category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles Section */}
      <section className="container py-12 md:py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentArticles.map((recentArticle) => (
            <ArticleCard key={recentArticle.id} article={recentArticle} variant="featured" />
          ))}
        </div>
      </section>
    </Layout>
  );
}
