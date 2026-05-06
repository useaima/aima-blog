create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  status text not null default 'active',
  avatar_url text,
  instagram_url text,
  facebook_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'contributor', 'support')),
  created_at timestamptz not null default now(),
  unique (profile_id, role)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'live' check (status in ('live', 'beta', 'archived')),
  summary text,
  description text,
  primary_url text not null,
  primary_label text not null,
  secondary_url text,
  secondary_label text,
  github_url text,
  support_label text,
  category_label text,
  featured_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contributor_invites (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('admin', 'editor', 'contributor', 'support')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by_email text,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  email text unique,
  role_title text,
  bio text,
  avatar_url text,
  instagram_url text,
  facebook_url text,
  website_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  color text,
  product_slug text check (product_slug in ('eva', 'utg')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_title text,
  excerpt text,
  tldr text,
  body_md text,
  featured_image text,
  cover_image_url text,
  author_id uuid references public.authors(id) on delete set null,
  category_id uuid references public.blog_categories(id) on delete set null,
  product_slug text check (product_slug in ('eva', 'utg')),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published', 'archived')),
  featured boolean not null default false,
  reading_time integer,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, tag_id)
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.blog_posts(id) on delete cascade,
  author_name text,
  author_email text,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  product_slug text not null check (product_slug in ('eva', 'utg')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  body_md text,
  keywords jsonb not null default '[]'::jsonb,
  related_slugs jsonb not null default '[]'::jsonb,
  collection_id uuid references public.support_collections(id) on delete set null,
  product_slug text not null check (product_slug in ('eva', 'utg')),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published', 'archived')),
  author_id uuid references public.authors(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  last_name text,
  status text not null default 'subscribed' check (status in ('pending', 'subscribed', 'unsubscribed')),
  source text,
  page_url text,
  origin text,
  tags jsonb not null default '[]'::jsonb,
  subscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  title text,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  public_url text,
  uploaded_by_email text,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'triaged', 'in_progress', 'resolved', 'spam')),
  source text,
  page_url text,
  origin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  status text not null default 'new' check (status in ('new', 'qualified', 'responded', 'customer', 'closed')),
  source text,
  first_touch_origin text,
  first_touch_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contact_notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  author_email text,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_featured_order on public.products(featured_order asc);
create index if not exists idx_team_roles_profile on public.team_roles(profile_id);
create index if not exists idx_contributor_invites_status on public.contributor_invites(status, created_at desc);
create index if not exists idx_blog_posts_status_published on public.blog_posts(status, published_at desc);
create index if not exists idx_support_articles_status_published on public.support_articles(status, published_at desc);
create index if not exists idx_newsletter_subscribers_created_at on public.newsletter_subscribers(created_at desc);
create index if not exists idx_support_requests_status_created_at on public.support_requests(status, created_at desc);
create index if not exists idx_crm_contacts_status_created_at on public.crm_contacts(status, created_at desc);

insert into storage.buckets (id, name, public)
values ('aima-media', 'aima-media', true)
on conflict (id) do nothing;

insert into public.products (
  slug,
  name,
  status,
  summary,
  description,
  primary_url,
  primary_label,
  secondary_url,
  secondary_label,
  github_url,
  support_label,
  category_label,
  featured_order
)
values
  (
    'eva',
    'eva',
    'live',
    'AI finance assistant for spending visibility, subscription review, and clearer next-step guidance.',
    'eva helps people understand spending behavior, detect unusual patterns, review subscriptions, and move from raw transaction history to confident financial action.',
    'https://eva.useaima.com',
    'Open eva',
    null,
    null,
    null,
    'EVA Help Center',
    'AI Finance Assistant',
    1
  ),
  (
    'utg',
    'Universal Transaction Gateway',
    'live',
    'Non-custodial transaction gateway for AI agents with strict human approval, idempotency, and auditability.',
    'UTG is AIMA''s programmable settlement layer for AI agents. It creates a hard security boundary between an agent''s intent and the user''s money using human approval, durable execution, and non-custodial controls.',
    'https://utg.useaima.com',
    'Open UTG',
    'https://github.com/useaima/universal-gateway',
    'View on GitHub',
    'https://github.com/useaima/universal-gateway',
    'UTG Help Center',
    'Agentic Commerce Infrastructure',
    2
  )
on conflict (slug) do update
set
  name = excluded.name,
  status = excluded.status,
  summary = excluded.summary,
  description = excluded.description,
  primary_url = excluded.primary_url,
  primary_label = excluded.primary_label,
  secondary_url = excluded.secondary_url,
  secondary_label = excluded.secondary_label,
  github_url = excluded.github_url,
  support_label = excluded.support_label,
  category_label = excluded.category_label,
  featured_order = excluded.featured_order;

insert into public.site_settings (key, value)
values (
  'public',
  jsonb_build_object(
    'brandName', 'aima',
    'companyName', 'aima',
    'siteUrl', 'https://useaima.com',
    'blogUrl', 'https://blog.useaima.com',
    'supportUrl', 'https://support.useaima.com',
    'evaUrl', 'https://eva.useaima.com',
    'utgUrl', 'https://utg.useaima.com',
    'utgRepoUrl', 'https://github.com/useaima/universal-gateway',
    'supportEmail', 'help@useaima.com',
    'instagramUrl', 'https://www.instagram.com/aima.ai123/',
    'youtubeUrl', 'https://www.youtube.com/channel/UCdUDx6XhvYMKTpEfjUPGgEQ',
    'instagramHandle', '@aima.ai123',
    'youtubeLabel', 'aima',
    'companyDescription', 'aima builds live AI products for financial clarity and agentic commerce, including eva and Universal Transaction Gateway.',
    'supportBlurb', 'Use the official help center for EVA and Universal Transaction Gateway documentation, troubleshooting, and direct support.',
    'canonicalMainDomain', 'https://useaima.com',
    'canonicalBlogDomain', 'https://blog.useaima.com',
    'canonicalSupportDomain', 'https://support.useaima.com'
  )
)
on conflict (key) do nothing;
