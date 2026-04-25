create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'support')),
  created_at timestamptz not null default now(),
  unique (profile_id, role)
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  email text unique,
  role_title text,
  bio text,
  avatar_url text,
  instagram_url text,
  facebook_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
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
  excerpt text,
  body_md text,
  author_id uuid references public.authors(id) on delete set null,
  category_id uuid references public.blog_categories(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  reading_time integer,
  cover_image_url text,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
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

create index if not exists idx_blog_posts_status_published on public.blog_posts(status, published_at desc);
create index if not exists idx_newsletter_subscribers_created_at on public.newsletter_subscribers(created_at desc);
create index if not exists idx_support_requests_status_created_at on public.support_requests(status, created_at desc);
create index if not exists idx_crm_contacts_status_created_at on public.crm_contacts(status, created_at desc);

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
    'supportEmail', 'help@useaima.com',
    'instagramUrl', 'https://www.instagram.com/aima.ai123/',
    'youtubeUrl', 'https://www.youtube.com/channel/UCdUDx6XhvYMKTpEfjUPGgEQ',
    'instagramHandle', '@aima.ai123',
    'youtubeLabel', 'aima'
  )
)
on conflict (key) do nothing;
