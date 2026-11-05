// Pure search helpers (no Next imports) so they can be unit-checked in plain node.
export type SearchDoc = {
  slug: string; title: string; excerpt: string; html: string; date: string;
  minutes: number; paid: boolean; image: string | null;
};
export type SearchResult = {
  slug: string; title: string; excerpt: string; date: string;
  minutes: number; paid: boolean; image: string | null;
};

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…" };

export function stripHtml(s: string): string {
  return (s || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

export function terms(q: string): string[] {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

export function snippet(text: string, ts: string[], max = 160): string {
  if (text.length <= max) return text;
  const low = text.toLowerCase();
  let at = -1;
  for (const t of ts) { const i = low.indexOf(t); if (i >= 0 && (at < 0 || i < at)) at = i; }
  if (at < 0) return text.slice(0, max - 1).trimEnd() + "…";
  let start = Math.max(0, at - 50);
  if (start > 0) { const sp = text.indexOf(" ", start); if (sp >= 0 && sp < at) start = sp + 1; }
  let end = Math.min(text.length, start + max);
  if (end < text.length) { const sp = text.lastIndexOf(" ", end); if (sp > at) end = sp; }
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}

export function searchDocs(docs: SearchDoc[], q: string, limit = 20): SearchResult[] {
  const ts = terms(q);
  if (!ts.length) return [];
  const scored: { d: SearchDoc; score: number; body: string }[] = [];
  for (const d of docs) {
    const title = d.title.toLowerCase();
    const ex = stripHtml(d.excerpt);
    const exl = ex.toLowerCase();
    const body = stripHtml(d.html);
    const bl = body.toLowerCase();
    let score = 0, ok = true;
    for (const t of ts) {
      const inT = title.includes(t), inE = exl.includes(t), inB = bl.includes(t);
      if (!inT && !inE && !inB) { ok = false; break; }
      score += (inT ? 100 : 0) + (inE ? 10 : 0) + (inB ? 1 : 0);
    }
    if (ok) scored.push({ d, score, body: inEx(exl, ts) ? ex : inEx(bl, ts) ? body : (ex || body) });
  }
  scored.sort((a, b) => b.score - a.score || (b.d.date > a.d.date ? 1 : -1));
  return scored.slice(0, limit).map(({ d, body }) => ({
    slug: d.slug, title: d.title, excerpt: snippet(body, ts), date: d.date,
    minutes: d.minutes, paid: d.paid, image: d.image,
  }));
}
function inEx(exl: string, ts: string[]) { return ts.some((t) => exl.includes(t)); }
