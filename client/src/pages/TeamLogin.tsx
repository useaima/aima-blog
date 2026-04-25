import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, MailCheck, ShieldCheck } from "lucide-react";

function readNextPath() {
  if (typeof window === "undefined") return "/admin";
  const params = new URLSearchParams(window.location.search);
  return params.get("next") || "/admin";
}

function readHashTokens() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken) return null;
  return { accessToken, refreshToken: refreshToken ?? undefined };
}

export default function TeamLogin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const nextPath = useMemo(() => readNextPath(), []);
  const hashTokens = useMemo(() => readHashTokens(), []);

  const requestMagicLink = trpc.auth.requestMagicLink.useMutation();
  const exchangeSession = trpc.auth.exchangeSession.useMutation();

  useEffect(() => {
    if (!hashTokens || exchangeSession.isPending || exchangeSession.isSuccess) {
      return;
    }

    exchangeSession
      .mutateAsync({
        accessToken: hashTokens.accessToken,
        refreshToken: hashTokens.refreshToken,
      })
      .then(() => {
        const target = nextPath || "/admin";
        window.history.replaceState({}, "", "/login");
        window.location.href = target;
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Unable to complete sign in.");
      });
  }, [exchangeSession, hashTokens, nextPath]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    try {
      await requestMagicLink.mutateAsync({ email, next: nextPath });
      setStatus("sent");
      setMessage("Magic link sent. Check your inbox to continue.");
    } catch (error) {
      setStatus("idle");
      setMessage(error instanceof Error ? error.message : "Unable to send sign-in link.");
    }
  };

  return (
    <Layout>
      <div className="container py-10 md:py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-secondary/70 p-8 shadow-sm md:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                <ShieldCheck className="h-4 w-4" />
                Team Access
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Sign in to the aima CMS and CRM</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                Use your team email to receive a secure magic link. Admin tools stay private while the public blog remains fully open.
              </p>
            </div>
            <Link href="/">
              <a className="text-sm font-medium text-accent hover:underline">Back to blog</a>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-background/80 p-5">
              <label className="block text-sm font-medium text-foreground" htmlFor="team-email">
                Team email
              </label>
              <input
                id="team-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="team@useaima.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="submit"
                disabled={requestMagicLink.isPending || exchangeSession.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {requestMagicLink.isPending || status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending magic link…
                  </>
                ) : (
                  <>
                    <MailCheck className="h-4 w-4" />
                    Email me the sign-in link
                  </>
                )}
              </button>
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </form>

            <aside className="rounded-2xl border border-border bg-background/60 p-5 text-sm text-muted-foreground">
              <h2 className="text-base font-semibold text-foreground">What this unlocks</h2>
              <ul className="mt-4 space-y-3 leading-6">
                <li>Private post, author, comment, subscriber, support, and CRM views.</li>
                <li>Shared site settings for the blog, main site, and support center.</li>
                <li>Team-only access designed for the new Supabase-backed content workflow.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
