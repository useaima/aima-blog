import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getArticles,
  getArticleBySlug,
  getFeaturedArticles,
  createArticle,
  updateArticle,
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  getArticleComments,
  createComment,
  approveComment,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  getSubscriberCount,
  getCategories,
  getCategoryBySlug,
  getTags,
  getTagBySlug,
  getUserBookmarks,
  getBookmark,
  createBookmark,
  deleteBookmark,
  getBookmarkCount,
} from "../db";

export const blogRouter = router({
  // ============ ARTICLE PROCEDURES ============
  articles: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(async ({ input }) => getArticles(input.limit, input.offset)),

    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => getFeaturedArticles(input.limit)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getArticleBySlug(input.slug)),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        featuredImage: z.string().optional(),
        authorId: z.number(),
        categoryId: z.number().optional(),
        isFeatured: z.number().optional(),
      }))
      .mutation(async ({ input }) => createArticle(input)),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          status: z.enum(["draft", "published", "archived"]).optional(),
          isFeatured: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => updateArticle(input.id, input.data)),
  }),

  // ============ AUTHOR PROCEDURES ============
  authors: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => getAuthors(input.limit)),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => getAuthorById(input.id)),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        bio: z.string().optional(),
        title: z.string().optional(),
        avatar: z.string().optional(),
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        youtube: z.string().optional(),
        isGuest: z.number().optional(),
        isVerified: z.number().optional(),
        verificationBadge: z.enum(["expert", "researcher", "industry_leader", "thought_leader"]).optional(),
      }))
      .mutation(async ({ input }) => createAuthor(input)),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          bio: z.string().optional(),
          isVerified: z.number().optional(),
          verificationBadge: z.enum(["expert", "researcher", "industry_leader", "thought_leader"]).optional(),
        }),
      }))
      .mutation(async ({ input }) => updateAuthor(input.id, input.data)),
  }),

  // ============ COMMENT PROCEDURES ============
  comments: router({
    byArticle: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ input }) => getArticleComments(input.articleId)),

    create: publicProcedure
      .input(z.object({
        articleId: z.number(),
        content: z.string(),
        authorId: z.number().optional(),
      }))
      .mutation(async ({ input }) => createComment({
        articleId: input.articleId,
        content: input.content,
        authorId: input.authorId,
        status: "pending",
      })),

    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => approveComment(input.id)),
  }),

  // ============ SUBSCRIBER PROCEDURES ============
  subscribers: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const existing = await getSubscriber(input.email);
        if (existing) {
          return { success: false, message: "Already subscribed" };
        }
        await createSubscriber({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          status: "subscribed",
        });
        return { success: true, message: "Subscribed successfully" };
      }),

    count: publicProcedure.query(async () => getSubscriberCount()),
  }),

  // ============ CATEGORY PROCEDURES ============
  categories: router({
    list: publicProcedure.query(async () => getCategories()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getCategoryBySlug(input.slug)),
  }),

  // ============ TAG PROCEDURES ============
  tags: router({
    list: publicProcedure.query(async () => getTags()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getTagBySlug(input.slug)),
  }),

  // ============ BOOKMARK PROCEDURES ============
  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => getUserBookmarks(ctx.user.id)),

    check: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .query(async ({ ctx, input }) => getBookmark(ctx.user.id, input.articleId)),

    add: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await createBookmark(ctx.user.id, input.articleId);
        return { success: true, message: "Article bookmarked" };
      }),

    remove: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteBookmark(ctx.user.id, input.articleId);
        return { success: true, message: "Bookmark removed" };
      }),

    count: protectedProcedure.query(async ({ ctx }) => getBookmarkCount(ctx.user.id)),
  }),
});

export type BlogRouter = typeof blogRouter;
