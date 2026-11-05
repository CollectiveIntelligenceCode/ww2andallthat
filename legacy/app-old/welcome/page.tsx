import { getMemberSession } from "@/lib/member-session";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Welcome — WW2 & All That",
  description: "You're in. Start reading James Holland's WW2 dispatches.",
};

const TIER_WELCOME: Record<string, { headline: string; body: string }> = {
  founding: {
    headline: "Welcome, Founding Member.",
    body: "You're one of the first. Your support makes this publication possible — and you now have full access to everything James writes, plus founding-only dispatches that go to no one else.",
  },
  paid: {
    headline: "Welcome, subscriber.",
    body: "You now have full access to the complete archive — every article James has written, subscriber-only essays, and monthly Q&A dispatches.",
  },
  free: {
    headline: "You're in.",
    body: "New dispatches from James Holland will arrive in your inbox the moment they publish. Every article is readable in full — no paywalls on free content.",
  },
};

const QUICK_LINKS = [
  { href: "/articles", label: "Browse all articles", desc: "The full archive" },
  { href: "/videos", label: "Watch videos", desc: "YouTube archive embedded here" },
  { href: "/podcast", label: "Listen to episodes", desc: "Audio dispatches" },
  { href: "/books", label: "James's books", desc: "The complete bibliography" },
  { href: "/events", label: "Upcoming events", desc: "Talks and appearances" },
  { href: "/profile", label: "Your record", desc: "Reading history and rank" },
];

export default async function WelcomePage() {
  const session = await getMemberSession();
  const tier = session?.tier ?? "free";
  const content = TIER_WELCOME[tier] ?? TIER_WELCOME.free;

  return (
    <div className="max-w-[760px] mx-auto px-6 py-16">

      {/* Header */}
      <header className="mb-12">
        {tier === "founding" && (
          <span className="inline-block mb-4 px-2 py-0.5 bg-[#D72638] text-white text-[9px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase">
            Founding Member
          </span>
        )}
        {tier === "paid" && (
          <span className="inline-block mb-4 px-2 py-0.5 bg-[#111111] text-white text-[9px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase">
            Paid Subscriber
          </span>
        )}
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.15] mb-5 text-balance">
          {content.headline}
        </h1>
        <p className="text-base font-[var(--font-lato)] text-[#4B5563] leading-relaxed max-w-lg">
          {content.body}
        </p>
      </header>

      {/* Start reading CTA */}
      <div className="border-t-2 border-[#111111] pt-8 mb-12">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-6">
          Start here
        </h2>
        <Link href="/articles"
          className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98] mr-4">
          Browse all articles
        </Link>
        <Link href="/profile"
          className="inline-block px-8 py-3 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
          Your reading record
        </Link>
      </div>

      {/* Quick links */}
      <div className="border-t border-[#E5E7EB] pt-8 mb-12">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-6">
          Explore the site
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="group flex items-start gap-3 p-4 border border-[#E5E7EB] hover:border-[#111111] transition-colors">
              <span className="text-[#D72638] mt-0.5 flex-shrink-0 font-[var(--font-baskerville)]">✦</span>
              <div>
                <p className="text-sm font-[var(--font-baskerville)] font-bold group-hover:text-[#D72638] transition-colors">
                  {link.label}
                </p>
                <p className="text-xs font-[var(--font-lato)] text-[#9CA3AF] mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade prompt for free members */}
      {tier === "free" && (
        <div className="border border-[#E5E7EB] p-8">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-3">
            Want more?
          </p>
          <p className="font-[var(--font-baskerville)] text-xl font-bold mb-2">Unlock the full archive.</p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-6 max-w-sm">
            Paid subscribers get every article ever written, subscriber-only essays, and monthly Q&A dispatches — £5/month or £50/year.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href={SITE_CONFIG.ghostPortalPaid} target="_blank" rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
              Upgrade to paid — £5/mo
            </Link>
            <Link href="/subscribe"
              className="inline-block px-6 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
              See all plans
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
