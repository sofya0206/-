import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { clients } from "../../../db/schema";

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
    let rows = await db.select().from(clients).orderBy(asc(clients.id));
    if (rows.length === 0) {
      rows = await db.insert(clients).values(seedClients).returning();
    }
    return Response.json({ clients: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { id?: number; stage?: string; manager?: string; revenue?: number };
    if (!payload.id) return Response.json({ error: "id is required" }, { status: 400 });
    const updates: { stage?: string; manager?: string; revenue?: number; lastActivity: string } = { lastActivity: "Только что" };
    if (payload.stage) updates.stage = payload.stage;
    if (payload.manager) updates.manager = payload.manager;
    if (typeof payload.revenue === "number") updates.revenue = payload.revenue;
    const [client] = await getDb().update(clients).set(updates).where(eq(clients.id, payload.id)).returning();
    return Response.json({ client });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
