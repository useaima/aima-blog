import { Link } from 'wouter';
import { Article } from '@/lib/mockData';
import ArticleCard from './ArticleCard';
import { ArrowRight } from 'lucide-react';

/**
 * Related Articles Widget
 * Displays related articles based on category or tags
 * Increases reader engagement and time-on-site
 */

interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
  variant?: 'grid' | 'list';
}

export default function RelatedArticles({
  articles,
  title = 'Related Articles',
  variant = 'grid',
}: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary border-y border-border">
      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          <Link href="/archive">
            <a className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </Link>
        </div>

        {/* Articles Grid */}
        {variant === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
