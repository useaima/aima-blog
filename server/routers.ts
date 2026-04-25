import { z } from "zod";
import {
  COOKIE_NAME,
  SUPABASE_ACCESS_COOKIE_NAME,
  SUPABASE_REFRESH_COOKIE_NAME,
} from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import { blogRouter } from "./routers/blog";
import { cmsRouter } from "./routers/cms";
import { crmRouter } from "./routers/crm";
import { settingsRouter } from "./routers/settings";
import { supportRouter } from "./routers/support";

export const appRouter = router({
  system: systemRouter,
  blog: blogRouter,
  cms: cmsRouter,
  crm: crmRouter,
  support: supportRouter,
  settings: settingsRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    requestMagicLink: publicProcedure
      .input(z.object({ email: z.string().email(), next: z.string().optional() }))
      .mutation(async ({ input }) => {
        await sdk.requestSupabaseMagicLink(input.email, input.next);
        return {
          success: true,
          message: "Magic link sent",
        } as const;
      }),

    exchangeSession: publicProcedure
      .input(
        z.object({
          accessToken: z.string().min(10),
          refreshToken: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const user = await sdk.exchangeSupabaseSession(
          ctx.req,
          ctx.res,
          input.accessToken,
          input.refreshToken,
        );

        return {
          success: true,
          user,
        } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(SUPABASE_ACCESS_COOKIE_NAME, {
        ...cookieOptions,
        maxAge: -1,
      });
      ctx.res.clearCookie(SUPABASE_REFRESH_COOKIE_NAME, {
        ...cookieOptions,
        maxAge: -1,
      });
      return {
        success: true,
      } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
