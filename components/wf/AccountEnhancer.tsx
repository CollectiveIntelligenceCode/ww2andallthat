"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getRank, getNextRank, getReadArticles } from "@/lib/gamification";

const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

async function getJson(url: string): Promise<{ status: number; data: any }> {
  try {
    const r = await fetch(url, { credentials: "same-origin" });
    let data: any = null;
    try { data = await r.json(); } catch {}
    return { status: r.status, data };
  } catch {
    return { status: 0, data: null };
  }
}

function planLabel(tier: unknown): string {
  const t = String(tier ?? "").toLowerCase();
  if (!t) return "";
  if (t.includes("found")) return "Founding member";
  if (t.includes("free")) return "Free";
  if (t.includes("paid") || t.includes("member") || t.includes("yearly") || t.includes("monthly")) return "Member";
  return String(tier);
}

export default function AccountEnhancer() {
  const path = usePathname();

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    async function refer() {
      const box = document.querySelector<HTMLElement>(".linkbox");
      if (!box) return;
      const { status, data } = await getJson("/api/ghost/referral");
      if (cancelled) return;
      const input = box.querySelector<HTMLInputElement>("input");
      const buttons = box.querySelectorAll<HTMLButtonElement>("button");
      const copyBtn = buttons[0];
      const shareBtn = buttons[1];
      if (status === 401) {
        if (input) {
          const a = document.createElement("a");
          a.href = "/sign-in";
          a.textContent = "Sign in to get your link";
          a.className = "btn";
          input.replaceWith(a);
        }
        copyBtn?.remove();
        shareBtn?.remove();
        return;
      }
      const url = data && typeof data.url === "string" ? data.url : "";
      if (!url) return;
      if (input) input.value = url;
      if (copyBtn) {
        const label = copyBtn.textContent || "Copy";
        let timer: number | undefined;
        const onCopy = async () => {
          try {
            await navigator.clipboard.writeText(url);
          } catch {
            input?.select();
            try { document.execCommand("copy"); } catch {}
          }
          copyBtn.textContent = "Copied";
          window.clearTimeout(timer);
          timer = window.setTimeout(() => { copyBtn.textContent = label; }, 1800);
        };
        copyBtn.addEventListener("click", onCopy);
        cleanups.push(() => { copyBtn.removeEventListener("click", onCopy); window.clearTimeout(timer); });
      }
      if (shareBtn) {
        const onShare = async () => {
          try {
            if (navigator.share) await navigator.share({ title: "WW2 & All That", url });
            else await navigator.clipboard.writeText(url);
          } catch {}
        };
        shareBtn.addEventListener("click", onShare);
        cleanups.push(() => shareBtn.removeEventListener("click", onShare));
      }
      const n = Number(data.count);
      if (Number.isFinite(n)) {
        const stats = document.querySelectorAll<HTMLElement>(".stats .stat b");
        if (stats[0]) stats[0].textContent = String(n);
      }
    }

    function badges() {
      let count = 0;
      try { count = getReadArticles().length; } catch {}
      const rank = getRank(count);
      const next = getNextRank(count);
      const host = document.querySelector<HTMLElement>(".totals");
      if (!host || document.getElementById("wf-rank")) return;
      const pct = next ? Math.min(100, Math.round(((count - rank.min) / (next.min - rank.min)) * 100)) : 100;
      const stars = "★".repeat(rank.stars) + "☆".repeat(Math.max(0, 9 - rank.stars));
      const left = next ? next.min - count : 0;
      const el = document.createElement("div");
      el.id = "wf-rank";
      el.className = "group";
      el.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:16px";
      el.innerHTML =
        `<h2>Your rank: ${esc(rank.name)}</h2>` +
        `<div aria-hidden="true" style="letter-spacing:2px">${stars}</div>` +
        `<div style="height:8px;background:#e5e5e5;border-radius:4px;overflow:hidden"><span style="display:block;height:100%;width:${pct}%;background:#222"></span></div>` +
        `<span class="meta">${esc(String(count))} ${count === 1 ? "essay" : "essays"} read on this device. ` +
        (next ? `${esc(String(left))} more to reach ${esc(next.name)}.` : "Top rank reached.") +
        `</span>`;
      host.parentElement?.insertBefore(el, host);
    }

    async function account() {
      const { status, data } = await getJson("/api/ghost/session");
      if (cancelled || status !== 200 || !data || !data.email) return;
      document.querySelectorAll<HTMLElement>(".settings-row").forEach((row) => {
        if (row.querySelector(".lbl")?.textContent?.trim() === "Email") {
          const v = row.querySelector<HTMLElement>(".val");
          if (v) v.textContent = String(data.email);
        }
      });
      const tag = document.querySelector<HTMLElement>(".since .tag");
      const label = planLabel(data.tier);
      if (tag && label) tag.textContent = label;
    }

    try {
      if (path.startsWith("/account/refer")) void refer();
      else if (path.startsWith("/account/badges")) badges();
      else if (path === "/account" || path.startsWith("/account/account") || path.startsWith("/account/founding")) void account();
    } catch {}

    return () => {
      cancelled = true;
      cleanups.forEach((f) => f());
    };
  }, [path]);

  return null;
}
