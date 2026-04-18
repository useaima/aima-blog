import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  articleId: number;
  className?: string;
}

export default function BookmarkButton({ articleId, className = '' }: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if article is bookmarked
  const checkBookmark = trpc.blog.bookmarks.check.useQuery(
    { articleId },
    { enabled: isAuthenticated }
  );

  // Add bookmark mutation
  const addBookmark = trpc.blog.bookmarks.add.useMutation({
    onSuccess: () => {
      setIsBookmarked(true);
      toast.success('Article bookmarked!');
    },
    onError: () => {
      toast.error('Failed to bookmark article');
    },
  });

  // Remove bookmark mutation
  const removeBookmark = trpc.blog.bookmarks.remove.useMutation({
    onSuccess: () => {
      setIsBookmarked(false);
      toast.success('Bookmark removed');
    },
    onError: () => {
      toast.error('Failed to remove bookmark');
    },
  });

  useEffect(() => {
    if (checkBookmark.data) {
      setIsBookmarked(!!checkBookmark.data);
    }
  }, [checkBookmark.data]);

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark articles');
      return;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark.mutateAsync({ articleId });
      } else {
        await addBookmark.mutateAsync({ articleId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isBookmarked
          ? 'bg-accent text-accent-foreground'
          : 'bg-secondary text-foreground hover:bg-secondary/80'
      } disabled:opacity-50 ${className}`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
    >
      <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  );
}
