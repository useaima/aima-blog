import express from "express";
import type { Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
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

export async function createApp(options: CreateAppOptions = {}) {
  const runtime = resolveRuntime(options.runtime);
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true, runtime });
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
