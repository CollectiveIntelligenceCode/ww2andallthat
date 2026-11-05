import Link from "next/link";

const NAV_LINKS = [
  { href: "/articles", label: "Latest" },
  { href: "/search", label: "Search" },
  { href: "/start-here", label: "Start here" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/discussions", label: "Discussions" },
  { href: "/videos", label: "Films" },
  { href: "/articles?type=flagship", label: "Essays" },
  { href: "/events", label: "Live" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/books", label: "Books" },
  { href: "/downloads", label: "Downloads" },
  { href: "/audio", label: "Audio" },
  { href: "/join", label: "Membership" },
  { href: "/gift", label: "Give a year" },
];

export default function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="ftr-in">
        <div className="statement">History told straight.</div>

        <div className="ftr-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </div>

        <div className="ftr-bottom">
          <div style={{ display: "flex", gap: 12 }} aria-label="Social media">
            {["YouTube", "Instagram", "X", "Substack"].map(name => (
              <span
                key={name}
                aria-label={name}
                style={{ width: 28, height: 28, border: "1px solid #666", borderRadius: "50%", display: "inline-block" }}
              />
            ))}
          </div>
          <div>
            &copy; {new Date().getFullYear()} James Holland WW2 Ltd
            {" · "}
            <Link href="/privacy" style={{ color: "#BBBBBB" }}>Privacy</Link>
            {" · "}
            <Link href="/terms" style={{ color: "#BBBBBB" }}>Terms</Link>
            {" · "}
            <Link href="/refunds" style={{ color: "#BBBBBB" }}>Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
