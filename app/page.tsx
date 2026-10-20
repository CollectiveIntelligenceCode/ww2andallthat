import { getFeaturedPost, getLatestPosts, getLatestVideos } from "@/lib/sanity";
import ArticleCard from "@/components/ArticleCard";
import VideoGridClient from "@/components/VideoGridClient";
import SubscribeBand from "@/components/SubscribeBand";
import Link from "next/link";
import type { Post } from "@/lib/types";

export const revalidate = 1800;

function SecondTierCard({ post }: { post: Post }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
  return (
    <article className="group">
      <div className="aspect-video overflow-hidden mb-3 bg-[#F3F4F6]">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-[#F3F4F6] flex items-end p-4">
            <span className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-[#9CA3AF]">
              WW2 &amp; All That
            </span>
          </div>
        )}
      </div>
      <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
        {post.isPaid ? "Subscriber" : "Analysis"}
      </span>
      <h3 className="font-[var(--font-baskerville)] text-[1.05rem] font-bold leading-snug mt-1.5 mb-2">
        <Link href={`/articles/${post.slug.current}`} className="article-title-link">
          {post.title}
        </Link>
      </h3>
      <p className="text-[10px] font-[var(--font-barlow)] tracking-wide uppercase text-[#9CA3AF]">
        {date} · James Holland
      </p>
    </article>
  );
}

export default async function HomePage() {
  const [hero, posts, videos] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(14),
    getLatestVideos(6),
  ]);
  const remainingPosts = posts.filter(p => p._id !== hero?._id);
  const secondTier = remainingPosts.slice(0, 3);
  const riverPosts = remainingPosts.slice(3);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">

      {/* Hero — dominant story */}
      {hero && <ArticleCard post={hero} featured />}

      {/* Second tier — 3 stories with images */}
      {secondTier.length > 0 && (
        <section className="border-b border-[#E5E7EB] pb-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {secondTier.map(post => <SecondTierCard key={post._id} post={post} />)}
          </div>
        </section>
      )}

      {/* Latest river + video sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-5 pb-2 border-b-2 border-[#111111]">
            Latest
          </h2>
          {riverPosts.slice(0, 8).map(post => (
            <ArticleCard key={post._id} post={post} />
          ))}
        </div>
        <div>
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-5 pb-2 border-b-2 border-[#111111]">
            Videos
          </h2>
          <VideoGridClient videos={videos} compact />
        </div>
      </div>

      <SubscribeBand />
    </div>
  );
}
