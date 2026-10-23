// Ghost Content API — primary article/content source.
// Falls back gracefully when Ghost has no content yet (pre-migration from Substack).
// All 12 content types detected from Ghost tags.

import type { Post, ContentType, MemberTier } from "./types";

const GHOST_URL = process.env.GHOST_URL ?? "https://ww2-and-all-that.ghost.io";
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY ?? "";

// Content types matching Paul's 12 templates, identified by Ghost tag slug
export const CONTENT_TYPES: ContentType[] = [
  "flagship", "film", "midweek", "lessons", "series",
  "live", "downloads", "gallery", "photo-essay", "document", "audio", "quiz",
];

// Human-readable labels for each type
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  flagship:     "Flagship Analysis",
  film:         "Film",
  midweek:      "Midweek Dispatch",
  lessons:      "Lessons",
  series:       "Series",
  live:         "Live",
  downloads:    "Downloads",
  gallery:      "Gallery",
  "photo-essay":"Photo Essay",
  document:     "Document",
  audio:        "Audio",
  quiz:         "Quiz",
  article:      "Analysis",
};

// Tier rank for access comparisons
export const TIER_RANK: Record<MemberTier, number> = { free: 1, paid: 2, founding: 3 };

interface GhostTag {
  id: string;
  name: string;
  slug: string;
}

interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string | null;
  feature_image?: string | null;
  featured: boolean;
  visibility: "public" | "members" | "paid";
  published_at: string;
  custom_excerpt?: string | null;
  excerpt?: string;
  reading_time?: number;
  tags?: GhostTag[];
}

interface GhostResponse {
  posts?: GhostPost[];
  error?: string;
}

function detectContentType(tags: GhostTag[]): ContentType {
  for (const tag of tags) {
    const slug = tag.slug.toLowerCase() as ContentType;
    if ((CONTENT_TYPES as string[]).includes(slug)) return slug;
  }
  return "article";
}

function isFoundingOnly(tags: GhostTag[]): boolean {
  return tags.some(t =>
    t.slug === "founding-only" ||
    t.slug === "founding" ||
    t.name.toLowerCase().includes("founding only"),
  );
}

function visibilityToRequiredTier(
  visibility: GhostPost["visibility"],
  foundingOnly: boolean,
): MemberTier | null {
  if (foundingOnly) return "founding";
  if (visibility === "paid") return "paid";
  if (visibility === "members") return "free";
  return null;
}

function ghostToPost(p: GhostPost, index: number): Post {
  const tags = p.tags ?? [];
  const foundingOnly = isFoundingOnly(tags);
  const requiredTier = visibilityToRequiredTier(p.visibility, foundingOnly);
  return {
    _id: p.id,
    title: p.title,
    slug: { current: p.slug },
    publishedAt: p.published_at,
    excerpt: p.custom_excerpt ?? p.excerpt ?? "",
    coverImage: p.feature_image ?? undefined,
    isPaid: requiredTier !== null && requiredTier !== "free",
    requiredTier,
    featured: p.featured || index === 0,
    tags: tags.filter(t => !t.slug.startsWith("#")).map(t => t.name),
    contentType: detectContentType(tags),
    body: p.html ?? undefined,
    readingTime: p.reading_time,
  };
}

async function fetchGhost(
  path: string,
  params: Record<string, string> = {},
): Promise<GhostPost[]> {
  if (!GHOST_KEY) return [];
  const url = new URL(`${GHOST_URL}/ghost/api/content/${path}/`);
  url.searchParams.set("key", GHOST_KEY);
  url.searchParams.set("include", "tags");
  url.searchParams.set("formats", "html");
  // Return all visibility levels — we enforce access control in the frontend
  url.searchParams.set("filter", "visibility:[public,members,paid]");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json() as GhostResponse;
    return json.posts ?? [];
  } catch {
    return [];
  }
}

export async function getGhostPosts(limit = 100): Promise<Post[]> {
  const raw = await fetchGhost("posts", { limit: String(limit), order: "published_at desc" });
  return raw.map(ghostToPost);
}

export async function getGhostPost(slug: string): Promise<Post | null> {
  const raw = await fetchGhost("posts", { filter: `slug:${slug}`, limit: "1" });
  return raw.length ? ghostToPost(raw[0], 0) : null;
}

export async function getGhostPostsByTag(tag: string, limit = 12): Promise<Post[]> {
  const raw = await fetchGhost("posts", {
    filter: `tag:${tag}+visibility:[public,members,paid]`,
    limit: String(limit),
  });
  return raw.map(ghostToPost);
}

export async function getRelatedGhostPosts(tags: string[], excludeId: string, limit = 3): Promise<Post[]> {
  if (!tags.length) return getGhostPosts(limit).then(posts => posts.filter(p => p._id !== excludeId).slice(0, limit));
  const tagFilter = tags.map(t => `tag:${t.toLowerCase().replace(/\s+/g, "-")}`).join(",");
  const raw = await fetchGhost("posts", {
    filter: `(${tagFilter})+id:-${excludeId}`,
    limit: String(limit),
  });
  return raw.map(ghostToPost);
}

/** Returns true if Ghost has any published content (post-migration check). */
export async function ghostHasContent(): Promise<boolean> {
  const raw = await fetchGhost("posts", { limit: "1" });
  return raw.length > 0;
}
