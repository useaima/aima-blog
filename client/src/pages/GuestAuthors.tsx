import Layout from '@/components/Layout';
import AuthorCard from '@/components/AuthorCard';
import { authors } from '@/lib/mockData';
import { Link } from 'wouter';

/**
 * Guest Authors Page Design Notes:
 * - Display all guest contributors with their profiles
 * - Show guest badge and expertise areas
 * - Link to contribute page
 */

export default function GuestAuthors() {
  const guestAuthors = authors.filter((author) => author.isGuest);
  const staffAuthors = authors.filter((author) => !author.isGuest);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Guest Contributors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Our guest author program brings diverse perspectives to the aima editorial desk. Expert voices from across AI, finance, and product share their insights on autonomous systems, financial innovation, and practical AI implementation.
          </p>
          <div className="accent-bar w-24 mt-8" />
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main - 2 columns */}
          <div className="lg:col-span-2">
            {/* Guest Authors */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Featured Guest Authors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guestAuthors.map((author) => (
                  <AuthorCard key={author.id} author={author} variant="featured" />
                ))}
              </div>
            </div>

            {/* Staff Authors */}
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

          {/* Sidebar - 1 column */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Contribute CTA */}
              <div className="bg-accent/10 rounded-lg p-8 border border-accent/20 mb-8">
                <h3 className="text-lg font-bold text-foreground mb-3">Become a Contributor</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We're always looking for thoughtful voices to contribute to the aima editorial desk. Share your expertise on AI, finance, and autonomous systems.
                </p>
                <Link href="/contribute">
                  <a className="block w-full px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-center">
                    Apply to Contribute →
                  </a>
                </Link>
              </div>

              {/* Stats */}
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
                    <p className="text-2xl font-bold text-accent">
                      {Math.ceil(
                        guestAuthors.reduce((sum, author) => sum + author.articleCount, 0) * 8
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Minutes of Reading</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Write for aima?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">📢</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Reach Engaged Audience</h3>
              <p className="text-sm text-muted-foreground">
                Share your insights with thousands of readers interested in AI, finance, and autonomous systems.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">🔗</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Build Your Platform</h3>
              <p className="text-sm text-muted-foreground">
                Establish thought leadership and connect with industry peers through your author profile.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">⭐</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">Professional Exposure</h3>
              <p className="text-sm text-muted-foreground">
                Get featured on the aima editorial desk and gain visibility in the AI and fintech communities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
