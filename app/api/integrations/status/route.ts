export async function GET(request: Request) {
  const bindings = process.env as unknown as Record<string, unknown>;
  const origin = new URL(request.url).origin;
  return Response.json({
    telegram: {
      configured: Boolean(bindings.TELEGRAM_BOT_TOKEN && bindings.TELEGRAM_CHAT_ID),
      botName: typeof bindings.TELEGRAM_BOT_NAME === "string" ? bindings.TELEGRAM_BOT_NAME : null,
      missing: [!bindings.TELEGRAM_BOT_TOKEN && "TELEGRAM_BOT_TOKEN", !bindings.TELEGRAM_CHAT_ID && "TELEGRAM_CHAT_ID"].filter(Boolean),
    },
    youtube: {
      configured: Boolean(bindings.YOUTUBE_API_KEY && bindings.YOUTUBE_CHANNEL_ID),
      missing: [!bindings.YOUTUBE_API_KEY && "YOUTUBE_API_KEY", !bindings.YOUTUBE_CHANNEL_ID && "YOUTUBE_CHANNEL_ID"].filter(Boolean),
    },
    webhook: {
      configured: Boolean(bindings.LEAD_WEBHOOK_SECRET),
      url: `${origin}/api/webhooks/leads`,
      missing: bindings.LEAD_WEBHOOK_SECRET ? [] : ["LEAD_WEBHOOK_SECRET"],
    },
  });
}
