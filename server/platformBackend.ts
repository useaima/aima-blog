import { ENV } from "./_core/env";
import { isSupabaseConfigured, supabaseRestRequest } from "./_core/supabase";
import {
  fallbackBlogArticles,
  fallbackBlogAuthors,
  fallbackBlogCategories,
  fallbackBlogTags,
  productSeeds,
  supportArticleSeeds,
  supportCollectionSeeds,
  type PublicProduct,
  type SupportArticleSeed,
  type SupportCollectionSeed,
} from "./platformSeeds";

export type TeamRole = "admin" | "editor" | "contributor" | "support";
export type CrmStatus = "new" | "qualified" | "responded" | "customer" | "closed";
export type SupportStatus = "new" | "triaged" | "in_progress" | "resolved" | "spam";
export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type PublicSiteSettings = {
  brandName: string;
  companyName: string;
  siteUrl: string;
  blogUrl: string;
  supportUrl: string;
  evaUrl: string;
  utgUrl: string;
  utgRepoUrl: string;
  supportEmail: string;
  instagramUrl: string;
  youtubeUrl: string;
  instagramHandle: string;
  youtubeLabel: string;
  companyDescription: string;
  supportBlurb: string;
  canonicalMainDomain: string;
  canonicalBlogDomain: string;
  canonicalSupportDomain: string;
};

export type NewsletterSubscriberRecord = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  status: string;
  source?: string | null;
  page_url?: string | null;
  origin?: string | null;
  tags?: string[] | null;
  subscribed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupportRequestRecord = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: SupportStatus;
  source?: string | null;
  page_url?: string | null;
  origin?: string | null;
  created_at?: string | null;
};

export type CrmContactRecord = {
  id: string;
  email: string;
  name?: string | null;
  status: CrmStatus;
  source?: string | null;
  first_touch_origin?: string | null;
  first_touch_path?: string | null;
  notes_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TeamProfileRecord = {
  id: string;
  email: string;
  full_name?: string | null;
  role: TeamRole;
  status?: string | null;
  avatar_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ContributorInviteRecord = {
  id: string;
  email: string;
  role: TeamRole;
  status: "pending" | "accepted" | "revoked";
  invited_by_email?: string | null;
  created_at?: string | null;
  accepted_at?: string | null;
};

export type MediaAssetRecord = {
  id: string;
  bucket: string;
  path: string;
  title?: string | null;
  alt_text?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  public_url: string;
  uploaded_by_email?: string | null;
  created_at?: string | null;
};

export type CmsAuthorRecord = {
  id: string;
  slug: string;
  name: string;
  email?: string | null;
  role_title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  website_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CmsCategoryRecord = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  color?: string | null;
  product_slug?: string | null;
};

export type CmsTagRecord = {
  id: string;
  slug: string;
  name: string;
};

export type CmsBlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  seo_title?: string | null;
  excerpt?: string | null;
  tldr?: string | null;
  body_md?: string | null;
  featured_image?: string | null;
  cover_image_url?: string | null;
  author_id?: string | null;
  category_id?: string | null;
  product_slug?: string | null;
  status: ContentStatus;
  featured?: boolean | null;
  reading_time?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CmsSupportCollectionRecord = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  product_slug: "eva" | "utg";
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CmsSupportArticleRecord = {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  body_md?: string | null;
  keywords?: string[] | null;
  related_slugs?: string[] | null;
  collection_id?: string | null;
  product_slug: "eva" | "utg";
  status: ContentStatus;
  author_id?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PublicBlogAuthor = {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  instagram?: string;
  facebook?: string;
  articleCount: number;
  company?: string;
  expertise?: string[];
  verified?: boolean;
  verificationBadge?: string;
};

export type PublicBlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
};

export type PublicBlogArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image: string;
  author: PublicBlogAuthor;
  category: PublicBlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  featured?: boolean;
  seoTitle?: string;
  tldr?: string;
  productSlugs: Array<"eva" | "utg">;
};

export type PublicSupportCollection = SupportCollectionSeed & {
  articleCount: number;
};

export type PublicSupportArticle = SupportArticleSeed & {
  collectionTitle: string;
  collectionDescription: string;
};

const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  brandName: "aima",
  companyName: "aima",
  siteUrl: "https://useaima.com",
  blogUrl: "https://blog.useaima.com",
  supportUrl: "https://support.useaima.com",
  evaUrl: "https://eva.useaima.com",
  utgUrl: "https://utg.useaima.com",
  utgRepoUrl: "https://github.com/useaima/universal-gateway",
  supportEmail: "help@useaima.com",
  instagramUrl: "https://www.instagram.com/aima.ai123/",
  youtubeUrl: "https://www.youtube.com/channel/UCdUDx6XhvYMKTpEfjUPGgEQ",
  instagramHandle: "@aima.ai123",
  youtubeLabel: "aima",
  companyDescription:
    "aima builds live AI products for financial clarity and agentic commerce, including eva and Universal Transaction Gateway.",
  supportBlurb:
    "Use the official help center for EVA and Universal Transaction Gateway documentation, troubleshooting, and direct support.",
  canonicalMainDomain: "https://useaima.com",
  canonicalBlogDomain: "https://blog.useaima.com",
  canonicalSupportDomain: "https://support.useaima.com",
};

const MEDIA_BUCKET = "aima-media";

function logSupabaseFallback(scope: string, error: unknown) {
  console.warn(`[PlatformBackend] Falling back for ${scope}:`, error instanceof Error ? error.message : error);
}

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

function normalizeName(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(item.slug, item);
  }
  return Array.from(map.values());
}

function createTldr(text?: string | null, maxLength = 150) {
  const collapsed = normalizeText(text).replace(/\s+/g, " ");
  if (collapsed.length <= maxLength) return collapsed;
  const sliced = collapsed.slice(0, maxLength - 3);
  const boundary = sliced.lastIndexOf(" ");
  return `${(boundary > 80 ? sliced.slice(0, boundary) : sliced).trimEnd()}...`;
}

function inferProductSlugs(text: string) {
  const haystack = text.toLowerCase();
  const productSlugs: Array<"eva" | "utg"> = [];
  if (/eva|finance|budget|money|spending|subscription/.test(haystack)) {
    productSlugs.push("eva");
  }
  if (/utg|transaction gateway|agentic commerce|idempotency|human-in-the-loop|x402|mpesa|settlement/.test(haystack)) {
    productSlugs.push("utg");
  }
  return productSlugs.length ? productSlugs : ["eva"];
}

function bufferFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image payload");
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function getStoragePublicUrl(path: string) {
  if (!ENV.supabaseUrl) {
    return path;
  }
  return `${ENV.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

async function uploadStorageObject(path: string, contentType: string, body: Buffer) {
  if (!ENV.supabaseUrl || !ENV.supabaseServiceRoleKey) {
    throw new Error("Supabase storage is not configured");
  }

  const response = await fetch(
    `${ENV.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${MEDIA_BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: ENV.supabaseServiceRoleKey,
        Authorization: `Bearer ${ENV.supabaseServiceRoleKey}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body,
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Storage upload failed (${response.status})`);
  }
}

function serializeSeedAuthor(author: (typeof fallbackBlogAuthors)[number], articleCount: number): PublicBlogAuthor {
  return {
    id: author.id,
    slug: author.id,
    name: author.name,
    title: author.title,
    bio: author.bio,
    avatar: author.avatar,
    instagram: author.instagram,
    facebook: author.facebook,
    articleCount,
    company: author.company,
    expertise: author.expertise,
    verified: author.verified,
    verificationBadge: author.verificationBadge,
  };
}

function serializeSeedCategory(category: (typeof fallbackBlogCategories)[number]): PublicBlogCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    color: category.color,
  };
}

function serializeSeedArticle(article: (typeof fallbackBlogArticles)[number]): PublicBlogArticle {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    slug: article.slug,
    image: article.image,
    author: serializeSeedAuthor(article.author, fallbackBlogArticles.filter((item) => item.author.id === article.author.id).length),
    category: serializeSeedCategory(article.category),
    tags: article.tags,
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    readTime: article.readTime,
    featured: article.featured,
    tldr: createTldr(article.excerpt),
    productSlugs: inferProductSlugs(`${article.title} ${article.excerpt} ${article.tags.join(" ")}`),
  };
}

async function upsertCrmContactRecord(input: {
  email: string;
  name?: string | null;
  source?: string | null;
  firstTouchOrigin?: string | null;
  firstTouchPath?: string | null;
  status?: CrmStatus;
}) {
  if (!isSupabaseConfigured()) return null;

  const payload = {
    email: normalizeEmail(input.email),
    name: normalizeName(input.name),
    status: input.status ?? "new",
    source: input.source ?? null,
    first_touch_origin: input.firstTouchOrigin ?? null,
    first_touch_path: input.firstTouchPath ?? null,
  };

  return supabaseRestRequest<CrmContactRecord[]>("crm_contacts", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "email",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  }).then((rows) => rows?.[0] ?? null);
}

async function listTable<T>(path: string, query: Record<string, string | number | boolean | null | undefined>) {
  if (!isSupabaseConfigured()) {
    return [] as T[];
  }

  try {
    return await supabaseRestRequest<T[]>(path, {
      serviceRole: true,
      query,
    });
  } catch (error) {
    logSupabaseFallback(`list ${path}`, error);
    return [] as T[];
  }
}

export function getDefaultSiteSettings() {
  return { ...DEFAULT_SITE_SETTINGS };
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    return getDefaultSiteSettings();
  }

  try {
    const rows = await supabaseRestRequest<Array<{ key: string; value: Partial<PublicSiteSettings> | null }>>(
      "site_settings",
      {
        serviceRole: true,
        query: {
          select: "key,value",
          key: "eq.public",
          limit: 1,
        },
      },
    );

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...(rows?.[0]?.value ?? {}),
    } as PublicSiteSettings;
  } catch (error) {
    logSupabaseFallback("site settings", error);
    return getDefaultSiteSettings();
  }
}

export async function updateSiteSettings(data: Partial<PublicSiteSettings>, actorEmail?: string | null) {
  const payload = {
    key: "public",
    value: {
      ...(await getSiteSettings()),
      ...data,
    },
    updated_by: actorEmail ?? null,
  };

  if (!isSupabaseConfigured()) {
    return payload.value as PublicSiteSettings;
  }

  const rows = await supabaseRestRequest<Array<{ value: PublicSiteSettings }>>("site_settings", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "key",
      select: "value",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });

  return rows?.[0]?.value ?? (payload.value as PublicSiteSettings);
}

export async function listProducts() {
  const dbRows = await listTable<any>("products", {
    select:
      "slug,name,status,summary,description,primary_url,primary_label,secondary_url,secondary_label,github_url,support_label,category_label",
    order: "featured_order.asc",
  });

  const normalized = dbRows.map((row) => ({
    slug: row.slug,
    name: row.name,
    status: row.status,
    summary: row.summary,
    description: row.description,
    primaryUrl: row.primary_url,
    primaryLabel: row.primary_label,
    secondaryUrl: row.secondary_url ?? undefined,
    secondaryLabel: row.secondary_label ?? undefined,
    githubUrl: row.github_url ?? undefined,
    supportLabel: row.support_label,
    categoryLabel: row.category_label,
  })) as PublicProduct[];

  return uniqueBySlug([...productSeeds, ...normalized]);
}

export async function getPublicPlatformData() {
  const [settings, products, blogIndex, supportIndex] = await Promise.all([
    getSiteSettings(),
    listProducts(),
    getPublicBlogIndex(),
    getPublicSupportIndex(),
  ]);

  return {
    settings,
    products,
    latestArticles: blogIndex.articles.slice(0, 6),
    featuredArticles: blogIndex.articles.filter((article) => article.featured).slice(0, 3),
    supportCollections: supportIndex.collections,
  };
}

export async function listContributorInvites(limit = 100) {
  return listTable<ContributorInviteRecord>("contributor_invites", {
    select: "*",
    order: "created_at.desc",
    limit,
  });
}

export async function getInviteByEmail(email: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const rows = await supabaseRestRequest<ContributorInviteRecord[]>("contributor_invites", {
      serviceRole: true,
      query: {
        select: "*",
        email: `eq.${normalizeEmail(email)}`,
        status: "in.(pending,accepted)",
        limit: 1,
      },
    });
    return rows?.[0] ?? null;
  } catch (error) {
    logSupabaseFallback("get contributor invite", error);
    return null;
  }
}

export async function createContributorInvite(input: {
  email: string;
  role: TeamRole;
  invitedByEmail?: string | null;
}) {
  const payload = {
    email: normalizeEmail(input.email),
    role: input.role,
    invited_by_email: input.invitedByEmail ?? null,
    status: "pending",
  };

  if (!isSupabaseConfigured()) {
    return { id: `invite-${payload.email}`, ...payload } as ContributorInviteRecord;
  }

  const rows = await supabaseRestRequest<ContributorInviteRecord[]>("contributor_invites", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "email",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });

  return rows?.[0];
}

export async function markInviteAccepted(email: string) {
  if (!isSupabaseConfigured()) return null;
  const rows = await supabaseRestRequest<ContributorInviteRecord[]>("contributor_invites", {
    method: "PATCH",
    serviceRole: true,
    query: {
      select: "*",
      email: `eq.${normalizeEmail(email)}`,
    },
    prefer: ["return=representation"],
    body: {
      status: "accepted",
      accepted_at: new Date().toISOString(),
    },
  });
  return rows?.[0] ?? null;
}

export async function resolveTeamRole(email?: string | null): Promise<TeamRole | undefined> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return undefined;

  if (ENV.supabaseAdminEmails.includes(normalizedEmail)) return "admin";
  if (ENV.supabaseEditorEmails.includes(normalizedEmail)) return "editor";
  if (ENV.supabaseSupportEmails.includes(normalizedEmail)) return "support";

  const invite = await getInviteByEmail(normalizedEmail);
  if (invite?.role) return invite.role;

  if (ENV.supabaseTeamAllowedEmails.length && ENV.supabaseTeamAllowedEmails.includes(normalizedEmail)) {
    return "contributor";
  }

  return undefined;
}

export async function isAllowedTeamEmail(email?: string | null) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return false;

  if (
    ENV.supabaseAdminEmails.includes(normalizedEmail) ||
    ENV.supabaseEditorEmails.includes(normalizedEmail) ||
    ENV.supabaseSupportEmails.includes(normalizedEmail)
  ) {
    return true;
  }

  if (ENV.supabaseTeamAllowedEmails.length && ENV.supabaseTeamAllowedEmails.includes(normalizedEmail)) {
    return true;
  }

  const invite = await getInviteByEmail(normalizedEmail);
  return Boolean(invite);
}

export async function syncTeamProfile(input: {
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const teamRole = (await resolveTeamRole(normalizedEmail)) ?? "contributor";

  const profile: TeamProfileRecord = {
    id: input.id,
    email: normalizedEmail,
    full_name: normalizeName(input.fullName),
    role: teamRole,
    avatar_url: input.avatarUrl ?? null,
    status: "active",
  };

  if (isSupabaseConfigured()) {
    try {
      await supabaseRestRequest<TeamProfileRecord[]>("profiles", {
        method: "POST",
        serviceRole: true,
        query: {
          on_conflict: "id",
          select: "*",
        },
        prefer: ["resolution=merge-duplicates", "return=representation"],
        body: profile,
      });

      await supabaseRestRequest("team_roles", {
        method: "DELETE",
        serviceRole: true,
        query: {
          profile_id: `eq.${input.id}`,
        },
      }).catch(() => null);

      await supabaseRestRequest("team_roles", {
        method: "POST",
        serviceRole: true,
        query: {
          on_conflict: "profile_id,role",
        },
        prefer: ["resolution=ignore-duplicates"],
        body: {
          profile_id: input.id,
          role: teamRole,
        },
      }).catch(() => null);

      if (normalizedEmail) {
        await markInviteAccepted(normalizedEmail).catch(() => null);
      }
    } catch (error) {
      logSupabaseFallback("sync team profile", error);
    }
  }

  return {
    id: input.id,
    email: normalizedEmail,
    full_name: profile.full_name,
    role: teamRole,
    avatar_url: profile.avatar_url,
  };
}

async function listAuthorsFromSupabase() {
  return listTable<CmsAuthorRecord>("authors", {
    select: "*",
    order: "created_at.asc",
    limit: 200,
  });
}

async function listCategoriesFromSupabase() {
  return listTable<CmsCategoryRecord>("blog_categories", {
    select: "*",
    order: "name.asc",
    limit: 100,
  });
}

async function listTagsFromSupabase() {
  return listTable<CmsTagRecord>("blog_tags", {
    select: "*",
    order: "name.asc",
    limit: 200,
  });
}

async function listPostTagsFromSupabase() {
  return listTable<Array<{ post_id: string; tag_id: string }>[number]>("blog_post_tags", {
    select: "post_id,tag_id",
    limit: 500,
  });
}

async function listPostsFromSupabase(status?: ContentStatus | "published_only") {
  const query: Record<string, string | number | undefined> = {
    select:
      "id,slug,title,seo_title,excerpt,tldr,body_md,cover_image_url,featured_image,author_id,category_id,product_slug,status,featured,reading_time,published_at,created_at,updated_at",
    order: "published_at.desc",
    limit: 200,
  };

  if (status === "published_only") {
    query.status = "eq.published";
  } else if (status) {
    query.status = `eq.${status}`;
  }

  return listTable<CmsBlogPostRecord>("blog_posts", query);
}

function buildPublicBlogAuthors(articles: PublicBlogArticle[]) {
  const counts = new Map<string, number>();
  articles.forEach((article) => {
    counts.set(article.author.slug, (counts.get(article.author.slug) ?? 0) + 1);
  });

  return fallbackBlogAuthors.map((author) =>
    serializeSeedAuthor(author, counts.get(author.id) ?? fallbackBlogArticles.filter((item) => item.author.id === author.id).length),
  );
}

function mergePublicArticles(dynamicArticles: PublicBlogArticle[]) {
  const seedArticles = fallbackBlogArticles.map(serializeSeedArticle);
  return uniqueBySlug([...seedArticles, ...dynamicArticles]).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPublicBlogIndex() {
  const [dbPosts, dbAuthors, dbCategories, dbTags, dbPostTags] = await Promise.all([
    listPostsFromSupabase("published_only"),
    listAuthorsFromSupabase(),
    listCategoriesFromSupabase(),
    listTagsFromSupabase(),
    listPostTagsFromSupabase(),
  ]);

  const authorById = new Map(dbAuthors.map((author) => [author.id, author]));
  const categoryById = new Map(dbCategories.map((category) => [category.id, category]));
  const tagById = new Map(dbTags.map((tag) => [tag.id, tag]));
  const tagsByPostId = new Map<string, string[]>();

  dbPostTags.forEach((item) => {
    const tag = tagById.get(item.tag_id);
    if (!tag) return;
    tagsByPostId.set(item.post_id, [...(tagsByPostId.get(item.post_id) ?? []), tag.slug]);
  });

  const dynamicArticles: PublicBlogArticle[] = dbPosts.map((post) => {
    const author = authorById.get(post.author_id ?? "");
    const category = categoryById.get(post.category_id ?? "");
    const fallbackAuthor = serializeSeedAuthor(fallbackBlogAuthors[0], 0);
    const fallbackCategory = serializeSeedCategory(fallbackBlogCategories[0]);
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt ?? createTldr(post.body_md, 180),
      content: post.body_md ?? "",
      slug: post.slug,
      image: post.cover_image_url || post.featured_image || "/blog/covers/product-updates.svg",
      author: author
        ? {
            id: author.id,
            slug: author.slug,
            name: author.name,
            title: author.role_title ?? "Contributor",
            bio: author.bio ?? "",
            avatar: author.avatar_url ?? undefined,
            instagram: author.instagram_url ?? undefined,
            facebook: author.facebook_url ?? undefined,
            articleCount: 0,
          }
        : fallbackAuthor,
      category: category
        ? {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            color: category.color ?? "oklch(0.67 0.08 70)",
          }
        : fallbackCategory,
      tags: tagsByPostId.get(post.id) ?? [],
      publishedAt: post.published_at ?? post.created_at ?? new Date().toISOString(),
      updatedAt: post.updated_at ?? post.created_at ?? new Date().toISOString(),
      readTime: post.reading_time ?? Math.max(4, Math.round((post.body_md ?? "").split(/\s+/).length / 200)),
      featured: Boolean(post.featured),
      seoTitle: post.seo_title ?? undefined,
      tldr: post.tldr ?? createTldr(post.excerpt || post.body_md),
      productSlugs: inferProductSlugs(`${post.title} ${post.excerpt ?? ""} ${post.product_slug ?? ""}`),
    };
  });

  const mergedArticles = mergePublicArticles(dynamicArticles);
  const mergedAuthors = buildPublicBlogAuthors(mergedArticles);
  const mergedCategories = uniqueBySlug([
    ...fallbackBlogCategories.map(serializeSeedCategory),
    ...dbCategories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      color: category.color ?? "oklch(0.67 0.08 70)",
    })),
  ]);
  const mergedTags = Array.from(new Set([...fallbackBlogTags, ...dbTags.map((tag) => tag.slug)])).sort();

  mergedArticles.forEach((article) => {
    const author = mergedAuthors.find((entry) => entry.slug === article.author.slug);
    if (author) {
      article.author = { ...article.author, articleCount: author.articleCount };
    }
  });

  return {
    authors: mergedAuthors,
    categories: mergedCategories,
    tags: mergedTags,
    articles: mergedArticles,
  };
}

export async function getPublicBlogArticle(slug: string) {
  const index = await getPublicBlogIndex();
  return index.articles.find((article) => article.slug === slug) ?? null;
}

export async function getPublicBlogAuthor(slug: string) {
  const index = await getPublicBlogIndex();
  const author = index.authors.find((entry) => entry.slug === slug || entry.id === slug);
  if (!author) return null;
  return {
    author,
    articles: index.articles.filter((article) => article.author.slug === author.slug),
  };
}

export async function listCmsAuthors(limit = 100) {
  const rows = await listAuthorsFromSupabase();
  return rows.slice(0, limit);
}

export async function createCmsAuthor(input: {
  name: string;
  email?: string;
  bio?: string;
  roleTitle?: string;
  avatarUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
}) {
  const payload = {
    slug: slugify(input.name),
    name: normalizeText(input.name),
    email: normalizeEmail(input.email),
    bio: input.bio ?? null,
    role_title: input.roleTitle ?? null,
    avatar_url: input.avatarUrl ?? null,
    instagram_url: input.instagramUrl ?? null,
    facebook_url: input.facebookUrl ?? null,
    website_url: input.websiteUrl ?? null,
  };

  if (!isSupabaseConfigured()) {
    return { id: `author-${payload.slug}`, ...payload } as CmsAuthorRecord;
  }

  const rows = await supabaseRestRequest<CmsAuthorRecord[]>("authors", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "slug",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });
  return rows?.[0];
}

export async function updateCmsAuthor(id: string, data: Partial<{
  name: string;
  bio: string;
  roleTitle: string;
  avatarUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  websiteUrl: string;
}>) {
  if (!isSupabaseConfigured()) {
    return { id, ...data };
  }

  const rows = await supabaseRestRequest<CmsAuthorRecord[]>("authors", {
    method: "PATCH",
    serviceRole: true,
    query: {
      id: `eq.${id}`,
      select: "*",
    },
    prefer: ["return=representation"],
    body: {
      ...(data.name ? { name: data.name, slug: slugify(data.name) } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.roleTitle !== undefined ? { role_title: data.roleTitle } : {}),
      ...(data.avatarUrl !== undefined ? { avatar_url: data.avatarUrl } : {}),
      ...(data.instagramUrl !== undefined ? { instagram_url: data.instagramUrl } : {}),
      ...(data.facebookUrl !== undefined ? { facebook_url: data.facebookUrl } : {}),
      ...(data.websiteUrl !== undefined ? { website_url: data.websiteUrl } : {}),
    },
  });

  return rows?.[0] ?? { id, ...data };
}

export async function ensureAuthorForUser(input: { email?: string | null; name?: string | null }) {
  const email = normalizeEmail(input.email);
  if (!email) {
    return listCmsAuthors(1).then((rows) => rows[0] ?? createCmsAuthor({ name: input.name || "AIMA Contributor" }));
  }

  if (isSupabaseConfigured()) {
    const rows = await supabaseRestRequest<CmsAuthorRecord[]>("authors", {
      serviceRole: true,
      query: {
        select: "*",
        email: `eq.${email}`,
        limit: 1,
      },
    }).catch(() => []);

    if (rows?.[0]) {
      return rows[0];
    }
  }

  return createCmsAuthor({
    name: input.name || email.split("@")[0],
    email,
    roleTitle: "Contributor",
  });
}

async function ensureCategoryBySlug(slug: string) {
  const categories = await listCategoriesFromSupabase();
  const existing = categories.find((category) => category.slug === slug);
  if (existing) return existing;

  if (!isSupabaseConfigured()) {
    return {
      id: `category-${slug}`,
      slug,
      name: slug.replace(/-/g, " "),
      description: "",
      color: "oklch(0.67 0.08 70)",
    } as CmsCategoryRecord;
  }

  const rows = await supabaseRestRequest<CmsCategoryRecord[]>("blog_categories", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "slug",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: {
      slug,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      description: "",
    },
  });
  return rows?.[0];
}

async function ensureTags(slugs: string[]) {
  if (!slugs.length) return [] as CmsTagRecord[];
  const existing = await listTagsFromSupabase();
  const ensured: CmsTagRecord[] = [];

  for (const slug of slugs) {
    const found = existing.find((tag) => tag.slug === slug);
    if (found) {
      ensured.push(found);
      continue;
    }

    if (!isSupabaseConfigured()) {
      ensured.push({ id: `tag-${slug}`, slug, name: slug } as CmsTagRecord);
      continue;
    }

    const rows = await supabaseRestRequest<CmsTagRecord[]>("blog_tags", {
      method: "POST",
      serviceRole: true,
      query: {
        on_conflict: "slug",
        select: "*",
      },
      prefer: ["resolution=merge-duplicates", "return=representation"],
      body: {
        slug,
        name: slug,
      },
    });

    if (rows?.[0]) {
      ensured.push(rows[0]);
    }
  }

  return ensured;
}

export async function listCmsPosts(limit = 100) {
  const rows = await listPostsFromSupabase();
  return rows.slice(0, limit);
}

export async function listCmsPostsForAuthor(email?: string | null, limit = 100) {
  const author = await ensureAuthorForUser({ email });
  const rows = await listPostsFromSupabase();
  return rows.filter((row) => row.author_id === author?.id).slice(0, limit);
}

export async function createCmsPost(input: {
  title: string;
  excerpt: string;
  tldr?: string;
  content: string;
  coverImageUrl?: string;
  categorySlug: string;
  tags: string[];
  authorId?: string;
  authorEmail?: string | null;
  authorName?: string | null;
  productSlug: "eva" | "utg";
  status: ContentStatus;
  featured?: boolean;
  seoTitle?: string;
  readingTime?: number;
}) {
  const category = await ensureCategoryBySlug(input.categorySlug);
  const author = input.authorId
    ? { id: input.authorId }
    : await ensureAuthorForUser({ email: input.authorEmail, name: input.authorName });
  const tags = await ensureTags(input.tags.map((tag) => slugify(tag)));
  const slug = slugify(input.title);
  const readingTime =
    input.readingTime ?? Math.max(4, Math.round(input.content.split(/\s+/).filter(Boolean).length / 200));

  const payload = {
    slug,
    title: normalizeText(input.title),
    seo_title: input.seoTitle ?? null,
    excerpt: normalizeText(input.excerpt),
    tldr: input.tldr ?? createTldr(input.excerpt || input.content),
    body_md: input.content,
    cover_image_url: input.coverImageUrl ?? null,
    author_id: author?.id ?? null,
    category_id: category?.id ?? null,
    product_slug: input.productSlug,
    status: input.status,
    featured: Boolean(input.featured),
    reading_time: readingTime,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  if (!isSupabaseConfigured()) {
    return { id: `post-${slug}`, ...payload } as CmsBlogPostRecord;
  }

  const rows = await supabaseRestRequest<CmsBlogPostRecord[]>("blog_posts", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "slug",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });
  const post = rows?.[0];

  if (post?.id && tags.length) {
    await supabaseRestRequest("blog_post_tags", {
      method: "DELETE",
      serviceRole: true,
      query: {
        post_id: `eq.${post.id}`,
      },
    }).catch(() => null);

    await Promise.all(
      tags.map((tag) =>
        supabaseRestRequest("blog_post_tags", {
          method: "POST",
          serviceRole: true,
          query: {
            on_conflict: "post_id,tag_id",
          },
          prefer: ["resolution=ignore-duplicates"],
          body: {
            post_id: post.id,
            tag_id: tag.id,
          },
        }).catch(() => null),
      ),
    );
  }

  return post;
}

export async function updateCmsPost(id: string, data: Partial<{
  title: string;
  excerpt: string;
  tldr: string;
  content: string;
  coverImageUrl: string;
  categorySlug: string;
  tags: string[];
  status: ContentStatus;
  featured: boolean;
  seoTitle: string;
  readingTime: number;
  productSlug: "eva" | "utg";
}>) {
  const category = data.categorySlug ? await ensureCategoryBySlug(data.categorySlug) : null;
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) {
    payload.title = data.title;
    payload.slug = slugify(data.title);
  }
  if (data.excerpt !== undefined) payload.excerpt = data.excerpt;
  if (data.tldr !== undefined) payload.tldr = data.tldr;
  if (data.content !== undefined) payload.body_md = data.content;
  if (data.coverImageUrl !== undefined) payload.cover_image_url = data.coverImageUrl;
  if (data.categorySlug !== undefined) payload.category_id = category?.id ?? null;
  if (data.status !== undefined) {
    payload.status = data.status;
    if (data.status === "published") {
      payload.published_at = new Date().toISOString();
    }
  }
  if (data.featured !== undefined) payload.featured = data.featured;
  if (data.seoTitle !== undefined) payload.seo_title = data.seoTitle;
  if (data.readingTime !== undefined) payload.reading_time = data.readingTime;
  if (data.productSlug !== undefined) payload.product_slug = data.productSlug;

  if (!isSupabaseConfigured()) {
    return { id, ...payload };
  }

  const rows = await supabaseRestRequest<CmsBlogPostRecord[]>("blog_posts", {
    method: "PATCH",
    serviceRole: true,
    query: {
      id: `eq.${id}`,
      select: "*",
    },
    prefer: ["return=representation"],
    body: payload,
  });

  if (data.tags) {
    const tags = await ensureTags(data.tags.map((tag) => slugify(tag)));
    await supabaseRestRequest("blog_post_tags", {
      method: "DELETE",
      serviceRole: true,
      query: {
        post_id: `eq.${id}`,
      },
    }).catch(() => null);
    await Promise.all(
      tags.map((tag) =>
        supabaseRestRequest("blog_post_tags", {
          method: "POST",
          serviceRole: true,
          query: {
            on_conflict: "post_id,tag_id",
          },
          prefer: ["resolution=ignore-duplicates"],
          body: {
            post_id: id,
            tag_id: tag.id,
          },
        }).catch(() => null),
      ),
    );
  }

  return rows?.[0] ?? { id, ...payload };
}

async function listSupportCollectionsFromSupabase() {
  return listTable<CmsSupportCollectionRecord>("support_collections", {
    select: "*",
    order: "product_slug.asc,title.asc",
    limit: 100,
  });
}

async function listSupportArticlesFromSupabase(status?: ContentStatus | "published_only") {
  const query: Record<string, string | number | undefined> = {
    select: "*",
    order: "published_at.desc",
    limit: 300,
  };
  if (status === "published_only") {
    query.status = "eq.published";
  } else if (status) {
    query.status = `eq.${status}`;
  }
  return listTable<CmsSupportArticleRecord>("support_articles", query);
}

export async function getPublicSupportIndex() {
  const [dbCollections, dbArticles] = await Promise.all([
    listSupportCollectionsFromSupabase(),
    listSupportArticlesFromSupabase("published_only"),
  ]);

  const collections = uniqueBySlug([
    ...supportCollectionSeeds,
    ...dbCollections.map((collection) => ({
      slug: collection.slug,
      title: collection.title,
      description: collection.description ?? "",
      productSlug: collection.product_slug,
      featured: Boolean(collection.featured),
    })),
  ]);

  const articles = uniqueBySlug([
    ...supportArticleSeeds,
    ...dbArticles.map((article) => {
      const collection = dbCollections.find((entry) => entry.id === article.collection_id);
      return {
        id: article.id,
        slug: article.slug,
        collectionSlug: collection?.slug ?? supportCollectionSeeds[0].slug,
        productSlug: article.product_slug,
        title: article.title,
        summary: article.summary ?? createTldr(article.body_md),
        body: article.body_md ?? "",
        keywords: article.keywords ?? [],
        relatedSlugs: article.related_slugs ?? [],
      } as SupportArticleSeed;
    }),
  ]);

  return {
    collections: collections.map((collection) => ({
      ...collection,
      articleCount: articles.filter((article) => article.collectionSlug === collection.slug).length,
    })) as PublicSupportCollection[],
    articles,
  };
}

export async function getPublicSupportArticle(slug: string) {
  const index = await getPublicSupportIndex();
  const article = index.articles.find((entry) => entry.slug === slug);
  if (!article) return null;
  const collection = index.collections.find((entry) => entry.slug === article.collectionSlug);
  return {
    ...article,
    collectionTitle: collection?.title ?? "",
    collectionDescription: collection?.description ?? "",
  } as PublicSupportArticle;
}

export async function listCmsSupportCollections(limit = 100) {
  const rows = await listSupportCollectionsFromSupabase();
  return rows.slice(0, limit);
}

export async function createCmsSupportCollection(input: {
  title: string;
  description?: string;
  productSlug: "eva" | "utg";
  featured?: boolean;
}) {
  const payload = {
    slug: slugify(input.title),
    title: input.title,
    description: input.description ?? null,
    product_slug: input.productSlug,
    featured: Boolean(input.featured),
  };

  if (!isSupabaseConfigured()) {
    return { id: `support-collection-${payload.slug}`, ...payload } as CmsSupportCollectionRecord;
  }

  const rows = await supabaseRestRequest<CmsSupportCollectionRecord[]>("support_collections", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "slug",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });
  return rows?.[0];
}

export async function listCmsSupportArticles(limit = 200) {
  const rows = await listSupportArticlesFromSupabase();
  return rows.slice(0, limit);
}

export async function createCmsSupportArticle(input: {
  title: string;
  summary: string;
  body: string;
  keywords: string[];
  relatedSlugs?: string[];
  collectionSlug: string;
  productSlug: "eva" | "utg";
  authorEmail?: string | null;
  authorName?: string | null;
  status: ContentStatus;
}) {
  const collections = await listSupportCollectionsFromSupabase();
  let collection = collections.find((entry) => entry.slug === input.collectionSlug);
  if (!collection) {
    collection = await createCmsSupportCollection({
      title: input.collectionSlug.replace(/-/g, " "),
      productSlug: input.productSlug,
      description: "",
    });
  }

  const author = await ensureAuthorForUser({ email: input.authorEmail, name: input.authorName });
  const payload = {
    slug: slugify(input.title),
    title: input.title,
    summary: input.summary,
    body_md: input.body,
    keywords: input.keywords,
    related_slugs: input.relatedSlugs ?? [],
    collection_id: collection?.id ?? null,
    product_slug: input.productSlug,
    status: input.status,
    author_id: author?.id ?? null,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  if (!isSupabaseConfigured()) {
    return { id: `support-${payload.slug}`, ...payload } as CmsSupportArticleRecord;
  }

  const rows = await supabaseRestRequest<CmsSupportArticleRecord[]>("support_articles", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "slug",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  });
  return rows?.[0];
}

export async function updateCmsSupportArticle(id: string, data: Partial<{
  title: string;
  summary: string;
  body: string;
  keywords: string[];
  relatedSlugs: string[];
  collectionSlug: string;
  productSlug: "eva" | "utg";
  status: ContentStatus;
}>) {
  let collectionId: string | null | undefined;
  if (data.collectionSlug) {
    const collections = await listSupportCollectionsFromSupabase();
    collectionId = collections.find((entry) => entry.slug === data.collectionSlug)?.id ?? null;
  }

  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) {
    payload.title = data.title;
    payload.slug = slugify(data.title);
  }
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.body !== undefined) payload.body_md = data.body;
  if (data.keywords !== undefined) payload.keywords = data.keywords;
  if (data.relatedSlugs !== undefined) payload.related_slugs = data.relatedSlugs;
  if (data.collectionSlug !== undefined) payload.collection_id = collectionId ?? null;
  if (data.productSlug !== undefined) payload.product_slug = data.productSlug;
  if (data.status !== undefined) {
    payload.status = data.status;
    if (data.status === "published") payload.published_at = new Date().toISOString();
  }

  if (!isSupabaseConfigured()) {
    return { id, ...payload };
  }

  const rows = await supabaseRestRequest<CmsSupportArticleRecord[]>("support_articles", {
    method: "PATCH",
    serviceRole: true,
    query: {
      id: `eq.${id}`,
      select: "*",
    },
    prefer: ["return=representation"],
    body: payload,
  });
  return rows?.[0] ?? { id, ...payload };
}

export async function subscribeNewsletter(input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  pageUrl?: string | null;
  origin?: string | null;
  tags?: string[] | null;
}) {
  const email = normalizeEmail(input.email);
  const payload = {
    email,
    first_name: normalizeName(input.firstName),
    last_name: normalizeName(input.lastName),
    status: "subscribed",
    source: input.source ?? "blog",
    page_url: input.pageUrl ?? null,
    origin: input.origin ?? null,
    tags: input.tags ?? ["blog-subscriber"],
    subscribed_at: new Date().toISOString(),
  };

  let row: NewsletterSubscriberRecord | null = null;

  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRestRequest<NewsletterSubscriberRecord[]>("newsletter_subscribers", {
        method: "POST",
        serviceRole: true,
        query: {
          on_conflict: "email",
          select: "*",
        },
        prefer: ["resolution=merge-duplicates", "return=representation"],
        body: payload,
      });
      row = rows?.[0] ?? null;
    } catch (error) {
      logSupabaseFallback("newsletter subscribe", error);
    }
  }

  await upsertCrmContactRecord({
    email,
    name: [payload.first_name, payload.last_name].filter(Boolean).join(" ") || null,
    source: payload.source,
    firstTouchOrigin: payload.origin,
    firstTouchPath: payload.page_url,
    status: "new",
  }).catch((error) => logSupabaseFallback("subscriber CRM sync", error));

  return {
    success: true,
    message: "Subscribed successfully",
    subscriber: row,
  };
}

export async function listNewsletterSubscribers(limit = 100) {
  return listTable<NewsletterSubscriberRecord>("newsletter_subscribers", {
    select: "*",
    order: "created_at.desc",
    limit,
  });
}

export async function createSupportRequest(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  source?: string | null;
  pageUrl?: string | null;
  origin?: string | null;
}) {
  const payload = {
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    topic: input.topic.trim(),
    message: input.message.trim(),
    status: "new" as SupportStatus,
    source: input.source ?? "support",
    page_url: input.pageUrl ?? null,
    origin: input.origin ?? null,
  };

  let row: SupportRequestRecord | null = null;

  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRestRequest<SupportRequestRecord[]>("support_requests", {
        method: "POST",
        serviceRole: true,
        query: {
          select: "*",
        },
        prefer: ["return=representation"],
        body: payload,
      });
      row = rows?.[0] ?? null;
    } catch (error) {
      logSupabaseFallback("create support request", error);
    }
  }

  await upsertCrmContactRecord({
    email: payload.email,
    name: payload.name,
    source: payload.source,
    firstTouchOrigin: payload.origin,
    firstTouchPath: payload.page_url,
    status: "responded",
  }).catch((error) => logSupabaseFallback("support CRM sync", error));

  return {
    success: true,
    request: row,
  };
}

export async function listSupportRequests(limit = 100) {
  return listTable<SupportRequestRecord>("support_requests", {
    select: "*",
    order: "created_at.desc",
    limit,
  });
}

export async function updateSupportRequestStatus(id: string, status: SupportStatus) {
  if (!isSupabaseConfigured()) {
    return { id, status };
  }

  const rows = await supabaseRestRequest<SupportRequestRecord[]>("support_requests", {
    method: "PATCH",
    serviceRole: true,
    query: {
      select: "*",
      id: `eq.${id}`,
    },
    prefer: ["return=representation"],
    body: { status },
  });

  return rows?.[0] ?? { id, status };
}

export async function captureCrmContact(input: {
  email: string;
  name?: string | null;
  source?: string | null;
  origin?: string | null;
  path?: string | null;
  status?: CrmStatus;
}) {
  const row = await upsertCrmContactRecord({
    email: input.email,
    name: input.name,
    source: input.source,
    firstTouchOrigin: input.origin,
    firstTouchPath: input.path,
    status: input.status,
  });

  return {
    success: true,
    contact: row,
  };
}

export async function listCrmContacts(limit = 100) {
  return listTable<CrmContactRecord>("crm_contacts", {
    select: "*",
    order: "created_at.desc",
    limit,
  });
}

export async function updateCrmContactStatus(id: string, status: CrmStatus) {
  if (!isSupabaseConfigured()) {
    return { id, status };
  }

  const rows = await supabaseRestRequest<CrmContactRecord[]>("crm_contacts", {
    method: "PATCH",
    serviceRole: true,
    query: {
      select: "*",
      id: `eq.${id}`,
    },
    prefer: ["return=representation"],
    body: { status },
  });

  return rows?.[0] ?? { id, status };
}

export async function addCrmContactNote(input: { contactId: string; body: string; authorEmail?: string | null }) {
  if (!isSupabaseConfigured()) {
    return { success: true, note: null };
  }

  const rows = await supabaseRestRequest<Array<{ id: string; body: string }>>("crm_contact_notes", {
    method: "POST",
    serviceRole: true,
    query: {
      select: "id,body",
    },
    prefer: ["return=representation"],
    body: {
      contact_id: input.contactId,
      body: input.body.trim(),
      author_email: input.authorEmail ?? null,
    },
  });

  return {
    success: true,
    note: rows?.[0] ?? null,
  };
}

export async function listMediaAssets(limit = 50) {
  return listTable<MediaAssetRecord>("media_assets", {
    select: "*",
    order: "created_at.desc",
    limit,
  });
}

export async function uploadMediaAsset(input: {
  fileName: string;
  dataUrl: string;
  title?: string;
  altText?: string;
  uploadedByEmail?: string | null;
}) {
  const cleanName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${cleanName}`;
  const decoded = bufferFromDataUrl(input.dataUrl);
  const publicUrl = getStoragePublicUrl(path);

  if (isSupabaseConfigured()) {
    await uploadStorageObject(path, decoded.mimeType, decoded.buffer);

    const rows = await supabaseRestRequest<MediaAssetRecord[]>("media_assets", {
      method: "POST",
      serviceRole: true,
      query: {
        on_conflict: "bucket,path",
        select: "*",
      },
      prefer: ["resolution=merge-duplicates", "return=representation"],
      body: {
        bucket: MEDIA_BUCKET,
        path,
        title: input.title ?? null,
        alt_text: input.altText ?? null,
        mime_type: decoded.mimeType,
        size_bytes: decoded.buffer.byteLength,
        public_url: publicUrl,
        uploaded_by_email: normalizeEmail(input.uploadedByEmail),
      },
    });

    return rows?.[0];
  }

  return {
    id: `media-${path}`,
    bucket: MEDIA_BUCKET,
    path,
    title: input.title ?? null,
    alt_text: input.altText ?? null,
    mime_type: decoded.mimeType,
    size_bytes: decoded.buffer.byteLength,
    public_url: publicUrl,
    uploaded_by_email: normalizeEmail(input.uploadedByEmail),
  } as MediaAssetRecord;
}
