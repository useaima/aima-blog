import { Link } from 'wouter';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="container py-24 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-2xl text-muted-foreground mb-4">Page Not Found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <a className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Back to Home
            </a>
          </Link>
          <Link href="/archive">
            <a className="px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors border border-border">
              Browse Archive
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
