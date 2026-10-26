export const runtime = "nodejs";
export async function GET() {
  const url = process.env.GHOST_URL ?? "(not set)";
  const key = process.env.GHOST_CONTENT_API_KEY ?? "(not set)";
  const keyPreview = key !== "(not set)" ? key.slice(0, 6) + "..." : key;
  let posts = 0;
  let status = 0;
  let error = "";
  try {
    const res = await fetch(`${url}/ghost/api/content/posts/?key=${key}&limit=1`);
    status = res.status;
    const json = await res.json() as { posts?: unknown[] };
    posts = json.posts?.length ?? 0;
  } catch (e) {
    error = String(e);
  }
  return Response.json({ url, keyPreview, status, posts, error });
}
