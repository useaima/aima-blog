import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

/**
 * Product Showcase Component
 * Displays eva product features and screenshots
 * CDN URL: https://d2xsxph8kpxj0f.cloudfront.net/310519663309378093/Y8MawcyLgQXgPKr39dS5yr/eva-product-screenshot_dd1e5cd7.webp
 */

export default function ProductShowcase() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Spending Analysis',
      description: 'Track and analyze your spending patterns in real-time with AI-powered insights.',
    },
    {
      icon: Zap,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications about unusual financial activity and anomalies.',
    },
    {
      icon: Shield,
      title: 'Financial Security',
      description: 'Detect risks and opportunities with advanced AI monitoring.',
    },
  ];

  return (
    <section className="bg-secondary border-y border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-4">
              LIVE PRODUCT
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              eva: AI Finance Assistant
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Turn your financial activity into clearer decisions. eva helps you understand spending, detect anomalies, and make better money decisions with less manual effort.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <a
              href="https://eva.useaima.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Open eva
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Product Screenshot */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663309378093/Y8MawcyLgQXgPKr39dS5yr/eva-product-screenshot_dd1e5cd7.webp"
                alt="eva AI Finance Assistant - Product Screenshot"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
