import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [["media:thumbnail", "mediaThumbnail"]],
  },
});

export function extractYoutubeId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  return null;
}

// Strip dangerous tags/attributes from Substack HTML before rendering
export function sanitiseHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

// Detect paid Substack articles: content is a short teaser with a subscribe prompt
function detectPaid(content: string): boolean {
  const lower = content.toLowerCase();
  if (
    lower.includes("subscribe to read") ||
    lower.includes("this post is for paid subscribers") ||
    lower.includes("this post is for paying subscribers") ||
    lower.includes("paid subscribers only")
  ) return true;
  // If stripped text is very short, it's a teaser
  const textOnly = content.replace(/<[^>]+>/g, "").trim();
  return textOnly.length < 600;
}

export function normaliseSubstackItem(item: {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: { url?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  const url = item.link ?? "";
  const slugMatch = url.match(/\/p\/([^/?#]+)/);
  const slug = slugMatch?.[1] ?? url.split("/").pop() ?? "";
  // rss-parser maps content:encoded → content by default
  const rawContent = (item.content as string | undefined) ?? "";
  const isPaid = rawContent ? detectPaid(rawContent) : false;
  const body = rawContent ? sanitiseHtml(rawContent) : undefined;
  return {
    title: item.title ?? "",
    slug,
    substackUrl: url,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    excerpt: item.contentSnippet?.slice(0, 280) ?? "",
    coverImage: item.enclosure?.url ?? item["media:thumbnail"]?.["$"]?.url ?? undefined,
    isPaid,
    featured: false,
    tags: [] as string[],
    body,
  };
}

export async function fetchSubstackFeed(feedUrl: string) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map(normaliseSubstackItem);
  } catch {
    return [];
  }
}

export async function fetchYoutubeFeed(channelId: string) {
  try {
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
  } catch {
    return [];
  }
}
