import { ArrowRight, ExternalLink, Shield, TrendingUp, Workflow } from 'lucide-react';
import { usePlatformData } from '@/lib/contentApi';

const productHighlights: Record<'eva' | 'utg', Array<{ icon: typeof TrendingUp; title: string; description: string }>> = {
  eva: [
    {
      icon: TrendingUp,
      title: 'Financial clarity',
      description: 'Turn spending activity into alerts, review queues, and next-step guidance.',
    },
    {
      icon: Shield,
      title: 'Safer money reviews',
      description: 'Spot anomalies, subscription drift, and repeated leaks before they get expensive.',
    },
  ],
  utg: [
    {
      icon: Workflow,
      title: 'Agentic transaction control',
      description: 'Place a hard gateway between agent intent and live money movement.',
    },
    {
      icon: Shield,
      title: 'Human approval + idempotency',
      description: 'Keep execution non-custodial, reviewable, and safe when retries or failures happen.',
    },
  ],
};

export default function ProductShowcase() {
  const { data: platform } = usePlatformData();
  const products = platform?.products ?? [];

  return (
    <section className="border-y border-border bg-secondary">
      <div className="container py-12 md:py-16">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Live products</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">AIMA is now building across finance guidance and transaction infrastructure.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            eva helps people understand money activity. Orbis helps AI agents interact with financial systems safely. The blog is where both product stories are explained in detail.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {products.map((product) => {
            const highlights = productHighlights[product.slug as 'eva' | 'utg'] ?? [];
            return (
              <article key={product.slug} className="rounded-2xl border border-border bg-background p-8 shadow-sm">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.categoryLabel}</p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground">{product.name}</h3>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {product.status}
                  </span>
                </div>

                <p className="text-base text-muted-foreground">{product.description}</p>

                <div className="mt-6 space-y-4">
                  {highlights.map((highlight) => {
                    const Icon = highlight.icon;
                    return (
                      <div key={highlight.title} className="flex gap-3">
                        <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{highlight.title}</h4>
                          <p className="text-sm text-muted-foreground">{highlight.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={product.primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    {product.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  {product.secondaryUrl && product.secondaryLabel ? (
                    <a
                      href={product.secondaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {product.secondaryLabel}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
