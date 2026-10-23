"use client";
// Mux video player component.
// Uses Mux playback ID when MUX_PUBLIC_TOKEN_ID is set in the environment.
// Falls back to YouTube embed when only a youtubeId is available.
//
// To activate: get MUX_TOKEN_ID + MUX_TOKEN_SECRET from mux.com, add to Vercel.
// Upload videos via Mux dashboard or API, pass the playbackId here.

interface MuxVideoProps {
  /** Mux playback ID — get from Mux dashboard after upload */
  muxPlaybackId?: string;
  /** YouTube video ID — fallback when no Mux ID */
  youtubeId?: string;
  title: string;
  className?: string;
}

export default function MuxVideo({ muxPlaybackId, youtubeId, title, className = "" }: MuxVideoProps) {
  if (muxPlaybackId) {
    return (
      <div className={`aspect-video w-full bg-black ${className}`}>
        {/* Mux player via web component (no npm package needed) */}
        {/* Mux player loaded as a web component — no npm package needed */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-in-document */}
        <script src="https://cdn.jsdelivr.net/npm/@mux/mux-player" type="module" async />
        <div
          dangerouslySetInnerHTML={{
            __html: `<mux-player stream-type="on-demand" playback-id="${muxPlaybackId}" metadata-video-title="${title.replace(/"/g, "&quot;")}" style="width:100%;height:100%;aspect-ratio:16/9"></mux-player>`,
          }}
        />
      </div>
    );
  }

  if (youtubeId) {
    return (
      <div className={`aspect-video w-full ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return null;
}
