import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type RuntimeBindings = { DB?: Parameters<typeof drizzle>[0] };
let runtimeBindings: RuntimeBindings = {};

if (!process.env.VERCEL) {
  try {
    const cloudflareModuleName = "cloudflare:workers";
    const cloudflareWorkers = await import(cloudflareModuleName) as { env?: RuntimeBindings };
    runtimeBindings = cloudflareWorkers.env ?? {};
  } catch {
    runtimeBindings = {};
  }
}

export function getDb() {
  if (!runtimeBindings.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(runtimeBindings.DB, { schema });
}
