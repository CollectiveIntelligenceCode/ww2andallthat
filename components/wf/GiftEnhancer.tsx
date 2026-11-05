"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Makes the gift journey interactive: /gift (form, live summary, validation),
// /gift/sent (fills stored values) and /gift/claim. No payment is taken and
// nothing is posted anywhere; entries only go to sessionStorage.
const KEY = "ww2_gift";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Gift = {
  plan: string; price: string; when: string; date: string;
  toName: string; toEmail: string; fromName: string; fromEmail: string; message: string;
};

function save(g: Gift) { try { sessionStorage.setItem(KEY, JSON.stringify(g)); } catch {} }
function load(): Gift | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Gift) : null;
  } catch { return null; }
}

function pad(n: number) { return String(n).padStart(2, "0"); }
function iso(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function longDate(isoStr: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoStr);
  if (!m) return "";
  const mo = MONTHS[Number(m[2]) - 1];
  return mo ? `${Number(m[3])} ${mo}` : "";
}
function christmas(): string {
  const now = new Date();
  let y = now.getFullYear();
  if (now.getMonth() === 11 && now.getDate() > 25) y += 1;
  return `${y}-12-25`;
}

function fieldInput(label: string): HTMLInputElement | HTMLTextAreaElement | null {
  const labels = document.querySelectorAll<HTMLLabelElement>("label.field");
  for (const l of Array.from(labels)) {
    if ((l.firstChild?.textContent || "").trim().toLowerCase().startsWith(label)) {
      return l.querySelector("input, textarea");
    }
  }
  return null;
}

function setText(el: Element | null | undefined, text: string) {
  if (el && el.textContent !== text) el.textContent = text;
}

function readForm(): Gift {
  const plan = document.querySelector(".gform .plan.on");
  const chip = document.querySelector(".gform .chip.on");
  const v = (l: string) => (fieldInput(l)?.value || "").trim();
  return {
    plan: plan?.querySelector(".kicker")?.textContent?.trim() || "",
    price: plan?.querySelector(".price")?.textContent?.trim() || "",
    when: chip?.textContent?.trim() || "",
    date: v("date"),
    toName: v("their name"),
    toEmail: v("their email"),
    fromName: v("your name"),
    fromEmail: v("your email"),
    message: v("message"),
  };
}

function effectiveDate(g: Gift): string {
  if (/straight/i.test(g.when)) return iso(new Date());
  if (/christmas/i.test(g.when)) return christmas();
  return g.date;
}

function showError(input: HTMLElement | null, msg: string | null) {
  const label = input?.closest("label");
  if (!label) return;
  let el = label.querySelector<HTMLElement>("[data-wf-error]");
  if (!msg) {
    el?.remove();
    input?.removeAttribute("aria-invalid");
    return;
  }
  if (!el) {
    el = document.createElement("span");
    el.setAttribute("data-wf-error", "");
    el.setAttribute("role", "alert");
    el.style.cssText = "color:#b3261e;font-size:13px;font-weight:600";
    label.appendChild(el);
  }
  el.textContent = msg;
  input?.setAttribute("aria-invalid", "true");
}

function validate(): { ok: boolean; first: HTMLElement | null } {
  const g = readForm();
  let first: HTMLElement | null = null;
  const check = (label: string, value: string, email: boolean, required = true) => {
    const input = fieldInput(label);
    let msg: string | null = null;
    if (required && !value) msg = "This field is required.";
    else if (email && value && !EMAIL_RE.test(value)) msg = "Please enter a valid email address.";
    showError(input, msg);
    if (msg && !first) first = input;
  };
  check("their name", g.toName, false);
  check("their email", g.toEmail, true);
  check("your name", g.fromName, false);
  check("your email", g.fromEmail, true);

  const dateInput = fieldInput("date");
  let dmsg: string | null = null;
  if (!/straight|christmas/i.test(g.when)) {
    if (!g.date) dmsg = "Please choose a date.";
    else if (g.date < iso(new Date())) dmsg = "Please choose today or a later date.";
  }
  showError(dateInput, dmsg);
  if (dmsg && !first) first = dateInput;
  return { ok: !first, first };
}

function syncForm() {
  const form = document.querySelector(".gform");
  if (!form) return;
  const g = readForm();
  const when = effectiveDate(g);

  const summary = document.querySelector(".summary");
  if (summary) {
    const lines = summary.querySelectorAll(".line");
    setText(lines[0]?.children[0], g.plan);
    setText(lines[0]?.children[1], g.price ? `${g.price}.00` : "");
    const sent = /straight/i.test(g.when) ? "Straight away" : /christmas/i.test(g.when) ? "Christmas Day" : longDate(g.date) || "Choose a date";
    setText(lines[1]?.children[1], sent);
    setText(lines[2]?.children[1], g.toName || g.toEmail || "Their name");
    setText(summary.querySelector(".total")?.children[1], g.price ? `${g.price}.00` : "");
  }

  const preview = document.querySelector(".preview");
  if (preview) {
    const b = preview.querySelector<HTMLElement>("b");
    const from = preview.querySelector<HTMLElement>(".from");
    if (b) {
      if (!b.dataset.wfOrig) b.dataset.wfOrig = b.textContent || "";
      setText(b, g.fromName ? `${g.fromName} has given you a year of WW2 & All That` : b.dataset.wfOrig);
    }
    if (from) {
      if (!from.dataset.wfOrig) from.dataset.wfOrig = from.textContent || "";
      setText(from, g.message ? `“${g.message}”` : from.dataset.wfOrig);
    }
  }

  const btn = document.querySelector<HTMLElement>(".gform .row button.btn.primary");
  if (btn) {
    setText(btn, "Continue");
    setText(btn.parentElement?.querySelector(".meta"), "Payment isn’t switched on yet. Nothing is charged and nothing is sent.");
  }
  void when;
}

function fillSent() {
  const g = load();
  if (!g) return;
  const root = document.querySelector("main .done");
  if (!root || (root as HTMLElement).dataset.wfFilled) return;
  const when = longDate(effectiveDate(g));
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) nodes.push(n as Text);
  for (const n of nodes) {
    let t = n.nodeValue || "";
    const o = t;
    if (g.toEmail) t = t.replace(/paul@example\.com/g, g.fromEmail || g.toEmail);
    if (when) t = t.replace(/14 March/g, when);
    if (g.toName) t = t.replace(/\bSteph\b/g, g.toName);
    t = t.replace("paid for and scheduled", "scheduled");
    t = t.replace("We’ve emailed a receipt to", "A receipt will go to");
    if (t !== o) n.nodeValue = t;
  }
  if (/straight/i.test(g.when)) {
    const h1 = root.querySelector("h1");
    if (h1 && g.toName) setText(h1, "Done. It goes straight away.");
  }
  (root as HTMLElement).dataset.wfFilled = "1";
}

export default function GiftEnhancer() {
  const router = useRouter();

  useEffect(() => {
    const path = () => window.location.pathname.replace(/\/+$/, "");

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const p = path();

      if (p === "/gift") {
        const plan = t.closest<HTMLElement>(".gform .plan");
        if (plan) {
          document.querySelectorAll(".gform .plan").forEach((x) => x.classList.toggle("on", x === plan));
          syncForm();
          return;
        }
        const chip = t.closest<HTMLElement>(".gform .chip");
        if (chip) {
          e.preventDefault();
          document.querySelectorAll(".gform .chip").forEach((x) => x.classList.toggle("on", x === chip));
          const date = fieldInput("date");
          if (date && /christmas/i.test(chip.textContent || "")) date.value = christmas();
          else if (date && /straight/i.test(chip.textContent || "")) date.value = iso(new Date());
          else date?.focus();
          showError(date, null);
          syncForm();
          return;
        }
        const btn = t.closest<HTMLElement>(".gform .row button.btn.primary");
        if (btn) {
          e.preventDefault();
          const { ok, first } = validate();
          if (!ok) { first?.focus(); return; }
          const g = readForm();
          g.date = effectiveDate(g);
          save(g);
          router.push("/gift/sent");
        }
        return;
      }

      if (p === "/gift/claim") {
        const btn = t.closest<HTMLElement>(".claim-form button.btn.primary");
        if (!btn) return;
        e.preventDefault();
        const form = btn.closest("form");
        const input = form?.querySelector<HTMLInputElement>('input[type="email"]') || null;
        const email = (input?.value || "").trim();
        if (!EMAIL_RE.test(email)) {
          showError(input, "Please enter a valid email address.");
          input?.focus();
          return;
        }
        showError(input, null);
        router.push("/sign-in");
      }
    };

    const onInput = (e: Event) => {
      if (path() !== "/gift") return;
      const t = e.target as HTMLElement;
      if (!t.closest(".gform")) return;
      showError(t, null);
      if (t instanceof HTMLInputElement && t.type === "date") {
        document.querySelectorAll(".gform .chip").forEach((x) =>
          x.classList.toggle("on", /choose/i.test(x.textContent || "")),
        );
      }
      syncForm();
    };

    const onBlur = (e: Event) => {
      if (path() !== "/gift") return;
      const t = e.target as HTMLInputElement;
      if (t.type === "email" && t.closest(".gform") && t.value.trim() && !EMAIL_RE.test(t.value.trim())) {
        showError(t, "Please enter a valid email address.");
      }
    };

    const run = () => {
      const p = path();
      if (p === "/gift") {
        document.querySelectorAll<HTMLElement>(".gform .plan").forEach((pl) => {
          if (!pl.hasAttribute("tabindex")) { pl.setAttribute("tabindex", "0"); pl.setAttribute("role", "button"); }
        });
        syncForm();
      } else if (p === "/gift/sent") fillSent();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const pl = (e.target as HTMLElement).closest?.<HTMLElement>(".gform .plan");
      if (pl && path() === "/gift") { e.preventDefault(); pl.click(); }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("focusout", onBlur, true);
    document.addEventListener("keydown", onKey, true);
    run();
    const mo = new MutationObserver(run);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("focusout", onBlur, true);
      document.removeEventListener("keydown", onKey, true);
      mo.disconnect();
    };
  }, [router]);

  return null;
}
