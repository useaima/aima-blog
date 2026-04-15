import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Navigation Component
 * Displays navigation hierarchy for better UX and SEO
 * Usage: <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Article', href: '/article/slug' }]} />
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 md:px-0">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {/* Home Link */}
        <li>
          <Link href="/">
            <a className="flex items-center gap-1 hover:text-accent transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-border" />
            {item.href ? (
              <Link href={item.href}>
                <a className="hover:text-accent transition-colors">{item.label}</a>
              </Link>
            ) : (
              <span className="text-foreground font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
