import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, clients } from "../../../db/schema";

const seedClients = [
  { name: "Анна Волкова", contact: "@anna_volkova", ageGroup: "25–34", incomeBand: "150–250 тыс. ₽", source: "YouTube", video: "Как выйти на доход 300к в 2026", utm: "yt_income_300", stage: "Звонок", manager: "Мария", revenue: 0, responseMinutes: 4, tags: "горячий,дожим", createdAt: "2026-08-05T07:42:00.000Z", lastActivity: "Сегодня, 11:26" },
  { name: "Илья Козлов", contact: "@ikozlov", ageGroup: "18–24", incomeBand: "80–150 тыс. ₽", source: "YouTube", video: "Разбор 5 ошибок новичков", utm: "yt_errors_5", stage: "Диалог", manager: "Алексей", revenue: 0, responseMinutes: 9, tags: "новый", createdAt: "2026-08-05T08:08:00.000Z", lastActivity: "Сегодня, 11:18" },
  { name: "Дарья Смирнова", contact: "@dasha_smir", ageGroup: "25–34", incomeBand: "250+ тыс. ₽", source: "YouTube", video: "Кейс: с нуля до первого миллиона", utm: "yt_case_million", stage: "Оплачено", manager: "Мария", revenue: 149000, responseMinutes: 2, tags: "vip,оплата", createdAt: "2026-08-04T12:30:00.000Z", lastActivity: "Сегодня, 10:42" },
  { name: "Максим Соколов", contact: "@max_sokolov", ageGroup: "35–44", incomeBand: "150–250 тыс. ₽", source: "YouTube", video: "7 инструментов для роста", utm: "yt_tools_growth", stage: "Новая", manager: "Не назначен", revenue: 0, responseMinutes: 0, tags: "новый", createdAt: "2026-08-05T09:22:00.000Z", lastActivity: "12 мин назад" },
  { name: "Елена Миронова", contact: "@elena_mir", ageGroup: "25–34", incomeBand: "80–150 тыс. ₽", source: "YouTube", video: "Как выбрать сильную нишу", utm: "yt_choose_niche", stage: "Думает", manager: "Денис", revenue: 0, responseMinutes: 16, tags: "дожим", createdAt: "2026-08-03T15:04:00.000Z", lastActivity: "Вчера, 18:04" },
  { name: "Роман Лебедев", contact: "@roman_leb", ageGroup: "35–44", incomeBand: "250+ тыс. ₽", source: "YouTube", video: "Как выйти на доход 300к в 2026", utm: "yt_income_300", stage: "Оплачено", manager: "Алексей", revenue: 129000, responseMinutes: 5, tags: "оплата", createdAt: "2026-08-02T10:12:00.000Z", lastActivity: "2 авг, 16:30" },
];

export async function GET() {
  try {
    const db = getDb();
    const rows = await db.select().from(clients).orderBy(asc(clients.id));
    if (rows.length === 0) {
      for (const batch of [seedClients.slice(0, 4), seedClients.slice(4)]) {
        rows.push(...await db.insert(clients).values(batch).returning());
      }
    }
    return Response.json({ clients: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<typeof clients.$inferInsert> & { clients?: Array<Partial<typeof clients.$inferInsert>> };
    const incoming = payload.clients ?? [payload];
    if (!incoming.length || incoming.some(item => !item.name?.trim() || !item.contact?.trim())) {
      return Response.json({ error: "Имя и контакт обязательны" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const values = incoming.slice(0, 500).map(item => ({
      name: item.name!.trim(),
      contact: item.contact!.trim(),
      ageGroup: item.ageGroup?.trim() || "Не указан",
      incomeBand: item.incomeBand?.trim() || "Не указан",
      source: item.source?.trim() || "Ручной ввод",
      video: item.video?.trim() || "Без атрибуции",
      utm: item.utm?.trim() || "direct",
      stage: item.stage?.trim() || "Новая",
      manager: item.manager?.trim() || "Не назначен",
      revenue: Number(item.revenue) || 0,
      responseMinutes: Number(item.responseMinutes) || 0,
      tags: item.tags?.trim() || "новый",
      notes: item.notes?.trim() || "",
      createdAt: item.createdAt || now,
      lastActivity: "Только что",
    }));
    const db = getDb();
    const rows: Array<typeof clients.$inferSelect> = [];
    for (let index = 0; index < values.length; index += 4) {
      rows.push(...await db.insert(clients).values(values.slice(index, index + 4)).returning());
    }
    await db.insert(activityEvents).values({ type: "lead_created", entityId: rows[0]?.id, title: rows.length > 1 ? `Импортировано лидов: ${rows.length}` : "Новая заявка создана", detail: rows[0]?.name ?? "", createdAt: now });
    return Response.json({ clients: rows }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { id?: number; stage?: string; manager?: string; revenue?: number; notes?: string; nextFollowUp?: string | null; callDuration?: number; callOutcome?: string };
    if (!payload.id) return Response.json({ error: "id is required" }, { status: 400 });
    const updates: Partial<typeof clients.$inferInsert> = { lastActivity: "Только что" };
    if (payload.stage) updates.stage = payload.stage;
    if (payload.manager) updates.manager = payload.manager;
    if (typeof payload.revenue === "number") updates.revenue = payload.revenue;
    if (typeof payload.notes === "string") updates.notes = payload.notes;
    if (payload.nextFollowUp !== undefined) updates.nextFollowUp = payload.nextFollowUp;
    if (typeof payload.callDuration === "number") updates.callDuration = payload.callDuration;
    if (typeof payload.callOutcome === "string") updates.callOutcome = payload.callOutcome;
    if (payload.stage === "Диалог") updates.dialogAt = new Date().toISOString();
    if (payload.stage === "Звонок") updates.callAt = new Date().toISOString();
    if (payload.stage === "Оплачено") updates.saleAt = new Date().toISOString();
    const [client] = await getDb().update(clients).set(updates).where(eq(clients.id, payload.id)).returning();
    return Response.json({ client });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });
    await getDb().delete(clients).where(eq(clients.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
