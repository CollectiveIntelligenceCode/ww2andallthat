"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getRank, getNextRank, getReadArticles, getStreak, RANKS } from "@/lib/gamification";
import type { MemberTier } from "@/lib/types";

const MEDALS = [
  { name: "First Dispatch",    target: 1,   symbol: "✦",   detail: "Filed your first report" },
  { name: "On Active Duty",    target: 5,   symbol: "✦✦",  detail: "5 dispatches filed" },
  { name: "Veteran Historian", target: 10,  symbol: "✦✦✦", detail: "10 dispatches filed" },
  { name: "Seasoned Analyst",  target: 25,  symbol: "✧✦✦", detail: "25 dispatches filed" },
  { name: "Theatre Commander", target: 50,  symbol: "✧✧✦", detail: "50 dispatches filed" },
  { name: "Field Marshal",     target: 150, symbol: "✧✧✧", detail: "150 dispatches filed" },
];

const TIER_LABELS: Record<MemberTier, string> = {
  founding: "Founding Member",
  paid: "Paid Subscriber",
  free: "Free Member",
};

const TIER_DESCRIPTIONS: Record<MemberTier, string> = {
  founding: "You are a Founding Member. Full archive, all content types, and early access to new material.",
  paid: "Full archive access and all subscriber-only content.",
  free: "You have a free membership. Subscribe to unlock the full archive.",
};

export default function ProfilePage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<{ email: string | null; tier: MemberTier | null }>({ email: null, tier: null });

  useEffect(() => {
    const load = () => {
      setSlugs(getReadArticles());
      setStreak(getStreak());
    };
    load();
    setHydrated(true);
    window.addEventListener("ww2:article-read", load);
    const poll = setInterval(load, 10_000);

    fetch("/api/ghost/session")
      .then(r => r.json())
      .then(data => setSession(data))
      .catch(() => {});

    return () => { window.removeEventListener("ww2:article-read", load); clearInterval(poll); };
  }, []);

  const count = slugs.length;
  const rank = getRank(count);
  const next = getNextRank(count);
  const progress = next ? Math.min(100, Math.round((count / next.min) * 100)) : 100;

  if (!hydrated) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="h-40 bg-[#F3F4F6] animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">

      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#9CA3AF] mb-2">
          Members area
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Your record</h1>
          {session.tier && (
            <span className={`text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase px-2 py-0.5 ${session.tier === "founding" ? "bg-[#D72638] text-white" : session.tier === "paid" ? "bg-[#111111] text-white" : "border border-[#E5E7EB] text-[#6B7280]"}`}>
              {TIER_LABELS[session.tier]}
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left — rank + stats */}
        <div className="lg:col-span-2">

          {/* Rank card */}
          <div className="bg-[#111111] text-white p-8 mb-8">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#D72638] mb-3">
              Current rank
            </p>
            <h2 className="font-[var(--font-baskerville)] text-4xl font-bold mb-1">{rank.name}</h2>
            <p className="text-sm font-[var(--font-lato)] text-white/40 mb-6">
              {count} {count === 1 ? "dispatch" : "dispatches"} filed
            </p>
            {next ? (
              <div>
                <div className="flex justify-between text-[10px] font-[var(--font-barlow)] tracking-widets uppercase text-white/30 mb-2">
                  <span>{rank.name}</span>
                  <span>{next.name} at {next.min}</span>
                </div>
                <div className="h-1 bg-white/10 w-full mb-2">
                  <div className="h-full bg-[#D72638] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] font-[var(--font-barlow)] text-white/25 tracking-wide">
                  {next.min - count} more to reach {next.name}
                </p>
              </div>
            ) : (
              <p className="text-[10px] font-[var(--font-barlow)] text-[#D72638] tracking-widets uppercase">
                Maximum rank achieved ✦
              </p>
            )}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-px bg-[#E5E7EB] border border-[#E5E7EB] mb-10">
            {[
              { label: "Dispatches read", value: count },
              { label: "Day streak", value: streak > 0 ? `${streak}d` : "—" },
              { label: "Rank", value: rank.name },
            ].map(s => (
              <div key={s.label} className="bg-white px-5 py-4">
                <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-0.5">{s.value}</p>
                <p className="text-[10px] font-[var(--font-barlow)] tracking-widets uppercase text-[#9CA3AF]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Reading history */}
          <section className="border-t-2 border-[#111111] pt-8 mb-10">
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-5">
              Reading history — {count} {count === 1 ? "article" : "articles"}
            </h2>
            {count === 0 ? (
              <div>
                <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-5">
                  No articles read yet. Articles are tracked locally in your browser after 10 seconds of reading.
                </p>
                <Link href="/articles"
                  className="inline-block px-6 py-2.5 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
                  Start reading
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {slugs.map(slug => (
                  <Link key={slug} href={`/articles/${slug}`}
                    className="group flex items-center justify-between py-3 border-b border-[#F3F4F6] hover:bg-[#FAFAFA] -mx-4 px-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[#D72638] text-xs">✦</span>
                      <span className="text-sm font-[var(--font-lato)] text-[#111111] group-hover:text-[#D72638] transition-colors">
                        {slug.replace(/-/g, " ")}
                      </span>
                    </div>
                    <span className="text-[10px] font-[var(--font-barlow)] tracking-widets uppercase text-[#9CA3AF]">
                      Read →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Rank progression */}
          <section className="border-t-2 border-[#111111] pt-8">
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-5">
              Rank progression
            </h2>
            <div className="space-y-0 max-w-[480px]">
              {RANKS.map(r => {
                const active = rank.name === r.name;
                const achieved = count >= r.min;
                return (
                  <div key={r.name}
                    className={`flex items-center justify-between py-3 border-b border-[#F3F4F6] ${active ? "bg-[#FFF5F5] -mx-4 px-4" : ""}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-[#D72638]" : achieved ? "bg-[#E5E7EB]" : "bg-transparent border border-[#E5E7EB]"}`} />
                      <span className={`text-sm font-[var(--font-baskerville)] ${active ? "font-bold text-[#D72638]" : achieved ? "text-[#111111]" : "text-[#9CA3AF]"}`}>
                        {r.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-[var(--font-barlow)] tracking-widets text-[#9CA3AF]">
                      {r.min === 0 ? "Start" : `${r.min}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right sidebar — subscription + medals */}
        <aside className="space-y-10">

          {/* Subscription management */}
          <div>
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-5 pb-2 border-b-2 border-[#111111]">
              Subscription
            </h2>
            {session.email ? (
              <>
                <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] mb-1">{session.email}</p>
                {session.tier && (
                  <p className="text-sm font-[var(--font-lato)] text-[#4B5563] leading-relaxed mb-5">
                    {TIER_DESCRIPTIONS[session.tier]}
                  </p>
                )}
                <div className="space-y-3">
                  {session.tier !== "founding" && (
                    <Link href="/join"
                      className="block text-center px-5 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
                      {session.tier === "free" ? "Upgrade to paid — £5/mo" : "Become a Founding Member"}
                    </Link>
                  )}
                  <form action="/api/ghost/signout" method="POST">
                    <button type="submit"
                      className="w-full text-center px-5 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
                      Sign out
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-5">
                  Sign in to access your subscription, unlock paid content, and sync your reading history.
                </p>
                <div className="space-y-3">
                  <Link href="/member/signin"
                    className="block text-center px-5 py-2.5 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
                    Sign in
                  </Link>
                  <Link href="/join"
                    className="block text-center px-5 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
                    Subscribe — £5/month
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Medals */}
          <div>
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-5 pb-2 border-b-2 border-[#111111]">
              Theatre medals
            </h2>
            <div className="space-y-3">
              {MEDALS.map(m => {
                const earned = count >= m.target;
                return (
                  <div key={m.name}
                    className={`flex items-start gap-3 p-3 border transition-colors ${earned ? "border-[#111111]" : "border-[#E5E7EB] opacity-50"}`}>
                    <span className={`text-base flex-shrink-0 mt-0.5 ${earned ? "text-[#D72638]" : "text-[#E5E7EB]"}`}>
                      {m.symbol}
                    </span>
                    <div>
                      <p className={`text-xs font-[var(--font-baskerville)] font-bold leading-snug ${earned ? "text-[#111111]" : "text-[#9CA3AF]"}`}>
                        {m.name}
                      </p>
                      <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF] mt-0.5">
                        {earned ? "Earned" : m.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset option */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#9CA3AF] mb-2">
              Reset record
            </p>
            <p className="text-xs font-[var(--font-lato)] text-[#9CA3AF] mb-3 leading-relaxed">
              Clears all reading history and rank from this browser. This cannot be undone.
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && confirm("Reset your reading record? This cannot be undone.")) {
                  localStorage.removeItem("ww2_read");
                  localStorage.removeItem("ww2_streak");
                  setSlugs([]);
                  setStreak(0);
                }
              }}
              className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors underline underline-offset-2">
              Clear record
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
