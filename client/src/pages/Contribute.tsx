import { useState } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Sparkles } from "lucide-react";

export default function Contribute() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    bio: "",
    expertise: "",
    instagram: "",
    facebook: "",
    website: "",
    articleIdea: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportRequestMutation = trpc.support.requests.create.useMutation();
  const captureLeadMutation = trpc.crm.contacts.capture.useMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const message = [
      `Contributor application from ${formData.name}.`,
      formData.company ? `Company: ${formData.company}` : null,
      formData.title ? `Role: ${formData.title}` : null,
      formData.bio ? `Bio: ${formData.bio}` : null,
      formData.expertise ? `Expertise: ${formData.expertise}` : null,
      formData.instagram ? `Instagram: ${formData.instagram}` : null,
      formData.facebook ? `Facebook: ${formData.facebook}` : null,
      formData.website ? `Website: ${formData.website}` : null,
      `Pitch: ${formData.articleIdea}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await supportRequestMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        topic: "Contributor application",
        message,
        source: "aima-blog-contribute",
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        origin: typeof window !== "undefined" ? window.location.origin : undefined,
      });

      await captureLeadMutation.mutateAsync({
        email: formData.email,
        name: formData.name,
        source: "contributor-application",
        origin: typeof window !== "undefined" ? window.location.origin : undefined,
        path: "/contribute",
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        title: "",
        bio: "",
        expertise: "",
        instagram: "",
        facebook: "",
        website: "",
        articleIdea: "",
      });
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Unable to send your contributor application.");
    }
  };

  return (
    <Layout>
      <section className="border-b border-border bg-secondary/60">
        <div className="container py-12 md:py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <Sparkles className="h-4 w-4" />
            Contributor program
          </p>
          <h1 className="mt-5 text-4xl font-bold text-foreground md:text-5xl">Write for the AIMA editorial system</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            We are building a non-coder publishing workflow for product, protocol, finance, and help-center content. If you want to contribute to the blog or support knowledge base, apply here and the editorial team can invite you into the shared CMS.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-foreground">Full name *
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Your full name" />
                </label>
                <label className="text-sm font-semibold text-foreground">Email address *
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="you@example.com" />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-foreground">Company
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Your company" />
                </label>
                <label className="text-sm font-semibold text-foreground">Role / title
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Your role" />
                </label>
              </div>

              <label className="text-sm font-semibold text-foreground">Short bio *
                <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={4} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Tell us about yourself and the perspective you bring." />
              </label>

              <label className="text-sm font-semibold text-foreground">Areas of expertise *
                <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="AI agents, fintech, support docs, APIs, developer relations…" />
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold text-foreground">Instagram
                  <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="@handle" />
                </label>
                <label className="text-sm font-semibold text-foreground">Facebook
                  <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Profile name or URL" />
                </label>
                <label className="text-sm font-semibold text-foreground">Website
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="https://your-site.com" />
                </label>
              </div>

              <label className="text-sm font-semibold text-foreground">Article or support-doc pitch *
                <textarea name="articleIdea" value={formData.articleIdea} onChange={handleChange} required rows={6} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3" placeholder="Tell us what you want to write, which product it relates to, and why readers would care." />
              </label>

              <button type="submit" className="w-full rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-60" disabled={supportRequestMutation.isPending || captureLeadMutation.isPending}>
                {supportRequestMutation.isPending || captureLeadMutation.isPending ? "Submitting application…" : "Submit application"}
              </button>

              {submitted ? (
                <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold text-foreground">Application received</p>
                      <p className="text-sm text-muted-foreground">We’ve sent your contributor application into the shared CMS/CRM queue so an editor can review it and invite you into the workspace.</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </form>
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">What invited contributors can do</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>Write blog posts without touching code.</li>
                <li>Upload cover images and reuse media from a shared library.</li>
                <li>Save drafts, revise them, and submit them for editorial review.</li>
                <li>Contribute product education for both EVA and Universal Transaction Gateway.</li>
              </ul>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">Editorial guidelines</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>Use clear headings and write for real users, not only search engines.</li>
                <li>Prefer helpful explanations, examples, and practical next steps.</li>
                <li>Keep product claims accurate and grounded in what is live.</li>
                <li>Expect editor review before anything goes public.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
