import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { productStats } from "../../../db/schema";

const seed = { period: "2026-08", activeStudents: 428, casesCount: 63, nps: 74, completionRate: 87, atRisk: 34, avgResultDays: 38, updatedAt: new Date().toISOString() };

export async function GET() {
  try {
    const db = getDb();
    let [row] = await db.select().from(productStats).orderBy(desc(productStats.period)).limit(1);
    if (!row) [row] = await db.insert(productStats).values(seed).returning();
    return Response.json({ product: row });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as Partial<typeof productStats.$inferInsert> & { id?: number };
    if (!payload.id) return Response.json({ error: "id is required" }, { status: 400 });
    const allowed = { activeStudents: Number(payload.activeStudents) || 0, casesCount: Number(payload.casesCount) || 0, nps: Number(payload.nps) || 0, completionRate: Number(payload.completionRate) || 0, atRisk: Number(payload.atRisk) || 0, avgResultDays: Number(payload.avgResultDays) || 0, updatedAt: new Date().toISOString() };
    const [product] = await getDb().update(productStats).set(allowed).where(eq(productStats.id, payload.id)).returning();
    return Response.json({ product });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
