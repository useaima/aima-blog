import { useState } from 'react';
import { MessageCircle, ThumbsUp, Flag } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  isVerified?: boolean;
}

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      email: 'sarah@example.com',
      content:
        'Great article! This really helped me understand how AI agents are transforming financial systems. Looking forward to more content like this.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 12,
      replies: [
        {
          id: '1-1',
          author: 'Alvins Mukabane',
          email: 'alvins@aima.com',
          content: 'Thanks Sarah! We have more deep dives coming. Stay tuned!',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          likes: 5,
          replies: [],
          isVerified: true,
        },
      ],
      isVerified: false,
    },
    {
      id: '2',
      author: 'Marcus Chen',
      email: 'marcus@example.com',
      content:
        'The section on autonomous commerce was particularly insightful. Would love to see a follow-up article on the regulatory challenges.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 8,
      replies: [],
      isVerified: false,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim() || !email.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: name,
      email,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      isVerified: false,
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setName('');
    setEmail('');
    setShowForm(false);
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      )
    );
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 mt-4' : 'mb-6'}`}>
      <div className="bg-secondary rounded-lg p-4 border border-border">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{comment.author}</p>
              {comment.isVerified && (
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                  Author
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {comment.timestamp.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLike(comment.id)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{comment.likes}</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  );

  return (
    <section className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Comments ({comments.length})</h2>
        <p className="text-sm text-muted-foreground">
          Join the discussion. Share your thoughts, questions, and insights about this article.
        </p>
      </div>

      {/* Comment Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mb-8 px-6 py-4 bg-accent/10 border-2 border-dashed border-accent rounded-lg text-accent font-semibold hover:bg-accent/20 transition-colors"
        >
          + Add Your Comment
        </button>
      ) : (
        <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-secondary rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Comment *</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-sm"
            >
              Post Comment
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-secondary border border-border rounded-lg font-semibold hover:bg-background transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Comments are moderated and may take a few minutes to appear. Please be respectful and constructive.
          </p>
        </form>
      )}

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </section>
  );
}
