import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { useBlogIndex } from '@/lib/contentApi';
import { resolveFacebookHref, resolveInstagramHref } from '@/lib/socialLinks';

export default function Authors() {
  const { data: index } = useBlogIndex();
  const authors = index?.authors ?? [];

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Meet the Authors</h1>
          <p className="text-lg text-muted-foreground">
            The people writing the guides behind eva and Orbis. Every article is linked to a real author page so readers can see who wrote it, what they focus on, and the body of work they have published for aima.
          </p>
          <div className="accent-bar mt-8 w-24" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {authors.map((author) => {
            const latestArticle = index?.articles.find((article) => article.author.id === author.id);
            const instagramHref = resolveInstagramHref(author.instagram);
            const facebookHref = resolveFacebookHref(author.facebook);

            return (
              <Link key={author.id} href={`/author/${author.id}`}>
                <a className="group block rounded-lg border border-border bg-secondary p-8 transition-colors hover:border-accent">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                    <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
                  </div>

                  <h3 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {author.name}
                  </h3>
                  <p className="mb-4 text-sm font-semibold text-accent">{author.title}</p>
                  <p className="mb-6 text-sm text-muted-foreground line-clamp-3">{author.bio}</p>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-lg font-bold text-foreground">{author.articleCount}</p>
                      <p className="text-xs text-muted-foreground">Published Articles</p>
                    </div>
                    {latestArticle ? (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Latest</p>
                        <p className="line-clamp-1 text-xs font-semibold text-foreground">{latestArticle.title}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-accent">
                    {instagramHref ? (
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm hover:underline"
                      >
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-[11px] font-bold text-accent">IG</span>
                        Instagram
                      </a>
                    ) : null}
                    {facebookHref ? (
                      <a
                        href={facebookHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm hover:underline"
                      >
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-[11px] font-bold text-accent">FB</span>
                        Facebook
                      </a>
                    ) : null}
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="container py-12 text-center md:py-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Interested in Writing?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            We are building the aima editorial desk around useful, product-linked writing on AI agents, autonomous finance, protocols, and agentic commerce infrastructure.
          </p>
          <Link href="/contribute">
            <a className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              Apply to contribute →
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
