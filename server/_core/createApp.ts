import express from "express";
import type { Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { ENV } from "./env";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { createSupportRequest, getSiteSettings, subscribeNewsletter } from "../sharedBackend";
import { serveStatic, setupVite } from "./vite";

export type AppRuntime = "development" | "production" | "serverless";

interface CreateAppOptions {
  runtime?: AppRuntime;
  server?: Server;
}

function resolveRuntime(runtime?: AppRuntime): AppRuntime {
  if (runtime) {
    return runtime;
  }

  return process.env.NODE_ENV === "development" ? "development" : "production";
}

function normalizeOrigin(origin?: string | null) {
  return origin?.trim().toLowerCase() ?? "";
}

function applyPublicCors(req: any, res: any) {
  const requestOrigin = req.get("origin");
  const normalizedOrigin = normalizeOrigin(requestOrigin);

  if (!normalizedOrigin) {
    return;
  }

  if (ENV.publicAllowedOrigins.includes(normalizedOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin as string);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }
}

function cleanString(value: unknown, maxLength = 240) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export async function createApp(options: CreateAppOptions = {}) {
  const runtime = resolveRuntime(options.runtime);
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use("/api/public", (req: any, res: any, next: any) => {
    applyPublicCors(req, res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get("/api/health", (_req: any, res: any) => {
    res.status(200).json({ ok: true, runtime });
  });

  app.get("/api/public/settings", async (_req: any, res: any) => {
    const settings = await getSiteSettings();
    res.status(200).json({ ok: true, settings });
  });

  app.post("/api/public/subscribe", async (req: any, res: any) => {
    const email = cleanString(req.body?.email, 160).toLowerCase();
    const firstName = cleanString(req.body?.firstName, 80);
    const lastName = cleanString(req.body?.lastName, 80);
    const source = cleanString(req.body?.source, 120) || "aima-blog";
    const pageUrl = cleanString(req.body?.pageUrl || req.body?.url, 500);
    const origin = cleanString(req.body?.origin, 240);
    const tags = Array.isArray(req.body?.tags)
      ? req.body.tags.filter((tag: unknown): tag is string => typeof tag === "string").slice(0, 12)
      : undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: "Enter a valid email address." });
      return;
    }

    try {
      const result = await subscribeNewsletter({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        source,
        pageUrl: pageUrl || undefined,
        origin: origin || undefined,
        tags,
      });

      res.status(200).json({ ok: true, ...result });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unable to subscribe right now.",
      });
    }
  });

  app.post("/api/public/support-request", async (req: any, res: any) => {
    const name = cleanString(req.body?.name, 120);
    const email = cleanString(req.body?.email, 160).toLowerCase();
    const topic = cleanString(req.body?.topic, 160);
    const message = cleanString(req.body?.message, 4000);
    const source = cleanString(req.body?.source, 120) || "support";
    const pageUrl = cleanString(req.body?.pageUrl || req.body?.url, 500);
    const origin = cleanString(req.body?.origin, 240);

    if (name.length < 2 || topic.length < 2 || message.length < 10) {
      res.status(400).json({ ok: false, error: "Please provide your name, topic, and a clear message." });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: "Enter a valid email address." });
      return;
    }

    try {
      const result = await createSupportRequest({
        name,
        email,
        topic,
        message,
        source,
        pageUrl: pageUrl || undefined,
        origin: origin || undefined,
      });

      res.status(200).json({ ok: true, ...result });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error instanceof Error ? error.message : "Unable to create the support request.",
      });
    }
  });

  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (runtime === "development") {
    if (!options.server) {
      throw new Error("A Node server instance is required when running the app in development mode.");
    }

    await setupVite(app, options.server);
    return app;
  }

  if (runtime === "production") {
    serveStatic(app);
  }

  return app;
}
