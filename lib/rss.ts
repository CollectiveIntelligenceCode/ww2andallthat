import Parser from "rss-parser";

const parser = new Parser({
  customFields: { item: [["media:thumbnail", "mediaThumbnail"]] },
});

export function extractYoutubeId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

export function normaliseSubstackItem(item: {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  enclosure?: { url?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  const url = item.link ?? "";
  const slugMatch = url.match(/\/p\/([^/?#]+)/);
  const slug = slugMatch?.[1] ?? url.split("/").pop() ?? "";
  return {
    title: item.title ?? "",
    slug,
    substackUrl: url,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    excerpt: item.contentSnippet?.slice(0, 280) ?? "",
    coverImage: item.enclosure?.url ?? item["media:thumbnail"]?.["$"]?.url ?? undefined,
    isPaid: false,
    featured: false,
    tags: [] as string[],
  };
}

export async function fetchSubstackFeed(feedUrl: string) {
  const feed = await parser.parseURL(feedUrl);
  return feed.items.map(normaliseSubstackItem);
}

export async function fetchYoutubeFeed(channelId: string) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const feed = await parser.parseURL(feedUrl);
  return feed.items.map(item => {
    const youtubeId = item.link ? extractYoutubeId(item.link) : null;
    return {
      title: item.title ?? "",
      slug: youtubeId ?? "",
      youtubeId: youtubeId ?? "",
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
      description: item.contentSnippet?.slice(0, 500) ?? "",
      thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : undefined,
      tags: [] as string[],
    };
  }).filter(v => v.youtubeId);
}
