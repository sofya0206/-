import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { activityEvents, clients, reminders } from "../../../../db/schema";

async function sendTelegram(token: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const result = await response.json() as { ok?: boolean; description?: string };
  if (!response.ok || !result.ok) throw new Error(result.description || "Telegram API error");
}

export async function POST(request: Request) {
  try {
    const bindings = process.env as unknown as Record<string, unknown>;
    const token = typeof bindings.TELEGRAM_BOT_TOKEN === "string" ? bindings.TELEGRAM_BOT_TOKEN : "";
    const chatId = typeof bindings.TELEGRAM_CHAT_ID === "string" ? bindings.TELEGRAM_CHAT_ID : "";
    if (!token || !chatId) return Response.json({ error: "Telegram не настроен" }, { status: 409 });

    const payload = await request.json().catch(() => ({})) as { action?: "process_due" | "daily_report" };
    const action = payload.action || "process_due";
    const db = getDb();
    const now = new Date();

    if (action === "daily_report") {
      const rows = await db.select().from(clients);
      const today = now.toISOString().slice(0, 10);
      const daily = rows.filter(row => row.createdAt.startsWith(today));
      const base = daily.length ? daily : rows;
      const calls = base.filter(row => row.callAt?.startsWith(today) || ["Звонок", "Думает", "Оплачено"].includes(row.stage)).length;
      const sales = base.filter(row => row.saleAt?.startsWith(today) || row.stage === "Оплачено").length;
      const revenue = base.reduce((sum, row) => sum + row.revenue, 0);
      const pct = (a: number, b: number) => b ? `${(a / b * 100).toFixed(1).replace(".", ",")}%` : "0%";
      await sendTelegram(token, chatId, `📊 LUMO · Итоги дня\n\nЗаявки: ${base.length}\nЗвонки: ${calls}\nПродажи: ${sales}\nВыручка: ${new Intl.NumberFormat("ru-RU").format(revenue)} ₽\n\nЗаявка → звонок: ${pct(calls, base.length)}\nЗвонок → продажа: ${pct(sales, calls)}\nЗаявка → продажа: ${pct(sales, base.length)}`);
      await db.insert(activityEvents).values({ type: "daily_report_sent", title: "Ежедневный отчёт отправлен", detail: `${base.length} заявок · ${sales} продаж`, createdAt: now.toISOString() });
      return Response.json({ ok: true, action, leads: base.length, calls, sales, revenue });
    }

    const planned = await db.select().from(reminders).where(eq(reminders.status, "planned")).orderBy(asc(reminders.remindAt)).limit(100);
    const due = planned.filter(item => new Date(item.remindAt).getTime() <= now.getTime());
    const clientRows = await db.select().from(clients);
    for (const reminder of due) {
      const client = clientRows.find(item => item.id === reminder.clientId);
      const mention = reminder.manager.startsWith("@") ? reminder.manager : reminder.manager;
      await sendTelegram(token, chatId, `🔔 ${mention}, время дожать лида\n\nКлиент: ${client?.name || `#${reminder.clientId}`}\nКонтакт: ${client?.contact || "—"}\nЗадача: ${reminder.message}`);
      await db.update(reminders).set({ status: "sent" }).where(eq(reminders.id, reminder.id));
      await db.insert(activityEvents).values({ type: "reminder_sent", entityId: reminder.id, title: "Менеджеру отправлено напоминание", detail: `${reminder.manager} · ${client?.name || reminder.clientId}`, createdAt: now.toISOString() });
    }
    return Response.json({ ok: true, action, processed: due.length, pending: planned.length - due.length });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Automation unavailable" }, { status: 500 });
  }
}
