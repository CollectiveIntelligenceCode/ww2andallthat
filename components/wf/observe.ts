// Wireframe fragments are injected as plain HTML and replaced whenever the page
// state changes, so enhancers must be safe to run repeatedly. `apply` has to be
// idempotent: it should only touch the DOM when something actually needs to change.
export function observeWf(apply: () => void): () => void {
  apply();
  let t: number | undefined;
  const mo = new MutationObserver(() => {
    window.clearTimeout(t);
    t = window.setTimeout(apply, 50);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    mo.disconnect();
    window.clearTimeout(t);
  };
}

const SECTIONS = ["latest", "campaigns", "films", "essays", "live", "discussions", "books"];

/** The header menu opens on the section you are in, and on Latest anywhere else. */
export function menuFor(pathname: string): string {
  const s = pathname.split("/")[1];
  return `/menus/${SECTIONS.includes(s) ? s : "latest"}`;
}

/** Plays the exit animation on the open menu or search, then runs `go`. */
export function leave(go: () => void) {
  const root = document.querySelector("[data-wf]");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!root || calm) { go(); return; }
  root.classList.add("wf-leaving");
  window.setTimeout(go, 150);
}
