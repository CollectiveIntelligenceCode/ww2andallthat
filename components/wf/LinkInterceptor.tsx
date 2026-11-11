"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { menuFor } from "./observe";

// Wireframe fragments are plain HTML. This gives them client-side navigation and
// wires the header's menu and search buttons to the menu and search wireframes.
export default function LinkInterceptor() {
  const router = useRouter();
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const t = e.target as HTMLElement;
      const btn = t.closest("button[aria-label]");
      if (btn) {
        const l = btn.getAttribute("aria-label");
        if (l === "Open menu") { e.preventDefault(); router.push(menuFor(window.location.pathname)); return; }
        if (l === "Search") { e.preventDefault(); router.push("/search/opened"); return; }
      }
      const a = t.closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target === "_blank") return;
      e.preventDefault();
      router.push(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);
  return null;
}
