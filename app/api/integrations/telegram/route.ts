import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { clients } from "../../../../db/schema";

export async function POST(request: Request) {
  try {
    const bindings = env as unknown as Record<string, unknown>;
    const token = typeof bindings.TELEGRAM_BOT_TOKEN === "string" ? bindings.TELEGRAM_BOT_TOKEN : "";
    const chatId = typeof bindings.TELEGRAM_CHAT_ID === "string" ? bindings.TELEGRAM_CHAT_ID : "";
    if (!token || !chatId) return Response.json({ error: "Telegram не настроен", missing: [!token && "TELEGRAM_BOT_TOKEN", !chatId && "TELEGRAM_CHAT_ID"].filter(Boolean) }, { status: 409 });
    const payload = (await request.json()) as { action?: "test" | "daily_report"; text?: string };
    let text = payload.text?.trim() || "✅ LUMO: тестовое сообщение. Интеграция работает.";
    if (payload.action === "daily_report") {
      const rows = await getDb().select().from(clients);
      const total = rows.length;
      const calls = rows.filter(row => ["Звонок", "Думает", "Оплачено"].includes(row.stage)).length;
      const sales = rows.filter(row => row.stage === "Оплачено").length;
      const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
      const pct = (a: number, b: number) => b ? `${(a / b * 100).toFixed(1).replace(".", ",")}%` : "0%";
      text = `📊 LUMO · Итоги дня\n\nЗаявки: ${total}\nЗвонки: ${calls}\nПродажи: ${sales}\nВыручка: ${new Intl.NumberFormat("ru-RU").format(revenue)} ₽\n\nЗаявка → звонок: ${pct(calls, total)}\nЗвонок → продажа: ${pct(sales, calls)}\nЗаявка → продажа: ${pct(sales, total)}`;
    }
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text }) });
    const result = await response.json() as { ok?: boolean; description?: string };
    if (!response.ok || !result.ok) return Response.json({ error: result.description || "Telegram API error" }, { status: 502 });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Telegram unavailable" }, { status: 500 });
  }
}
