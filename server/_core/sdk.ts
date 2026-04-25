import {
  AXIOS_TIMEOUT_MS,
  COOKIE_NAME,
  ONE_YEAR_MS,
  SUPABASE_ACCESS_COOKIE_NAME,
  SUPABASE_REFRESH_COOKIE_NAME,
} from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { type AuthenticatedUser } from "./context";
import { ENV } from "./env";
import {
  getSupabaseUser,
  refreshSupabaseSession,
  sendSupabaseMagicLink,
} from "./supabase";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/manusTypes";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
const GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
const GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function inferDisplayName(email?: string | null, metadata?: Record<string, unknown> | null) {
  const candidate =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    (typeof metadata?.user_name === "string" && metadata.user_name) ||
    email?.split("@")[0];

  return candidate?.trim() || "AIMA Team";
}

function includesEmail(list: string[], email?: string | null) {
  const normalized = normalizeEmail(email);
  return normalized ? list.includes(normalized) : false;
}

function resolveTeamRole(email?: string | null): AuthenticatedUser["teamRole"] {
  if (includesEmail(ENV.supabaseAdminEmails, email)) return "admin";
  if (includesEmail(ENV.supabaseEditorEmails, email)) return "editor";
  if (includesEmail(ENV.supabaseSupportEmails, email)) return "support";
  return undefined;
}

function isAllowedTeamEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  if (!ENV.supabaseTeamAllowedEmails.length) {
    return true;
  }

  return ENV.supabaseTeamAllowedEmails.includes(normalized);
}

class OAuthService {
  constructor(private client: ReturnType<typeof axios.create>) {
    if (!ENV.oAuthServerUrl) {
      console.warn("[OAuth] OAUTH_SERVER_URL is not configured.");
    }
  }

  private decodeState(state: string): string {
    return atob(state);
  }

  async getTokenByCode(
    code: string,
    state: string
  ): Promise<ExchangeTokenResponse> {
    const payload: ExchangeTokenRequest = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state),
    };

    const { data } = await this.client.post<ExchangeTokenResponse>(
      EXCHANGE_TOKEN_PATH,
      payload
    );

    return data;
  }

  async getUserInfoByToken(
    token: ExchangeTokenResponse
  ): Promise<GetUserInfoResponse> {
    const { data } = await this.client.post<GetUserInfoResponse>(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken,
      }
    );

    return data;
  }
}

const createOAuthHttpClient = (): AxiosInstance =>
  axios.create({
    baseURL: ENV.oAuthServerUrl,
    timeout: AXIOS_TIMEOUT_MS,
  });

class SDKServer {
  private readonly client: AxiosInstance;
  private readonly oauthService: OAuthService;

  constructor(client: AxiosInstance = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }

  private deriveLoginMethod(
    platforms: unknown,
    fallback: string | null | undefined
  ): string | null {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set<string>(
      platforms.filter((p): p is string => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (
      set.has("REGISTERED_PLATFORM_MICROSOFT") ||
      set.has("REGISTERED_PLATFORM_AZURE")
    )
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }

  async exchangeCodeForToken(
    code: string,
    state: string
  ): Promise<ExchangeTokenResponse> {
    return this.oauthService.getTokenByCode(code, state);
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken,
    } as ExchangeTokenResponse);
    const loginMethod = this.deriveLoginMethod(
      (data as any)?.platforms,
      (data as any)?.platform ?? data.platform ?? null
    );
    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoResponse;
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret || "aima-dev-session-secret";
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) {
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(openId) ||
        !isNonEmptyString(appId) ||
        !isNonEmptyString(name)
      ) {
        return null;
      }

      return {
        openId,
        appId,
        name,
      };
    } catch (_error) {
      return null;
    }
  }

  async getUserInfoWithJwt(
    jwtToken: string
  ): Promise<GetUserInfoWithJwtResponse> {
    const payload: GetUserInfoWithJwtRequest = {
      jwtToken,
      projectId: ENV.appId,
    };

    const { data } = await this.client.post<GetUserInfoWithJwtResponse>(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );

    const loginMethod = this.deriveLoginMethod(
      (data as any)?.platforms,
      (data as any)?.platform ?? data.platform ?? null
    );
    return {
      ...(data as any),
      platform: loginMethod,
      loginMethod,
    } as GetUserInfoWithJwtResponse;
  }

  private applySupabaseCookies(req: any, res: any, accessToken: string, refreshToken?: string | null) {
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(SUPABASE_ACCESS_COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    if (refreshToken) {
      res.cookie(SUPABASE_REFRESH_COOKIE_NAME, refreshToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });
    }
  }

  private async syncSupabaseUser(params: {
    id: string;
    email?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<AuthenticatedUser> {
    const openId = `supabase:${params.id}`;
    const email = normalizeEmail(params.email);
    const teamRole = resolveTeamRole(email);
    const role: User["role"] = teamRole === "admin" ? "admin" : "user";

    await db.upsertUser({
      openId,
      email: email || null,
      name: inferDisplayName(params.email, params.metadata),
      loginMethod: "supabase_magic_link",
      role,
      lastSignedIn: new Date(),
    });

    const user = await db.getUserByOpenId(openId);
    if (!user) {
      throw ForbiddenError("Failed to provision team user");
    }

    return {
      ...user,
      teamRole,
    };
  }

  async requestSupabaseMagicLink(email: string, next?: string) {
    const normalizedEmail = normalizeEmail(email);
    if (!isAllowedTeamEmail(normalizedEmail)) {
      throw ForbiddenError("This email is not allowlisted for the AIMA team workspace.");
    }

    const redirectUrl = new URL("/login", ENV.siteUrl);
    if (next) {
      redirectUrl.searchParams.set("next", next);
    }

    return sendSupabaseMagicLink(normalizedEmail, redirectUrl.toString());
  }

  async exchangeSupabaseSession(
    req: any,
    res: any,
    accessToken: string,
    refreshToken?: string | null,
  ) {
    const user = await getSupabaseUser(accessToken);
    if (!isAllowedTeamEmail(user.email)) {
      throw ForbiddenError("This email is not allowlisted for the AIMA team workspace.");
    }

    this.applySupabaseCookies(req, res, accessToken, refreshToken ?? null);
    return this.syncSupabaseUser({
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
    });
  }

  private async authenticateSupabaseRequest(req: any, res?: any) {
    const cookies = this.parseCookies(req.get("cookie"));
    let accessToken = cookies.get(SUPABASE_ACCESS_COOKIE_NAME);
    const refreshToken = cookies.get(SUPABASE_REFRESH_COOKIE_NAME);

    if (!accessToken && !refreshToken) {
      return null;
    }

    try {
      if (!accessToken && refreshToken) {
        const refreshed = await refreshSupabaseSession(refreshToken);
        accessToken = refreshed.access_token;
        if (res) {
          this.applySupabaseCookies(req, res, refreshed.access_token, refreshed.refresh_token);
        }
      }

      if (!accessToken) {
        return null;
      }

      let user = await getSupabaseUser(accessToken);

      if (!isAllowedTeamEmail(user.email) && refreshToken) {
        const refreshed = await refreshSupabaseSession(refreshToken);
        accessToken = refreshed.access_token;
        user = refreshed.user ?? (await getSupabaseUser(accessToken));
        if (res) {
          this.applySupabaseCookies(req, res, refreshed.access_token, refreshed.refresh_token);
        }
      }

      if (!isAllowedTeamEmail(user.email)) {
        throw ForbiddenError("This email is not allowlisted for the AIMA team workspace.");
      }

      return this.syncSupabaseUser({
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      });
    } catch (error) {
      if (res) {
        const cookieOptions = getSessionCookieOptions(req);
        res.clearCookie(SUPABASE_ACCESS_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
        res.clearCookie(SUPABASE_REFRESH_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      }

      if (error instanceof Error && /allowlisted/i.test(error.message)) {
        throw error;
      }

      return null;
    }
  }

  private async authenticateLegacyRequest(req: any): Promise<AuthenticatedUser> {
    const cookies = this.parseCookies(req.get("cookie"));
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const sessionUserId = session.openId;
    const signedInAt = new Date();
    let user = await db.getUserByOpenId(sessionUserId);

    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt,
        });
        user = await db.getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }

    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt,
    });

    return user;
  }

  async authenticateRequest(req: any, res?: any): Promise<AuthenticatedUser> {
    const supabaseUser = await this.authenticateSupabaseRequest(req, res);
    if (supabaseUser) {
      return supabaseUser;
    }

    return this.authenticateLegacyRequest(req);
  }
}

export const sdk = new SDKServer();
