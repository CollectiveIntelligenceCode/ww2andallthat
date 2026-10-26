export const runtime = "nodejs";

import { revalidateTag, revalidatePath } from "next/cache";

// POST /api/revalidate?secret=xxx
// Clears all content caches so Ghost/Substack content refreshes immediately.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET && process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // Bust data caches
  revalidateTag("live-posts", "page");
  revalidateTag("substack-posts", "page");
  revalidateTag("live-videos", "page");

  // Bust ISR page caches
  revalidatePath("/", "page");
  revalidatePath("/articles", "page");
  revalidatePath("/videos", "page");

  return Response.json({ ok: true, revalidated: ["live-posts", "substack-posts", "live-videos", "/", "/articles", "/videos"] });
}
