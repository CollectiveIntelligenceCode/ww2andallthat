import { getLatestVideos } from "@/lib/sanity";
import VideoGridWithFilter from "@/components/VideoGridWithFilter";

export const revalidate = 3600;
export const metadata = { title: "Videos" };

export default async function VideosPage() {
  const videos = await getLatestVideos(48);
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">YouTube</p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Videos</h1>
      </header>
      {videos.length === 0
        ? <p className="text-sm text-[#1A1A18]/40">No videos yet.</p>
        : <VideoGridWithFilter videos={videos} />}
    </div>
  );
}
