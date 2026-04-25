import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type AuthenticatedUser = User & {
  teamRole?: "admin" | "editor" | "support";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthenticatedUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: AuthenticatedUser | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req, opts.res);
  } catch (_error) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
