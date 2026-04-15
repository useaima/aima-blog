import { useState } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { ArrowLeft, Upload, Plus, Edit2, Trash2 } from 'lucide-react';
import { articles } from '@/lib/mockData';

/**
 * Author Dashboard
 * Allows authors to manage and upload their articles
 */

interface DraftArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export default function AuthorDashboard() {
  const [drafts, setDrafts] = useState<DraftArticle[]>([
    {
      id: '1',
      title: 'Getting Started with AI Agents',
      excerpt: 'Learn how to build your first AI agent...',
      content: 'Full article content here...',
      status: 'draft',
      createdAt: new Date('2026-04-10'),
      updatedAt: new Date('2026-04-15'),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all fields');
      return;
    }

    const newDraft: DraftArticle = {
      id: Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDrafts([newDraft, ...drafts]);
    setFormData({ title: '', excerpt: '', content: '' });
    setShowForm(false);
    alert('Article submitted for review!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      setDrafts(drafts.filter((d) => d.id !== id));
    }
  };

  const publishedCount = drafts.filter((d) => d.status === 'published').length;
  const pendingCount = drafts.filter((d) => d.status === 'pending').length;
  const draftCount = drafts.filter((d) => d.status === 'draft').length;

  return (
    <Layout>
      {/* Back Button */}
      <div className="container py-8">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>
        </Link>
      </div>

      <div className="container py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Author Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage and publish your articles</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Published</p>
            <p className="text-3xl font-bold text-accent">{publishedCount}</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
            <p className="text-3xl font-bold text-orange-500">{pendingCount}</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">Drafts</p>
            <p className="text-3xl font-bold text-blue-500">{draftCount}</p>
          </div>
        </div>

        {/* New Article Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Article
          </button>
        </div>

        {/* Article Form */}
        {showForm && (
          <div className="mb-12 p-8 bg-secondary rounded-lg border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title..."
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of your article..."
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article content here..."
                  rows={10}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Submit for Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-secondary text-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors border border-border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Articles</h2>
          {drafts.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No articles yet. Create your first article!</p>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="p-6 bg-secondary rounded-lg border border-border hover:border-accent transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{draft.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            draft.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : draft.status === 'pending'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{draft.excerpt}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {draft.updatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-background rounded-lg transition-colors" title="Edit article">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(draft.id)}
                        className="p-2 hover:bg-background rounded-lg transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="mt-12 p-8 bg-secondary rounded-lg border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Article Guidelines</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Articles should be at least 500 words</li>
            <li>• Include relevant keywords for SEO</li>
            <li>• Use clear headings and formatting</li>
            <li>• Provide accurate, well-researched information</li>
            <li>• Include author bio and social links</li>
            <li>• Articles are reviewed before publication</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
