import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { createSupportRequest, listSupportRequests, updateSupportRequestStatus } from "../sharedBackend";

export const supportRouter = router({
  requests: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          topic: z.string().min(2),
          message: z.string().min(10),
          source: z.string().optional(),
          pageUrl: z.string().url().optional(),
          origin: z.string().url().optional(),
        }),
      )
      .mutation(async ({ input }) => createSupportRequest(input)),

    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }))
      .query(async ({ input }) => listSupportRequests(input.limit ?? 100)),

    updateStatus: adminProcedure
      .input(z.object({ id: z.string().uuid(), status: z.enum(["new", "triaged", "in_progress", "resolved", "spam"]) }))
      .mutation(async ({ input }) => updateSupportRequestStatus(input.id, input.status)),
  }),
});
