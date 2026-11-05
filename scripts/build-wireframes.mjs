// Converts Paul's scoping-pack wireframes (docs/scoping/02 Wireframes) into:
//   lib/wireframes/pages/<file>.html   body fragments, links rewritten to site routes
//   app/wireframe.css                  union of every wireframe stylesheet, deduped by rule
// Run: node scripts/build-wireframes.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FILE_TO_ROUTE } from "../lib/wireframes/route-map.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "docs/scoping/02 Wireframes (responsive HTML)");
const outPages = path.join(root, "lib/wireframes/pages");
fs.mkdirSync(outPages, { recursive: true });

// Split CSS into top-level rules (handles @container { ... } nesting).
function splitRules(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  let depth = 0, start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) { rules.push(css.slice(start, i + 1).trim()); start = i + 1; }
    }
  }
  return rules.filter(Boolean);
}

const missing = new Set();
let pages = 0;

// Each wireframe's CSS is scoped to its own wrapper with CSS nesting, so rules from
// different pages (which reuse class names with different values) can never collide.
const BASE_ONLY = /^(html|body)\s*\{/;

for (const file of fs.readdirSync(src).sort()) {
  if (!file.endsWith(".html") || file === "index.html") continue;
  const name = file.replace(/\.html$/, "");
  const html = fs.readFileSync(path.join(src, file), "utf8");

  const rules = [];
  for (const m of html.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
    for (const r of splitRules(m[1])) if (!BASE_ONLY.test(r)) rules.push(r);
  }
  const css = `[data-wf="${name}"]{${rules.join("\n")}}`;

  let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  body = body.replace(/<script[\s\S]*?<\/script>/g, "");
  body = body.replace(/href="([^"#]+\.html)(#[^"]*)?"/g, (_, f, hash = "") => {
    const route = FILE_TO_ROUTE[f];
    if (!route) { missing.add(`${file} -> ${f}`); return `href="#"`; }
    return `href="${route}${hash}"`;
  });
  fs.writeFileSync(path.join(outPages, file), body.trim() + "\n");
  fs.writeFileSync(path.join(outPages, `${name}.css`), css + "\n");
  pages++;
}

fs.writeFileSync(path.join(root, "app/wireframe.css"), "/* Per-page wireframe CSS is inlined with each page, scoped by [data-wf]. */\nbody{margin:0}\n");
console.log(`pages: ${pages}`);
if (missing.size) console.log("UNMAPPED LINKS:\n" + [...missing].join("\n"));
