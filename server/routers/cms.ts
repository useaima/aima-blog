import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  contentProcedure,
  editorProcedure,
  publicProcedure,
  router,
} from "../_core/trpc";
import {
  createCmsAuthor,
  createCmsPost,
  createCmsSupportArticle,
  createCmsSupportCollection,
  createContributorInvite,
  getPublicBlogArticle,
  getPublicBlogAuthor,
  getPublicSupportArticle,
  listCmsAuthors,
  listCmsPosts,
  listCmsPostsForAuthor,
  listCmsSupportArticles,
  listCmsSupportCollections,
  listContributorInvites,
  listMediaAssets,
  updateCmsAuthor,
  updateCmsPost,
  updateCmsSupportArticle,
  uploadMediaAsset,
} from "../platformBackend";

const contentStatusSchema = z.enum(["draft", "in_review", "published", "archived"]);
const productSlugSchema = z.enum(["eva", "utg"]);

function normalizeContributorStatus(
  teamRole: string | undefined,
  status: z.infer<typeof contentStatusSchema>,
) {
  if (teamRole !== "contributor") {
    return status;
  }

  return status === "draft" ? "draft" : "in_review";
}

export const cmsRouter = router({
  posts: router({
    list: editorProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ input }) => listCmsPosts(input?.limit ?? 100)),

    listMine: contentProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ ctx, input }) => listCmsPostsForAuthor(ctx.user.email ?? null, input?.limit ?? 100)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => getPublicBlogArticle(input.slug)),

    create: contentProcedure
      .input(
        z.object({
          title: z.string().min(3),
          excerpt: z.string().min(12),
          tldr: z.string().max(160).optional(),
          content: z.string().min(40),
          coverImageUrl: z.string().url().optional(),
          categorySlug: z.string().min(2),
          tags: z.array(z.string()).default([]),
          authorId: z.string().uuid().optional(),
          productSlug: productSlugSchema,
          status: contentStatusSchema,
          featured: z.boolean().optional(),
          seoTitle: z.string().optional(),
          readingTime: z.number().int().positive().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) =>
        createCmsPost({
          ...input,
          status: normalizeContributorStatus(ctx.user.teamRole, input.status),
          authorEmail: ctx.user.email ?? null,
          authorName: ctx.user.name ?? null,
        }),
      ),

    update: contentProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: z.object({
            title: z.string().min(3).optional(),
            excerpt: z.string().min(12).optional(),
            tldr: z.string().max(160).optional(),
            content: z.string().min(40).optional(),
            coverImageUrl: z.string().url().optional(),
            categorySlug: z.string().min(2).optional(),
            tags: z.array(z.string()).optional(),
            productSlug: productSlugSchema.optional(),
            status: contentStatusSchema.optional(),
            featured: z.boolean().optional(),
            seoTitle: z.string().optional(),
            readingTime: z.number().int().positive().optional(),
          }),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.teamRole === "contributor") {
          const myPosts = await listCmsPostsForAuthor(ctx.user.email ?? null, 200);
          const ownsPost = myPosts.some((post) => post.id === input.id);

          if (!ownsPost) {
            throw new TRPCError({ code: "FORBIDDEN", message: "You can only update your own drafts." });
          }
        }

        return updateCmsPost(input.id, {
          ...input.data,
          status:
            input.data.status === undefined
              ? undefined
              : normalizeContributorStatus(ctx.user.teamRole, input.data.status),
        });
      }),
  }),

  authors: router({
    list: editorProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ input }) => listCmsAuthors(input?.limit ?? 100)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => getPublicBlogAuthor(input.slug)),

    create: editorProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email().optional(),
          bio: z.string().optional(),
          roleTitle: z.string().optional(),
          avatarUrl: z.string().url().optional(),
          instagramUrl: z.string().url().optional(),
          facebookUrl: z.string().url().optional(),
          websiteUrl: z.string().url().optional(),
        }),
      )
      .mutation(async ({ input }) => createCmsAuthor(input)),

    update: editorProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: z.object({
            name: z.string().min(2).optional(),
            bio: z.string().optional(),
            roleTitle: z.string().optional(),
            avatarUrl: z.string().url().optional(),
            instagramUrl: z.string().url().optional(),
            facebookUrl: z.string().url().optional(),
            websiteUrl: z.string().url().optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => updateCmsAuthor(input.id, input.data)),
  }),

  comments: router({
    list: editorProcedure
      .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).optional())
      .query(async () => []),

    approve: editorProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]) }))
      .mutation(async () => ({ success: true })),
  }),

  supportCollections: router({
    list: editorProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ input }) => listCmsSupportCollections(input?.limit ?? 100)),

    create: editorProcedure
      .input(
        z.object({
          title: z.string().min(3),
          description: z.string().optional(),
          productSlug: productSlugSchema,
          featured: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => createCmsSupportCollection(input)),
  }),

  supportArticles: router({
    list: editorProcedure
      .input(z.object({ limit: z.number().int().positive().max(300).optional() }).optional())
      .query(async ({ input }) => listCmsSupportArticles(input?.limit ?? 200)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => getPublicSupportArticle(input.slug)),

    create: contentProcedure
      .input(
        z.object({
          title: z.string().min(3),
          summary: z.string().min(12),
          body: z.string().min(40),
          keywords: z.array(z.string()).default([]),
          relatedSlugs: z.array(z.string()).optional(),
          collectionSlug: z.string().min(2),
          productSlug: productSlugSchema,
          status: contentStatusSchema,
        }),
      )
      .mutation(async ({ ctx, input }) =>
        createCmsSupportArticle({
          ...input,
          status: normalizeContributorStatus(ctx.user.teamRole, input.status),
          authorEmail: ctx.user.email ?? null,
          authorName: ctx.user.name ?? null,
        }),
      ),

    update: editorProcedure
      .input(
        z.object({
          id: z.string().uuid(),
          data: z.object({
            title: z.string().min(3).optional(),
            summary: z.string().min(12).optional(),
            body: z.string().min(40).optional(),
            keywords: z.array(z.string()).optional(),
            relatedSlugs: z.array(z.string()).optional(),
            collectionSlug: z.string().min(2).optional(),
            productSlug: productSlugSchema.optional(),
            status: contentStatusSchema.optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => updateCmsSupportArticle(input.id, input.data)),
  }),

  media: router({
    list: contentProcedure
      .input(z.object({ limit: z.number().int().positive().max(100).optional() }).optional())
      .query(async ({ input }) => listMediaAssets(input?.limit ?? 50)),

    upload: contentProcedure
      .input(
        z.object({
          fileName: z.string().min(1),
          dataUrl: z.string().min(30),
          title: z.string().optional(),
          altText: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) =>
        uploadMediaAsset({
          ...input,
          uploadedByEmail: ctx.user.email ?? null,
        }),
      ),
  }),

  invites: router({
    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ input }) => listContributorInvites(input?.limit ?? 100)),

    create: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          role: z.enum(["admin", "editor", "contributor", "support"]),
        }),
      )
      .mutation(async ({ ctx, input }) =>
        createContributorInvite({
          email: input.email,
          role: input.role,
          invitedByEmail: ctx.user.email ?? null,
        }),
      ),
  }),
});
