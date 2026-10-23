// Index all Ghost posts into Typesense.
// POST /api/search/sync — call after Ghost content changes, or on a schedule.
// No-op if Typesense is not configured.

export const runtime = "nodejs";
export const maxDuration = 60;

import { getGhostPosts } from "@/lib/ghost-content";
import { ensureCollection, typesenseIndexPost, TYPESENSE_READY } from "@/lib/search";

export async function POST() {
  if (!TYPESENSE_READY) {
    return Response.json({ message: "Typesense not configured — add TYPESENSE_HOST and TYPESENSE_API_KEY to Vercel" });
  }

  await ensureCollection();
  const posts = await getGhostPosts(500);

  let indexed = 0;
  for (const post of posts) {
    try {
      await typesenseIndexPost({
        id:          post._id,
        title:       post.title,
        slug:        post.slug.current,
        excerpt:     post.excerpt ?? "",
        tags:        post.tags,
        publishedAt: post.publishedAt,
        isPaid:      post.isPaid,
      });
      indexed++;
    } catch {
      // Continue on individual failures
    }
  }

  return Response.json({ ok: true, indexed, total: posts.length });
}
