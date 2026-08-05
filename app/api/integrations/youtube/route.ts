import { desc } from "drizzle-orm";
import { getDb } from "../../../../db";
import { videos } from "../../../../db/schema";

type SearchItem = { id?: { videoId?: string }; snippet?: { title?: string; publishedAt?: string } };
type VideoItem = { id?: string; statistics?: { viewCount?: string } };

const seedVideos = [
  { youtubeId: "demo-income-300", title: "Как выйти на доход 300к в 2026", publishedAt: "2026-07-28T10:00:00.000Z", utm: "yt_income_300", views: 324800, leads: 462, dialogs: 284, calls: 118, sales: 38, revenue: 5120000, spend: 412000, updatedAt: "2026-08-05T08:00:00.000Z" },
  { youtubeId: "demo-case-million", title: "Кейс: с нуля до первого миллиона", publishedAt: "2026-07-22T10:00:00.000Z", utm: "yt_case_million", views: 186200, leads: 318, dialogs: 211, calls: 92, sales: 31, revenue: 4280000, spend: 255000, updatedAt: "2026-08-05T08:00:00.000Z" },
  { youtubeId: "demo-tools-growth", title: "7 инструментов для роста в 2026", publishedAt: "2026-07-15T10:00:00.000Z", utm: "yt_tools_growth", views: 241700, leads: 286, dialogs: 175, calls: 71, sales: 22, revenue: 2930000, spend: 341000, updatedAt: "2026-08-05T08:00:00.000Z" },
  { youtubeId: "demo-errors-5", title: "Разбор 5 ошибок новичков", publishedAt: "2026-07-08T10:00:00.000Z", utm: "yt_errors_5", views: 152400, leads: 229, dialogs: 142, calls: 62, sales: 18, revenue: 2410000, spend: 265000, updatedAt: "2026-08-05T08:00:00.000Z" },
  { youtubeId: "demo-choose-niche", title: "Как выбрать сильную нишу", publishedAt: "2026-07-02T10:00:00.000Z", utm: "yt_choose_niche", views: 118900, leads: 174, dialogs: 103, calls: 45, sales: 12, revenue: 1610000, spend: 217000, updatedAt: "2026-08-05T08:00:00.000Z" },
];

export async function GET() {
  try {
    const db = getDb();
    let rows = await db.select().from(videos).orderBy(desc(videos.publishedAt));
    if (!rows.length) rows = await db.insert(videos).values(seedVideos).returning();
    return Response.json({ videos: rows, source: rows.some(row => row.youtubeId.startsWith("demo-")) ? "demo" : "youtube" });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const bindings = process.env as unknown as Record<string, unknown>;
    const key = typeof bindings.YOUTUBE_API_KEY === "string" ? bindings.YOUTUBE_API_KEY : "";
    const channel = typeof bindings.YOUTUBE_CHANNEL_ID === "string" ? bindings.YOUTUBE_CHANNEL_ID : "";
    if (!key || !channel) return Response.json({ error: "YouTube не настроен", missing: [!key && "YOUTUBE_API_KEY", !channel && "YOUTUBE_CHANNEL_ID"].filter(Boolean) }, { status: 409 });
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.search = new URLSearchParams({ part: "snippet", channelId: channel, maxResults: "25", order: "date", type: "video", key }).toString();
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) return Response.json({ error: "YouTube API отклонил запрос" }, { status: 502 });
    const searchData = await searchResponse.json() as { items?: SearchItem[] };
    const ids = (searchData.items ?? []).map(item => item.id?.videoId).filter((id): id is string => Boolean(id));
    if (!ids.length) return Response.json({ synced: 0 });
    const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    statsUrl.search = new URLSearchParams({ part: "statistics", id: ids.join(","), key }).toString();
    const statsData = await (await fetch(statsUrl)).json() as { items?: VideoItem[] };
    const viewsById = new Map((statsData.items ?? []).map(item => [item.id, Number(item.statistics?.viewCount || 0)]));
    const db = getDb();
    const now = new Date().toISOString();
    for (const item of searchData.items ?? []) {
      const youtubeId = item.id?.videoId;
      if (!youtubeId) continue;
      await db.insert(videos).values({ youtubeId, title: item.snippet?.title || "Без названия", publishedAt: item.snippet?.publishedAt || now, utm: `yt_${youtubeId}`, views: viewsById.get(youtubeId) || 0, updatedAt: now }).onConflictDoUpdate({ target: videos.youtubeId, set: { title: item.snippet?.title || "Без названия", publishedAt: item.snippet?.publishedAt || now, views: viewsById.get(youtubeId) || 0, updatedAt: now } });
    }
    return Response.json({ synced: ids.length, updatedAt: now });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "YouTube unavailable" }, { status: 500 });
  }
}
