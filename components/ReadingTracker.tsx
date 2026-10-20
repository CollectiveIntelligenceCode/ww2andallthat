"use client";
import { useEffect } from "react";
import { markArticleRead } from "@/lib/gamification";

// Invisible component — marks article as read after 10 seconds on page
export default function ReadingTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const t = setTimeout(() => markArticleRead(slug), 10_000);
    return () => clearTimeout(t);
  }, [slug]);
  return null;
}
