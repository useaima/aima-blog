import { useQuery } from "@tanstack/react-query";
import {
  articles as fallbackArticles,
  authors as fallbackAuthors,
  categories as fallbackCategories,
  getAllTags,
  getArticleBySlug as getFallbackArticleBySlug,
  getArticlesByAuthor as getFallbackArticlesByAuthor,
  getArticlesByCategory as getFallbackArticlesByCategory,
  getArticlesByTag as getFallbackArticlesByTag,
  type Article,
  type Author,
  type Category,
} from "./mockData";

const PUBLIC_API = "/api/public";

export type PlatformProduct = {
  slug: "eva" | "utg";
  name: string;
  status: string;
  summary: string;
  description: string;
  primaryUrl: string;
  primaryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  githubUrl?: string;
  supportLabel?: string;
  categoryLabel?: string;
};

export type PublicBlogIndex = {
  articles: Article[];
  authors: Author[];
  categories: Category[];
  tags: string[];
};

export type PublicPlatformData = {
  settings: {
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
  products: PlatformProduct[];
  latestArticles: Article[];
  featuredArticles: Article[];
  supportCollections: Array<{
    slug: string;
    title: string;
    description: string;
    productSlug: "eva" | "utg";
    featured: boolean;
    articleCount: number;
  }>;
};

const fallbackIndex: PublicBlogIndex = {
  articles: fallbackArticles,
  authors: fallbackAuthors,
  categories: fallbackCategories,
  tags: getAllTags(),
};

const fallbackPlatform: PublicPlatformData = {
  settings: {
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
  },
  products: [
    {
      slug: "eva",
      name: "eva",
      status: "live",
      summary: "AI finance assistant for spending visibility, subscription review, and clearer next-step guidance.",
      description:
        "eva helps people understand spending behavior, detect unusual patterns, review subscriptions, and move from raw transaction history to confident financial action.",
      primaryUrl: "https://eva.useaima.com",
      primaryLabel: "Open eva",
      supportLabel: "EVA Help Center",
      categoryLabel: "AI Finance Assistant",
    },
    {
      slug: "utg",
      name: "Universal Transaction Gateway",
      status: "live",
      summary: "Non-custodial transaction gateway for AI agents with strict human approval, idempotency, and auditability.",
      description:
        "UTG is AIMA's programmable settlement layer for AI agents. It creates a hard security boundary between an agent's intent and the user's money.",
      primaryUrl: "https://utg.useaima.com",
      primaryLabel: "Open UTG",
      secondaryUrl: "https://github.com/useaima/universal-gateway",
      secondaryLabel: "View on GitHub",
      githubUrl: "https://github.com/useaima/universal-gateway",
      supportLabel: "UTG Help Center",
      categoryLabel: "Agentic Commerce Infrastructure",
    },
  ],
  latestArticles: fallbackArticles.slice(0, 6),
  featuredArticles: fallbackArticles.filter((article) => article.featured).slice(0, 3),
  supportCollections: [],
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${PUBLIC_API}${path}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || `Failed to load ${path}`);
  }
  return payload as T;
}

function reviveAuthor(raw: any, fallback?: Author): Author {
  return {
    id: raw?.id ?? fallback?.id ?? "author",
    name: raw?.name ?? fallback?.name ?? "AIMA Author",
    title: raw?.title ?? fallback?.title ?? "Contributor",
    bio: raw?.bio ?? fallback?.bio ?? "",
    avatar: raw?.avatar ?? fallback?.avatar,
    instagram: raw?.instagram ?? fallback?.instagram,
    facebook: raw?.facebook ?? fallback?.facebook,
    company: raw?.company ?? fallback?.company ?? "aima",
    expertise: raw?.expertise ?? fallback?.expertise,
    articleCount: raw?.articleCount ?? fallback?.articleCount ?? 0,
    verified: raw?.verified ?? fallback?.verified,
    verificationBadge: raw?.verificationBadge ?? fallback?.verificationBadge,
  };
}

function reviveCategory(raw: any, fallback?: Category): Category {
  return {
    id: raw?.id ?? fallback?.id ?? raw?.slug ?? "category",
    name: raw?.name ?? fallback?.name ?? "Category",
    slug: raw?.slug ?? fallback?.slug ?? "category",
    description: raw?.description ?? fallback?.description ?? "",
    color: raw?.color ?? fallback?.color ?? "oklch(0.67 0.08 70)",
  };
}

function reviveArticle(raw: any, fallback?: Article): Article {
  return {
    id: raw?.id ?? fallback?.id ?? "article",
    title: raw?.title ?? fallback?.title ?? "Untitled article",
    excerpt: raw?.excerpt ?? fallback?.excerpt ?? "",
    content: raw?.content ?? fallback?.content ?? "",
    slug: raw?.slug ?? fallback?.slug ?? "article",
    image: raw?.image ?? fallback?.image ?? "/blog/covers/product-updates.svg",
    author: reviveAuthor(raw?.author, fallback?.author),
    category: reviveCategory(raw?.category, fallback?.category),
    tags: Array.isArray(raw?.tags) ? raw.tags : fallback?.tags ?? [],
    publishedAt: raw?.publishedAt ? new Date(raw.publishedAt) : fallback?.publishedAt ?? new Date(),
    updatedAt: raw?.updatedAt ? new Date(raw.updatedAt) : fallback?.updatedAt ?? new Date(),
    readTime: raw?.readTime ?? fallback?.readTime ?? 6,
    featured: Boolean(raw?.featured ?? fallback?.featured),
  };
}

function reviveIndex(payload: any): PublicBlogIndex {
  const seedAuthorsById = new Map(fallbackAuthors.map((author) => [author.id, author]));
  const seedCategoriesBySlug = new Map(fallbackCategories.map((category) => [category.slug, category]));

  const authors = Array.isArray(payload?.authors)
    ? payload.authors.map((author: any) => reviveAuthor(author, seedAuthorsById.get(author?.slug) ?? seedAuthorsById.get(author?.id)))
    : fallbackAuthors;

  const categories = Array.isArray(payload?.categories)
    ? payload.categories.map((category: any) => reviveCategory(category, seedCategoriesBySlug.get(category?.slug)))
    : fallbackCategories;

  const articles = Array.isArray(payload?.articles)
    ? payload.articles.map((article: any) => reviveArticle(article, getFallbackArticleBySlug(article?.slug)))
    : fallbackArticles;

  const tags = Array.isArray(payload?.tags) ? payload.tags : getAllTags();

  return {
    authors,
    categories,
    articles,
    tags,
  };
}

function revivePlatform(payload: any): PublicPlatformData {
  const latestArticles = Array.isArray(payload?.platform?.latestArticles)
    ? payload.platform.latestArticles.map((article: any) => reviveArticle(article, getFallbackArticleBySlug(article?.slug)))
    : fallbackPlatform.latestArticles;

  const featuredArticles = Array.isArray(payload?.platform?.featuredArticles)
    ? payload.platform.featuredArticles.map((article: any) => reviveArticle(article, getFallbackArticleBySlug(article?.slug)))
    : fallbackPlatform.featuredArticles;

  return {
    settings: {
      ...fallbackPlatform.settings,
      ...(payload?.platform?.settings ?? {}),
    },
    products: Array.isArray(payload?.platform?.products) && payload.platform.products.length
      ? payload.platform.products
      : fallbackPlatform.products,
    latestArticles,
    featuredArticles,
    supportCollections: Array.isArray(payload?.platform?.supportCollections)
      ? payload.platform.supportCollections
      : fallbackPlatform.supportCollections,
  };
}

export function getPrimaryProductSlug(article?: Article | null): "eva" | "utg" {
  const haystack = `${article?.title ?? ""} ${article?.excerpt ?? ""} ${article?.content ?? ""}`.toLowerCase();
  if (/utg|universal transaction gateway|agentic commerce|idempotency|human approval|settlement/.test(haystack)) {
    return "utg";
  }
  return "eva";
}

export function useBlogIndex() {
  return useQuery({
    queryKey: ["public-blog-index"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const payload = await fetchJson<any>("/blog/index");
        return reviveIndex(payload);
      } catch (error) {
        console.warn("[contentApi] Falling back to local blog index.", error);
        return fallbackIndex;
      }
    },
  });
}

export function usePlatformData() {
  return useQuery({
    queryKey: ["public-platform"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const payload = await fetchJson<any>("/platform");
        return revivePlatform(payload);
      } catch (error) {
        console.warn("[contentApi] Falling back to local platform data.", error);
        return fallbackPlatform;
      }
    },
  });
}

export function useBlogArticle(slug?: string) {
  return useQuery({
    queryKey: ["public-blog-article", slug],
    enabled: Boolean(slug),
    staleTime: 60_000,
    queryFn: async () => {
      if (!slug) return null;
      try {
        const payload = await fetchJson<any>(`/blog/article?slug=${encodeURIComponent(slug)}`);
        return reviveArticle(payload.article, getFallbackArticleBySlug(slug));
      } catch (error) {
        console.warn(`[contentApi] Falling back to local article for ${slug}.`, error);
        return getFallbackArticleBySlug(slug) ?? null;
      }
    },
  });
}

export function useBlogAuthor(slug?: string) {
  return useQuery({
    queryKey: ["public-blog-author", slug],
    enabled: Boolean(slug),
    staleTime: 60_000,
    queryFn: async () => {
      if (!slug) return null;
      try {
        const payload = await fetchJson<any>(`/blog/author?slug=${encodeURIComponent(slug)}`);
        return {
          author: reviveAuthor(payload.author, fallbackAuthors.find((author) => author.id === slug)),
          articles: Array.isArray(payload.articles)
            ? payload.articles.map((article: any) => reviveArticle(article, getFallbackArticleBySlug(article?.slug)))
            : getFallbackArticlesByAuthor(slug),
        };
      } catch (error) {
        console.warn(`[contentApi] Falling back to local author page for ${slug}.`, error);
        const fallbackAuthor = fallbackAuthors.find((author) => author.id === slug);
        if (!fallbackAuthor) return null;
        return {
          author: fallbackAuthor,
          articles: getFallbackArticlesByAuthor(slug),
        };
      }
    },
  });
}

export function getArticlesForCategory(index: PublicBlogIndex, categorySlug: string) {
  return index.articles.filter((article) => article.category.slug === categorySlug);
}

export function getArticlesForTag(index: PublicBlogIndex, tag: string) {
  return index.articles.filter((article) => article.tags.includes(tag));
}

export function getRelatedArticles(index: PublicBlogIndex, article: Article, limit = 3) {
  return index.articles
    .filter((candidate) => candidate.id !== article.id)
    .filter(
      (candidate) =>
        candidate.category.slug === article.category.slug ||
        candidate.tags.some((tag) => article.tags.includes(tag)),
    )
    .slice(0, limit);
}

export function groupArticlesByMonth(index: PublicBlogIndex) {
  return index.articles.reduce<Record<string, Article[]>>((groups, article) => {
    const monthKey = article.publishedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(article);
    return groups;
  }, {});
}

export function searchArticles(index: PublicBlogIndex, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [] as Article[];

  return index.articles.filter((article) => {
    const haystack = [
      article.title,
      article.excerpt,
      article.author.name,
      article.category.name,
      article.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function getFallbackCategoryArticles(categorySlug: string) {
  return getFallbackArticlesByCategory(categorySlug);
}

export function getFallbackTagArticles(tag: string) {
  return getFallbackArticlesByTag(tag);
}
