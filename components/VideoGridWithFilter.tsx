"use client";
import { useState, useMemo } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import type { Video } from "@/lib/types";

export default function VideoGridWithFilter({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    videos.forEach(v => v.tags.forEach(t => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [videos]);

  const filtered = filter === "All" ? videos : videos.filter(v => v.tags.includes(filter));

  return (
    <>
      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)}
              className={`px-3 py-1 text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase border transition-colors ${
                filter === tag
                  ? "bg-[#111111] text-white border-[#111111]"
                  : "bg-transparent text-[#6B7280] border-[#E5E7EB] hover:border-[#111111] hover:text-[#111111]"
              }`}>
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(v => <VideoCard key={v._id} video={v} onClick={setActive} />)}
        {filtered.length === 0 && (
          <p className="text-sm text-[#1A1A18]/40 col-span-3">No videos for this filter.</p>
        )}
      </div>

      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </>
  );
}
