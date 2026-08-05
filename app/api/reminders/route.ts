import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { reminders } from "../../../db/schema";

export async function GET() {
  try {
    const rows = await getDb().select().from(reminders).orderBy(desc(reminders.id)).limit(50);
    return Response.json({ reminders: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { id?: number; status?: string };
    if (!payload.id || !payload.status) return Response.json({ error: "id and status are required" }, { status: 400 });
    const [reminder] = await getDb().update(reminders).set({ status: payload.status }).where(eq(reminders.id, payload.id)).returning();
    return Response.json({ reminder });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { clientId?: number; manager?: string; message?: string; remindAt?: string };
    if (!payload.clientId || !payload.manager || !payload.message || !payload.remindAt) {
      return Response.json({ error: "Заполните все поля" }, { status: 400 });
    }
    const [reminder] = await getDb().insert(reminders).values({
      clientId: payload.clientId,
      manager: payload.manager,
      message: payload.message,
      remindAt: payload.remindAt,
      createdAt: new Date().toISOString(),
    }).returning();
    return Response.json({ reminder }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
