"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Wires the sign-in wireframes (and the account page's sign out controls) to the
// Ghost magic-link API. Uses delegated document listeners so it survives
// client-side navigation between /sign-in, /sign-in/returning and /sign-in/sent.
const KEY = "wf_signin_email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeRedirect(): string {
  const r = new URLSearchParams(window.location.search).get("redirect");
  return r && r.startsWith("/") && !r.startsWith("//") ? r : "/welcome";
}

function store(email: string) {
  try { sessionStorage.setItem(KEY, email); } catch {}
}
function stored(): string {
  try { return sessionStorage.getItem(KEY) || ""; } catch { return ""; }
}

async function sendLink(email: string): Promise<string | null> {
  try {
    const res = await fetch("/api/ghost/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirect: safeRedirect() }),
    });
    if (res.ok) return null;
    const data = await res.json().catch(() => ({}));
    return data.error || "Could not send sign-in link. Please try again.";
  } catch {
    return "Network error. Please check your connection and try again.";
  }
}

function showError(form: HTMLElement, msg: string | null) {
  let el = form.querySelector<HTMLElement>("[data-wf-error]");
  if (!msg) { el?.remove(); return; }
  if (!el) {
    el = document.createElement("span");
    el.setAttribute("data-wf-error", "");
    el.setAttribute("role", "alert");
    el.style.cssText = "color:#b3261e;font-size:14px;font-weight:600";
    form.insertBefore(el, form.querySelector(".meta"));
  }
  el.textContent = msg;
}

export default function SignInEnhancer() {
  const router = useRouter();

  useEffect(() => {
    let busy = false;

    const submit = async (form: HTMLFormElement) => {
      if (busy) return;
      const input = form.querySelector<HTMLInputElement>('input[type="email"]');
      const btn = form.querySelector<HTMLButtonElement>("button");
      const email = (input?.value || "").trim();
      if (!EMAIL_RE.test(email)) {
        showError(form, "Please enter a valid email address.");
        input?.focus();
        return;
      }
      showError(form, null);
      busy = true;
      const label = btn?.textContent ?? "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
      const err = await sendLink(email);
      busy = false;
      if (btn) { btn.disabled = false; btn.textContent = label; }
      if (err) { showError(form, err); return; }
      store(email);
      router.push("/sign-in/sent");
    };

    const onClick = async (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const path = window.location.pathname;

      if (path.startsWith("/account")) {
        const a = t.closest("a.btn");
        if (a && /^sign out$/i.test((a.textContent || "").trim())) {
          e.preventDefault();
          e.stopPropagation();
          try { await fetch("/api/ghost/signout", { method: "POST" }); } catch {}
          window.location.assign("/");
        }
        return;
      }

      const form = t.closest("form");
      if (form && t.closest("button") && form.querySelector('input[type="email"]')) {
        e.preventDefault();
        e.stopPropagation();
        submit(form);
        return;
      }

      const a = t.closest("a");
      if (a && path.startsWith("/sign-in/sent") && /send again/i.test(a.textContent || "")) {
        e.preventDefault();
        e.stopPropagation();
        const email = stored();
        if (!email) { router.push("/sign-in"); return; }
        const err = await sendLink(email);
        a.textContent = err ? "Could not resend, try again" : "Sent again";
      }
    };

    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form.querySelector?.('input[type="email"]')) return;
      e.preventDefault();
      submit(form);
    };

    // Replace the placeholder address on the "sent" page.
    const fillEmail = () => {
      if (!window.location.pathname.startsWith("/sign-in/sent")) return;
      const email = stored();
      if (!email) return;
      document.querySelectorAll<HTMLElement>(".sent").forEach((el) => {
        if (el.dataset.wfFilled) return;
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (n.nodeValue?.includes("paul@example.com")) {
            n.nodeValue = n.nodeValue.replace("paul@example.com", email);
            el.dataset.wfFilled = "1";
          }
        }
      });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    fillEmail();
    const mo = new MutationObserver(fillEmail);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      mo.disconnect();
    };
  }, [router]);

  return null;
}
