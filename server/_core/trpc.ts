import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TeamRole } from "../platformBackend";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

function requireTeamRole(roles: TeamRole[], message = "You do not have required permission (10002)") {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }

    const teamRole = ctx.user.teamRole;
    if (!teamRole || !roles.includes(teamRole)) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

export const protectedProcedure = t.procedure.use(requireUser);
export const adminProcedure = t.procedure.use(requireTeamRole(["admin"], NOT_ADMIN_ERR_MSG));
export const editorProcedure = t.procedure.use(requireTeamRole(["admin", "editor"]));
export const contentProcedure = t.procedure.use(requireTeamRole(["admin", "editor", "contributor"]));
export const supportProcedure = t.procedure.use(requireTeamRole(["admin", "support"]));
