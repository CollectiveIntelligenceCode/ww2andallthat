import { getFeaturedPost, getLatestPosts, getLatestVideos } from "@/lib/sanity";
import ArticleCard from "@/components/ArticleCard";
import VideoGridClient from "@/components/VideoGridClient";
import SubscribeBand from "@/components/SubscribeBand";

export const revalidate = 1800; // 30 minutes

export default async function HomePage() {
  const [hero, posts, videos] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(10),
    getLatestVideos(6),
  ]);
  const remainingPosts = posts.filter(p => p._id !== hero?._id);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      {hero && <div className="mb-12"><ArticleCard post={hero} featured /></div>}

      {/* 2-col river — becomes 3-col when podcast (phase 1.5) is added */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-6 pb-2 border-b border-black/[0.08]">
            Latest articles
          </h2>
          {remainingPosts.slice(0, 6).map(post => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
        <div>
          <h2 className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-6 pb-2 border-b border-black/[0.08]">
            Latest videos
          </h2>
          <VideoGridClient videos={videos} compact />
        </div>
      </div>

      <SubscribeBand />
    </div>
  );
}
