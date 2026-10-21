"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getRank, getReadArticles } from "@/lib/gamification";

// Shows reader's current WW2 rank in the nav — only appears after first article read
export default function RankDisplay() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getReadArticles().length);

    const refresh = () => setCount(getReadArticles().length);

    // Instant update when article read fires in this tab
    window.addEventListener("ww2:article-read", refresh);
    // Cross-tab sync via storage event
    window.addEventListener("storage", refresh);
    // Fallback poll
    const poll = setInterval(refresh, 15_000);

    return () => {
      window.removeEventListener("ww2:article-read", refresh);
      window.removeEventListener("storage", refresh);
      clearInterval(poll);
    };
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
