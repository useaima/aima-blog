import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { TeamRole } from "../platformBackend";
import { sdk } from "./sdk";

export type AuthenticatedUser = {
  id: string | number;
  openId: string;
  email?: string | null;
  name?: string | null;
  role: "admin" | "user";
  teamRole?: TeamRole;
  avatarUrl?: string | null;
  loginMethod?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  lastSignedIn?: Date | string | null;
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
