import { ENV } from "./env";

type QueryValue = string | number | boolean | null | undefined;

type SupabaseRestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD";
  body?: unknown;
  serviceRole?: boolean;
  accessToken?: string;
  query?: Record<string, QueryValue>;
  prefer?: string[];
  headers?: Record<string, string>;
};

type SupabaseAuthOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  accessToken?: string;
  serviceRole?: boolean;
  headers?: Record<string, string>;
};

function ensureUrl() {
  if (!ENV.supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
  }

  return ENV.supabaseUrl.replace(/\/$/, "");
}

function resolveApiKey(serviceRole = false) {
  const key = serviceRole
    ? ENV.supabaseServiceRoleKey || ENV.supabaseAnonKey
    : ENV.supabaseAnonKey || ENV.supabaseServiceRoleKey;

  if (!key) {
    throw new Error(
      serviceRole
        ? "SUPABASE_SERVICE_ROLE_KEY is not configured"
        : "SUPABASE_ANON_KEY is not configured",
    );
  }

  return key;
}

function createHeaders(options: {
  serviceRole?: boolean;
  accessToken?: string;
  prefer?: string[];
  headers?: Record<string, string>;
}) {
  const apiKey = resolveApiKey(options.serviceRole);
  const authToken = options.accessToken || apiKey;
  const headers = new Headers({
    apikey: apiKey,
    Authorization: `Bearer ${authToken}`,
    ...options.headers,
  });

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.prefer?.length) {
    headers.set("Prefer", options.prefer.join(","));
  }

  return headers;
}

function buildRestUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${ensureUrl()}/rest/v1/${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
}

async function parseResponse(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildSupabaseError(message: string, payload: unknown) {
  if (payload && typeof payload === "object") {
    const maybeMessage = (payload as Record<string, unknown>).message;
    const maybeError = (payload as Record<string, unknown>).error_description ?? (payload as Record<string, unknown>).error;
    return new Error([message, maybeMessage, maybeError].filter(Boolean).join(": "));
  }

  return new Error(message);
}

export function isSupabaseConfigured() {
  return Boolean(ENV.supabaseUrl && (ENV.supabaseAnonKey || ENV.supabaseServiceRoleKey));
}

export async function supabaseRestRequest<T = unknown>(path: string, options: SupabaseRestOptions = {}) {
  const response = await fetch(buildRestUrl(path, options.query), {
    method: options.method ?? "GET",
    headers: createHeaders({
      serviceRole: options.serviceRole ?? false,
      accessToken: options.accessToken,
      prefer: options.prefer,
      headers: options.headers,
    }),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (options.method === "HEAD") {
    if (!response.ok) {
      throw buildSupabaseError(`Supabase HEAD request failed (${response.status})`, null);
    }
    return response as unknown as T;
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw buildSupabaseError(`Supabase REST request failed (${response.status})`, payload);
  }

  return payload as T;
}

export async function supabaseAuthRequest<T = unknown>(path: string, options: SupabaseAuthOptions = {}) {
  const response = await fetch(`${ensureUrl()}/auth/v1/${path}`.replace(/([^:]\/)\/+/, "$1"), {
    method: options.method ?? "GET",
    headers: createHeaders({
      serviceRole: options.serviceRole ?? false,
      accessToken: options.accessToken,
      headers: options.headers,
    }),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await parseResponse(response);
  if (!response.ok) {
    throw buildSupabaseError(`Supabase auth request failed (${response.status})`, payload);
  }

  return payload as T;
}

export type SupabaseAuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

export async function getSupabaseUser(accessToken: string) {
  return supabaseAuthRequest<SupabaseAuthUser>("user", {
    method: "GET",
    accessToken,
    serviceRole: false,
  });
}

export async function refreshSupabaseSession(refreshToken: string) {
  return supabaseAuthRequest<{
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    token_type?: string;
    user?: SupabaseAuthUser;
  }>("token?grant_type=refresh_token", {
    method: "POST",
    serviceRole: false,
    body: {
      refresh_token: refreshToken,
    },
  });
}

export async function sendSupabaseMagicLink(email: string, redirectTo: string) {
  return supabaseAuthRequest<{ message_id?: string }>("otp", {
    method: "POST",
    serviceRole: false,
    body: {
      email,
      create_user: true,
      redirect_to: redirectTo,
      data: {
        source: "aima-blog-admin",
      },
    },
  });
}
