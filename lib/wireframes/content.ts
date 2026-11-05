import snapshot from "./ghost-snapshot.json";

export type Essay = {
  slug: string; title: string; image: string | null; excerpt: string; date: string;
  minutes: number; paid: boolean; html: string; author: string;
};

type Raw = (typeof snapshot)[number];

const GHOST_URL = process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io";
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY ?? "";

async function fetchLive(): Promise<Raw[] | null> {
  if (!GHOST_KEY) return null;
  try {
    const out: Raw[] = [];
    for (let page = 1; page < 6; page++) {
      const u = new URL(`${GHOST_URL}/ghost/api/content/posts/`);
      u.search = new URLSearchParams({ key: GHOST_KEY, include: "tags,authors", formats: "html", limit: "50", page: String(page), order: "published_at desc" }).toString();
      const res = await fetch(u, { next: { revalidate: 300 } });
      if (!res.ok) return null;
      const j = await res.json();
      for (const p of j.posts ?? []) {
        out.push({
          id: p.id, slug: p.slug, title: p.title, html: p.html, image: p.feature_image,
          excerpt: p.custom_excerpt || p.excerpt || "", published_at: p.published_at,
          reading_time: p.reading_time, visibility: p.visibility,
          tags: (p.tags ?? []).map((t: { name: string; slug: string }) => ({ name: t.name, slug: t.slug })),
          author: p.authors?.[0]?.name ?? "James Holland",
        });
      }
      if (!j.meta?.pagination?.next) break;
    }
    return out.length ? out : null;
  } catch {
    return null;
  }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Real essays from Ghost (live if the key is set, otherwise the checked-in snapshot). Junk and duplicate imports removed. */
export async function getEssays(): Promise<Essay[]> {
  const raw = (await fetchLive()) ?? (snapshot as Raw[]);
  const best = new Map<string, Raw>();
  for (const p of raw) {
    // Ghost's Content API withholds the body of paid posts: keep them, teaser only.
    if (!p.title || p.title.trim().length < 6 || (p.reading_time ?? 0) < 3 || (!p.html && p.visibility !== "paid")) continue;
    if (!/\s/.test(p.title.trim())) continue; // slug-style titles are duplicate import artefacts
    const k = norm(p.title);
    const cur = best.get(k);
    if (!cur || (p.html?.length ?? 0) > (cur.html?.length ?? 0)) best.set(k, p);
  }
  return [...best.values()]
    .sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at))
    .map((p) => ({
      slug: p.slug, title: p.title.trim(), image: p.image ?? null,
      excerpt: (p.excerpt || "").replace(/\s+/g, " ").trim(),
      date: p.published_at, minutes: p.reading_time || 5, paid: p.visibility === "paid",
      html: p.html ?? "", author: p.author || "James Holland",
    }));
}

export async function getEssay(slug: string): Promise<Essay | null> {
  return (await getEssays()).find((e) => e.slug === slug) ?? null;
}
