import { sanityClient } from "@/lib/sanity";
import { fetchSubstackFeed, fetchYoutubeFeed, normaliseSubstackItem } from "@/lib/rss";

export const runtime = "nodejs";
export const maxDuration = 60;

const SUBSTACK_FEED = "https://james1940.substack.com/feed";

type SubstackItem = ReturnType<typeof normaliseSubstackItem>;
type YoutubeItem = Awaited<ReturnType<typeof fetchYoutubeFeed>>[number];

async function upsertPost(item: SubstackItem) {
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type == "post" && slug.current == $slug][0]{ _id }`,
    { slug: item.slug }
  );
  if (existing) {
    // Never overwrite `featured` or `tags` set by editors
    return sanityClient.patch(existing._id).set({
      title: item.title,
      substackUrl: item.substackUrl,
      publishedAt: item.publishedAt,
      excerpt: item.excerpt,
      ...(item.coverImage ? { coverImage: item.coverImage } : {}),
    }).commit();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug: _slug, ...rest } = item;
  return sanityClient.create({
    _type: "post",
    slug: { _type: "slug", current: item.slug },
    ...rest,
  });
}

async function upsertVideo(item: YoutubeItem) {
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type == "video" && youtubeId == $youtubeId][0]{ _id }`,
    { youtubeId: item.youtubeId }
  );
  if (existing) {
    // Never overwrite `tags` set by editors
    return sanityClient.patch(existing._id).set({
      title: item.title,
      publishedAt: item.publishedAt,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
    }).commit();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug: _slug, ...rest } = item;
  return sanityClient.create({
    _type: "video",
    slug: { _type: "slug", current: item.slug },
    ...rest,
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { posts: 0, videos: 0, errors: [] as string[] };

  try {
    const posts = await fetchSubstackFeed(SUBSTACK_FEED);
    for (const post of posts) {
      try { await upsertPost(post); results.posts++; }
      catch (e) { results.errors.push(`post:${post.slug}: ${e}`); }
    }
  } catch (e) {
    results.errors.push(`Substack feed failed: ${e}`);
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (channelId) {
    try {
      const videos = await fetchYoutubeFeed(channelId);
      for (const video of videos) {
        try { await upsertVideo(video); results.videos++; }
        catch (e) { results.errors.push(`video:${video.youtubeId}: ${e}`); }
      }
    } catch (e) {
      results.errors.push(`YouTube feed failed: ${e}`);
    }
  }

  return Response.json(results, { status: results.errors.length > 0 ? 207 : 200 });
}
