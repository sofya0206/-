import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { automationSettings } from "../../../db/schema";

const seeds = [
  { key: "lead_sync", enabled: true, config: JSON.stringify({ assignMode: "round_robin" }), updatedAt: new Date().toISOString() },
  { key: "lead_nudges", enabled: true, config: JSON.stringify({ firstDelayMinutes: 15, escalationMinutes: 30 }), updatedAt: new Date().toISOString() },
  { key: "daily_report", enabled: true, config: JSON.stringify({ time: "20:30", timezone: "Asia/Novosibirsk" }), updatedAt: new Date().toISOString() },
];

export async function GET() {
  try {
    const db = getDb();
    let rows = await db.select().from(automationSettings).orderBy(asc(automationSettings.id));
    if (!rows.length) rows = await db.insert(automationSettings).values(seeds).returning();
    return Response.json({ settings: rows.map(row => ({ ...row, config: JSON.parse(row.config) })) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { key?: string; enabled?: boolean; config?: Record<string, unknown> };
    if (!payload.key) return Response.json({ error: "key is required" }, { status: 400 });
    const now = new Date().toISOString();
    const [setting] = await getDb().insert(automationSettings).values({ key: payload.key, enabled: payload.enabled ?? true, config: JSON.stringify(payload.config ?? {}), updatedAt: now }).onConflictDoUpdate({ target: automationSettings.key, set: { enabled: payload.enabled ?? true, config: JSON.stringify(payload.config ?? {}), updatedAt: now } }).returning();
    return Response.json({ setting: { ...setting, config: JSON.parse(setting.config) } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
