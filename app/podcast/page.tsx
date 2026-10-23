import { getLatestPosts } from "@/lib/sanity";
import Link from "next/link";
import type { Metadata } from "next";
import SubscribeBand from "@/components/SubscribeBand";

export const revalidate = 1800;
export const metadata: Metadata = {
  title: "Podcast — WW2 & All That",
  description: "James Holland's audio essays and podcast episodes on World War Two — analysis and narrative in spoken form.",
};

export default async function PodcastPage() {
  const allPosts = await getLatestPosts(200);
  const audioPosts = allPosts.filter(p => p.contentType === "audio");

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Audio
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold mb-4">Podcast</h1>
        <p className="text-base font-[var(--font-lato)] text-[#6B7280] leading-relaxed max-w-xl">
          James Holland's WW2 analysis in spoken form. Episodes covering battles, commanders, strategy,
          and the stories that shaped the war.
        </p>
      </header>

      {audioPosts.length > 0 ? (
        <div className="max-w-[760px] space-y-0">
          {audioPosts.map((post, i) => {
            const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric",
            });
            return (
              <article key={post._id} className="border-b border-[#E5E7EB] py-7 group">
                <div className="flex gap-6 items-start">
                  {/* Episode number */}
                  <span className="flex-shrink-0 w-10 text-right text-[11px] font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide pt-1">
                    {String(audioPosts.length - i).padStart(2, "0")}
                  </span>

                  {/* Play button */}
                  <div className="flex-shrink-0 w-10 h-10 border-2 border-[#111111] flex items-center justify-center group-hover:bg-[#111111] transition-colors mt-0.5">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:fill-white fill-[#111111] transition-colors ml-0.5">
                      <path d="M0 0L10 6L0 12V0Z" />
                    </svg>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
                        {post.isPaid ? "Subscriber" : "Free"}
                      </span>
                      <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{date}</span>
                      {post.readingTime && (
                        <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
                          {post.readingTime} min
                        </span>
                      )}
                    </div>
                    <h2 className="font-[var(--font-baskerville)] text-lg font-bold leading-snug mb-2">
                      <Link href={`/articles/${post.slug.current}`} className="article-title-link">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Thumbnail */}
                  {post.coverImage && (
                    <div className="hidden md:block flex-shrink-0 w-[80px] h-[60px] overflow-hidden bg-[#F3F4F6]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="max-w-[640px] py-16 border-b border-[#E5E7EB]">
          <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-3">Episodes coming soon.</p>
          <p className="text-base font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-8">
            Audio episodes will appear here once published. Subscribe free to get notified the moment
            new episodes drop.
          </p>
          <Link href="/subscribe"
            className="inline-block px-6 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
            Subscribe for updates
          </Link>
        </div>
      )}

      <SubscribeBand />
    </div>
  );
}
