import { Link } from 'wouter';
import { Instagram, Facebook } from 'lucide-react';
import Layout from '@/components/Layout';
import { authors, getArticlesByAuthor } from '@/lib/mockData';

export default function Authors() {
  return (
    <Layout>
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Meet the Authors</h1>
          <p className="text-lg text-muted-foreground">
            The people writing the guides behind eva. Every article is linked to a real author page so readers can see who wrote it, what they focus on, and the body of work they have published for aima.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {authors.map((author) => {
            const authorArticles = getArticlesByAuthor(author.id);
            const latestArticle = authorArticles[0];

            return (
              <Link key={author.id} href={`/author/${author.id}`}>
                <a className="group block p-8 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-sm text-accent font-semibold mb-4">{author.title}</p>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{author.bio}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-lg font-bold text-foreground">{author.articleCount}</p>
                      <p className="text-xs text-muted-foreground">Published Articles</p>
                    </div>
                    {latestArticle && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Latest</p>
                        <p className="text-xs font-semibold text-foreground line-clamp-1">
                          {latestArticle.title}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-accent">
                    {author.instagram && (
                      <a
                        href={`https://instagram.com/${author.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm hover:underline"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                    {author.facebook && (
                      <a
                        href={`https://facebook.com/${encodeURIComponent(author.facebook)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm hover:underline"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                    )}
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Interested in Writing?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We are building the aima editorial desk around useful, product-linked writing on AI agents, autonomous finance, protocols, and practical decision systems.
          </p>
          <a
            href="mailto:help@useaima.com"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Get in Touch →
          </a>
        </div>
      </section>
    </Layout>
  );
}
