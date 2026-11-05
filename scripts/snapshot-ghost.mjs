// Snapshot published Ghost posts so previews without Ghost env vars still show real content.
// Reads GHOST_URL / GHOST_CONTENT_API_KEY from .env.local. Run: node scripts/snapshot-ghost.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")
    .map((l) => l.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean)
    .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
);
const url = env.GHOST_URL || "https://ww2-and-all-that.ghost.io";
const key = env.GHOST_CONTENT_API_KEY;
if (!key) throw new Error("GHOST_CONTENT_API_KEY missing in .env.local");

const posts = [];
for (let page = 1; ; page++) {
  const u = new URL(`${url}/ghost/api/content/posts/`);
  u.search = new URLSearchParams({ key, include: "tags,authors", formats: "html", limit: "50", page: String(page), order: "published_at desc" });
  const j = await (await fetch(u)).json();
  posts.push(...(j.posts ?? []));
  if (!j.meta?.pagination?.next) break;
}
const slim = posts.map((p) => ({
  id: p.id, slug: p.slug, title: p.title, html: p.html, image: p.feature_image,
  excerpt: p.custom_excerpt || p.excerpt || "", published_at: p.published_at,
  reading_time: p.reading_time, visibility: p.visibility,
  tags: (p.tags ?? []).map((t) => ({ name: t.name, slug: t.slug })),
  author: p.authors?.[0]?.name ?? "James Holland",
}));
fs.writeFileSync(path.join(root, "lib/wireframes/ghost-snapshot.json"), JSON.stringify(slim));
const tagCount = {}; slim.forEach((p) => p.tags.forEach((t) => (tagCount[t.slug] = (tagCount[t.slug] || 0) + 1)));
const vis = {}; slim.forEach((p) => (vis[p.visibility] = (vis[p.visibility] || 0) + 1));
console.log(slim.length, "posts", vis, "bytes", fs.statSync(path.join(root, "lib/wireframes/ghost-snapshot.json")).size, tagCount);
