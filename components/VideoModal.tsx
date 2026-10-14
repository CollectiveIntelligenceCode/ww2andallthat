"use client";
import { useEffect } from "react";
import type { Video } from "@/lib/types";

export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}>
      <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="w-full h-full"
          />
        </div>
        <div className="flex items-start justify-between mt-3">
          <p className="text-sm text-white/80 leading-snug max-w-lg">{video.title}</p>
          <button onClick={onClose} className="text-white/60 hover:text-white text-sm ml-4 flex-shrink-0">
            Close ✕
          </button>
        </div>
      </div>
    </div>
  );
}
