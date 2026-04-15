import { Link } from 'wouter';
import { Author } from '@/lib/mockData';
import { Twitter, Linkedin, Github, Globe, Badge } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

interface AuthorCardProps {
  author: Author;
  variant?: 'compact' | 'full' | 'featured';
}

export default function AuthorCard({ author, variant = 'full' }: AuthorCardProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSocialUrl = (platform: string, handle: string) => {
    if (!handle) return '';
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/${handle.replace('@', '')}`;
      case 'linkedin':
        return `https://linkedin.com/in/${handle}`;
      case 'github':
        return `https://github.com/${handle}`;
      case 'website':
        return handle;
      default:
        return '';
    }
  };

  const socialLinks = [
    { platform: 'twitter', handle: author.twitter },
    { platform: 'linkedin', handle: author.linkedin },
    { platform: 'github', handle: author.github },
    { platform: 'website', handle: author.website },
  ].filter((link) => link.handle);

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
            {author.isGuest && (
              <Badge className="flex-shrink-0 bg-accent/10 text-accent border-0">
                Guest
              </Badge>
            )}
          </div>
        </a>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/author/${author.id}`}>
        <a className="group block p-6 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>

          {/* Name and Title */}
          <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
            {author.name}
          </h3>
          <p className="text-sm text-accent font-semibold mb-2">{author.title}</p>

          {/* Company */}
          {author.company && (
            <p className="text-xs text-muted-foreground mb-3">{author.company}</p>
          )}

          {/* Bio */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{author.bio}</p>

          {/* Verification Badge */}
          {author.verified && author.verificationBadge && (
            <div className="mb-4">
              <VerificationBadge type={author.verificationBadge} size="sm" />
            </div>
          )}

          {/* Expertise Tags */}
          {author.expertise && author.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {author.expertise?.slice(0, 3).map((skill) => (
                <span key={skill} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            {socialLinks.map(({ platform, handle }) => (
              handle && (
                <a
                  key={platform}
                  href={getSocialUrl(platform, handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-accent transition-colors"
                  title={`${platform}: ${handle}`}
                >
                  {getSocialIcon(platform)}
                </a>
              )
            ))}
          </div>

          {/* Guest Badge */}
          {author.isGuest && (
            <div className="mt-4 pt-4 border-t border-border">
              <Badge className="bg-accent/10 text-accent border-0">Guest Contributor</Badge>
            </div>
          )}
        </a>
      </Link>
    );
  }

  // Default full variant
  return (
    <Link href={`/author/${author.id}`}>
      <a className="group block p-8 rounded-lg bg-secondary border border-border hover:border-accent transition-colors">
        {/* Header with Avatar and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>
          {author.isGuest && (
            <Badge className="bg-accent/10 text-accent border-0">Guest</Badge>
          )}
        </div>

        {/* Name and Title */}
        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
          {author.name}
        </h3>
        <p className="text-sm text-accent font-semibold mb-3">{author.title}</p>

        {/* Company and Expertise */}
        {author.company && (
          <p className="text-xs text-muted-foreground mb-2">{author.company}</p>
        )}
        {/* Verification Badge */}
        {author.verified && author.verificationBadge && (
          <div className="mb-4">
            <VerificationBadge type={author.verificationBadge} size="md" />
          </div>
        )}

        {author.expertise && author.expertise.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {author.expertise?.map((skill) => (
              <span key={skill} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{author.bio}</p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border mb-4">
          <div>
            <p className="text-lg font-bold text-foreground">{author.articleCount}</p>
            <p className="text-xs text-muted-foreground">Published Articles</p>
          </div>
          {author.joinedDate && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-xs font-semibold text-foreground">
                {new Date(author.joinedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            {socialLinks.map(({ platform, handle }) => (
              handle && (
                <a
                  key={platform}
                  href={getSocialUrl(platform, handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-accent transition-colors"
                  title={`${platform}: ${handle}`}
                >
                  {getSocialIcon(platform)}
                </a>
              )
            ))}
          </div>
        )}
      </a>
    </Link>
  );
}
