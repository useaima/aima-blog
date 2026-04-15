import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'full-width';
  title?: string;
  description?: string;
}

export default function NewsletterSignup({
  variant = 'default',
  title = 'Subscribe for Daily Updates',
  description = 'Receive new articles, eva updates, and finance insights from the aima blog without having to check manually.',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubscribed(true);
    setEmail('');
    setLoading(false);

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-secondary rounded-lg p-4 border border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribed}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={subscribed || loading}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {subscribed ? '✓' : 'Subscribe'}
          </button>
        </form>
        {subscribed && (
          <p className="text-xs text-accent font-semibold mt-2">
            Check your email to confirm!
          </p>
        )}
      </div>
    );
  }

  if (variant === 'full-width') {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribed}
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={subscribed || loading}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {subscribed ? '✓ Subscribed' : 'Subscribe'}
          </button>
        </form>
        {subscribed && (
          <p className="text-sm text-accent font-semibold mt-2">
            ✓ Thanks for subscribing! Check your email to confirm.
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          By subscribing, readers opt in to blog updates and eva-related notifications from aima.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-accent" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
      <p className="text-muted-foreground mb-8">{description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribed}
          className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={subscribed || loading}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Subscribing...' : subscribed ? '✓ Subscribed' : 'Subscribe'}
        </button>
      </form>

      {subscribed && (
        <div className="flex items-center justify-center gap-2 text-sm text-accent font-semibold mb-4">
          <CheckCircle className="w-4 h-4" />
          Thanks for subscribing! Check your email to confirm.
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        By subscribing, readers opt in to blog updates and eva-related notifications from aima.
      </p>
    </div>
  );
}
