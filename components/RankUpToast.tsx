"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ToastData {
  newRank: string;
  count: number;
}

// Appears briefly when a reader levels up rank
export default function RankUpToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        rankUp: boolean; newRank: string; count: number;
      };
      if (!detail.rankUp) return;
      setToast({ newRank: detail.newRank, count: detail.count });
      setVisible(true);
      // Auto-dismiss after 5 seconds
      setTimeout(() => setVisible(false), 5_000);
      setTimeout(() => setToast(null), 5_400);
    };
    window.addEventListener("ww2:article-read", handler);
    return () => window.removeEventListener("ww2:article-read", handler);
  }, []);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(1rem)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Link href="/progress"
        className="flex items-center gap-4 bg-[#111111] text-white px-6 py-4 shadow-2xl border-l-4 border-[#D72638]">
        <span className="text-[#D72638] text-xl">✦</span>
        <div>
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-0.5">
            Rank up
          </p>
          <p className="text-sm font-[var(--font-baskerville)] font-bold">
            {toast.newRank}
          </p>
        </div>
        <span className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-white/40 ml-2">
          View record →
        </span>
      </Link>
    </div>
  );
}
