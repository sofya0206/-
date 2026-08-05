import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { activityEvents, clients } from "../../../../db/schema";

export async function POST(request: Request) {
  try {
    const bindings = env as unknown as Record<string, unknown>;
    const expected = typeof bindings.LEAD_WEBHOOK_SECRET === "string" ? bindings.LEAD_WEBHOOK_SECRET : "";
    if (expected && request.headers.get("x-webhook-secret") !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const name = String(payload.name || payload.full_name || "").trim();
    const contact = String(payload.contact || payload.telegram || payload.phone || "").trim();
    if (!name || !contact) return Response.json({ error: "name and contact are required" }, { status: 400 });
    const now = new Date().toISOString();
    const db = getDb();
    const [client] = await db.insert(clients).values({ name, contact, ageGroup: String(payload.age_group || payload.age || "Не указан"), incomeBand: String(payload.income_band || payload.income || "Не указан"), source: String(payload.source || "Telegram"), video: String(payload.video || payload.video_title || "Без атрибуции"), utm: String(payload.utm || payload.utm_campaign || "telegram"), stage: "Новая", manager: String(payload.manager || "Не назначен"), tags: String(payload.tags || "webhook"), notes: typeof payload.notes === "string" ? payload.notes : "", createdAt: now, lastActivity: "Только что" }).returning();
    await db.insert(activityEvents).values({ type: "webhook_lead", entityId: client.id, title: "Заявка получена через webhook", detail: `${client.name} · ${client.utm}`, createdAt: now });
    return Response.json({ client }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Webhook unavailable" }, { status: 500 });
  }
}
