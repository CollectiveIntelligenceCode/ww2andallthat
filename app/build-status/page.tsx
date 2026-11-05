import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/wireframes";

export const metadata: Metadata = { title: "Build status" };

const uniq = (f: { v: string; f: string; m: string }) => [...new Set([f.v, f.f, f.m])];

export default function BuildStatus() {
  const sections = [...new Set(ROUTES.map((r) => r.section))];
  const files = new Set(ROUTES.flatMap((r) => uniq(r.files)));
  return (
    <div className="page">
      <section className="section"><div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <span className="kicker">Build status · vanilla build</span>
          <h1 className="h-page">Every wireframe, built</h1>
          <p className="sub" style={{ marginTop: 8 }}>{files.size} of 73 wireframe files from the scoping pack are live across {ROUTES.length} routes. Use the “Preview as” bar (bottom right) to switch between visitor, free subscriber and member.</p>
        </div>
        {sections.map((s) => (
          <div key={s}>
            <div className="sec-head"><h2>{s}</h2></div>
            <table className="plain"><thead><tr><th>Page</th><th>Route</th><th>Wireframe file(s)</th></tr></thead><tbody>
              {ROUTES.filter((r) => r.section === s).map((r) => (
                <tr key={r.path}><td>{r.title}</td><td><Link href={`/${r.path}`}>/{r.path}</Link></td><td className="meta">{uniq(r.files).join(", ")}</td></tr>
              ))}
            </tbody></table>
          </div>
        ))}
      </div></section>
    </div>
  );
}
