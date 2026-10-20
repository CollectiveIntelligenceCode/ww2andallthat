"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getRank, getReadArticles } from "@/lib/gamification";

// Shows reader's current WW2 rank in the nav — only appears after first article read
export default function RankDisplay() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getReadArticles().length);
    // Refresh when storage changes (e.g. user reads an article in another tab)
    const handler = () => setCount(getReadArticles().length);
    window.addEventListener("storage", handler);
    // Also poll every 15s in case ReadingTracker fires in same tab
    const poll = setInterval(handler, 15_000);
    return () => { window.removeEventListener("storage", handler); clearInterval(poll); };
  }, []);

  if (count === 0) return null;

  const rank = getRank(count);
  return (
    <Link href="/progress"
      className="hidden lg:flex items-center gap-1.5 text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors ml-auto">
      <span className="text-[#D72638]">✦</span>
      <span>{rank.name}</span>
    </Link>
  );
}
