"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/articles", label: "Articles" },
  { href: "/videos", label: "Videos" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" },
];

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#111111]">
      {/* Masthead */}
      <div className="border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <span className="hidden md:block text-[11px] font-[var(--font-barlow)] font-medium tracking-widest uppercase text-[#9CA3AF] whitespace-nowrap">
            {todayLabel()}
          </span>
          <Link href="/"
            className="font-[var(--font-baskerville)] text-2xl md:text-[1.75rem] font-bold tracking-tight text-[#111111] text-center flex-1 md:flex-none leading-none">
            WW2 &amp; All That
          </Link>
          <div className="flex items-center">
            <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
              className="hidden md:inline-block px-4 py-1.5 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase bg-[#D72638] text-white hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
              Subscribe
            </a>
            <button
              className="md:hidden text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] px-2 py-1"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "Close menu" : "Open menu"}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Nav category strip */}
      <nav aria-label="Main navigation" className="hidden md:block">
        <div className="max-w-[1200px] mx-auto px-6 h-9 flex items-center gap-7">
          {LINKS.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link key={l.href} href={l.href}
                className={`text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase transition-colors
                  ${active ? "text-[#D72638]" : "text-[#111111] hover:text-[#D72638]"}`}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-6 py-3 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] border-b border-[#E5E7EB] hover:text-[#D72638] transition-colors">
              {l.label}
            </Link>
          ))}
          <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
            className="block px-6 py-3 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
            Subscribe →
          </a>
        </div>
      )}
    </header>
  );
}
