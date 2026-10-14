"use client";
import Link from "next/link";
import { useState } from "react";

// Podcast omitted from nav — page is phase 1.5 (pending RSS feed URL from Paul)
const LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/videos", label: "Videos" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF8] border-b border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-[var(--font-playfair)] text-lg font-semibold tracking-tight text-[#1A1A18]">
          WW2 &amp; All That
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors">
              {l.label}
            </Link>
          ))}
          <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
            className="ml-2 px-4 py-1.5 text-sm font-medium bg-[#1A1A18] text-[#FAFAF8] rounded-sm hover:bg-[#1A1A18]/80 transition-colors">
            Subscribe
          </a>
        </div>
        <button className="md:hidden text-sm text-[#1A1A18]/60" onClick={() => setOpen(o => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-black/[0.06] bg-[#FAFAF8]">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-[#1A1A18]/70 border-b border-black/[0.04]">
              {l.label}
            </Link>
          ))}
          <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
            className="block px-6 py-3 text-sm font-medium text-[#1A1A18]">
            Subscribe →
          </a>
        </div>
      )}
    </nav>
  );
}
