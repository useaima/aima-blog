import { createApp } from "../server/_core/createApp";

let cachedAppPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!cachedAppPromise) {
    cachedAppPromise = createApp({ runtime: "serverless" });
  }

  return cachedAppPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
