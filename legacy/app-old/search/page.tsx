import { getLatestPosts } from "@/lib/sanity";
import SearchClient from "@/components/SearchClient";
import type { Metadata } from "next";

export const revalidate = 1800;
export const metadata: Metadata = {
  title: "Search",
  description: "Search all articles and dispatches from James Holland on World War Two.",
};

export default async function SearchPage() {
  const posts = await getLatestPosts(200);
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Find dispatches
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Search</h1>
      </header>
      <SearchClient posts={posts} />
    </div>
  );
}
