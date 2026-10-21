import { getPostBySlug, getLatestPosts, getRelatedPosts } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReadingTracker from "@/components/ReadingTracker";
import { getMemberSession } from "@/lib/member-session";
import type { Metadata } from "next";

export const revalidate = 1800;

export async function generateStaticParams() {
  try {
    const posts = await getLatestPosts(100);
    return posts.map(p => ({ slug: p.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : [] },
  };
}

function readingTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.tags, post._id);
  const session = await getMemberSession();
  const isPaidMember = session?.tier === "paid";
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const bodyText = post.body ?? "";
  const estReadTime = bodyText ? readingTime(bodyText) : post.excerpt ? readingTime(post.excerpt) : null;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <ReadingTracker slug={slug} />
      <div className="max-w-[680px] mx-auto">
        <Link href="/articles" className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors mb-8 inline-block">
          ← Articles
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF]">{date}</p>
            {estReadTime && (
              <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{estReadTime}</p>
            )}
          </div>
          <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.15] mb-4 text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg font-[var(--font-lato)] text-[#4B5563] leading-relaxed border-l-2 border-[#D72638] pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover mb-8"
          />
        )}

        {post.isPaid && !isPaidMember ? (
          /* Paywall — shown to non-paid visitors */
          <div className="border-l-4 border-[#D72638] pl-6 py-2 my-8 bg-[#FFF5F5]">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-3">
              Subscriber content
            </p>
            <p className="text-sm font-[var(--font-lato)] text-[#4B5563] mb-4 leading-relaxed">
              This article is for paid subscribers. Join for £5/month to access the full piece and complete archive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/join"
                className="inline-block px-5 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
                Join for £5/month
              </Link>
              <Link href={`/member/signin?redirect=/articles/${slug}`}
                className="inline-block px-5 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
                Already a subscriber? Sign in
              </Link>
            </div>
          </div>
        ) : bodyText ? (
          /* Full article content rendered inline */
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        ) : post.excerpt ? (
          /* Fallback: show excerpt if no full body */
          <p className="text-base font-[var(--font-lato)] text-[#111111] leading-relaxed">
            {post.excerpt}
          </p>
        ) : null}

        {/* Post-article subscribe CTA — shown after free article body */}
        {!post.isPaid && bodyText && (
          <div className="my-12 border-t-2 border-b-2 border-[#111111] py-8">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-3">
              Free dispatches · Every week
            </p>
            <h3 className="font-[var(--font-baskerville)] text-2xl font-bold mb-3 max-w-sm">
              Get the next dispatch in your inbox.
            </h3>
            <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-5 max-w-sm leading-relaxed">
              James Holland writes every week on WW2 history, strategy, and research. Free to read. No algorithm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/subscribe"
                className="inline-block px-6 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
                Subscribe free
              </Link>
              <Link href="/join"
                className="inline-block px-6 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
                £5/month for full archive
              </Link>
            </div>
          </div>
        )}

        {/* Substack attribution for free articles */}
        {!post.isPaid && post.substackUrl && (
          <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
            <p className="text-xs font-[var(--font-barlow)] text-[#9CA3AF] tracking-wide">
              Originally published on Substack
            </p>
            <a href={post.substackUrl} target="_blank" rel="noopener noreferrer"
              className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors">
              View on Substack →
            </a>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <aside className="mt-12 pt-8 border-t-2 border-[#111111]">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-5">
              Further dispatches
            </p>
            <div className="flex flex-col gap-5">
              {related.map(r => (
                <Link key={r._id} href={`/articles/${r.slug.current}`}
                  className="group flex flex-col gap-1 border-b border-[#E5E7EB] pb-4">
                  <span className="text-base font-[var(--font-baskerville)] font-bold article-title-link">
                    {r.title}
                  </span>
                  <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
                    {new Date(r.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
