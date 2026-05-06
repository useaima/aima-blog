import { ChangeEvent, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ImagePlus, PencilLine, RefreshCcw, Save, Send, Sparkles } from "lucide-react";

type SectionBlock = {
  heading: string;
  body: string;
};

type BlogFormState = {
  id?: string;
  title: string;
  excerpt: string;
  tldr: string;
  categorySlug: string;
  productSlug: "eva" | "utg";
  status: "draft" | "in_review" | "published" | "archived";
  seoTitle: string;
  tags: string;
  coverImageUrl: string;
  sections: SectionBlock[];
};

type SupportFormState = {
  id?: string;
  title: string;
  summary: string;
  productSlug: "eva" | "utg";
  collectionSlug: string;
  status: "draft" | "in_review" | "published" | "archived";
  keywords: string;
  relatedSlugs: string;
  sections: SectionBlock[];
};

const initialBlogForm: BlogFormState = {
  title: "",
  excerpt: "",
  tldr: "",
  categorySlug: "product-updates",
  productSlug: "eva",
  status: "draft",
  seoTitle: "",
  tags: "aima, eva",
  coverImageUrl: "",
  sections: [
    { heading: "Overview", body: "" },
    { heading: "Why it matters", body: "" },
  ],
};

const initialSupportForm: SupportFormState = {
  title: "",
  summary: "",
  productSlug: "eva",
  collectionSlug: "eva-getting-started",
  status: "draft",
  keywords: "eva, getting started",
  relatedSlugs: "",
  sections: [
    { heading: "Answer", body: "" },
    { heading: "Next step", body: "" },
  ],
};

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unable to read file."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function toSlugList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderMarkdownFromSections(sections: SectionBlock[]) {
  return sections
    .filter((section) => section.heading.trim() || section.body.trim())
    .map((section, index) => {
      const title = section.heading.trim();
      const body = section.body.trim();
      if (!title) {
        return body;
      }
      return `${index === 0 ? "##" : "##"} ${title}\n\n${body}`.trim();
    })
    .join("\n\n");
}

function estimateReadingTime(text: string) {
  return Math.max(4, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

export default function AuthorDashboard() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const teamRole = ((user as any)?.teamRole ?? "contributor") as "admin" | "editor" | "contributor" | "support";
  const canPublish = teamRole === "admin" || teamRole === "editor";
  const canManageSupport = teamRole === "admin" || teamRole === "editor";

  const [activeTab, setActiveTab] = useState(canManageSupport ? "blog" : "blog");
  const [blogForm, setBlogForm] = useState<BlogFormState>(initialBlogForm);
  const [supportForm, setSupportForm] = useState<SupportFormState>(initialSupportForm);
  const [blogMessage, setBlogMessage] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);
  const [mediaMessage, setMediaMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const myPostsQuery = trpc.cms.posts.listMine.useQuery({ limit: 50 }, { enabled: Boolean(user) });
  const mediaQuery = trpc.cms.media.list.useQuery({ limit: 80 }, { enabled: Boolean(user) });
  const supportCollectionsQuery = trpc.cms.supportCollections.list.useQuery(
    { limit: 50 },
    { enabled: Boolean(user) && canManageSupport },
  );
  const supportArticlesQuery = trpc.cms.supportArticles.list.useQuery(
    { limit: 80 },
    { enabled: Boolean(user) && canManageSupport },
  );

  const createPostMutation = trpc.cms.posts.create.useMutation({
    onSuccess: async () => {
      await utils.cms.posts.listMine.invalidate();
      setBlogMessage("Saved to the shared CMS workspace.");
      setBlogForm(initialBlogForm);
    },
  });
  const updatePostMutation = trpc.cms.posts.update.useMutation({
    onSuccess: async () => {
      await utils.cms.posts.listMine.invalidate();
      setBlogMessage("Changes saved.");
    },
  });
  const uploadMediaMutation = trpc.cms.media.upload.useMutation({
    onSuccess: async (asset) => {
      await utils.cms.media.list.invalidate();
      setBlogForm((prev) => ({ ...prev, coverImageUrl: asset.public_url || prev.coverImageUrl }));
      setMediaMessage("Image uploaded to the shared media library.");
    },
  });

  const createSupportArticleMutation = trpc.cms.supportArticles.create.useMutation({
    onSuccess: async () => {
      await utils.cms.supportArticles.list.invalidate();
      setSupportMessage("Support article saved to the shared knowledge base.");
      setSupportForm(initialSupportForm);
    },
  });
  const updateSupportArticleMutation = trpc.cms.supportArticles.update.useMutation({
    onSuccess: async () => {
      await utils.cms.supportArticles.list.invalidate();
      setSupportMessage("Support article updated.");
    },
  });

  const publishedCount = useMemo(
    () => myPostsQuery.data?.filter((post: any) => post.status === "published").length ?? 0,
    [myPostsQuery.data],
  );
  const reviewCount = useMemo(
    () => myPostsQuery.data?.filter((post: any) => post.status === "in_review").length ?? 0,
    [myPostsQuery.data],
  );
  const draftCount = useMemo(
    () => myPostsQuery.data?.filter((post: any) => post.status === "draft").length ?? 0,
    [myPostsQuery.data],
  );

  const allowedStatuses = canPublish
    ? (["draft", "in_review", "published", "archived"] as const)
    : (["draft", "in_review"] as const);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMediaMessage(null);

    try {
      const dataUrl = await toDataUrl(file);
      await uploadMediaMutation.mutateAsync({
        fileName: file.name,
        dataUrl,
        title: file.name.replace(/\.[^.]+$/, ""),
        altText: blogForm.title || file.name,
      });
    } catch (error) {
      setMediaMessage(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      event.target.value = "";
    }
  };

  const handleBlogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlogMessage(null);

    const content = renderMarkdownFromSections(blogForm.sections);
    const nextStatus = canPublish ? blogForm.status : blogForm.status === "draft" ? "draft" : "in_review";

    try {
      if (blogForm.id) {
        await updatePostMutation.mutateAsync({
          id: blogForm.id,
          data: {
            title: blogForm.title,
            excerpt: blogForm.excerpt,
            tldr: blogForm.tldr || undefined,
            content,
            coverImageUrl: blogForm.coverImageUrl || undefined,
            categorySlug: blogForm.categorySlug,
            tags: toSlugList(blogForm.tags),
            productSlug: blogForm.productSlug,
            status: nextStatus,
            seoTitle: blogForm.seoTitle || undefined,
            readingTime: estimateReadingTime(content),
          },
        });
      } else {
        await createPostMutation.mutateAsync({
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          tldr: blogForm.tldr || undefined,
          content,
          coverImageUrl: blogForm.coverImageUrl || undefined,
          categorySlug: blogForm.categorySlug,
          tags: toSlugList(blogForm.tags),
          productSlug: blogForm.productSlug,
          status: nextStatus,
          seoTitle: blogForm.seoTitle || undefined,
          readingTime: estimateReadingTime(content),
        });
      }
    } catch (error) {
      setBlogMessage(error instanceof Error ? error.message : "Unable to save this article.");
    }
  };

  const handleSupportSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSupportMessage(null);

    const body = renderMarkdownFromSections(supportForm.sections);
    const nextStatus = canPublish ? supportForm.status : supportForm.status === "draft" ? "draft" : "in_review";

    try {
      if (supportForm.id) {
        await updateSupportArticleMutation.mutateAsync({
          id: supportForm.id,
          data: {
            title: supportForm.title,
            summary: supportForm.summary,
            body,
            collectionSlug: supportForm.collectionSlug,
            productSlug: supportForm.productSlug,
            status: nextStatus,
            keywords: toSlugList(supportForm.keywords),
            relatedSlugs: toSlugList(supportForm.relatedSlugs),
          },
        });
      } else {
        await createSupportArticleMutation.mutateAsync({
          title: supportForm.title,
          summary: supportForm.summary,
          body,
          collectionSlug: supportForm.collectionSlug,
          productSlug: supportForm.productSlug,
          status: nextStatus,
          keywords: toSlugList(supportForm.keywords),
          relatedSlugs: toSlugList(supportForm.relatedSlugs),
        });
      }
    } catch (error) {
      setSupportMessage(error instanceof Error ? error.message : "Unable to save this support article.");
    }
  };

  const isBusy =
    createPostMutation.isPending ||
    updatePostMutation.isPending ||
    uploadMediaMutation.isPending ||
    createSupportArticleMutation.isPending ||
    updateSupportArticleMutation.isPending;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading editorial workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
            <span aria-hidden="true" className="text-base leading-none">←</span>
            Back to blog
          </a>
        </Link>

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              <Sparkles className="h-4 w-4" />
              Editorial Workspace
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">Write without touching code</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              Draft blog posts, build help-center articles, upload images, and submit everything into the shared AIMA review workflow. Contributors can draft and submit. Editors and admins can publish.
            </p>
          </div>
          <div className="rounded-2xl border bg-secondary/70 px-5 py-4 text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{(user as any)?.email || "team member"}</span>
            <br />
            Role: <span className="font-semibold uppercase tracking-[0.18em] text-accent">{teamRole}</span>
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Published</p><p className="text-3xl font-bold text-foreground">{publishedCount}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">In review</p><p className="text-3xl font-bold text-foreground">{reviewCount}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Drafts</p><p className="text-3xl font-bold text-foreground">{draftCount}</p></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${canManageSupport ? "grid-cols-3" : "grid-cols-2"}`}>
            <TabsTrigger value="blog">Blog posts</TabsTrigger>
            {canManageSupport ? <TabsTrigger value="support">Support articles</TabsTrigger> : null}
            <TabsTrigger value="media">Media library</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{blogForm.id ? "Update article" : "Create a new article"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBlogSubmit} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-medium text-foreground">Title
                      <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.title} onChange={(event) => setBlogForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="A clear title readers can understand fast" />
                    </label>
                    <label className="text-sm font-medium text-foreground">SEO title
                      <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.seoTitle} onChange={(event) => setBlogForm((prev) => ({ ...prev, seoTitle: event.target.value }))} placeholder="Optional SEO-specific title" />
                    </label>
                  </div>

                  <label className="text-sm font-medium text-foreground">Excerpt
                    <textarea className="mt-2 min-h-[96px] w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.excerpt} onChange={(event) => setBlogForm((prev) => ({ ...prev, excerpt: event.target.value }))} placeholder="Summarize the article in plain language for readers and search snippets." />
                  </label>

                  <label className="text-sm font-medium text-foreground">TL;DR
                    <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" maxLength={160} value={blogForm.tldr} onChange={(event) => setBlogForm((prev) => ({ ...prev, tldr: event.target.value }))} placeholder="A short answer-engine summary (about 150 characters)." />
                  </label>

                  <div className="grid gap-4 md:grid-cols-4">
                    <label className="text-sm font-medium text-foreground">Category
                      <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.categorySlug} onChange={(event) => setBlogForm((prev) => ({ ...prev, categorySlug: event.target.value }))} placeholder="product-updates" />
                    </label>
                    <label className="text-sm font-medium text-foreground">Product
                      <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.productSlug} onChange={(event) => setBlogForm((prev) => ({ ...prev, productSlug: event.target.value as "eva" | "utg" }))}>
                        <option value="eva">eva</option>
                        <option value="utg">UTG</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-foreground">Status
                      <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.status} onChange={(event) => setBlogForm((prev) => ({ ...prev, status: event.target.value as BlogFormState["status"] }))}>
                        {allowedStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                      </select>
                    </label>
                    <label className="text-sm font-medium text-foreground">Tags
                      <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={blogForm.tags} onChange={(event) => setBlogForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="eva, ai agents, finance" />
                    </label>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Cover image</p>
                        <p className="text-sm text-muted-foreground">Upload once, then reuse it across the blog and help center.</p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent">
                        <ImagePlus className="h-4 w-4" />
                        Upload image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <input className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" value={blogForm.coverImageUrl} onChange={(event) => setBlogForm((prev) => ({ ...prev, coverImageUrl: event.target.value }))} placeholder="https://... or a media-library upload URL" />
                    {mediaMessage ? <p className="mt-3 text-sm text-muted-foreground">{mediaMessage}</p> : null}
                  </div>

                  <div className="space-y-4 rounded-2xl border bg-secondary/40 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-foreground">Article sections</p>
                        <p className="text-sm text-muted-foreground">Write in sections so non-coders can structure long-form content without markdown knowledge.</p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => setBlogForm((prev) => ({ ...prev, sections: [...prev.sections, { heading: "", body: "" }] }))}>Add section</Button>
                    </div>
                    {blogForm.sections.map((section, index) => (
                      <div key={`blog-section-${index}`} className="grid gap-3 rounded-2xl border bg-background p-4">
                        <input className="w-full rounded-xl border border-border bg-background px-4 py-3" value={section.heading} onChange={(event) => setBlogForm((prev) => ({ ...prev, sections: prev.sections.map((item, itemIndex) => itemIndex === index ? { ...item, heading: event.target.value } : item) }))} placeholder={`Section ${index + 1} heading`} />
                        <textarea className="min-h-[140px] w-full rounded-xl border border-border bg-background px-4 py-3" value={section.body} onChange={(event) => setBlogForm((prev) => ({ ...prev, sections: prev.sections.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) }))} placeholder="Write the body in clear paragraphs. Bullet points and headings are okay in plain language." />
                        {blogForm.sections.length > 1 ? (
                          <div>
                            <Button type="button" variant="ghost" onClick={() => setBlogForm((prev) => ({ ...prev, sections: prev.sections.filter((_, itemIndex) => itemIndex !== index) }))}>Remove section</Button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={isBusy} className="gap-2">
                      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : blogForm.id ? <Save className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                      {blogForm.id ? "Save changes" : canPublish && blogForm.status === "published" ? "Publish article" : "Save article"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setBlogForm(initialBlogForm); setBlogMessage(null); }}>Reset form</Button>
                    {blogMessage ? <span className="text-sm text-muted-foreground">{blogMessage}</span> : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your blog content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myPostsQuery.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : myPostsQuery.data?.length ? (
                  myPostsQuery.data.map((post: any) => (
                    <div key={post.id} className="rounded-2xl border bg-background p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">/{post.slug} • {post.status.replace("_", " ")} • {post.product_slug}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2"
                          onClick={() => setBlogForm({
                            id: post.id,
                            title: post.title,
                            excerpt: post.excerpt || "",
                            tldr: post.tldr || "",
                            categorySlug: "product-updates",
                            productSlug: (post.product_slug || "eva") as "eva" | "utg",
                            status: (post.status || "draft") as BlogFormState["status"],
                            seoTitle: post.seo_title || "",
                            tags: "",
                            coverImageUrl: post.cover_image_url || "",
                            sections: [{ heading: "Imported content", body: post.body_md || "" }],
                          })}
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No drafts yet. Use the form above to create your first post.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canManageSupport ? (
            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support article editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSupportSubmit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-sm font-medium text-foreground">Title
                        <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.title} onChange={(event) => setSupportForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Support article title" />
                      </label>
                      <label className="text-sm font-medium text-foreground">Collection slug
                        <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.collectionSlug} onChange={(event) => setSupportForm((prev) => ({ ...prev, collectionSlug: event.target.value }))} placeholder="eva-getting-started" />
                      </label>
                    </div>
                    <label className="text-sm font-medium text-foreground">Summary
                      <textarea className="mt-2 min-h-[96px] w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.summary} onChange={(event) => setSupportForm((prev) => ({ ...prev, summary: event.target.value }))} placeholder="Summarize the answer in clear, direct language." />
                    </label>
                    <div className="grid gap-4 md:grid-cols-4">
                      <label className="text-sm font-medium text-foreground">Product
                        <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.productSlug} onChange={(event) => setSupportForm((prev) => ({ ...prev, productSlug: event.target.value as "eva" | "utg" }))}>
                          <option value="eva">eva</option>
                          <option value="utg">UTG</option>
                        </select>
                      </label>
                      <label className="text-sm font-medium text-foreground">Status
                        <select className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.status} onChange={(event) => setSupportForm((prev) => ({ ...prev, status: event.target.value as SupportFormState["status"] }))}>
                          {allowedStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                        </select>
                      </label>
                      <label className="text-sm font-medium text-foreground md:col-span-2">Keywords / related slugs
                        <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.keywords} onChange={(event) => setSupportForm((prev) => ({ ...prev, keywords: event.target.value }))} placeholder="keywords, for, search" />
                      </label>
                    </div>
                    <label className="text-sm font-medium text-foreground">Related article slugs
                      <input className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" value={supportForm.relatedSlugs} onChange={(event) => setSupportForm((prev) => ({ ...prev, relatedSlugs: event.target.value }))} placeholder="eva-first-review, eva-subscriptions-review" />
                    </label>
                    <div className="space-y-4 rounded-2xl border bg-secondary/40 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">Answer sections</p>
                          <p className="text-sm text-muted-foreground">Use short, direct sections so support content stays easy to scan.</p>
                        </div>
                        <Button type="button" variant="outline" onClick={() => setSupportForm((prev) => ({ ...prev, sections: [...prev.sections, { heading: "", body: "" }] }))}>Add section</Button>
                      </div>
                      {supportForm.sections.map((section, index) => (
                        <div key={`support-section-${index}`} className="grid gap-3 rounded-2xl border bg-background p-4">
                          <input className="w-full rounded-xl border border-border bg-background px-4 py-3" value={section.heading} onChange={(event) => setSupportForm((prev) => ({ ...prev, sections: prev.sections.map((item, itemIndex) => itemIndex === index ? { ...item, heading: event.target.value } : item) }))} placeholder={`Section ${index + 1} heading`} />
                          <textarea className="min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3" value={section.body} onChange={(event) => setSupportForm((prev) => ({ ...prev, sections: prev.sections.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) }))} placeholder="Write the answer in plain language." />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button type="submit" disabled={isBusy} className="gap-2">
                        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {supportForm.id ? "Save support article" : "Create support article"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setSupportForm(initialSupportForm); setSupportMessage(null); }}>Reset form</Button>
                      {supportMessage ? <span className="text-sm text-muted-foreground">{supportMessage}</span> : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Collections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supportCollectionsQuery.data?.map((collection: any) => (
                      <div key={collection.id} className="rounded-2xl border bg-background p-4">
                        <h3 className="font-semibold text-foreground">{collection.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{collection.slug} • {collection.product_slug}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge base articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supportArticlesQuery.data?.map((article: any) => (
                      <div key={article.id} className="rounded-2xl border bg-background p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{article.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{article.slug} • {article.status} • {article.product_slug}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSupportForm({
                              id: article.id,
                              title: article.title,
                              summary: article.summary || "",
                              productSlug: (article.product_slug || "eva") as "eva" | "utg",
                              collectionSlug: supportCollectionsQuery.data?.find((collection: any) => collection.id === article.collection_id)?.slug || "eva-getting-started",
                              status: (article.status || "draft") as SupportFormState["status"],
                              keywords: Array.isArray(article.keywords) ? article.keywords.join(", ") : "",
                              relatedSlugs: Array.isArray(article.related_slugs) ? article.related_slugs.join(", ") : "",
                              sections: [{ heading: "Imported content", body: article.body_md || "" }],
                            })}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ) : null}

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shared media library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-5 rounded-2xl border border-dashed border-border bg-secondary/40 p-5">
                  <p className="font-semibold text-foreground">Fast upload</p>
                  <p className="mt-2 text-sm text-muted-foreground">Upload an image here first, then reuse the URL in blog posts or support articles.</p>
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent">
                    <ImagePlus className="h-4 w-4" />
                    Upload image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {mediaMessage ? <p className="mt-3 text-sm text-muted-foreground">{mediaMessage}</p> : null}
                </div>

                {mediaQuery.isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : mediaQuery.data?.length ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {mediaQuery.data.map((asset: any) => (
                      <article key={asset.id} className="overflow-hidden rounded-2xl border bg-background">
                        <div className="aspect-[4/3] bg-secondary">
                          <img src={asset.public_url} alt={asset.alt_text || asset.title || "uploaded media"} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-2 p-4 text-sm">
                          <p className="font-semibold text-foreground">{asset.title || asset.path}</p>
                          <p className="break-all text-muted-foreground">{asset.public_url}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
