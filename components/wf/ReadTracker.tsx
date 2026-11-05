"use client";
import { useEffect } from "react";
import { markArticleRead } from "@/lib/gamification";

// Counts an essay as read once the page has been open for about 8 seconds.
export default function ReadTracker() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const m = location.pathname.match(/^\/essays\/([^/?#]+)/);
        if (m) markArticleRead(decodeURIComponent(m[1]));
      } catch {}
    }, 8000);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
