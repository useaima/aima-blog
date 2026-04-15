import { Link } from 'wouter';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="Aima Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-muted-foreground tracking-widest">AIMA</div>
                <div className="text-xs text-muted-foreground">EDITORIAL HUB FOR EVA</div>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors">Latest</a>
            </Link>
            <Link href="/authors">
              <a className="text-sm font-medium hover:text-accent transition-colors">Authors</a>
            </Link>
            <Link href="/categories">
              <a className="text-sm font-medium hover:text-accent transition-colors">Categories</a>
            </Link>
            <Link href="/archive">
              <a className="text-sm font-medium hover:text-accent transition-colors">Archive</a>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* CTA Button */}
            <a
              href="https://eva.useaima.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Open eva
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-border bg-secondary">
            <div className="container py-3">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border bg-secondary">
            <div className="container py-4 flex flex-col gap-4">
              <Link href="/">
                <a className="text-sm font-medium hover:text-accent transition-colors">Latest</a>
              </Link>
              <Link href="/authors">
                <a className="text-sm font-medium hover:text-accent transition-colors">Authors</a>
              </Link>
              <Link href="/categories">
                <a className="text-sm font-medium hover:text-accent transition-colors">Categories</a>
              </Link>
              <Link href="/archive">
                <a className="text-sm font-medium hover:text-accent transition-colors">Archive</a>
              </Link>
              <a
                href="https://eva.useaima.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-center"
              >
                Open eva
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-16">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                The official aima publication for practical AI agents, personal finance systems, and product updates.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/category/ai-agents">
                    <a className="text-muted-foreground hover:text-accent transition-colors">AI Agents</a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/personal-finance">
                    <a className="text-muted-foreground hover:text-accent transition-colors">Personal Finance</a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/protocols">
                    <a className="text-muted-foreground hover:text-accent transition-colors">Protocols</a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/product-updates">
                    <a className="text-muted-foreground hover:text-accent transition-colors">Product Updates</a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://useaima.com" className="text-muted-foreground hover:text-accent transition-colors">
                    Main site
                  </a>
                </li>
                <li>
                  <a href="https://useaima.com" className="text-muted-foreground hover:text-accent transition-colors">
                    About aima
                  </a>
                </li>
                <li>
                  <a href="https://support.useaima.com" className="text-muted-foreground hover:text-accent transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    RSS Feed
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 aima. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
