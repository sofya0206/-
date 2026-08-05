import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityEvents } from "../../../db/schema";

export async function GET() {
  try {
    const rows = await getDb().select().from(activityEvents).orderBy(desc(activityEvents.createdAt)).limit(30);
    return Response.json({ events: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
