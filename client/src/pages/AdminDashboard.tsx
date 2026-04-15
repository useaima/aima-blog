import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');

  // Fetch data
  const articlesQuery = trpc.blog.articles.list.useQuery({ limit: 50 });
  const authorsQuery = trpc.blog.authors.list.useQuery({ limit: 50 });
  const subscriberCountQuery = trpc.blog.subscribers.count.useQuery();

  // Mutations
  const approveCommentMutation = trpc.blog.comments.approve.useMutation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You must be logged in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage articles, authors, and subscribers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Articles</h2>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                New Article
              </Button>
            </div>

            {articlesQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : articlesQuery.data && articlesQuery.data.length > 0 ? (
              <div className="space-y-2">
                {articlesQuery.data.map((article: any) => (
                  <Card key={article.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-foreground">{article.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Status: <span className="font-semibold">{article.status}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Views: {article.viewCount}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No articles found
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Authors</h2>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Add Author
              </Button>
            </div>

            {authorsQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : authorsQuery.data && authorsQuery.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authorsQuery.data.map((author: any) => (
                  <Card key={author.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-foreground">{author.name}</h3>
                          <p className="text-sm text-muted-foreground">{author.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Articles: {author.articleCount}
                          </p>
                          {author.isVerified && (
                            <div className="flex items-center gap-1 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600 font-semibold">
                                {author.verificationBadge}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No authors found
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Subscribers</h2>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {subscriberCountQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Total Subscribers</p>
                      <p className="text-3xl font-bold text-foreground">
                        {subscriberCountQuery.data || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">This Month</p>
                      <p className="text-3xl font-bold text-accent">+12</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Open Rate</p>
                      <p className="text-3xl font-bold text-foreground">34%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
