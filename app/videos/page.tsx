import { getLatestVideos } from "@/lib/sanity";
import VideoGridWithFilter from "@/components/VideoGridWithFilter";

export const revalidate = 3600;
export const metadata = { title: "Videos" };

export default async function VideosPage() {
  const videos = await getLatestVideos(48);
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-6 border-b border-black/[0.08]">
        <p className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-2">YouTube</p>
        <h1 className="font-[var(--font-playfair)] text-4xl font-semibold">Videos</h1>
      </header>
      {videos.length === 0
        ? <p className="text-sm text-[#1A1A18]/40">No videos yet.</p>
        : <VideoGridWithFilter videos={videos} />}
    </div>
  );
}
