import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  addCrmContactNote,
  captureCrmContact,
  listCrmContacts,
  listNewsletterSubscribers,
  subscribeNewsletter,
  updateCrmContactStatus,
} from "../sharedBackend";

export const crmRouter = router({
  subscribers: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          source: z.string().optional(),
          pageUrl: z.string().url().optional(),
          origin: z.string().url().optional(),
          tags: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ input }) => subscribeNewsletter(input)),

    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }))
      .query(async ({ input }) => listNewsletterSubscribers(input.limit ?? 100)),

    count: adminProcedure.query(async () => {
      const rows = await listNewsletterSubscribers(500);
      return rows.length;
    }),
  }),

  contacts: router({
    capture: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          source: z.string().optional(),
          origin: z.string().url().optional(),
          path: z.string().optional(),
          status: z.enum(["new", "qualified", "responded", "customer", "closed"]).optional(),
        }),
      )
      .mutation(async ({ input }) => captureCrmContact(input)),

    list: adminProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }))
      .query(async ({ input }) => listCrmContacts(input.limit ?? 100)),

    updateStatus: adminProcedure
      .input(z.object({ id: z.string().uuid(), status: z.enum(["new", "qualified", "responded", "customer", "closed"]) }))
      .mutation(async ({ input }) => updateCrmContactStatus(input.id, input.status)),

    addNote: adminProcedure
      .input(z.object({ contactId: z.string().uuid(), body: z.string().min(4) }))
      .mutation(async ({ input, ctx }) => addCrmContactNote({
        contactId: input.contactId,
        body: input.body,
        authorEmail: ctx.user?.email ?? undefined,
      })),
  }),
});
