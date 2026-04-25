import Layout from '@/components/Layout';
import FeaturedSlider from '@/components/FeaturedSlider';
import ArticleCard from '@/components/ArticleCard';
import CategoryGrid from '@/components/CategoryGrid';
import ProductShowcase from '@/components/ProductShowcase';
import NewsletterSignup from '@/components/NewsletterSignup';
import { articles, categories, getFeaturedArticles, getLatestArticles } from '@/lib/mockData';
import { Link } from 'wouter';

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const topStories = getLatestArticles(5);
  const latestArticles = getLatestArticles(6);

  return (
    <Layout>
      <section className="bg-secondary border-b border-border">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="featured-label mb-4">Official Editorial Hub for Eva</div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The aima blog built like a product newsroom.
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              blog.useaima.com is the official aima publication for practical AI agents, personal finance systems, protocol guides, and product updates tied directly to eva.
            </p>
            <div className="accent-bar w-24 mb-8" />
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {featuredArticles.length > 0 && <FeaturedSlider articles={featuredArticles} />}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Top Stories</h2>
              <div className="space-y-4">
                {topStories.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
              <Link href="/archive">
                <a className="inline-block mt-6 text-accent font-semibold hover:underline">
                  Search the archive →
                </a>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <ProductShowcase />

      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <h2 className="text-3xl font-bold text-foreground mb-12">Explore by Category</h2>
          <CategoryGrid categories={categories.slice(0, 4)} />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Why This Matters</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Real product proof</strong> - Real screenshots show that eva is already live.
              </p>
              <p>
                <strong className="text-foreground">Author pages make ownership visible</strong> - Every article is linked to a real author with their body of work.
              </p>
              <p>
                <strong className="text-foreground">Each article can lead directly into eva</strong> - When the reader is ready, they can take action immediately.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Readers trust a blog more when the product is visible, the authors are real, and the next step is clear.
              </p>
              <a
                href="https://eva.useaima.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Open eva →
              </a>
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-8 border border-border">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Real product screenshots</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Latest Articles</h2>
          <p className="text-muted-foreground">Current thinking from the aima editorial desk</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>

        <div className="text-center">
          <Link href="/archive">
            <a className="inline-block text-accent font-semibold hover:underline">
              View all articles →
            </a>
          </Link>
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container py-12 md:py-16">
          <NewsletterSignup variant="full-width" />
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet the Authors</h2>
          <p className="text-muted-foreground">
            The people writing the guides behind eva. Every article is linked to a real author page so readers can see who wrote it, what they focus on, and the body of work they have published for aima.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => article.author).filter((author, index, self) => self.findIndex((a) => a.id === author.id) === index).slice(0, 2).map((author) => (
            <Link key={author.id} href={`/author/${author.id}`}>
              <a className="group block p-8 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-accent">{author.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {author.name}
                </h3>
                <p className="text-sm text-accent font-semibold mb-3">{author.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>
                <div className="text-xs text-muted-foreground">
                  {author.articleCount} published articles
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
