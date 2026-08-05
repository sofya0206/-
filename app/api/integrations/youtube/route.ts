import { env } from "cloudflare:workers";
import { getDb } from "../../../../db";
import { videos } from "../../../../db/schema";

type SearchItem = { id?: { videoId?: string }; snippet?: { title?: string; publishedAt?: string } };
type VideoItem = { id?: string; statistics?: { viewCount?: string } };

export async function POST() {
  try {
    const bindings = env as unknown as Record<string, unknown>;
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
