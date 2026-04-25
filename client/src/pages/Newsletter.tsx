import Layout from '@/components/Layout';
import { Link } from 'wouter';
import { Mail, Users, TrendingUp, LifeBuoy } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function Newsletter() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const subscribersQuery = trpc.crm.subscribers.list.useQuery({ limit: 100 }, { enabled: Boolean(user) });
  const contactsQuery = trpc.crm.contacts.list.useQuery({ limit: 100 }, { enabled: Boolean(user) });
  const supportQuery = trpc.support.requests.list.useQuery({ limit: 100 }, { enabled: Boolean(user) });

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading subscriber workspace…</p>
      </div>
    );
  }

  const subscribers = subscribersQuery.data || [];
  const contacts = contactsQuery.data || [];
  const supportRequests = supportQuery.data || [];
  const activeSubscribers = subscribers.filter((subscriber: any) => subscriber.status === 'subscribed').length;

  return (
    <Layout>
      <div className="container py-8">
        <Link href="/admin">
          <a className="inline-flex items-center gap-2 text-accent hover:underline mb-8">
            <span aria-hidden="true" className="text-base leading-none">←</span>
            Back to admin
          </a>
        </Link>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Subscribers + CRM</h1>
          <p className="text-lg text-muted-foreground">Review newsletter growth, support demand, and the broader CRM pipeline from the shared backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Active Subscribers</p>
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeSubscribers}</p>
          </div>

          <div className="p-6 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">CRM Contacts</p>
              <Users className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{contacts.length}</p>
          </div>

          <div className="p-6 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Support Requests</p>
              <LifeBuoy className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{supportRequests.length}</p>
          </div>

          <div className="p-6 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Qualified Contacts</p>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{contacts.filter((contact: any) => contact.status === 'qualified').length}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Latest Subscribers</h2>
            <div className="space-y-3">
              {subscribers.slice(0, 12).map((subscriber: any) => (
                <div key={subscriber.id || subscriber.email} className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="font-semibold text-foreground">{subscriber.email}</p>
                  <p className="text-sm text-muted-foreground">{subscriber.source || 'unknown source'} • {subscriber.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Latest CRM Contacts</h2>
            <div className="space-y-3">
              {contacts.slice(0, 12).map((contact: any) => (
                <div key={contact.id || contact.email} className="rounded-xl border border-border bg-background/70 p-4">
                  <p className="font-semibold text-foreground">{contact.name || contact.email}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mt-2">{contact.status}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
