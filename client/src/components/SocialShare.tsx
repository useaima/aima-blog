import { Share2, Twitter, Linkedin, Facebook, Mail, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Social Share Component
 * Allows users to share articles on social media platforms
 * Supports Twitter, LinkedIn, Facebook, Email, and Copy Link
 */

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  variant?: 'horizontal' | 'vertical';
}

export default function SocialShare({
  title,
  url,
  description = '',
  variant = 'horizontal',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-500',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:text-orange-500',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const containerClass =
    variant === 'horizontal'
      ? 'flex items-center gap-4'
      : 'flex flex-col gap-3';

  const buttonClass =
    variant === 'horizontal'
      ? 'p-2 rounded-lg hover:bg-secondary transition-colors'
      : 'flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium';

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Share2 className="w-4 h-4" />
        <span className={variant === 'vertical' ? 'text-sm font-semibold' : 'text-sm hidden sm:inline'}>
          Share
        </span>
      </div>

      <div className={variant === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-2'}>
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${social.name}`}
              className={`${buttonClass} ${social.color} text-foreground transition-colors`}
            >
              <Icon className="w-4 h-4" />
              {variant === 'vertical' && <span>{social.name}</span>}
            </a>
          );
        })}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          title="Copy article link"
          className={`${buttonClass} hover:text-green-500 text-foreground transition-colors`}
        >
          <Copy className="w-4 h-4" />
          {variant === 'vertical' && <span>{copied ? 'Copied!' : 'Copy Link'}</span>}
        </button>
      </div>
    </div>
  );
}
