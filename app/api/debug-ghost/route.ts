export const runtime = "nodejs";
import { ghostHasContent, getGhostPosts } from "@/lib/ghost-content";
import { getLatestPosts } from "@/lib/sanity";

export async function GET() {
  const url = process.env.GHOST_URL ?? "(not set)";
  const key = process.env.GHOST_CONTENT_API_KEY ?? "(not set)";
  const keyPreview = key !== "(not set)" ? key.slice(0, 6) + "..." : key;

  // 1. Raw API call (no filter)
  let rawStatus = 0;
  let rawPosts = 0;
  let rawError = "";
  try {
    const res = await fetch(`${url}/ghost/api/content/posts/?key=${key}&limit=3&filter=visibility:[public,members,paid]`, { cache: "no-store" });
    rawStatus = res.status;
    const json = await res.json() as { posts?: unknown[] };
    rawPosts = json.posts?.length ?? 0;
  } catch (e) {
    rawError = String(e);
  }

  // 2. ghostHasContent()
  let hasContent = false;
  let hasContentError = "";
  try {
    hasContent = await ghostHasContent();
  } catch (e) {
    hasContentError = String(e);
  }

  // 3. getGhostPosts(3) — direct, no cache
  let ghostPostsCount = 0;
  let ghostPostTitles: string[] = [];
  let ghostPostsError = "";
  try {
    const p = await getGhostPosts(3);
    ghostPostsCount = p.length;
    ghostPostTitles = p.map(x => x.title);
  } catch (e) {
    ghostPostsError = String(e);
  }

  // 4. getLatestPosts(3) — goes through unstable_cache
  let cachedPostsCount = 0;
  let cachedPostTitles: string[] = [];
  let cachedError = "";
  try {
    const p = await getLatestPosts(3);
    cachedPostsCount = p.length;
    cachedPostTitles = p.map(x => x.title);
  } catch (e) {
    cachedError = String(e);
  }

  return Response.json({
    url, keyPreview,
    rawApi: { status: rawStatus, posts: rawPosts, error: rawError },
    ghostHasContent: { result: hasContent, error: hasContentError },
    getGhostPosts: { count: ghostPostsCount, titles: ghostPostTitles, error: ghostPostsError },
    getLatestPosts_cached: { count: cachedPostsCount, titles: cachedPostTitles, error: cachedError },
  });
}
