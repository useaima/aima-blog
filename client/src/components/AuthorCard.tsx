import { Link } from 'wouter';
import { Author } from '@/lib/mockData';
import VerificationBadge from './VerificationBadge';

interface AuthorCardProps {
  author: Author;
  variant?: 'compact' | 'full' | 'featured';
}

function AuthorSocials({ author }: { author: Author }) {
  const links = [
    author.instagram
      ? {
          key: 'instagram',
          href: `https://instagram.com/${author.instagram}`,
          label: 'IG',
        }
      : null,
    author.facebook
      ? {
          key: 'facebook',
          href: `https://facebook.com/${encodeURIComponent(author.facebook)}`,
          label: 'FB',
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; href: string; label: string }>;

  if (!links.length) return null;

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-border bg-background px-2 text-[11px] font-bold text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function AuthorCard({ author, variant = 'full' }: AuthorCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/author/${author.id}`}>
        <a className="group block">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-accent">{author.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                {author.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{author.title}</p>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/author/${author.id}`}>
        <a className="group block p-6 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
            {author.name}
          </h3>
          <p className="text-sm text-accent font-semibold mb-2">{author.title}</p>
          {author.company && <p className="text-xs text-muted-foreground mb-3">{author.company}</p>}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{author.bio}</p>
          {author.verified && author.verificationBadge && (
            <div className="mb-4">
              <VerificationBadge type={author.verificationBadge} size="sm" />
            </div>
          )}
          {author.expertise && author.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {author.expertise.slice(0, 3).map((skill) => (
                <span key={skill} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}
          <AuthorSocials author={author} />
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/author/${author.id}`}>
      <a className="group block p-8 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
          {author.name}
        </h3>
        <p className="text-sm text-accent font-semibold mb-3">{author.title}</p>
        {author.company && <p className="text-xs text-muted-foreground mb-2">{author.company}</p>}
        {author.verified && author.verificationBadge && (
          <div className="mb-4">
            <VerificationBadge type={author.verificationBadge} size="md" />
          </div>
        )}
        {author.expertise && author.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {author.expertise.map((skill) => (
              <span key={skill} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{author.bio}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border mb-4">
          <div>
            <p className="text-lg font-bold text-foreground">{author.articleCount}</p>
            <p className="text-xs text-muted-foreground">Published Articles</p>
          </div>
        </div>
        <AuthorSocials author={author} />
      </a>
    </Link>
  );
}
