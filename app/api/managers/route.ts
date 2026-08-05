import { asc } from "drizzle-orm";
import { getDb } from "../../../db";
import { managers } from "../../../db/schema";

const seeds = [
  { name: "Мария Сергеева", telegram: "@maria_sales", email: "maria@lumo.team", plan: 3800000, createdAt: "2026-07-01T09:00:00.000Z" },
  { name: "Алексей Белов", telegram: "@alex_sales", email: "alex@lumo.team", plan: 3700000, createdAt: "2026-07-01T09:00:00.000Z" },
  { name: "Денис Романов", telegram: "@denis_sales", email: "denis@lumo.team", plan: 3500000, createdAt: "2026-07-01T09:00:00.000Z" },
  { name: "Ольга Ларионова", telegram: "@olga_sales", email: "olga@lumo.team", plan: 3400000, createdAt: "2026-07-01T09:00:00.000Z" },
];

export async function GET() {
  try {
    const db = getDb();
    let rows = await db.select().from(managers).orderBy(asc(managers.id));
    if (!rows.length) rows = await db.insert(managers).values(seeds).returning();
    return Response.json({ managers: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { name?: string; telegram?: string; email?: string; plan?: number };
    if (!payload.name || !payload.telegram) return Response.json({ error: "Имя и Telegram обязательны" }, { status: 400 });
    const [manager] = await getDb().insert(managers).values({ name: payload.name.trim(), telegram: payload.telegram.trim(), email: payload.email?.trim() || "", plan: Math.round(payload.plan || 0), createdAt: new Date().toISOString() }).returning();
    return Response.json({ manager }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
