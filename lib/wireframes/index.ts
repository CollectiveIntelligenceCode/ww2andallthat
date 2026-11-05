import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./route-map.mjs";

import { STATES, STATE_COOKIE, type ViewerState } from "./states";
export { STATES, STATE_COOKIE };
export type { ViewerState };

export { ROUTES };

export function findRoute(slug: string[] | undefined) {
  const p = (slug ?? []).join("/");
  return ROUTES.find((r) => r.path === p);
}

/** Scoped page: <div data-wf=name><style>…</style>body</div> */
export function readFragment(file: string): string {
  const dir = path.join(process.cwd(), "lib/wireframes/pages");
  const body = fs.readFileSync(path.join(dir, `${file}.html`), "utf8");
  const css = fs.readFileSync(path.join(dir, `${file}.css`), "utf8");
  return `<div data-wf="${file}"><style>${css}</style>${body}</div>`;
}

export function parseState(v: string | undefined): ViewerState {
  return v === "f" || v === "m" ? v : "v";
}

/** Header and footer from the home wireframe, for pages outside the wireframe set (legal, 404). */
export function chrome() {
  const dir = path.join(process.cwd(), "lib/wireframes/pages");
  const scope = "home--visitor";
  const body = fs.readFileSync(path.join(dir, `${scope}.html`), "utf8");
  const css = fs.readFileSync(path.join(dir, `${scope}.css`), "utf8");
  return {
    scope,
    css,
    header: body.match(/<header class="hdr">[\s\S]*?<\/header>/)?.[0] ?? "",
    footer: body.match(/<footer class="ftr">[\s\S]*?<\/footer>/)?.[0] ?? "",
  };
}
