import type { Video } from "@/lib/types";

export default function VideoCard({ video, onClick }: { video: Video; onClick: (v: Video) => void }) {
  const thumb = video.thumbnailUrl ?? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return (
    <button onClick={() => onClick(video)} className="text-left group w-full">
      <div className="aspect-video bg-black/5 overflow-hidden mb-3 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb} alt={video.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-sm font-[var(--font-baskerville)] font-bold leading-snug text-[#111111] group-hover:opacity-70 transition-opacity line-clamp-2">
        {video.title}
      </h3>
      {video.tags.length > 0 && (
        <p className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-[#9CA3AF] mt-1">{video.tags[0]}</p>
      )}
    </button>
  );
}
