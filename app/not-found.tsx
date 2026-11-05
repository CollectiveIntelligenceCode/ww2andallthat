import Link from "next/link";
import { chrome } from "@/lib/wireframes";

export default function NotFound() {
  const { scope, css, header, footer } = chrome();
  return (
    <div data-wf={scope}>
     <style dangerouslySetInnerHTML={{ __html: css }} />
     <div className="page">
      <div dangerouslySetInnerHTML={{ __html: header }} />
      <section className="section">
        <div className="wrap narrow" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="kicker">404</span>
          <h1 className="h-page">That page has moved or never existed.</h1>
          <p className="sub">Try the start-here guide, or search the archive.</p>
          <div className="row"><Link className="btn primary" href="/start-here">Start here</Link><Link className="btn" href="/search/opened">Search</Link></div>
        </div>
      </section>
      <div dangerouslySetInnerHTML={{ __html: footer }} />
     </div>
    </div>
  );
}
