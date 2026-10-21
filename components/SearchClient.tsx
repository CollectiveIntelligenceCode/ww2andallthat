"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";

export default function SearchClient({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? "").toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query, posts]);

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-10">
        <label htmlFor="search-input" className="sr-only">Search articles</label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles, topics, campaigns..."
          autoFocus
          className="w-full max-w-[640px] border-b-2 border-[#111111] bg-transparent py-3 pr-10 text-xl font-[var(--font-baskerville)] text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#D72638] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111111] transition-colors px-2"
            aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Results */}
      {query.length >= 2 && (
        <div>
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-5">
            {results.length === 0
              ? "No results"
              : `${results.length} ${results.length === 1 ? "result" : "results"}`}
          </p>
          <div className="space-y-0 max-w-[680px]">
            {results.map(post => {
              const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <Link key={post._id} href={`/articles/${post.slug.current}`}
                  className="group flex gap-4 items-start border-b border-[#E5E7EB] py-5 hover:bg-[#FAFAFA] -mx-4 px-4 transition-colors">
                  {post.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title}
                      className="flex-shrink-0 w-[72px] h-[48px] object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
                        {post.isPaid ? "Subscriber" : "Analysis"}
                      </span>
                      <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
                        {date}
                      </span>
                    </div>
                    <h2 className="font-[var(--font-baskerville)] text-base font-bold leading-snug mb-1 group-hover:text-[#D72638] transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {query.length < 2 && (
        <div>
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-5">
            All articles — {posts.length} dispatches
          </p>
          <div className="space-y-0 max-w-[680px]">
            {posts.slice(0, 10).map(post => {
              const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <Link key={post._id} href={`/articles/${post.slug.current}`}
                  className="group flex gap-4 items-start border-b border-[#E5E7EB] py-4 -mx-4 px-4 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
                        {post.isPaid ? "Subscriber" : "Analysis"}
                      </span>
                      <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{date}</span>
                    </div>
                    <h2 className="font-[var(--font-baskerville)] text-sm font-bold leading-snug group-hover:text-[#D72638] transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
            {posts.length > 10 && (
              <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] pt-4 tracking-wide">
                Type to search all {posts.length} articles
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
