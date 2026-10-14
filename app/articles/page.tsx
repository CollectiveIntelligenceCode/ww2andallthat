import { getLatestPosts } from "@/lib/sanity";
import ArticleCard from "@/components/ArticleCard";
import SubscribeBand from "@/components/SubscribeBand";

export const revalidate = 1800;
export const metadata = { title: "Articles" };

export default async function ArticlesPage() {
  const posts = await getLatestPosts(50);
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-6 border-b border-black/[0.08]">
        <p className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-2">Archive</p>
        <h1 className="font-[var(--font-playfair)] text-4xl font-semibold">Articles</h1>
      </header>
      <div className="max-w-[680px]">
        {posts.map(post => <ArticleCard key={post._id} post={post} />)}
        {posts.length === 0 && <p className="text-sm text-[#1A1A18]/40">No articles yet.</p>}
      </div>
      <SubscribeBand />
    </div>
  );
}
