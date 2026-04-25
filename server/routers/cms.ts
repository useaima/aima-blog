import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  approveComment,
  createArticle,
  createAuthor,
  getAllArticles,
  getArticleBySlug,
  getAuthorById,
  getAuthors,
  getCommentsForModeration,
  updateArticle,
  updateAuthor,
} from "../db";
import { listMediaAssets } from "../sharedBackend";

export const cmsRouter = router({
  posts: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }))
      .query(async ({ input }) => getAllArticles(input.limit)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getArticleBySlug(input.slug)),

    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          slug: z.string(),
          excerpt: z.string().optional(),
          content: z.string(),
          featuredImage: z.string().optional(),
          authorId: z.number(),
          categoryId: z.number().optional(),
          isFeatured: z.number().optional(),
        }),
      )
      .mutation(async ({ input }) => createArticle(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            title: z.string().optional(),
            slug: z.string().optional(),
            excerpt: z.string().optional(),
            content: z.string().optional(),
            status: z.enum(["draft", "published", "archived"]).optional(),
            isFeatured: z.number().optional(),
            featuredImage: z.string().optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => updateArticle(input.id, input.data)),
  }),

  authors: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }))
      .query(async ({ input }) => getAuthors(input.limit)),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => getAuthorById(input.id)),

    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          bio: z.string().optional(),
          title: z.string().optional(),
          avatar: z.string().optional(),
          website: z.string().optional(),
          twitter: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
          instagram: z.string().optional(),
          youtube: z.string().optional(),
          isGuest: z.number().optional(),
          isVerified: z.number().optional(),
          verificationBadge: z.enum(["expert", "researcher", "industry_leader", "thought_leader"]).optional(),
        }),
      )
      .mutation(async ({ input }) => createAuthor(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            name: z.string().optional(),
            bio: z.string().optional(),
            title: z.string().optional(),
            avatar: z.string().optional(),
            instagram: z.string().optional(),
            youtube: z.string().optional(),
            isGuest: z.number().optional(),
            isVerified: z.number().optional(),
            verificationBadge: z.enum(["expert", "researcher", "industry_leader", "thought_leader"]).optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => updateAuthor(input.id, input.data)),
  }),

  comments: router({
    list: adminProcedure
      .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }))
      .query(async ({ input }) => getCommentsForModeration(input.status)),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => approveComment(input.id)),
  }),

  media: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(100).optional() }))
      .query(async ({ input }) => listMediaAssets(input.limit ?? 50)),
  }),
});
