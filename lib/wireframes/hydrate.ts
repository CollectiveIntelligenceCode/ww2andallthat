import type { Essay } from "./content";
import type { ViewerState } from "./states";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

/** Index just past the close of the element opened at `start`, counting nested tags of the same name. */
function blockEnd(html: string, start: number, tag: string): number {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "g");
  re.lastIndex = start;
  let depth = 0, m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  return html.length;
}

/** Remove every element matching `open` (a regex for the opening tag), nesting-aware. */
function removeBlocks(html: string, open: RegExp, tag: string): string {
  let out = html, m: RegExpExecArray | null;
  const re = new RegExp(open.source, "g");
  while ((m = re.exec(out))) {
    out = out.slice(0, m.index) + out.slice(blockEnd(out, m.index, tag));
    re.lastIndex = m.index;
  }
  return out;
}

const NON_ESSAY = /film|live|map|document|audio|gallery|photo|quiz|badge|book|chat|series|download|trailer/i;
const ESSAY_LIKE = /essay|lessons|midweek|workshop|analysis|flagship|q&amp;a|dispatch|diary/i;

const img = (e: Essay, style: string) =>
  `<img src="${esc(e.image!)}" alt="" loading="lazy" style="${style};width:100%;object-fit:cover;display:block;background:#E9E9E9">`;

function hydrateCard(card: string, e: Essay): string {
  let c = card;
  const kicker = c.match(/<span class="kicker">([\s\S]*?)<\/span>/)?.[1] ?? "";
  const keep = /lessons|midweek/i.test(kicker) ? kicker : "Essay";
  c = c.replace(/<span class="kicker">[\s\S]*?<\/span>/, `<span class="kicker">${keep}</span>`);
  c = c.replace(/<h3([^>]*)><a href="[^"]*">[\s\S]*?<\/a><\/h3>/, `<h3$1><a href="/essays/${e.slug}">${esc(e.title)}</a></h3>`);
  c = c.replace(/<div class="ph"([^>]*)>[\s\S]*?<\/div>/, (full, attrs: string) => {
    if (!e.image) return full;
    const ar = attrs.match(/aspect-ratio:\s*([^;"]+)/)?.[1] ?? "16 / 9";
    const w = attrs.match(/width:\s*([^;"]+)/)?.[1];
    return img(e, `aspect-ratio:${ar}${w ? `;max-width:${w}` : ""}`);
  });
  if (/<p>/.test(c)) c = c.replace(/<p>[\s\S]*?<\/p>/, `<p>${esc(clip(e.excerpt, 140))}</p>`);
  c = c.replace(/<span class="meta">[\s\S]*?<\/span>/, `<span class="meta">${fmtDate(e.date)} · ${e.minutes} min read</span>`);
  c = c.replace(/<span class="tag [^"]*">[\s\S]*?<\/span>/, e.paid ? `<span class="tag members">Members</span>` : `<span class="tag free">Free</span>`);
  // invented comment counts and "James replied" flags
  let i: number;
  while ((i = c.indexOf('<span class="engage">')) >= 0) c = c.slice(0, i) + c.slice(blockEnd(c, i, "span"));
  return c;
}

/** Swap placeholder essay cards for real Ghost essays, in order, each used once per page. */
export function hydrateCards(html: string, essays: Essay[]): string {
  if (!essays.length) return html;
  let n = 0;
  return html.replace(/<article class="(?:card|item)"[\s\S]*?<\/article>/g, (card) => {
    const kicker = card.match(/<span class="kicker">([\s\S]*?)<\/span>/)?.[1] ?? "";
    if (!kicker || NON_ESSAY.test(kicker) || !ESSAY_LIKE.test(kicker) || /class="btn/.test(card)) return card;
    return hydrateCard(card, essays[n++ % essays.length]);
  });
}

const NAV: Record<string, string> = {
  Latest: "/latest", Campaigns: "/campaigns", Films: "/films", Essays: "/essays", Live: "/live",
  Discussions: "/discussions", Books: "/books", Search: "/search/opened", "Start here": "/start-here",
  About: "/about", FAQs: "/faqs", FAQ: "/faqs", Membership: "/membership", Privacy: "/privacy", Terms: "/terms",
  Cookies: "/cookies", Quizzes: "/quizzes", Documents: "/documents/malta-war-diary", Maps: "/maps",
  Downloads: "/downloads", Audio: "/audio", Galleries: "/galleries", "Log in": "/sign-in", Subscribe: "/sign-in",
  Account: "/account", Upgrade: "/membership", Join: "/membership", "Give a year": "/gift",
};

/** Header, footer and menu links that the wireframes leave as "#" go to the page they name. */
export function wireNavLinks(html: string): string {
  return html.replace(/<a ([^>]*?)href="#"([^>]*)>([^<]{2,24})<\/a>/g, (full, a: string, b: string, text: string) => {
    const to = NAV[text.trim()];
    return to ? `<a ${a}href="${to}"${b}>${text}</a>` : full;
  });
}

function firstParas(body: string, from: number, to: number): string {
  const paras = body.match(/<(p|h2|h3|blockquote|figure|ul|ol)\b[\s\S]*?<\/\1>/g) ?? [];
  return paras.slice(from, to).join("\n");
}

const SUBSTACK_CHROME = /<p>\s*(?:<[^>]+>)*\s*(subscribe|share|leave a comment|give a gift subscription|subscribe now)\s*(?:<\/[^>]+>)*\s*<\/p>/gi;

const cleanBody = (h: string) =>
  h.replace(SUBSTACK_CHROME, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<iframe[\s\S]*?<\/iframe>/g, "")
    .replace(/<p>(\s|&nbsp;)*<\/p>/g, "").replace(/\sstyle="[^"]*"/g, "");

/** Fill an essay wireframe with a real post. `gated` shows a teaser and keeps the wireframe's gate. */
export function hydrateEssay(html: string, e: Essay, gated: boolean, more: Essay[]): string {
  let out = html;
  out = out.replace(/<div class="crumb"[^>]*>[\s\S]*?<\/div>/, `<div class="crumb" style="padding: 0"><a href="/essays">‹ Essays</a> · Essay</div>`);
  out = out.replace(/<span class="kicker">[^<]*<\/span>/, `<span class="kicker">Essay</span>`);
  out = out.replace(/<h1 class="title">[\s\S]*?<\/h1>/, `<h1 class="title">${esc(e.title)}</h1>`);
  out = out.replace(/<p class="standfirst">[\s\S]*?<\/p>/, e.excerpt ? `<p class="standfirst">${esc(clip(e.excerpt, 220))}</p>` : "");
  out = out.replace(/(<div class="byline">[\s\S]*?<span class="meta">)[\s\S]*?(<\/span>)/, `$1<b style="color: #1A1A1A">${esc(e.author)}</b> · ${fmtDate(e.date)} · ${e.minutes} min read$2`);
  out = out.replace(/<div class="wide">[\s\S]*?<\/div>\s*(?=<div class="actions">)/, e.image ? `<div class="wide">${img(e, "aspect-ratio:21 / 9")}</div>\n` : "");

  const body = cleanBody(e.html || (e.excerpt ? `<p>${esc(e.excerpt)}</p>` : ""));
  const total = (body.match(/<(p|h2|h3|blockquote|figure|ul|ol)\b/g) ?? []).length;
  const first = gated ? firstParas(body, 0, 4) : body;
  const second = gated ? firstParas(body, 4, 7) : "";

  const bodyOpen = /<div class="body"[^>]*>/g;
  let seen = 0, m: RegExpExecArray | null;
  while ((m = bodyOpen.exec(out))) {
    const end = blockEnd(out, m.index, "div");
    const idx = seen++;
    let inner = idx === 0 ? first : idx === 1 ? second : "";
    if (idx === 0) inner = inner.replace(/<p>/, '<p class="dropcap">');
    const repl = idx > 1 || (idx === 1 && !gated) ? "" : `${m[0]}${inner}</div>`;
    out = out.slice(0, m.index) + repl + out.slice(end);
    bodyOpen.lastIndex = m.index + repl.length;
  }
  if (gated && total <= 4) out = removeBlocks(out, /<div class="gate-fade"/, "div");

  out = removeBlocks(out, /<section aria-label="Comments"/, "section");
  out = removeBlocks(out, /<div class="row"><span class="meta">Tags<\/span>/, "div");
  out = out.replace(/<div class="author"><div class="ph">Photo<\/div>/, `<div class="author"><div class="ph">JH</div>`);
  out = out.replace(/<h2>More in Fortress Malta<\/h2><a href="[^"]*">[^<]*<\/a>/, `<h2>More essays</h2><a href="/essays">All essays →</a>`);
  out = out.replace(/Part \d+ · (Film|Essay|Map pack)/g, "Essay").replace(/<div class="ph" style="aspect-ratio: 4 \/ 3">(Film|Maps)<\/div>/g, `<div class="ph" style="aspect-ratio: 4 / 3">Essay</div>`);
  return hydrateCards(out, more);
}

/** Home page: the wireframe's lead slot shows the newest real essay instead of the invented film. */
export function hydrateHero(html: string, e: Essay): string {
  const start = html.indexOf('<div class="hero">');
  if (start < 0) return html;
  const end = blockEnd(html, start, "div");
  const hero = html.slice(start, end);
  if (!/film/i.test(hero.match(/<span class="kicker">([\s\S]*?)<\/span>/)?.[1] ?? "")) return html;
  const ph = hero.match(/<div class="ph"([^>]*)>/)?.[1] ?? "";
  const ar = ph.match(/aspect-ratio:\s*([^;"]+)/)?.[1] ?? "16 / 10";
  const tag = e.paid ? `<span class="tag members">Members</span>` : `<span class="tag free">Free</span>`;
  const next = `<div class="hero">
<span class="kicker">This week · Essay</span>
<h1><a href="/essays/${e.slug}">${esc(e.title)}</a></h1>
${e.image ? img(e, `aspect-ratio:${ar}`) : `<div class="ph" style="aspect-ratio: ${ar}">Hero image</div>`}
<p>${esc(clip(e.excerpt, 200))}</p>
<div class="row" style="justify-content: center"><span class="meta">${e.author} · ${fmtDate(e.date)} · ${e.minutes} min read</span>${tag}</div>
</div>`;
  return html.slice(0, start) + next + html.slice(end);
}
