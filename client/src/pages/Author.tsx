import { useRoute, Link } from 'wouter';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { authors, getArticlesByAuthor } from '@/lib/mockData';

export default function Author() {
  const [, params] = useRoute('/author/:id');
  const authorId = params?.id as string;
  const author = authors.find((a) => a.id === authorId);
  const authorArticles = author ? getArticlesByAuthor(authorId) : [];

  if (!author) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Author not found</h1>
          <p className="text-muted-foreground mb-8">The author you're looking for doesn't exist.</p>
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

      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-5xl font-bold text-accent">{author.name.charAt(0)}</span>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{author.name}</h1>
              <p className="text-lg text-accent font-semibold mb-4">{author.title}</p>
              <p className="text-muted-foreground mb-6 max-w-2xl">{author.bio}</p>

              <div className="flex items-center gap-4 flex-wrap">
                {author.instagram && (
                  <a
                    href={`https://instagram.com/${author.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
                  >
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-xs font-bold text-accent">
                      IG
                    </span>
                    @{author.instagram}
                  </a>
                )}
                {author.facebook && (
                  <a
                    href={`https://facebook.com/${encodeURIComponent(author.facebook)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:underline font-semibold"
                  >
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-2 text-xs font-bold text-accent">
                      FB
                    </span>
                    {author.facebook}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-8 pt-8 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">{author.articleCount}</p>
              <p className="text-sm text-muted-foreground">Published Articles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{authorArticles.length}</p>
              <p className="text-sm text-muted-foreground">In Archive</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12">{author.name}'s Articles</h2>

        {authorArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No articles published yet.</p>
            <Link href="/">
              <a className="text-accent font-semibold hover:underline">Browse all articles →</a>
            </Link>
          </div>
        )}
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <h2 className="text-3xl font-bold text-foreground mb-12">Other Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {authors
              .filter((a) => a.id !== author.id)
              .map((otherAuthor) => (
                <Link key={otherAuthor.id} href={`/author/${otherAuthor.id}`}>
                  <a className="group block p-8 rounded-lg bg-background border border-border hover:border-accent transition-colors">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-accent">{otherAuthor.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {otherAuthor.name}
                    </h3>
                    <p className="text-sm text-accent font-semibold mb-3">{otherAuthor.title}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{otherAuthor.bio}</p>
                    <div className="text-xs text-muted-foreground">{otherAuthor.articleCount} published articles</div>
                  </a>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
