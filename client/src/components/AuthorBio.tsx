import { Link } from 'wouter';
import { Author } from '@/lib/mockData';
import { Twitter, Linkedin, Github, Globe, Badge } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

interface AuthorBioProps {
  author: Author;
}

export default function AuthorBio({ author }: AuthorBioProps) {
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

  return (
    <div className="bg-secondary rounded-lg p-6 md:p-8 border border-border">
      {/* Author Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <Link href={`/author/${author.id}`}>
            <a className="group">
              <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                {author.name}
              </h3>
            </a>
          </Link>
          <p className="text-sm text-accent font-semibold">{author.title}</p>
          {author.company && <p className="text-xs text-muted-foreground">{author.company}</p>}
        {author.verified && author.verificationBadge && (
          <div className="mt-2">
            <VerificationBadge type={author.verificationBadge} size="sm" />
          </div>
        )}
        </div>
        {author.isGuest && (
          <Badge className="bg-accent/10 text-accent border-0 flex-shrink-0">Guest</Badge>
        )}
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>

      {/* Expertise */}
      {author.expertise && author.expertise.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2">EXPERTISE</p>
          <div className="flex flex-wrap gap-2">
            {author.expertise.map((skill) => (
              <span key={skill} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3">
          {socialLinks.map(({ platform, handle }) => (
            handle && (
              <a
                key={platform}
                href={getSocialUrl(platform, handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                title={`${platform}: ${handle}`}
              >
                {getSocialIcon(platform)}
              </a>
            )
          ))}
        </div>
      )}

      {/* View Profile Link */}
      <Link href={`/author/${author.id}`}>
        <a className="inline-block mt-4 text-sm font-semibold text-accent hover:underline">
          View Profile →
        </a>
      </Link>
    </div>
  );
}
