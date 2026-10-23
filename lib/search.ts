// Typesense full-text search.
// When TYPESENSE_HOST + TYPESENSE_API_KEY are set, uses Typesense Cloud.
// Falls back to simple client-side filtering when not configured.
//
// To activate: create a free Typesense Cloud cluster at cloud.typesense.org,
// then add TYPESENSE_HOST and TYPESENSE_API_KEY to Vercel env vars.
// Run POST /api/search/sync to index all Ghost posts.

const TYPESENSE_HOST = process.env.TYPESENSE_HOST ?? "";
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY ?? "";
export const TYPESENSE_READY = !!(TYPESENSE_HOST && TYPESENSE_API_KEY);

export const COLLECTION = "ww2_posts";

export interface SearchHit {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  isPaid: boolean;
}

export async function typesenseSearch(query: string, limit = 20): Promise<SearchHit[]> {
  if (!TYPESENSE_READY) return [];
  const url = `https://${TYPESENSE_HOST}/collections/${COLLECTION}/documents/search`;
  const params = new URLSearchParams({
    q: query,
    query_by: "title,excerpt,tags",
    per_page: String(limit),
    sort_by: "_text_match:desc,publishedAt:desc",
  });
  try {
    const res = await fetch(`${url}?${params}`, {
      headers: { "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY },
    });
    if (!res.ok) return [];
    const json = await res.json() as { hits?: Array<{ document: SearchHit }> };
    return (json.hits ?? []).map(h => h.document);
  } catch {
    return [];
  }
}

export async function typesenseIndexPost(post: SearchHit): Promise<void> {
  if (!TYPESENSE_READY) return;
  const url = `https://${TYPESENSE_HOST}/collections/${COLLECTION}/documents`;
  await fetch(`${url}/${post.id}`, {
    method: "DELETE",
    headers: { "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY },
  }).catch(() => {});
  await fetch(url, {
    method: "POST",
    headers: {
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
}

export async function ensureCollection(): Promise<void> {
  if (!TYPESENSE_READY) return;
  const url = `https://${TYPESENSE_HOST}/collections/${COLLECTION}`;
  const check = await fetch(url, { headers: { "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY } });
  if (check.ok) return;
  await fetch(`https://${TYPESENSE_HOST}/collections`, {
    method: "POST",
    headers: {
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: COLLECTION,
      fields: [
        { name: "id",          type: "string" },
        { name: "title",       type: "string" },
        { name: "slug",        type: "string" },
        { name: "excerpt",     type: "string", optional: true },
        { name: "tags",        type: "string[]", facet: true },
        { name: "publishedAt", type: "string" },
        { name: "isPaid",      type: "bool", facet: true },
      ],
      default_sorting_field: "publishedAt",
    }),
  });
}
