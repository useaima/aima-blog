import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useBlogAuthor, useBlogIndex } from '@/lib/contentApi';
import { formatSocialLabel, resolveFacebookHref, resolveInstagramHref } from '@/lib/socialLinks';

export default function Author() {
  const [, params] = useRoute('/author/:id');
  const authorId = params?.id as string | undefined;
  const { data: authorPayload, isLoading } = useBlogAuthor(authorId);
  const { data: index } = useBlogIndex();

  if (!isLoading && !authorPayload) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Author not found</h1>
          <p className="mb-8 text-muted-foreground">The author you're looking for doesn't exist.</p>
          <Link href="/">
            <a className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              Back to Home
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  const author = authorPayload?.author;
  const authorArticles = authorPayload?.articles ?? [];
  const otherAuthors = (index?.authors ?? []).filter((entry) => entry.id !== author?.id).slice(0, 2);
  const instagramHref = resolveInstagramHref(author?.instagram);
  const facebookHref = resolveFacebookHref(author?.facebook);

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

      {author ? (
        <>
          <section className="border-b border-border bg-secondary">
            <div className="container py-12 md:py-16">
              <div className="mb-8 flex flex-col items-start gap-8 md:flex-row">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <span className="text-5xl font-bold text-accent">{author.name.charAt(0)}</span>
                </div>

                <div className="flex-1">
                  <h1 className="mb-2 text-4xl font-bold text-foreground md:text-5xl">{author.name}</h1>
                  <p className="mb-4 text-lg font-semibold text-accent">{author.title}</p>
                  <p className="mb-6 max-w-2xl text-muted-foreground">{author.bio}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    {instagramHref ? (
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                      >
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-xs font-bold text-accent">IG</span>
                        {formatSocialLabel(author.instagram, 'instagram')}
                      </a>
                    ) : null}
                    {facebookHref ? (
                      <a
                        href={facebookHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-semibold text-accent hover:underline"
                      >
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-xs font-bold text-accent">FB</span>
                        {formatSocialLabel(author.facebook, 'facebook')}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex gap-8 border-t border-border pt-8">
                <div>
                  <p className="text-2xl font-bold text-foreground">{author.articleCount}</p>
                  <p className="text-sm text-muted-foreground">Published Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{authorArticles.length}</p>
                  <p className="text-sm text-muted-foreground">Visible In Archive</p>
                </div>
              </div>
            </div>
          </section>

          <section className="container py-12 md:py-16">
            <h2 className="mb-12 text-3xl font-bold text-foreground">{author.name}'s Articles</h2>

            {authorArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {authorArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">No articles published yet.</p>
                <Link href="/">
                  <a className="font-semibold text-accent hover:underline">Browse all articles →</a>
                </Link>
              </div>
            )}
          </section>

          <section className="border-y border-border bg-secondary">
            <div className="container py-12 md:py-16">
              <h2 className="mb-12 text-3xl font-bold text-foreground">Other Authors</h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {otherAuthors.map((otherAuthor) => (
                  <Link key={otherAuthor.id} href={`/author/${otherAuthor.id}`}>
                    <a className="group block rounded-lg border border-border bg-background p-8 transition-colors hover:border-accent">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                        <span className="text-2xl font-bold text-accent">{otherAuthor.name.charAt(0)}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                        {otherAuthor.name}
                      </h3>
                      <p className="mb-3 text-sm font-semibold text-accent">{otherAuthor.title}</p>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{otherAuthor.bio}</p>
                      <div className="text-xs text-muted-foreground">{otherAuthor.articleCount} published articles</div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </Layout>
  );
}
