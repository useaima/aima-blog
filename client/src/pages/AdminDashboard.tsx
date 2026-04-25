import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Loader2, Mail, MessageSquareWarning, Newspaper, Settings, Users } from 'lucide-react';

const initialSettings = {
  supportEmail: '',
  instagramUrl: '',
  youtubeUrl: '',
  siteUrl: '',
  blogUrl: '',
  supportUrl: '',
  evaUrl: '',
  companyDescription: '',
  supportBlurb: '',
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState('posts');
  const [settingsForm, setSettingsForm] = useState(initialSettings);

  const postsQuery = trpc.cms.posts.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const authorsQuery = trpc.cms.authors.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const commentsQuery = trpc.cms.comments.list.useQuery({ status: 'pending' }, { enabled: Boolean(user) });
  const subscribersQuery = trpc.crm.subscribers.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const contactsQuery = trpc.crm.contacts.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const supportQuery = trpc.support.requests.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const settingsQuery = trpc.settings.site.get.useQuery(undefined, { enabled: Boolean(user) });
  const utils = trpc.useUtils();

  const approveCommentMutation = trpc.cms.comments.approve.useMutation({
    onSuccess: async () => {
      await utils.cms.comments.list.invalidate();
    },
  });

  const updateSupportStatusMutation = trpc.support.requests.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.support.requests.list.invalidate();
    },
  });

  const updateContactStatusMutation = trpc.crm.contacts.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.crm.contacts.list.invalidate();
    },
  });

  const saveSettingsMutation = trpc.settings.site.update.useMutation({
    onSuccess: async () => {
      await utils.settings.site.get.invalidate();
    },
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    setSettingsForm({
      supportEmail: settingsQuery.data.supportEmail || '',
      instagramUrl: settingsQuery.data.instagramUrl || '',
      youtubeUrl: settingsQuery.data.youtubeUrl || '',
      siteUrl: settingsQuery.data.siteUrl || '',
      blogUrl: settingsQuery.data.blogUrl || '',
      supportUrl: settingsQuery.data.supportUrl || '',
      evaUrl: settingsQuery.data.evaUrl || '',
      companyDescription: settingsQuery.data.companyDescription || '',
      supportBlurb: settingsQuery.data.supportBlurb || '',
    });
  }, [settingsQuery.data]);

  const snapshot = useMemo(() => ({
    posts: postsQuery.data?.length || 0,
    comments: commentsQuery.data?.length || 0,
    subscribers: subscribersQuery.data?.length || 0,
    support: supportQuery.data?.length || 0,
    contacts: contactsQuery.data?.length || 0,
  }), [postsQuery.data, commentsQuery.data, subscribersQuery.data, supportQuery.data, contactsQuery.data]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading team workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            <Settings className="h-4 w-4" />
            Team Console
          </div>
          <h1 className="mt-4 text-4xl font-bold text-foreground">AIMA CMS + CRM</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Operate the editorial stack, subscriber pipeline, support inbox, and shared company settings from the blog control plane.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Posts</p><p className="text-3xl font-bold">{snapshot.posts}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending comments</p><p className="text-3xl font-bold">{snapshot.comments}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Subscribers</p><p className="text-3xl font-bold">{snapshot.subscribers}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Support requests</p><p className="text-3xl font-bold">{snapshot.support}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">CRM contacts</p><p className="text-3xl font-bold">{snapshot.contacts}</p></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="contacts">CRM</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="flex items-center gap-3"><Newspaper className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Posts</h2></div>
            {postsQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="space-y-3">
                {postsQuery.data?.map((post: any) => (
                  <Card key={post.id}><CardContent className="pt-6 flex items-start justify-between gap-4"><div><h3 className="font-bold text-foreground">{post.title}</h3><p className="text-sm text-muted-foreground">/{post.slug} • {post.status}</p></div><span className="text-xs font-semibold text-accent">Views {post.viewCount}</span></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="authors" className="space-y-4">
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Authors</h2></div>
            {authorsQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {authorsQuery.data?.map((author: any) => (
                  <Card key={author.id}><CardContent className="pt-6"><h3 className="font-bold text-foreground">{author.name}</h3><p className="text-sm text-muted-foreground">{author.title || author.email}</p><p className="mt-3 text-sm text-muted-foreground">{author.bio || 'No bio yet.'}</p></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="flex items-center gap-3"><MessageSquareWarning className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Comment moderation</h2></div>
            {commentsQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : commentsQuery.data?.length ? (
              <div className="space-y-3">
                {commentsQuery.data.map((comment: any) => (
                  <Card key={comment.id}><CardContent className="pt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-medium text-foreground">Article #{comment.articleId}</p><p className="mt-2 text-sm text-muted-foreground">{comment.content}</p></div><Button size="sm" onClick={() => approveCommentMutation.mutate({ id: comment.id })} disabled={approveCommentMutation.isPending}>{approveCommentMutation.isPending ? 'Saving…' : 'Approve'}</Button></CardContent></Card>
                ))}
              </div>
            ) : <Card><CardContent className="pt-6 text-muted-foreground">No pending comments.</CardContent></Card>}
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Subscribers</h2></div>
            {subscribersQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="space-y-3">
                {subscribersQuery.data?.map((subscriber: any) => (
                  <Card key={subscriber.id || subscriber.email}><CardContent className="pt-6"><div className="flex items-center justify-between gap-4"><div><h3 className="font-semibold text-foreground">{subscriber.email}</h3><p className="text-sm text-muted-foreground">{subscriber.source || 'unknown source'} • {subscriber.status}</p></div><span className="text-xs text-muted-foreground">{subscriber.created_at || subscriber.subscribed_at || 'recent'}</span></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Support inbox</h2></div>
            {supportQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="space-y-3">
                {supportQuery.data?.map((request: any) => (
                  <Card key={request.id}><CardContent className="pt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold text-foreground">{request.topic}</h3><p className="text-sm text-muted-foreground">{request.name} • {request.email}</p><p className="mt-2 text-sm text-muted-foreground">{request.message}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => updateSupportStatusMutation.mutate({ id: request.id, status: 'triaged' })}>Triaged</Button><Button size="sm" onClick={() => updateSupportStatusMutation.mutate({ id: request.id, status: 'resolved' })}>Resolve</Button></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">CRM contacts</h2></div>
            {contactsQuery.isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <div className="space-y-3">
                {contactsQuery.data?.map((contact: any) => (
                  <Card key={contact.id || contact.email}><CardContent className="pt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold text-foreground">{contact.name || contact.email}</h3><p className="text-sm text-muted-foreground">{contact.email}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">{contact.status}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => updateContactStatusMutation.mutate({ id: contact.id, status: 'qualified' })}>Qualify</Button><Button size="sm" onClick={() => updateContactStatusMutation.mutate({ id: contact.id, status: 'responded' })}>Responded</Button></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="flex items-center gap-3"><Settings className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Shared site settings</h2></div>
            <Card>
              <CardHeader><CardTitle>Public company settings</CardTitle></CardHeader>
              <CardContent>
                <form
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveSettingsMutation.mutate(settingsForm);
                  }}
                >
                  <label className="text-sm font-medium text-foreground">Support email<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportEmail} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportEmail: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Instagram URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.instagramUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, instagramUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">YouTube URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.youtubeUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, youtubeUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Main site URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.siteUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, siteUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Blog URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.blogUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, blogUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Support URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">EVA URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.evaUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, evaUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">Company description<textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.companyDescription} onChange={(event) => setSettingsForm((prev) => ({ ...prev, companyDescription: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">Support blurb<textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportBlurb} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportBlurb: event.target.value }))} /></label>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <Button type="submit" disabled={saveSettingsMutation.isPending}>{saveSettingsMutation.isPending ? 'Saving…' : 'Save shared settings'}</Button>
                    {saveSettingsMutation.isSuccess ? <span className="inline-flex items-center gap-2 text-sm text-accent"><CheckCircle className="h-4 w-4" />Saved</span> : null}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
