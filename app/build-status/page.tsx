import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES, chrome } from "@/lib/wireframes";

export const metadata: Metadata = { title: "Build status" };

// How far each route goes beyond the wireframe. Everything else is the wireframe as built.
type Level = "Real content" | "Working feature" | "Wireframe";
function levelOf(path: string): { level: Level; note: string } {
  if (path === "" || path === "latest" || path === "essays") return { level: "Real content", note: "Ghost essays, images and access labels" };
  if (path.startsWith("search")) return { level: "Working feature", note: "Live search across all essays" };
  if (path.startsWith("sign-in")) return { level: "Working feature", note: "Ghost magic-link sign-in" };
  if (path === "quizzes" || path === "quizzes/result") return { level: "Working feature", note: "Playable quiz and score" };
  if (path.startsWith("gift")) return { level: "Working feature", note: "Form flow (payment comes with Stripe)" };
  if (path === "account/refer" || path === "account/badges" || path === "account") return { level: "Working feature", note: "Uses the signed-in member's data" };
  return { level: "Wireframe", note: "Built to the wireframe; content to come" };
}
const tone = { "Real content": "free", "Working feature": "members", Wireframe: "" } as const;

const uniq = (f: { v: string; f: string; m: string }) => [...new Set([f.v, f.f, f.m])];

export default function BuildStatus() {
  const sections = [...new Set(ROUTES.map((r) => r.section))];
  const files = new Set(ROUTES.flatMap((r) => uniq(r.files)));
  const { scope, css, header, footer } = chrome();
  return (
    <div data-wf={scope}>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    <div className="page">
      <div dangerouslySetInnerHTML={{ __html: header }} />
      <section className="section"><div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <span className="kicker">Build status · vanilla build</span>
          <h1 className="h-page">Every wireframe, built</h1>
          <p className="sub" style={{ marginTop: 8 }}>{files.size} of 73 wireframe files from the scoping pack are live across {ROUTES.length} routes. Essays on the home, Latest and Essays pages are real Ghost content, and search, sign-in, quizzes, gifts and the account pages are working features. Use the “Preview as” bar (bottom right) to switch between visitor, free subscriber and member.</p>
        </div>
        {sections.map((s) => (
          <div key={s}>
            <div className="sec-head"><h2>{s}</h2></div>
            <table className="plain"><thead><tr><th>Page</th><th>Route</th><th>Wireframe file(s)</th><th>Status</th></tr></thead><tbody>
              {ROUTES.filter((r) => r.section === s).map((r) => (
                <tr key={r.path}><td>{r.title}</td><td><Link href={`/${r.path}`}>/{r.path}</Link></td><td className="meta">{uniq(r.files).join(", ")}</td><td><span className={`tag ${tone[levelOf(r.path).level]}`}>{levelOf(r.path).level}</span> <span className="meta">{levelOf(r.path).note}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        ))}
      </div></section>
      <div dangerouslySetInnerHTML={{ __html: footer }} />
    </div>
    </div>
  );
}
