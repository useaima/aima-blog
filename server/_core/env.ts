const parseCsv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  siteUrl: process.env.SITE_URL ?? "https://blog.useaima.com",
  publicMainSiteUrl: process.env.PUBLIC_MAIN_SITE_URL ?? "https://useaima.com",
  publicSupportUrl: process.env.PUBLIC_SUPPORT_URL ?? "https://support.useaima.com",
  publicEvaUrl: process.env.PUBLIC_EVA_URL ?? "https://eva.useaima.com",
  publicAllowedOrigins: parseCsv(process.env.PUBLIC_ALLOWED_ORIGINS).length
    ? parseCsv(process.env.PUBLIC_ALLOWED_ORIGINS)
    : [
        "https://blog.useaima.com",
        "https://useaima.com",
        "https://support.useaima.com",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
      ],
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseProjectRef: process.env.SUPABASE_PROJECT_REF ?? "",
  supabaseTeamAllowedEmails: parseCsv(process.env.SUPABASE_TEAM_ALLOWED_EMAILS),
  supabaseAdminEmails: parseCsv(process.env.SUPABASE_ADMIN_EMAILS),
  supabaseEditorEmails: parseCsv(process.env.SUPABASE_EDITOR_EMAILS),
  supabaseSupportEmails: parseCsv(process.env.SUPABASE_SUPPORT_EMAILS),
};
