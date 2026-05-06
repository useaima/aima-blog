import Layout from '@/components/Layout';
import AuthorCard from '@/components/AuthorCard';
import { useBlogIndex } from '@/lib/contentApi';
import { Link } from 'wouter';

export default function GuestAuthors() {
  const { data: index } = useBlogIndex();
  const authors = index?.authors ?? [];
  const guestAuthors = authors.filter((author) => author.title.toLowerCase().includes('contributor'));
  const staffAuthors = authors.filter((author) => !author.title.toLowerCase().includes('contributor'));

  return (
    <Layout>
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Guest Contributors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Our contributor program brings diverse perspectives to the aima editorial desk. Writers can submit drafts, upload imagery, and work with editors on practical pieces about eva, UTG, AI agents, finance, and agentic commerce.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Featured Guest Authors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guestAuthors.length > 0 ? guestAuthors.map((author) => (
                  <AuthorCard key={author.id} author={author} variant="featured" />
                )) : (
                  <div className="rounded-lg border border-border bg-secondary p-8 text-muted-foreground">
                    Contributor profiles will appear here as soon as invited writers publish through the shared CMS.
                  </div>
                )}
              </div>
            </div>

            {staffAuthors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-8">Editorial Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {staffAuthors.map((author) => (
                    <AuthorCard key={author.id} author={author} variant="featured" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-accent/10 rounded-lg p-8 border border-accent/20 mb-8">
                <h3 className="text-lg font-bold text-foreground mb-3">Become a Contributor</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Non-coders can now pitch, draft, upload images, and submit articles for editorial review through the shared AIMA workspace.
                </p>
                <Link href="/contribute">
                  <a className="block w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-center">
                    Apply to Contribute →
                  </a>
                </Link>
              </div>

              <div className="bg-secondary rounded-lg p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-6">Program Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-accent">{guestAuthors.length}</p>
                    <p className="text-xs text-muted-foreground">Guest Contributors</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">
                      {guestAuthors.reduce((sum, author) => sum + author.articleCount, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Guest Articles Published</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{staffAuthors.length}</p>
                    <p className="text-xs text-muted-foreground">Editorial Team Members</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why write for aima?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">📢</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Reach a product-aware audience</h3>
              <p className="text-sm text-muted-foreground">
                Publish for readers actively exploring AI finance and agentic transaction infrastructure.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">🛠️</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Use a no-code editorial workspace</h3>
              <p className="text-sm text-muted-foreground">
                Draft sections, upload images, save progress, and submit for review without touching the codebase.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">⭐</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Build a real author profile</h3>
              <p className="text-sm text-muted-foreground">
                Every published contributor receives a public byline, author page, and article trail across the AIMA blog.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
