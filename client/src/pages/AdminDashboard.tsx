import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  ImagePlus,
  Link2,
  Loader2,
  Mail,
  MessageSquareWarning,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

const initialSettings = {
  supportEmail: "",
  instagramUrl: "",
  youtubeUrl: "",
  siteUrl: "",
  blogUrl: "",
  supportUrl: "",
  evaUrl: "",
  utgUrl: "",
  utgRepoUrl: "",
  companyDescription: "",
  supportBlurb: "",
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState("posts");
  const [settingsForm, setSettingsForm] = useState(initialSettings);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "contributor" as "admin" | "editor" | "contributor" | "support" });
  const [collectionForm, setCollectionForm] = useState({ title: "", description: "", productSlug: "eva" as "eva" | "utg", featured: false });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const postsQuery = trpc.cms.posts.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const authorsQuery = trpc.cms.authors.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const commentsQuery = trpc.cms.comments.list.useQuery({ status: "pending" }, { enabled: Boolean(user) });
  const subscribersQuery = trpc.crm.subscribers.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const contactsQuery = trpc.crm.contacts.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const supportQuery = trpc.support.requests.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const settingsQuery = trpc.settings.site.get.useQuery(undefined, { enabled: Boolean(user) });
  const productsQuery = trpc.settings.products.list.useQuery(undefined, { enabled: Boolean(user) });
  const invitesQuery = trpc.cms.invites.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const mediaQuery = trpc.cms.media.list.useQuery({ limit: 24 }, { enabled: Boolean(user) });
  const supportCollectionsQuery = trpc.cms.supportCollections.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const supportArticlesQuery = trpc.cms.supportArticles.list.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const utils = trpc.useUtils();

  const approveCommentMutation = trpc.cms.comments.approve.useMutation({
    onSuccess: async () => {
      await utils.cms.comments.list.invalidate();
      setStatusMessage("Comment moderation updated.");
    },
  });

  const updateSupportStatusMutation = trpc.support.requests.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.support.requests.list.invalidate();
      setStatusMessage("Support request updated.");
    },
  });

  const updateContactStatusMutation = trpc.crm.contacts.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.crm.contacts.list.invalidate();
      setStatusMessage("CRM contact updated.");
    },
  });

  const saveSettingsMutation = trpc.settings.site.update.useMutation({
    onSuccess: async () => {
      await utils.settings.site.get.invalidate();
      setStatusMessage("Shared settings saved.");
    },
  });

  const createInviteMutation = trpc.cms.invites.create.useMutation({
    onSuccess: async () => {
      await utils.cms.invites.list.invalidate();
      setInviteForm({ email: "", role: "contributor" });
      setStatusMessage("Contributor invite added.");
    },
  });

  const createSupportCollectionMutation = trpc.cms.supportCollections.create.useMutation({
    onSuccess: async () => {
      await utils.cms.supportCollections.list.invalidate();
      setCollectionForm({ title: "", description: "", productSlug: "eva", featured: false });
      setStatusMessage("Support collection created.");
    },
  });

  useEffect(() => {
    if (!settingsQuery.data) return;
    setSettingsForm({
      supportEmail: settingsQuery.data.supportEmail || "",
      instagramUrl: settingsQuery.data.instagramUrl || "",
      youtubeUrl: settingsQuery.data.youtubeUrl || "",
      siteUrl: settingsQuery.data.siteUrl || "",
      blogUrl: settingsQuery.data.blogUrl || "",
      supportUrl: settingsQuery.data.supportUrl || "",
      evaUrl: settingsQuery.data.evaUrl || "",
      utgUrl: settingsQuery.data.utgUrl || "",
      utgRepoUrl: settingsQuery.data.utgRepoUrl || "",
      companyDescription: settingsQuery.data.companyDescription || "",
      supportBlurb: settingsQuery.data.supportBlurb || "",
    });
  }, [settingsQuery.data]);

  const snapshot = useMemo(
    () => ({
      posts: postsQuery.data?.length || 0,
      comments: commentsQuery.data?.length || 0,
      subscribers: subscribersQuery.data?.length || 0,
      support: supportQuery.data?.length || 0,
      contacts: contactsQuery.data?.length || 0,
    }),
    [postsQuery.data, commentsQuery.data, subscribersQuery.data, supportQuery.data, contactsQuery.data],
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading team workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container space-y-8 py-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            <Settings className="h-4 w-4" />
            Team Console
          </div>
          <h1 className="mt-4 text-4xl font-bold text-foreground">AIMA CMS + CRM</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Operate blog publishing, contributor invites, UTG/EVA support collections, the shared CRM, and company-wide settings from one workspace.
          </p>
          {statusMessage ? <p className="mt-3 text-sm text-muted-foreground">{statusMessage}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Posts</p><p className="text-3xl font-bold">{snapshot.posts}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending comments</p><p className="text-3xl font-bold">{snapshot.comments}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Subscribers</p><p className="text-3xl font-bold">{snapshot.subscribers}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Support requests</p><p className="text-3xl font-bold">{snapshot.support}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">CRM contacts</p><p className="text-3xl font-bold">{snapshot.contacts}</p></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-8">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="contacts">CRM</TabsTrigger>
            <TabsTrigger value="operations">Ops</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center gap-3"><Newspaper className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Blog publishing</h2></div>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card>
                <CardHeader><CardTitle>Latest posts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {postsQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : postsQuery.data?.map((post: any) => (
                    <div key={post.id} className="rounded-2xl border bg-background p-4">
                      <h3 className="font-semibold text-foreground">{post.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">/{post.slug} • {post.status} • {post.product_slug}</p>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button asChild variant="outline"><a href="/author-dashboard">Open editorial workspace</a></Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Support knowledge base</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border bg-background p-4">
                      <p className="text-sm text-muted-foreground">Collections</p>
                      <p className="text-3xl font-bold text-foreground">{supportCollectionsQuery.data?.length || 0}</p>
                    </div>
                    <div className="rounded-2xl border bg-background p-4">
                      <p className="text-sm text-muted-foreground">Support articles</p>
                      <p className="text-3xl font-bold text-foreground">{supportArticlesQuery.data?.length || 0}</p>
                    </div>
                  </div>
                  <form
                    className="space-y-3 rounded-2xl border bg-background p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createSupportCollectionMutation.mutate(collectionForm);
                    }}
                  >
                    <p className="font-semibold text-foreground">Create support collection</p>
                    <input className="w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Collection title" value={collectionForm.title} onChange={(event) => setCollectionForm((prev) => ({ ...prev, title: event.target.value }))} />
                    <textarea className="min-h-[88px] w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Collection description" value={collectionForm.description} onChange={(event) => setCollectionForm((prev) => ({ ...prev, description: event.target.value }))} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <select className="rounded-xl border border-border bg-background px-4 py-3" value={collectionForm.productSlug} onChange={(event) => setCollectionForm((prev) => ({ ...prev, productSlug: event.target.value as "eva" | "utg" }))}>
                        <option value="eva">eva</option>
                        <option value="utg">UTG</option>
                      </select>
                      <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                        <input type="checkbox" checked={collectionForm.featured} onChange={(event) => setCollectionForm((prev) => ({ ...prev, featured: event.target.checked }))} />
                        Featured collection
                      </label>
                    </div>
                    <Button type="submit" disabled={createSupportCollectionMutation.isPending} className="gap-2">
                      {createSupportCollectionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                      Add collection
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authors" className="space-y-6">
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Authors and contributors</h2></div>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card>
                <CardHeader><CardTitle>Author profiles</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {authorsQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : authorsQuery.data?.map((author: any) => (
                    <div key={author.id} className="rounded-2xl border bg-background p-4">
                      <h3 className="font-semibold text-foreground">{author.name}</h3>
                      <p className="text-sm text-muted-foreground">{author.role_title || author.email || "Contributor"}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{author.bio || "No bio yet."}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Contributor invites</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <form
                    className="space-y-3 rounded-2xl border bg-background p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      createInviteMutation.mutate(inviteForm);
                    }}
                  >
                    <input className="w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="writer@company.com" value={inviteForm.email} onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))} />
                    <select className="w-full rounded-xl border border-border bg-background px-4 py-3" value={inviteForm.role} onChange={(event) => setInviteForm((prev) => ({ ...prev, role: event.target.value as typeof inviteForm.role }))}>
                      <option value="contributor">Contributor</option>
                      <option value="editor">Editor</option>
                      <option value="support">Support</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button type="submit" disabled={createInviteMutation.isPending} className="gap-2">
                      {createInviteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                      Create invite
                    </Button>
                  </form>

                  <div className="space-y-3">
                    {invitesQuery.data?.map((invite: any) => (
                      <div key={invite.id} className="rounded-2xl border bg-background p-4 text-sm">
                        <p className="font-semibold text-foreground">{invite.email}</p>
                        <p className="mt-1 text-muted-foreground">{invite.role} • {invite.status}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="flex items-center gap-3"><MessageSquareWarning className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Comment moderation</h2></div>
            {commentsQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : commentsQuery.data?.length ? (
              <div className="space-y-3">
                {commentsQuery.data.map((comment: any) => (
                  <Card key={comment.id}><CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-medium text-foreground">Article #{comment.articleId}</p><p className="mt-2 text-sm text-muted-foreground">{comment.content}</p></div><Button size="sm" onClick={() => approveCommentMutation.mutate({ id: comment.id })} disabled={approveCommentMutation.isPending}>{approveCommentMutation.isPending ? "Saving…" : "Approve"}</Button></CardContent></Card>
                ))}
              </div>
            ) : <Card><CardContent className="pt-6 text-muted-foreground">No pending comments.</CardContent></Card>}
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Subscribers</h2></div>
            {subscribersQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <div className="space-y-3">
                {subscribersQuery.data?.map((subscriber: any) => (
                  <Card key={subscriber.id || subscriber.email}><CardContent className="pt-6"><div className="flex items-center justify-between gap-4"><div><h3 className="font-semibold text-foreground">{subscriber.email}</h3><p className="text-sm text-muted-foreground">{subscriber.source || "unknown source"} • {subscriber.status}</p></div><span className="text-xs text-muted-foreground">{subscriber.created_at || subscriber.subscribed_at || "recent"}</span></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="flex items-center gap-3"><AlertCircle className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Support inbox</h2></div>
            {supportQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <div className="space-y-3">
                {supportQuery.data?.map((request: any) => (
                  <Card key={request.id}><CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold text-foreground">{request.topic}</h3><p className="text-sm text-muted-foreground">{request.name} • {request.email}</p><p className="mt-2 text-sm text-muted-foreground">{request.message}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => updateSupportStatusMutation.mutate({ id: request.id, status: "triaged" })}>Triaged</Button><Button size="sm" onClick={() => updateSupportStatusMutation.mutate({ id: request.id, status: "resolved" })}>Resolve</Button></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">CRM contacts</h2></div>
            {contactsQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <div className="space-y-3">
                {contactsQuery.data?.map((contact: any) => (
                  <Card key={contact.id || contact.email}><CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold text-foreground">{contact.name || contact.email}</h3><p className="text-sm text-muted-foreground">{contact.email}</p><p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">{contact.status}</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => updateContactStatusMutation.mutate({ id: contact.id, status: "qualified" })}>Qualify</Button><Button size="sm" onClick={() => updateContactStatusMutation.mutate({ id: contact.id, status: "responded" })}>Responded</Button></div></CardContent></Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="flex items-center gap-3"><ImagePlus className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Operations</h2></div>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader><CardTitle>Live products</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {productsQuery.data?.map((product: any) => (
                    <div key={product.slug} className="rounded-2xl border bg-background p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{product.summary}</p>
                        </div>
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{product.status}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Media library snapshot</CardTitle></CardHeader>
                <CardContent>
                  {mediaQuery.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : mediaQuery.data?.length ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {mediaQuery.data.map((asset: any) => (
                        <article key={asset.id} className="overflow-hidden rounded-2xl border bg-background">
                          <div className="aspect-[4/3] bg-secondary">
                            <img src={asset.public_url} alt={asset.alt_text || asset.title || "asset"} className="h-full w-full object-cover" />
                          </div>
                          <div className="p-4 text-sm">
                            <p className="font-semibold text-foreground">{asset.title || asset.path}</p>
                            <p className="mt-1 break-all text-muted-foreground">{asset.public_url}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">No media assets uploaded yet.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="flex items-center gap-3"><Settings className="h-5 w-5 text-accent" /><h2 className="text-2xl font-bold">Shared site settings</h2></div>
            <Card>
              <CardHeader><CardTitle>Public company settings</CardTitle></CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); saveSettingsMutation.mutate(settingsForm); }}>
                  <label className="text-sm font-medium text-foreground">Support email<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportEmail} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportEmail: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Instagram URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.instagramUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, instagramUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">YouTube URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.youtubeUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, youtubeUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Main site URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.siteUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, siteUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Blog URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.blogUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, blogUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">Support URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">EVA URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.evaUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, evaUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground">UTG URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.utgUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, utgUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">UTG repository URL<input className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.utgRepoUrl} onChange={(event) => setSettingsForm((prev) => ({ ...prev, utgRepoUrl: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">Company description<textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.companyDescription} onChange={(event) => setSettingsForm((prev) => ({ ...prev, companyDescription: event.target.value }))} /></label>
                  <label className="text-sm font-medium text-foreground md:col-span-2">Support blurb<textarea className="mt-2 min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2" value={settingsForm.supportBlurb} onChange={(event) => setSettingsForm((prev) => ({ ...prev, supportBlurb: event.target.value }))} /></label>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <Button type="submit" disabled={saveSettingsMutation.isPending}>{saveSettingsMutation.isPending ? "Saving…" : "Save shared settings"}</Button>
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
