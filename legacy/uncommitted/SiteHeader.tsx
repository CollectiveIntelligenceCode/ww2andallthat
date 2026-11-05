"use client";
import { useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="hdr">
      <div className="hdr-top">
        <button
          className="icon-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {menuOpen
              ? <path d="M6 18L18 6M6 6l12 12" />
              : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>

        <Link href="/" className="wordmark">WW2 &amp; All That</Link>

        <Link href="/start-here" className="promo-bar">
          <b>NEW HERE?</b>
          <span>Start with Fortress Malta: one essay, one film, one map, and the guide to everything else →</span>
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/search">
            <button className="icon-btn" aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </Link>
          <Link href="/join" className="btn hide-m">Log in</Link>
          <Link href="/join" className="btn primary">Subscribe</Link>
        </div>
      </div>

      <nav className="nav" aria-label="Primary">
        <Link href="/articles">Latest</Link>
        <Link href="/campaigns">Campaigns</Link>
        <Link href="/videos">Films</Link>
        <Link href="/articles?type=flagship">Essays</Link>
        <Link href="/events">Live</Link>
        <Link href="/discussions">Discussions</Link>
        <Link href="/books">Books</Link>
      </nav>

      {menuOpen && (
        <div style={{
          background: "#fff",
          borderTop: "1px solid #DDD",
          padding: "16px 24px 24px",
        }}>
          <nav aria-label="Mobile menu" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { href: "/articles", label: "Latest" },
              { href: "/campaigns", label: "Campaigns" },
              { href: "/videos", label: "Films" },
              { href: "/articles?type=flagship", label: "Essays" },
              { href: "/events", label: "Live" },
              { href: "/discussions", label: "Discussions" },
              { href: "/books", label: "Books" },
              { href: "/search", label: "Search" },
              { href: "/join", label: "Subscribe" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 0",
                  borderBottom: "1px solid #EEE",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
