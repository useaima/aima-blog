import Layout from '@/components/Layout';
import FeaturedSlider from '@/components/FeaturedSlider';
import ArticleCard from '@/components/ArticleCard';
import CategoryGrid from '@/components/CategoryGrid';
import ProductShowcase from '@/components/ProductShowcase';
import NewsletterSignup from '@/components/NewsletterSignup';
import { Link } from 'wouter';
import { useBlogIndex, usePlatformData } from '@/lib/contentApi';

export default function Home() {
  const { data: index } = useBlogIndex();
  const { data: platform } = usePlatformData();

  const featuredArticles = platform?.featuredArticles?.length
    ? platform.featuredArticles
    : index?.articles.filter((article) => article.featured).slice(0, 3) ?? [];
  const topStories = index?.articles.slice(0, 5) ?? [];
  const latestArticles = index?.articles.slice(0, 6) ?? [];
  const categories = index?.categories.slice(0, 4) ?? [];
  const authors = index?.authors.slice(0, 2) ?? [];

  return (
    <Layout>
      <section className="border-b border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <div className="max-w-4xl">
            <div className="featured-label mb-4">Official Editorial Hub for EVA + ORBIS</div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl">
              The aima newsroom for financial AI and agentic transaction infrastructure.
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              blog.useaima.com is the official aima publication for practical AI agents, personal finance systems, protocol guides, product updates, and the operating model behind eva and Orbis.
            </p>
            <div className="accent-bar mb-8 w-24" />
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {featuredArticles.length > 0 ? <FeaturedSlider articles={featuredArticles} /> : null}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Top Stories</h2>
              <div className="space-y-4">
                {topStories.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
              <Link href="/archive">
                <a className="mt-6 inline-block font-semibold text-accent hover:underline">
                  Search the archive →
                </a>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <ProductShowcase />

      <section className="border-y border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <h2 className="mb-12 text-3xl font-bold text-foreground">Explore by Category</h2>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-foreground">Why this editorial hub matters</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Real product context</strong> — Articles connect directly to the live AIMA products instead of floating as disconnected thought pieces.
              </p>
              <p>
                <strong className="text-foreground">Clear authorship</strong> — Readers can see who wrote the article, what they focus on, and the body of work they own.
              </p>
              <p>
                <strong className="text-foreground">A stronger next step</strong> — Every guide can lead into eva, Orbis, or the support center depending on the reader’s intent.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={platform?.settings?.evaUrl ?? 'https://eva.useaima.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Open eva →
              </a>
              <a
                href={platform?.settings?.utgUrl ?? 'https://utg.useaima.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Open Orbis →
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Editorial utility</p>
            <h3 className="mb-4 text-2xl font-bold text-foreground">Readers should leave with clarity, not just inspiration.</h3>
            <p className="text-muted-foreground">
              This hub is built to explain how AIMA’s products behave in the real world: how eva helps people review money better, how Orbis creates safer transaction rails for agents, and what those systems look like in practice.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Latest Articles</h2>
          <p className="text-muted-foreground">Current thinking from the aima editorial desk</p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>

        <div className="text-center">
          <Link href="/archive">
            <a className="inline-block font-semibold text-accent hover:underline">View all articles →</a>
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="container py-12 md:py-16">
          <NewsletterSignup variant="full-width" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-12">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Meet the Authors</h2>
          <p className="text-muted-foreground">
            The people writing the guides behind eva and Orbis. Every article is linked to a real author page so readers can see who wrote it, what they focus on, and the body of work they have published for aima.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {authors.map((author) => (
            <Link key={author.id} href={`/author/${author.id}`}>
              <a className="group block rounded-lg border border-border bg-secondary p-8 transition-colors hover:border-accent">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <span className="text-lg font-bold text-accent">{author.name.charAt(0)}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                  {author.name}
                </h3>
                <p className="mb-3 text-sm font-semibold text-accent">{author.title}</p>
                <p className="mb-4 text-sm text-muted-foreground">{author.bio}</p>
                <div className="text-xs text-muted-foreground">{author.articleCount} published articles</div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
