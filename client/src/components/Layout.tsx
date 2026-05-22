import { Link } from 'wouter';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePlatformData } from '@/lib/contentApi';
import SearchBox from './SearchBox';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: platform } = usePlatformData();
  const settings = platform?.settings;
  const evaUrl = settings?.evaUrl ?? 'https://eva.useaima.com';
  const utgUrl = settings?.utgUrl ?? 'https://utg.useaima.com';
  const supportUrl = settings?.supportUrl ?? 'https://support.useaima.com';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <img src="/logo.png" alt="Aima Logo" className="h-8 w-8 object-contain" />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold tracking-widest text-muted-foreground">AIMA</div>
                <div className="text-xs text-muted-foreground">EDITORIAL HUB FOR EVA + ORBIS</div>
              </div>
            </a>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/">
              <a className="text-sm font-medium transition-colors hover:text-accent">Latest</a>
            </Link>
            <Link href="/categories">
              <a className="text-sm font-medium transition-colors hover:text-accent">Categories</a>
            </Link>
            <Link href="/authors">
              <a className="text-sm font-medium transition-colors hover:text-accent">Authors</a>
            </Link>
            <Link href="/archive">
              <a className="text-sm font-medium transition-colors hover:text-accent">Archive</a>
            </Link>
            <Link href="/author-dashboard">
              <a className="text-sm font-medium transition-colors hover:text-accent">Dashboard</a>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBox />
            </div>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <a
              href={evaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition-colors hover:bg-accent/90 sm:inline-flex"
            >
              Open eva
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-border bg-secondary md:hidden">
            <div className="container py-3">
              <SearchBox />
            </div>
          </div>
        )}

        {isMenuOpen && (
          <nav className="border-t border-border bg-secondary md:hidden">
            <div className="container flex flex-col gap-4 py-4">
              <Link href="/">
                <a className="text-sm font-medium transition-colors hover:text-accent">Latest</a>
              </Link>
              <Link href="/categories">
                <a className="text-sm font-medium transition-colors hover:text-accent">Categories</a>
              </Link>
              <Link href="/authors">
                <a className="text-sm font-medium transition-colors hover:text-accent">Authors</a>
              </Link>
              <Link href="/archive">
                <a className="text-sm font-medium transition-colors hover:text-accent">Archive</a>
              </Link>
              <a
                href={evaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-accent px-4 py-2 text-center font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Open eva
              </a>
              <a
                href={utgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-border px-4 py-2 text-center font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Open Orbis
              </a>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-secondary">
        <div className="container py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">About</h3>
              <p className="text-sm text-muted-foreground">
                The official aima publication for practical AI agents, personal finance systems, protocol guides, and the infrastructure behind eva and Orbis.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/category/ai-agents"><a className="text-muted-foreground transition-colors hover:text-accent">AI Agents</a></Link></li>
                <li><Link href="/category/personal-finance"><a className="text-muted-foreground transition-colors hover:text-accent">Personal Finance</a></Link></li>
                <li><Link href="/category/protocols"><a className="text-muted-foreground transition-colors hover:text-accent">Protocols</a></Link></li>
                <li><Link href="/category/product-updates"><a className="text-muted-foreground transition-colors hover:text-accent">Product Updates</a></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Products</h3>
              <ul className="space-y-2 text-sm">
                <li><a href={evaUrl} className="text-muted-foreground transition-colors hover:text-accent">eva</a></li>
                <li><a href={utgUrl} className="text-muted-foreground transition-colors hover:text-accent">Orbis</a></li>
                <li><a href={supportUrl} className="text-muted-foreground transition-colors hover:text-accent">Support Center</a></li>
                <li><a href="https://useaima.com" className="text-muted-foreground transition-colors hover:text-accent">Main site</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://useaima.com/privacy-policy" className="text-muted-foreground transition-colors hover:text-accent">Privacy</a></li>
                <li><a href="https://useaima.com/cookie-policy" className="text-muted-foreground transition-colors hover:text-accent">Cookies</a></li>
                <li><a href="https://useaima.com/terms-of-service" className="text-muted-foreground transition-colors hover:text-accent">Terms</a></li>
                <li><a href={supportUrl} className="text-muted-foreground transition-colors hover:text-accent">Contact support</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} aima. Built around eva and Orbis.</p>
            <p>blog.useaima.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
