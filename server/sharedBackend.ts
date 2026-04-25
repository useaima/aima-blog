import { supabaseRestRequest, isSupabaseConfigured } from "./_core/supabase";

export type TeamRole = "admin" | "editor" | "support";
export type CrmStatus = "new" | "qualified" | "responded" | "customer" | "closed";
export type SupportStatus = "new" | "triaged" | "in_progress" | "resolved" | "spam";

export type PublicSiteSettings = {
  brandName: string;
  companyName: string;
  siteUrl: string;
  blogUrl: string;
  supportUrl: string;
  evaUrl: string;
  supportEmail: string;
  instagramUrl: string;
  youtubeUrl: string;
  instagramHandle: string;
  youtubeLabel: string;
  companyDescription: string;
  supportBlurb: string;
  canonicalMainDomain: string;
  canonicalBlogDomain: string;
  canonicalSupportDomain: string;
};

export type NewsletterSubscriberRecord = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  status: string;
  source?: string | null;
  page_url?: string | null;
  origin?: string | null;
  tags?: string[] | null;
  subscribed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SupportRequestRecord = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: SupportStatus;
  source?: string | null;
  page_url?: string | null;
  origin?: string | null;
  created_at?: string | null;
};

export type CrmContactRecord = {
  id: string;
  email: string;
  name?: string | null;
  status: CrmStatus;
  source?: string | null;
  first_touch_origin?: string | null;
  first_touch_path?: string | null;
  notes_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  brandName: "aima",
  companyName: "aima",
  siteUrl: "https://useaima.com",
  blogUrl: "https://blog.useaima.com",
  supportUrl: "https://support.useaima.com",
  evaUrl: "https://eva.useaima.com",
  supportEmail: "help@useaima.com",
  instagramUrl: "https://www.instagram.com/aima.ai123/",
  youtubeUrl: "https://www.youtube.com/channel/UCdUDx6XhvYMKTpEfjUPGgEQ",
  instagramHandle: "@aima.ai123",
  youtubeLabel: "aima",
  companyDescription:
    "aima is the official company behind eva, an AI finance assistant built to help people understand spending, spot anomalies early, and make clearer money decisions.",
  supportBlurb:
    "Use the official support hub for product help, onboarding questions, troubleshooting, and direct contact with the aima team.",
  canonicalMainDomain: "https://useaima.com",
  canonicalBlogDomain: "https://blog.useaima.com",
  canonicalSupportDomain: "https://support.useaima.com",
};

function logSupabaseFallback(scope: string, error: unknown) {
  console.warn(`[SharedBackend] Falling back for ${scope}:`, error instanceof Error ? error.message : error);
}

export function getDefaultSiteSettings() {
  return { ...DEFAULT_SITE_SETTINGS };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeName(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

async function upsertCrmContactRecord(input: {
  email: string;
  name?: string | null;
  source?: string | null;
  firstTouchOrigin?: string | null;
  firstTouchPath?: string | null;
  status?: CrmStatus;
}) {
  if (!isSupabaseConfigured()) return null;

  const payload = {
    email: normalizeEmail(input.email),
    name: normalizeName(input.name),
    status: input.status ?? "new",
    source: input.source ?? null,
    first_touch_origin: input.firstTouchOrigin ?? null,
    first_touch_path: input.firstTouchPath ?? null,
  };

  return supabaseRestRequest<CrmContactRecord[]>("crm_contacts", {
    method: "POST",
    serviceRole: true,
    query: {
      on_conflict: "email",
      select: "*",
    },
    prefer: ["resolution=merge-duplicates", "return=representation"],
    body: payload,
  }).then((rows) => rows?.[0] ?? null);
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) {
    return getDefaultSiteSettings();
  }

  try {
    const rows = await supabaseRestRequest<Array<{ key: string; value: Partial<PublicSiteSettings> | null }>>(
      "site_settings",
      {
        serviceRole: true,
        query: {
          select: "key,value",
          key: "eq.public",
          limit: 1,
        },
      },
    );

    const row = rows?.[0];
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...(row?.value ?? {}),
    } as PublicSiteSettings;
  } catch (error) {
    logSupabaseFallback("site settings", error);
    return getDefaultSiteSettings();
  }
}

export async function updateSiteSettings(data: Partial<PublicSiteSettings>, actorEmail?: string | null) {
  const payload = {
    key: "public",
    value: {
      ...(await getSiteSettings()),
      ...data,
    },
    updated_by: actorEmail ?? null,
  };

  if (!isSupabaseConfigured()) {
    return payload.value as PublicSiteSettings;
  }

  try {
    const rows = await supabaseRestRequest<Array<{ value: PublicSiteSettings }>>("site_settings", {
      method: "POST",
      serviceRole: true,
      query: {
        on_conflict: "key",
        select: "value",
      },
      prefer: ["resolution=merge-duplicates", "return=representation"],
      body: payload,
    });

    return rows?.[0]?.value ?? payload.value;
  } catch (error) {
    logSupabaseFallback("update site settings", error);
    return payload.value as PublicSiteSettings;
  }
}

export async function subscribeNewsletter(input: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  source?: string | null;
  pageUrl?: string | null;
  origin?: string | null;
  tags?: string[] | null;
}) {
  const email = normalizeEmail(input.email);
  const payload = {
    email,
    first_name: normalizeName(input.firstName),
    last_name: normalizeName(input.lastName),
    status: "subscribed",
    source: input.source ?? "blog",
    page_url: input.pageUrl ?? null,
    origin: input.origin ?? null,
    tags: input.tags ?? ["blog-subscriber"],
    subscribed_at: new Date().toISOString(),
  };

  let row: NewsletterSubscriberRecord | null = null;

  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRestRequest<NewsletterSubscriberRecord[]>("newsletter_subscribers", {
        method: "POST",
        serviceRole: true,
        query: {
          on_conflict: "email",
          select: "*",
        },
        prefer: ["resolution=merge-duplicates", "return=representation"],
        body: payload,
      });
      row = rows?.[0] ?? null;
    } catch (error) {
      logSupabaseFallback("newsletter subscribe", error);
    }
  }

  await upsertCrmContactRecord({
    email,
    name: [payload.first_name, payload.last_name].filter(Boolean).join(" ") || null,
    source: payload.source,
    firstTouchOrigin: payload.origin,
    firstTouchPath: payload.page_url,
    status: "new",
  }).catch((error) => logSupabaseFallback("subscriber CRM sync", error));

  return {
    success: true,
    message: "Subscribed successfully",
    subscriber: row,
  };
}

export async function listNewsletterSubscribers(limit = 100) {
  if (!isSupabaseConfigured()) return [] as NewsletterSubscriberRecord[];

  try {
    return await supabaseRestRequest<NewsletterSubscriberRecord[]>("newsletter_subscribers", {
      serviceRole: true,
      query: {
        select: "*",
        order: "created_at.desc",
        limit,
      },
    });
  } catch (error) {
    logSupabaseFallback("list newsletter subscribers", error);
    return [] as NewsletterSubscriberRecord[];
  }
}

export async function createSupportRequest(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
  source?: string | null;
  pageUrl?: string | null;
  origin?: string | null;
}) {
  const payload = {
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    topic: input.topic.trim(),
    message: input.message.trim(),
    status: "new" as SupportStatus,
    source: input.source ?? "support",
    page_url: input.pageUrl ?? null,
    origin: input.origin ?? null,
  };

  let row: SupportRequestRecord | null = null;

  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRestRequest<SupportRequestRecord[]>("support_requests", {
        method: "POST",
        serviceRole: true,
        query: {
          select: "*",
        },
        prefer: ["return=representation"],
        body: payload,
      });
      row = rows?.[0] ?? null;
    } catch (error) {
      logSupabaseFallback("create support request", error);
    }
  }

  await upsertCrmContactRecord({
    email: payload.email,
    name: payload.name,
    source: payload.source,
    firstTouchOrigin: payload.origin,
    firstTouchPath: payload.page_url,
    status: "responded",
  }).catch((error) => logSupabaseFallback("support CRM sync", error));

  return {
    success: true,
    request: row,
  };
}

export async function listSupportRequests(limit = 100) {
  if (!isSupabaseConfigured()) return [] as SupportRequestRecord[];

  try {
    return await supabaseRestRequest<SupportRequestRecord[]>("support_requests", {
      serviceRole: true,
      query: {
        select: "*",
        order: "created_at.desc",
        limit,
      },
    });
  } catch (error) {
    logSupabaseFallback("list support requests", error);
    return [] as SupportRequestRecord[];
  }
}

export async function updateSupportRequestStatus(id: string, status: SupportStatus) {
  if (!isSupabaseConfigured()) {
    return { id, status };
  }

  const rows = await supabaseRestRequest<SupportRequestRecord[]>("support_requests", {
    method: "PATCH",
    serviceRole: true,
    query: {
      select: "*",
      id: `eq.${id}`,
    },
    prefer: ["return=representation"],
    body: { status },
  });

  return rows?.[0] ?? { id, status };
}

export async function captureCrmContact(input: {
  email: string;
  name?: string | null;
  source?: string | null;
  origin?: string | null;
  path?: string | null;
  status?: CrmStatus;
}) {
  const row = await upsertCrmContactRecord({
    email: input.email,
    name: input.name,
    source: input.source,
    firstTouchOrigin: input.origin,
    firstTouchPath: input.path,
    status: input.status,
  });

  return {
    success: true,
    contact: row,
  };
}

export async function listCrmContacts(limit = 100) {
  if (!isSupabaseConfigured()) return [] as CrmContactRecord[];

  try {
    return await supabaseRestRequest<CrmContactRecord[]>("crm_contacts", {
      serviceRole: true,
      query: {
        select: "*",
        order: "created_at.desc",
        limit,
      },
    });
  } catch (error) {
    logSupabaseFallback("list CRM contacts", error);
    return [] as CrmContactRecord[];
  }
}

export async function updateCrmContactStatus(id: string, status: CrmStatus) {
  if (!isSupabaseConfigured()) {
    return { id, status };
  }

  const rows = await supabaseRestRequest<CrmContactRecord[]>("crm_contacts", {
    method: "PATCH",
    serviceRole: true,
    query: {
      select: "*",
      id: `eq.${id}`,
    },
    prefer: ["return=representation"],
    body: { status },
  });

  return rows?.[0] ?? { id, status };
}

export async function addCrmContactNote(input: { contactId: string; body: string; authorEmail?: string | null }) {
  if (!isSupabaseConfigured()) {
    return { success: true, note: null };
  }

  const rows = await supabaseRestRequest<Array<{ id: string; body: string }>>("crm_contact_notes", {
    method: "POST",
    serviceRole: true,
    query: {
      select: "id,body",
    },
    prefer: ["return=representation"],
    body: {
      contact_id: input.contactId,
      body: input.body.trim(),
      author_email: input.authorEmail ?? null,
    },
  });

  return {
    success: true,
    note: rows?.[0] ?? null,
  };
}

export async function listMediaAssets(limit = 50) {
  if (!isSupabaseConfigured()) return [] as Array<Record<string, unknown>>;

  try {
    return await supabaseRestRequest<Array<Record<string, unknown>>>("media_assets", {
      serviceRole: true,
      query: {
        select: "*",
        order: "created_at.desc",
        limit,
      },
    });
  } catch (error) {
    logSupabaseFallback("list media assets", error);
    return [] as Array<Record<string, unknown>>;
  }
}
