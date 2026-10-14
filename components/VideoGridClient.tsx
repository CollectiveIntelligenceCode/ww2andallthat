"use client";
import { useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import type { Video } from "@/lib/types";

export default function VideoGridClient({ videos, compact = false }: { videos: Video[]; compact?: boolean }) {
  const [active, setActive] = useState<Video | null>(null);
  return (
    <>
      <div className={compact
        ? "flex flex-col gap-5"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      }>
        {videos.map(v => <VideoCard key={v._id} video={v} onClick={setActive} />)}
      </div>
      {active && <VideoModal video={active} onClose={() => setActive(null)} />}
    </>
  );
}
