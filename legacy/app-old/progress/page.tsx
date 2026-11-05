"use client";
import { useState, useEffect } from "react";
import { getRank, getNextRank, getReadArticles, getStreak, RANKS } from "@/lib/gamification";
import Link from "next/link";

const CAMPAIGNS = [
  { name: "First Dispatch",    target: 1,   medal: "✦",   colour: "text-[#9CA3AF]"  },
  { name: "On Active Duty",    target: 5,   medal: "✦✦",  colour: "text-[#6B7280]"  },
  { name: "Veteran Historian", target: 10,  medal: "✦✦✦", colour: "text-[#4B5563]"  },
  { name: "Seasoned Analyst",  target: 25,  medal: "✧✦✦", colour: "text-[#D97706]"  },
  { name: "Theatre Commander", target: 50,  medal: "✧✧✦", colour: "text-[#D72638]"  },
  { name: "Field Marshal",     target: 150, medal: "✧✧✧", colour: "text-[#111111]"  },
];

export default function ProgressPage() {
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCount(getReadArticles().length);
    setStreak(getStreak());
    setHydrated(true);
    const interval = setInterval(() => {
      setCount(getReadArticles().length);
      setStreak(getStreak());
    }, 5_000);
    return () => clearInterval(interval);
  }, []);

  const rank = getRank(count);
  const next = getNextRank(count);
  const progress = next ? Math.round((count / next.min) * 100) : 100;

  if (!hydrated) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="h-40 bg-[#F3F4F6] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">

      {/* Header */}
      <header className="mb-12 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Field record
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Your campaign</h1>
      </header>

      {/* Rank card */}
      <div className="bg-[#111111] text-white p-8 md:p-12 mb-12 max-w-[640px]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-3">
          Current rank
        </p>
        <h2 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold mb-2">
          {rank.name}
        </h2>
        <p className="text-sm font-[var(--font-lato)] text-white/50 mb-8">
          {count} {count === 1 ? "dispatch" : "dispatches"} filed
        </p>

        {/* Progress bar */}
        {next && (
          <div>
            <div className="flex justify-between text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-white/40 mb-2">
              <span>{rank.name}</span>
              <span>{next.name} — {next.min} dispatches</span>
            </div>
            <div className="h-1 bg-white/10 w-full">
              <div
                className="h-full bg-[#D72638] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-[var(--font-barlow)] text-white/30 tracking-wide mt-2">
              {next.min - count} more {next.min - count === 1 ? "dispatch" : "dispatches"} to {next.name}
            </p>
          </div>
        )}
        {!next && (
          <p className="text-[10px] font-[var(--font-barlow)] text-[#D72638] tracking-widest uppercase">
            Maximum rank achieved ✦
          </p>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#E5E7EB] border border-[#E5E7EB] mb-12 max-w-[640px]">
        {[
          { label: "Dispatches read", value: count },
          { label: "Reading streak", value: `${streak}d` },
          { label: "Rank", value: rank.name },
        ].map(stat => (
          <div key={stat.label} className="bg-white px-6 py-5">
            <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-[#9CA3AF]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Campaign medals */}
      <section className="border-t-2 border-[#111111] pt-10 mb-12">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
          Theatre medals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-[640px]">
          {CAMPAIGNS.map(c => {
            const earned = count >= c.target;
            return (
              <div key={c.name}
                className={`border p-5 transition-colors ${earned ? "border-[#111111]" : "border-[#E5E7EB] opacity-50"}`}>
                <span className={`text-2xl block mb-2 ${earned ? c.colour : "text-[#E5E7EB]"}`}>
                  {c.medal}
                </span>
                <p className={`text-xs font-[var(--font-baskerville)] font-bold leading-snug mb-1 ${earned ? "text-[#111111]" : "text-[#9CA3AF]"}`}>
                  {c.name}
                </p>
                <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
                  {earned ? "Earned" : `${c.target} dispatches`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rank table */}
      <section className="border-t-2 border-[#111111] pt-10 mb-12 max-w-[640px]">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-6">
          Rank progression
        </h2>
        <div className="space-y-0">
          {RANKS.map(r => {
            const active = getRank(count).name === r.name;
            return (
              <div key={r.name}
                className={`flex items-center justify-between py-3 border-b border-[#F3F4F6] ${active ? "bg-[#FFF5F5]" : ""}`}>
                <div className="flex items-center gap-3">
                  {active && <span className="w-1.5 h-1.5 bg-[#D72638] rounded-full flex-shrink-0" />}
                  {!active && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                  <span className={`text-sm font-[var(--font-baskerville)] ${active ? "font-bold text-[#D72638]" : count >= r.min ? "text-[#111111]" : "text-[#9CA3AF]"}`}>
                    {r.name}
                  </span>
                </div>
                <span className="text-[10px] font-[var(--font-barlow)] tracking-widest text-[#9CA3AF]">
                  {r.min === 0 ? "—" : `${r.min} dispatches`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA — keep reading */}
      {count === 0 ? (
        <div className="max-w-[480px]">
          <p className="font-[var(--font-baskerville)] text-xl font-bold mb-3">Start your field record</p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-6">
            Read your first article to earn Private rank and begin tracking your progress.
          </p>
          <Link href="/articles"
            className="inline-block px-8 py-3 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
            Read an article
          </Link>
        </div>
      ) : (
        <div className="max-w-[480px]">
          <p className="font-[var(--font-baskerville)] text-xl font-bold mb-3">Keep advancing</p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-6">
            {next ? `${next.min - count} more ${next.min - count === 1 ? "dispatch" : "dispatches"} until you reach ${next.name}.` : "You've reached the highest rank."}
          </p>
          <Link href="/articles"
            className="inline-block px-8 py-3 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
            Read more articles
          </Link>
        </div>
      )}

    </div>
  );
}
