import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents, expenses } from "../../../db/schema";

const seedExpenses = [
  { category: "YouTube", description: "Монтаж роликов · Июль", amount: 184000, spentAt: "2026-08-05", videoId: null, createdAt: "2026-08-05T06:18:00.000Z" },
  { category: "Команда", description: "Зарплата отдела продаж", amount: 786000, spentAt: "2026-08-04", videoId: null, createdAt: "2026-08-04T12:00:00.000Z" },
  { category: "Маркетинг", description: "Посевы и дистрибуция", amount: 312000, spentAt: "2026-08-03", videoId: null, createdAt: "2026-08-03T09:40:00.000Z" },
  { category: "Сервисы", description: "CRM, телефония и аналитика", amount: 92000, spentAt: "2026-08-01", videoId: null, createdAt: "2026-08-01T08:00:00.000Z" },
];

export async function GET() {
  try {
    const db = getDb();
    let rows = await db.select().from(expenses).orderBy(desc(expenses.spentAt), desc(expenses.id));
    if (!rows.length) rows = await db.insert(expenses).values(seedExpenses).returning();
    return Response.json({ expenses: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { category?: string; description?: string; amount?: number; spentAt?: string; videoId?: string | null };
    if (!payload.category || !payload.description || !payload.amount || !payload.spentAt) return Response.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    const db = getDb();
    const now = new Date().toISOString();
    const [expense] = await db.insert(expenses).values({ category: payload.category, description: payload.description, amount: Math.round(payload.amount), spentAt: payload.spentAt, videoId: payload.videoId || null, createdAt: now }).returning();
    await db.insert(activityEvents).values({ type: "expense_created", entityId: expense.id, title: "Добавлен расход", detail: `${payload.category}: ${payload.amount}`, createdAt: now });
    return Response.json({ expense }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });
    await getDb().delete(expenses).where(eq(expenses.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
