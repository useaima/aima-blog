export function resolveInstagramHref(value?: string | null) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

export function resolveFacebookHref(value?: string | null) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://facebook.com/${encodeURIComponent(value)}`;
}

export function formatSocialLabel(value?: string | null, kind: "instagram" | "facebook" = "instagram") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      const lastSegment = parsed.pathname.split("/").filter(Boolean).pop();
      if (!lastSegment) return parsed.hostname.replace(/^www\./, "");
      return kind === "instagram" ? `@${lastSegment.replace(/^@/, "")}` : lastSegment.replace(/-/g, " ");
    } catch {
      return value;
    }
  }

  return kind === "instagram" ? `@${value.replace(/^@/, "")}` : value;
}
