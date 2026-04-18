import { Link } from 'wouter';
import { Instagram, Facebook } from 'lucide-react';
import { Author } from '@/lib/mockData';
import VerificationBadge from './VerificationBadge';

interface AuthorBioProps {
  author: Author;
}

export default function AuthorBio({ author }: AuthorBioProps) {
  const socialLinks = [
    author.instagram
      ? {
          key: 'instagram',
          label: 'Instagram',
          href: `https://instagram.com/${author.instagram}`,
          icon: <Instagram className="w-4 h-4" />,
        }
      : null,
    author.facebook
      ? {
          key: 'facebook',
          label: 'Facebook',
          href: `https://facebook.com/${encodeURIComponent(author.facebook)}`,
          icon: <Facebook className="w-4 h-4" />,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; href: string; icon: JSX.Element }>;

  return (
    <div className="bg-secondary rounded-lg p-6 md:p-8 border border-border">
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
      </div>

      <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>

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

      {socialLinks.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              title={link.label}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      )}

      <Link href={`/author/${author.id}`}>
        <a className="inline-block mt-4 text-sm font-semibold text-accent hover:underline">
          View Profile →
        </a>
      </Link>
    </div>
  );
}
