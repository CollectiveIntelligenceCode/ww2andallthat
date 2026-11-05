"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const thumb = (r: { image: string | null }, tag: "span" | "div") =>
  r.image
    ? `<${tag} class="ph" style="overflow:hidden;padding:0"><img src="${r.image.replace(/"/g, "&quot;")}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></${tag}>`
    : `<${tag} class="ph">Essay</${tag}>`;

type R = { slug: string; title: string; excerpt: string; date: string; minutes: number; paid: boolean; image: string | null };

const LOCK = '<span class="lock"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="6" width="10" height="7" rx="1"/><path d="M3 6V4a3 3 0 0 1 6 0v2"/></svg>Members</span>';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function fmtDate(d: string) {
  const t = new Date(d);
  return isNaN(t.getTime()) ? "" : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Escape the snippet, then wrap matched terms in <mark>.
function hl(text: string, q: string) {
  let out = esc(text);
  for (const t of q.toLowerCase().split(/\s+/).filter(Boolean)) {
    const re = new RegExp(esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(/(<mark>.*?<\/mark>)|([^<]+)/g, (m, mk, txt) => (mk ? mk : txt.replace(re, (x: string) => `<mark>${x}</mark>`)));
  }
  return out;
}

function meta(r: R) {
  const bits = ["Essay"];
  const d = fmtDate(r.date);
  if (d) bits.push(d);
  return esc(bits.join(" · ")) + (r.paid ? " · " + LOCK : "");
}

function hitRow(r: R, q: string) {
  return `<a class="hit" href="/essays/${encodeURIComponent(r.slug)}">${thumb(r, "span")}<span><b>${esc(r.title)}</b><span class="snip">${hl(r.excerpt, q)}</span><span class="meta">${meta(r)}</span></span></a>`;
}

function itemRow(r: R, q: string) {
  const tag = r.paid ? '<span class="tag members">Members</span>' : '<span class="tag free">Free</span>';
  const mins = r.minutes ? ` · ${r.minutes} min read` : "";
  return `<article class="item">${thumb(r, "div")}<div class="card"><span class="kicker">Essay</span><h3><a href="/essays/${encodeURIComponent(r.slug)}">${esc(r.title)}</a></h3><p class="snip">${hl(r.excerpt, q)}</p><div class="row"><span class="meta">${esc(fmtDate(r.date) + mins)}</span>${tag}</div></div></article>`;
}

async function query(q: string): Promise<R[]> {
  if (!q.trim()) return [];
  const res = await fetch("/api/wf-search?q=" + encodeURIComponent(q.trim()));
  if (!res.ok) return [];
  return ((await res.json()).results ?? []) as R[];
}

export default function SearchEnhancer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[type="search"]');
    if (!input) return;
    const form = input.closest("form");
    const full = pathname === "/search";
    const cleanups: Array<() => void> = [];
    const on = <T extends EventTarget>(el: T | null, ev: string, fn: (e: any) => void) => {
      if (!el) return;
      el.addEventListener(ev, fn);
      cleanups.push(() => el.removeEventListener(ev, fn));
    };
    let seq = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    cleanups.push(() => clearTimeout(timer));

    const close = () => { if (window.history.length > 1) router.back(); else router.push("/"); };
    const submit = () => {
      const v = input.value.trim();
      if (!v) return;
      if (full) { window.history.pushState(null, "", "/search?q=" + encodeURIComponent(v)); runFull(v); }
      else router.push("/search?q=" + encodeURIComponent(v));
    };

    on(form, "submit", (e: Event) => { e.preventDefault(); submit(); });
    on(input, "keydown", (e: KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });

    let runFull: (q: string) => void = () => {};

    if (!full) {
      // Overlay (opened / typing)
      const box = document.querySelector<HTMLElement>(".box");
      const scrim = document.querySelector<HTMLElement>(".scrim");
      const sugg = document.querySelector<HTMLElement>(".sugg");
      const hint = document.querySelector<HTMLElement>(".hint");
      const oldGroups = document.querySelector<HTMLElement>(".groups");
      const oldFoot = document.querySelector<HTMLElement>(".foot");
      const hidden: HTMLElement[] = [];
      [oldGroups, oldFoot].forEach((el) => { if (el) { el.style.display = "none"; hidden.push(el); } });
      const panel = document.createElement("div");
      panel.setAttribute("data-wf-search", "");
      box?.appendChild(panel);
      cleanups.push(() => { panel.remove(); hidden.forEach((el) => (el.style.display = "")); if (sugg) sugg.style.display = ""; if (hint) hint.style.display = ""; });

      input.value = "";
      input.focus();
      const showIdle = (idle: boolean) => { if (sugg) sugg.style.display = idle ? "" : "none"; if (hint) hint.style.display = idle ? "" : "none"; };
      const render = async (q: string) => {
        const my = ++seq;
        if (!q.trim()) { panel.innerHTML = ""; showIdle(true); return; }
        showIdle(false);
        let rs: R[] = [];
        try { rs = await query(q); } catch { rs = []; }
        if (my !== seq) return;
        const shown = rs.slice(0, 6);
        const link = "/search?q=" + encodeURIComponent(q.trim());
        panel.innerHTML = shown.length
          ? `<div class="groups"><div class="grp"><div class="grp-h"><span class="kicker">Essays · ${rs.length}</span></div>${shown.map((r) => hitRow(r, q)).join("")}</div></div><div class="foot"><a class="btn primary" href="${link}">See all results for “${esc(q.trim())}”</a><span class="meta">Enter ↵</span></div>`
          : `<div class="groups"><div class="grp"><p class="hint">No results for “${esc(q.trim())}”</p></div></div>`;
      };
      on(input, "input", () => { clearTimeout(timer); timer = setTimeout(() => render(input.value), 200); });
      on(document.querySelector('[aria-label="Close"]'), "click", (e: Event) => { e.preventDefault(); close(); });
      on(scrim, "click", (e: MouseEvent) => { if (e.target === scrim) close(); });
      on(document, "keydown", (e: KeyboardEvent) => { if (e.key === "Escape") close(); });
      // clicking a suggestion fills the box
      on(sugg, "click", (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest("a");
        if (!a || (a.getAttribute("href") ?? "#") !== "#") return;
        e.preventDefault(); e.stopPropagation();
        input.value = a.textContent ?? ""; render(input.value);
      });
    } else {
      // Full results page
      const h1 = document.querySelector<HTMLElement>("main h1");
      const chips = document.querySelector<HTMLElement>(".chips");
      const list = document.querySelector<HTMLElement>("section.list");
      const topic = Array.from(document.querySelectorAll<HTMLElement>("aside .panel")).find((p) => p.querySelector("h3")?.textContent === "Operation Pedestal");
      const origH1 = h1?.textContent ?? "";
      const origList = list?.innerHTML ?? "";
      const origChips = chips?.style.display ?? "";
      if (chips) chips.style.display = "none";
      if (topic) topic.style.display = "none";
      cleanups.push(() => { if (h1) h1.textContent = origH1; if (list) list.innerHTML = origList; if (chips) chips.style.display = origChips; if (topic) topic.style.display = ""; });

      runFull = async (q: string) => {
        const my = ++seq;
        input.value = q;
        if (!q.trim()) {
          if (h1) h1.textContent = "Search";
          if (list) list.innerHTML = '<p class="hint">Type a word or phrase to search the essays.</p>';
          return;
        }
        if (h1) h1.textContent = "Searching…";
        let rs: R[] = [];
        try { rs = await query(q); } catch { rs = []; }
        if (my !== seq) return;
        if (h1) h1.textContent = rs.length ? `${rs.length === 20 ? "Top 20" : rs.length} result${rs.length === 1 ? "" : "s"} for “${q.trim()}”` : `No results for “${q.trim()}”`;
        if (list) list.innerHTML = rs.length ? rs.map((r) => itemRow(r, q)).join("") : '<p class="hint">No results. Try a different word, or fewer words.</p>';
      };
      const fromUrl = () => runFull(new URLSearchParams(window.location.search).get("q") ?? "");
      fromUrl();
      on(window, "popstate", fromUrl);
    }

    return () => cleanups.forEach((f) => f());
  }, [pathname, router]);

  return null;
}
