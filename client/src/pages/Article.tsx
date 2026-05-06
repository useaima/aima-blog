import { useEffect, useMemo, useState } from 'react';
import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import AuthorBio from '@/components/AuthorBio';
import Breadcrumb from '@/components/Breadcrumb';
import RelatedArticles from '@/components/RelatedArticles';
import SocialShare from '@/components/SocialShare';
import { getPrimaryProductSlug, getRelatedArticles, useBlogArticle, useBlogIndex, usePlatformData } from '@/lib/contentApi';

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
  const slug = params?.slug as string | undefined;
  const { data: article, isLoading } = useBlogArticle(slug);
  const { data: index } = useBlogIndex();
  const { data: platform } = usePlatformData();
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
  const relatedArticles = article && index ? getRelatedArticles(index, article, 3) : [];
  const productSlug = getPrimaryProductSlug(article ?? null);
  const primaryProduct = platform?.products.find((product) => product.slug === productSlug);

  if (!isLoading && !article) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Article not found</h1>
          <p className="mb-8 text-muted-foreground">The article you're looking for doesn't exist.</p>
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
      <div className="fixed left-0 top-0 z-50 h-1 bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />

      {article ? (
        <>
          <div className="border-b border-border bg-secondary">
            <div className="container">
              <Breadcrumb
                items={[
                  { label: 'Categories', href: '/categories' },
                  { label: article.category.name, href: `/category/${article.category.slug}` },
                  { label: article.title },
                ]}
              />
            </div>
          </div>

          <div className="h-80 w-full overflow-hidden bg-secondary md:h-[460px]">
            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
          </div>

          <article className="container py-12 md:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="category-badge mb-4">{article.category.name}</div>

                <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  {article.title}
                </h1>

                <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-border pb-8">
                  <Link href={`/author/${article.author.id}`}>
                    <a className="flex items-center gap-3 transition-opacity hover:opacity-80">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                        <span className="font-bold text-accent">{article.author.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{article.author.name}</p>
                        <p className="text-xs text-muted-foreground">{article.author.title}</p>
                      </div>
                    </a>
                  </Link>

                  <div className="hidden h-8 w-px bg-border sm:block" />

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
                  </div>
                </div>

                <aside className="mb-10 rounded-2xl border border-accent/20 bg-accent/5 p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Quick Summary</p>
                  <p className="mb-4 text-base leading-7 text-foreground">{article.excerpt}</p>
                  {primaryProduct ? (
                    <a
                      href={primaryProduct.primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                    >
                      {primaryProduct.primaryLabel}
                    </a>
                  ) : null}
                </aside>

                <div className="space-y-6">
                  {contentBlocks.map((block, index) => {
                    if (block.type === 'h1') {
                      return (
                        <h2 key={`${block.type}-${index}`} className="pt-2 text-3xl font-bold text-foreground">
                          {block.content}
                        </h2>
                      );
                    }

                    if (block.type === 'h2') {
                      return (
                        <h2 key={`${block.type}-${index}`} className="pt-6 text-2xl font-bold text-foreground">
                          {block.content}
                        </h2>
                      );
                    }

                    if (block.type === 'h3') {
                      return (
                        <h3 key={`${block.type}-${index}`} className="pt-4 text-xl font-semibold text-foreground">
                          {block.content}
                        </h3>
                      );
                    }

                    if (block.type === 'ul' || block.type === 'ol') {
                      const ListTag = block.type;
                      const listClass = block.type === 'ol'
                        ? 'list-decimal'
                        : 'list-disc';

                      return (
                        <ListTag key={`${block.type}-${index}`} className={`space-y-3 pl-6 text-base leading-8 text-muted-foreground ${listClass} marker:text-accent`}>
                          {block.items.map((item, itemIndex) => (
                            <li key={`${block.type}-${index}-${itemIndex}`}>{item}</li>
                          ))}
                        </ListTag>
                      );
                    }

                    return (
                      <p key={`${block.type}-${index}`} className="text-base leading-8 text-muted-foreground md:text-lg">
                        {block.content}
                      </p>
                    );
                  })}
                </div>

                {article.tags.length > 0 ? (
                  <div className="mb-8 mt-12 border-y border-border py-8">
                    <p className="mb-4 text-sm font-semibold text-muted-foreground">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Link key={tag} href={`/tag/${tag}`}>
                          <a className="rounded-full border border-border bg-secondary px-3 py-1 text-sm text-foreground transition-colors hover:border-accent hover:text-accent">
                            #{tag}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-secondary p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Next Step</p>
                    <h2 className="mb-3 text-xl font-bold text-foreground">Move from reading to action.</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Open the matching AIMA product or go straight to the support center if you need implementation help.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {primaryProduct ? (
                        <a
                          href={primaryProduct.primaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                        >
                          {primaryProduct.primaryLabel}
                        </a>
                      ) : null}
                      <a
                        href={platform?.settings?.supportUrl ?? 'https://support.useaima.com'}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                      >
                        Open support
                      </a>
                    </div>
                  </div>
                  <AuthorBio author={article.author} />
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl border border-border bg-secondary p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Product Link</p>
                    <h3 className="mb-2 text-xl font-bold text-foreground">{primaryProduct?.name ?? 'AIMA Product'}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{primaryProduct?.summary}</p>
                    {primaryProduct ? (
                      <a
                        href={primaryProduct.primaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                      >
                        {primaryProduct.primaryLabel} →
                      </a>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          </article>

          <RelatedArticles articles={relatedArticles} title="Related Articles" variant="grid" />
        </>
      ) : null}
    </Layout>
  );
}
