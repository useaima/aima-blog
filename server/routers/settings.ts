import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getSiteSettings, updateSiteSettings } from "../sharedBackend";

const siteSettingsInput = z.object({
  brandName: z.string().optional(),
  companyName: z.string().optional(),
  siteUrl: z.string().url().optional(),
  blogUrl: z.string().url().optional(),
  supportUrl: z.string().url().optional(),
  evaUrl: z.string().url().optional(),
  supportEmail: z.string().email().optional(),
  instagramUrl: z.string().url().optional(),
  youtubeUrl: z.string().url().optional(),
  instagramHandle: z.string().optional(),
  youtubeLabel: z.string().optional(),
  companyDescription: z.string().optional(),
  supportBlurb: z.string().optional(),
  canonicalMainDomain: z.string().url().optional(),
  canonicalBlogDomain: z.string().url().optional(),
  canonicalSupportDomain: z.string().url().optional(),
});

export const settingsRouter = router({
  site: router({
    get: publicProcedure.query(async () => getSiteSettings()),
    update: adminProcedure
      .input(siteSettingsInput)
      .mutation(async ({ input, ctx }) => updateSiteSettings(input, ctx.user?.email ?? null)),
  }),
});
