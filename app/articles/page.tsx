import { getLatestPosts } from "@/lib/sanity";
import ArticleCard from "@/components/ArticleCard";
import ArticleFilters from "@/components/ArticleFilters";
import SubscribeBand from "@/components/SubscribeBand";
import { Suspense } from "react";
import type { ContentType } from "@/lib/types";
import { CONTENT_TYPE_LABELS } from "@/lib/ghost-content";

export const revalidate = 1800;
export const metadata = { title: "Articles" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const rawType = searchParams?.type;
  const type = (rawType && rawType !== "all") ? rawType as ContentType : undefined;
  const posts = await getLatestPosts(200);

  const filtered = type
    ? posts.filter(p => p.contentType === type)
    : posts;

  const heading = type && CONTENT_TYPE_LABELS[type] ? CONTENT_TYPE_LABELS[type] : "Articles";

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-8 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Archive
        </p>
        <div className="flex items-baseline gap-4">
          <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">{heading}</h1>
          {filtered.length > 0 && (
            <span className="text-sm font-[var(--font-lato)] text-[#9CA3AF]">{filtered.length}</span>
          )}
        </div>
      </header>

      <Suspense>
        <ArticleFilters />
      </Suspense>

      <div className="max-w-[680px]">
        {filtered.map(post => (
          <ArticleCard key={post._id} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[#1A1A18]/40">No articles in this category yet.</p>
        )}
      </div>

      <SubscribeBand />
    </div>
  );
}
