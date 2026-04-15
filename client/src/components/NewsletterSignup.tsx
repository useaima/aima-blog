import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { subscribeToNewsletter } from '@/lib/mailchimp';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'full-width';
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export default function NewsletterSignup({
  variant = 'default',
  title = 'Subscribe for Daily Updates',
  description = 'Receive new articles, eva updates, and finance insights from the aima blog without having to check manually.',
  onSuccess,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await subscribeToNewsletter({
        email,
        firstName: firstName || undefined,
        source: 'blog',
        tags: ['blog-subscriber'],
      });

      if (result.success) {
        setSubscribed(true);
        setShowForm(false);
        setEmail('');
        setFirstName('');
        onSuccess?.();

        // Reset after 5 seconds
        setTimeout(() => {
          setSubscribed(false);
          setShowForm(true);
        }, 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Newsletter subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-secondary rounded-lg p-4 border border-border">
        {subscribed ? (
          <div className="flex items-center gap-2 text-accent font-semibold">
            <CheckCircle className="w-5 h-5" />
            <span>Check your email to confirm!</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  if (variant === 'full-width') {
    return (
      <div className="w-full">
        {subscribed ? (
          <div className="flex items-center gap-2 text-accent font-semibold text-center justify-center py-4">
            <CheckCircle className="w-5 h-5" />
            <span>Thanks for subscribing! Check your email to confirm.</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mb-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </>
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

      {subscribed ? (
        <div className="flex items-center justify-center gap-2 text-lg text-accent font-semibold mb-4">
          <CheckCircle className="w-6 h-6" />
          Thanks for subscribing! Check your email to confirm.
        </div>
      ) : (
        <>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-4 p-4 bg-red-50 rounded-lg justify-center">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        By subscribing, readers opt in to blog updates and eva-related notifications from aima.
      </p>
    </div>
  );
}
