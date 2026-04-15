import { Link } from 'wouter';
import { Article } from '@/lib/mockData';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`}>
        <a className="group block py-4 border-b border-border last:border-b-0 hover:bg-secondary/50 px-4 -mx-4 transition-colors">
          <div className="flex gap-4">
            {/* Image */}
            <div className="hidden sm:block w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="category-badge mb-2">{article.category.name}</div>
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
              <div className="metadata mt-2">{article.publishedAt.toLocaleDateString()}</div>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.slug}`}>
        <a className="group block article-card overflow-hidden">
          {/* Image */}
          <div className="relative h-48 md:h-64 overflow-hidden bg-secondary">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="category-badge mb-3">{article.category.name}</div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="metadata">{article.readTime} min read</div>
              <div className="metadata">{article.publishedAt.toLocaleDateString()}</div>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`}>
      <a className="group block article-card">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-secondary">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <div className="category-badge">{article.category.name}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>

          {/* Author and Meta */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-accent">{article.author.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{article.author.name}</p>
              <p className="metadata">{article.readTime} min • {article.publishedAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
