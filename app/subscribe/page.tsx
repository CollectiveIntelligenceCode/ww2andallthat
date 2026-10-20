import { getLatestPosts } from "@/lib/sanity";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Subscribe",
  description: "Join James Holland's weekly dispatches on World War Two — free to read, with a paid tier for the full archive.",
};

const FREE_BENEFITS = [
  "Weekly articles on WW2 history and analysis",
  "Full video archive — every YouTube episode",
  "Event announcements and appearances",
  "Books and recommendations",
];

const PAID_BENEFITS = [
  "Every article ever written — complete back catalogue",
  "Subscriber-only deep dives and essays",
  "Long-form investigations and original research",
  "Monthly Q&A dispatches",
  "Early access to new book chapters",
];

export default async function SubscribePage() {
  const posts = await getLatestPosts(3);
  const freePosts = posts.filter(p => !p.isPaid);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">

      {/* Hero */}
      <header className="max-w-[640px] mx-auto text-center mb-16">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-4">
          Free dispatches
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.1] mb-6 text-balance">
          History told without compromise.
        </h1>
        <p className="text-base font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-8 max-w-md mx-auto">
          James Holland writes about World War Two every week — analysis, narrative, and original
          research. Free to read. No algorithm. No noise.
        </p>
        <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
          Subscribe free on Substack
        </a>
        <p className="text-[11px] font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide mt-3">
          Free forever. No card required.
        </p>
      </header>

      {/* Recent articles preview */}
      {freePosts.length > 0 && (
        <section className="border-t-2 border-[#111111] pt-10 mb-16">
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
            Recent dispatches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {freePosts.map(post => (
              <article key={post._id} className="group border-b border-[#E5E7EB] pb-6">
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden mb-4 bg-[#F3F4F6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage} alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                )}
                <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-1.5">
                  Analysis
                </p>
                <h3 className="font-[var(--font-baskerville)] text-lg font-bold leading-snug mb-2">
                  <Link href={`/articles/${post.slug.current}`} className="article-title-link">
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt && (
                  <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Free vs Paid comparison */}
      <section className="border-t-2 border-[#111111] pt-10 mb-16">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
          What you get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px]">
          {/* Free */}
          <div className="border border-[#E5E7EB] p-8">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
              Free reader
            </p>
            <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-1">£0</p>
            <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide mb-6">forever</p>
            <ul className="space-y-3 mb-8">
              {FREE_BENEFITS.map(b => (
                <li key={b} className="flex items-start gap-3 text-sm font-[var(--font-lato)] text-[#4B5563]">
                  <span className="text-[#D72638] mt-0.5 flex-shrink-0">✦</span>
                  {b}
                </li>
              ))}
            </ul>
            <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
              className="block text-center px-6 py-2.5 border-2 border-[#111111] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#111111] hover:text-white transition-colors">
              Subscribe free
            </a>
          </div>

          {/* Paid */}
          <div className="border-2 border-[#111111] p-8 relative">
            <span className="absolute -top-3 left-6 bg-[#D72638] text-white text-[9px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase px-2 py-0.5">
              Recommended
            </span>
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
              Paid subscriber
            </p>
            <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-1">£5</p>
            <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide mb-6">per month</p>
            <ul className="space-y-3 mb-8">
              {[...FREE_BENEFITS, ...PAID_BENEFITS].map(b => (
                <li key={b} className="flex items-start gap-3 text-sm font-[var(--font-lato)] text-[#4B5563]">
                  <span className="text-[#D72638] mt-0.5 flex-shrink-0">✦</span>
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/join"
              className="block text-center px-6 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
              Start paid subscription
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
