"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { observeWf, leave } from "./observe";

// Site-wide behaviour for the wireframe header and menus:
// - skip link and a focusable main landmark
// - the current section is marked in the primary nav (aria-current and .on)
// - on the menu pages, the close icon and the Search chip are real controls,
//   and Escape closes the menu
export default function ChromeEnhancer() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const close = () => leave(() => {
      if (window.history.length > 1) router.back();
      else router.push("/");
    });

    const stop = observeWf(() => {
      const root = document.querySelector("[data-wf]");
      const main = document.querySelector("main");
      if (main && !main.id) {
        main.id = "main-content";
        main.tabIndex = -1;
      }
      if (root && main && !root.querySelector(".skip-link")) {
        const a = document.createElement("a");
        a.className = "skip-link";
        a.href = "#main-content";
        a.textContent = "Skip to main content";
        a.addEventListener("click", (e) => {
          e.preventDefault();
          main.focus();
          main.scrollIntoView();
        });
        root.prepend(a);
      }

      // Current section in the primary nav
      const here = path.split("/")[1] ?? "";
      document.querySelectorAll<HTMLAnchorElement>("nav.nav a").forEach((a) => {
        const seg = (a.getAttribute("href") ?? "").split("/")[1];
        const current = !!here && seg === here;
        if (current && a.getAttribute("aria-current") !== "page") a.setAttribute("aria-current", "page");
        if (!current && a.hasAttribute("aria-current")) a.removeAttribute("aria-current");
        a.classList.toggle("on", current);
      });

      // Menu pages
      if (path.startsWith("/menus/")) {
        const x = document.querySelector<HTMLElement>(".rail-top .x");
        if (x && !x.dataset.enh) {
          x.dataset.enh = "1";
          x.setAttribute("role", "button");
          x.setAttribute("aria-label", "Close menu");
          x.tabIndex = 0;
          x.style.cursor = "pointer";
          x.addEventListener("click", close);
          x.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); close(); }
          });
        }
        const search = document.querySelector<HTMLElement>(".pane-top .btn.quiet");
        if (search && !search.dataset.enh) {
          search.dataset.enh = "1";
          search.setAttribute("role", "link");
          search.tabIndex = 0;
          search.style.cursor = "pointer";
          const go = () => router.push("/search/opened");
          search.addEventListener("click", go);
          search.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); go(); }
          });
        }
      }
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && path.startsWith("/menus/")) close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      stop();
      document.removeEventListener("keydown", onKey);
    };
  }, [path, router]);

  return null;
}
