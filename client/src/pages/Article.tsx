import { useEffect, useMemo, useState } from 'react';
import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import AuthorBio from '@/components/AuthorBio';
import NewsletterSignup from '@/components/NewsletterSignup';
import Comments from '@/components/Comments';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedArticles from '@/components/RelatedArticles';
import SocialShare from '@/components/SocialShare';
import BookmarkButton from '@/components/BookmarkButton';
import { getArticleBySlug, getArticlesByCategory, getLatestArticles } from '@/lib/mockData';

type ContentBlock =
  | { type: 'h1' | 'h2' | 'h3'; content: string }
  | { type: 'p'; content: string }
  | { type: 'ul' | 'ol'; items: string[] };

function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    blocks.push({ type: 'p', content: paragraphBuffer.join(' ').trim() });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length || !listType) return;
    blocks.push({ type: listType, items: [...listBuffer] });
    listBuffer = [];
    listType = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h1', content: line.replace(/^#\s+/, '') });
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', content: line.replace(/^##\s+/, '') });
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', content: line.replace(/^###\s+/, '') });
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export default function Article() {
  const [, params] = useRoute('/article/:slug');
  const slug = params?.slug as string;
  const article = getArticleBySlug(slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      setProgress(next);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const contentBlocks = useMemo(() => (article ? parseContentBlocks(article.content) : []), [article]);

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
  const recentArticles = getLatestArticles(3).filter((a) => a.id !== article.id);

  return (
    <Layout>
      <div className="fixed top-0 left-0 z-50 h-1 bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />

      <div className="border-b border-border bg-secondary">
        <div className="container">
          <Breadcrumb
            items={[
              { label: article.category.name, href: `/category/${article.category.slug}` },
              { label: article.title },
            ]}
          />
        </div>
      </div>

      <div className="w-full h-80 md:h-[460px] overflow-hidden bg-secondary">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <article className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="category-badge mb-4">{article.category.name}</div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border mb-8">
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

              <div className="hidden sm:block w-px h-8 bg-border" />

              <div className="text-sm text-muted-foreground">
                <p>{article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Updated {article.updatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p>{article.readTime} min read</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <SocialShare
                  title={article.title}
                  url={`https://blog.useaima.com/article/${article.slug}`}
                  description={article.excerpt}
                  variant="horizontal"
                />
                <BookmarkButton articleId={Number(article.id)} />
              </div>
            </div>

            <aside className="mb-10 rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">Quick Summary</p>
              <p className="text-base leading-7 text-foreground mb-4">{article.excerpt}</p>
              <a
                href="https://eva.useaima.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Open eva
              </a>
            </aside>

            <div className="space-y-6">
              {contentBlocks.map((block, index) => {
                if (block.type === 'h1') {
                  return (
                    <h2 key={`${block.type}-${index}`} className="text-3xl font-bold text-foreground pt-2">
                      {block.content}
                    </h2>
                  );
                }

                if (block.type === 'h2') {
                  return (
                    <h2 key={`${block.type}-${index}`} className="text-2xl font-bold text-foreground pt-6">
                      {block.content}
                    </h2>
                  );
                }

                if (block.type === 'h3') {
                  return (
                    <h3 key={`${block.type}-${index}`} className="text-xl font-semibold text-foreground pt-4">
                      {block.content}
                    </h3>
                  );
                }

                if (block.type === 'ul' || block.type === 'ol') {
                  const ListTag = block.type;
                  return (
                    <ListTag key={`${block.type}-${index}`} className="space-y-3 pl-6 text-base leading-8 text-muted-foreground list-disc marker:text-accent">
                      {block.items.map((item, itemIndex) => (
                        <li key={`${block.type}-${index}-${itemIndex}`}>{item}</li>
                      ))}
                    </ListTag>
                  );
                }

                return (
                  <p key={`${block.type}-${index}`} className="text-base md:text-lg leading-8 text-muted-foreground">
                    {block.content}
                  </p>
                );
              })}
            </div>

            {article.tags.length > 0 && (
              <div className="py-8 border-t border-b border-border mt-12 mb-8">
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

            <div className="bg-secondary rounded-lg p-8 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">{article.author.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{article.author.name}</h3>
                  <p className="text-sm text-accent font-semibold mb-3">{article.author.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">{article.author.bio}</p>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    {article.author.instagram && (
                      <a
                        href={`https://instagram.com/${article.author.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Instagram
                      </a>
                    )}
                    {article.author.facebook && (
                      <a
                        href={`https://facebook.com/${encodeURIComponent(article.author.facebook)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                  <Link href={`/author/${article.author.id}`}>
                    <a className="text-accent font-semibold text-sm hover:underline">
                      View author page →
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {relatedArticles.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-6">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <ArticleCard key={relatedArticle.id} article={relatedArticle} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h4 className="font-bold text-foreground mb-2">Go From Reading To Action</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Use eva to review spending behavior, spot subscription waste, and turn financial signals into better next-step decisions.
                </p>
                <a
                  href="https://eva.useaima.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Open eva
                </a>
              </div>
            </div>
          </aside>
        </div>
      </article>

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

      <section className="container py-12 md:py-16 border-b border-border">
        <Comments articleId={article.id} />
      </section>

      <section className="container py-12 md:py-16 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <AuthorBio author={article.author} />
        </div>
      </section>

      <section className="container py-12 md:py-16 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup variant="full-width" />
        </div>
      </section>

      <RelatedArticles articles={recentArticles} title="Latest from the Editorial Desk" variant="grid" />
    </Layout>
  );
}
