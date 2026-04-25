# aima-blog

The editorial and operational center for the AIMA public web stack.

## What this repo owns

- `blog.useaima.com` public editorial experience
- team-only CMS and CRM surface for posts, authors, subscribers, support, and shared settings
- public shared-backend endpoints consumed by the other company sites where it makes sense

## Shared backend

`aima-blog` is now the first production-facing CMS/CRM surface for the split repo architecture:

- `aima-blog` powers content operations and shared intake workflows
- `useaima-hub` stays mostly code-driven, but can submit newsletter/support data into the shared backend
- `aima-support` stays mostly static, but can read shared settings and submit help requests into the shared backend

The canonical shared backend is the Supabase project:

- project ref: `aeswccckvxntbhdmyewt`

## Required environment variables

Create a local `.env` from `.env.example` and configure the same values in Vercel.

### Core runtime

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`

### Supabase shared backend

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_TEAM_ALLOWED_EMAILS`
- `SUPABASE_ADMIN_EMAILS`
- `SUPABASE_EDITOR_EMAILS`
- `SUPABASE_SUPPORT_EMAILS`
- `SITE_URL`
- `PUBLIC_MAIN_SITE_URL`
- `PUBLIC_SUPPORT_URL`
- `PUBLIC_EVA_URL`
- `PUBLIC_ALLOWED_ORIGINS`

### Legacy Manus OAuth compatibility fallback

These can stay configured during migration if you still need the older session path:

- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`

## Supabase schema

The first shared CMS/CRM schema lives in:

- `supabase/migrations/0001_blog_first_cms_crm.sql`

Apply it in the Supabase SQL editor or your preferred migration workflow before enabling the new admin features in production.

## Public shared endpoints

These are intended for trusted first-party use by the other public sites:

- `GET /api/public/settings`
- `POST /api/public/subscribe`
- `POST /api/public/support-request`

They are CORS-limited to the allowlisted AIMA domains.
