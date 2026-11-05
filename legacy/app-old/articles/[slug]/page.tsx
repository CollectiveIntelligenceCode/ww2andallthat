import { getPostBySlug, getLatestPosts, getRelatedPosts } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReadingTracker from "@/components/ReadingTracker";
import { getMemberSession, canAccess } from "@/lib/member-session";
import { CONTENT_TYPE_LABELS } from "@/lib/ghost-content";
import { SITE_CONFIG } from "@/lib/config";
import type { Metadata } from "next";
import type { ContentType } from "@/lib/types";

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

function ContentTypeBadge({ type }: { type?: ContentType }) {
  if (!type || type === "article") return null;
  const specialTypes: ContentType[] = ["film", "audio", "quiz", "downloads", "flagship"];
  if (!specialTypes.includes(type)) return null;
  return (
    <span className="inline-block text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase px-2 py-0.5 bg-[#111111] text-white mr-2">
      {CONTENT_TYPE_LABELS[type] ?? type}
    </span>
  );
}

function PaywallBlock({ slug, tier }: { slug: string; tier?: "paid" | "founding" | null }) {
  const isFounding = tier === "founding";
  return (
    <div className="border-l-4 border-[#D72638] pl-6 py-2 my-8 bg-[#FFF5F5]">
      <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#D72638] mb-3">
        {isFounding ? "Founding member content" : "Subscriber content"}
      </p>
      <p className="text-sm font-[var(--font-lato)] text-[#4B5563] mb-4 leading-relaxed">
        {isFounding
          ? `This piece is reserved for Founding Members — ${SITE_CONFIG.foundingCapacity} places available at £250/year.`
          : "This article is for paid subscribers. Join for £5/month to access the full piece and complete archive."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={isFounding ? SITE_CONFIG.ghostPortalFounding : SITE_CONFIG.ghostPortalPaid}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
          {isFounding ? "Become a Founding Member" : "Join for £5/month"}
        </Link>
        <Link
          href={`/member/signin?redirect=/articles/${slug}`}
          className="inline-block px-5 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
          Already a subscriber? Sign in
        </Link>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, session] = await Promise.all([getPostBySlug(slug), getMemberSession()]);
  if (!post) notFound();

  const related = await getRelatedPosts(post.tags, post._id);
  const accessible = canAccess(session, post.requiredTier);
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const bodyText = post.body ?? "";
  const estReadTime = bodyText ? readingTime(bodyText) : post.excerpt ? readingTime(post.excerpt) : null;

  const contentTypeLabel = post.contentType && post.contentType !== "article"
    ? (CONTENT_TYPE_LABELS[post.contentType] ?? "Analysis")
    : "Analysis";

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <ReadingTracker slug={slug} />
      <div className="max-w-[680px] mx-auto">
        <Link href="/articles" className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors mb-8 inline-block">
          ← Articles
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <ContentTypeBadge type={post.contentType} />
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#D72638]">
              {contentTypeLabel}
            </p>
            <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{date}</p>
            {estReadTime && (
              <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{estReadTime}</p>
            )}
            {post.requiredTier === "founding" && (
              <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase px-2 py-0.5 bg-[#D72638] text-white">
                Founding
              </span>
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

        {!accessible ? (
          <PaywallBlock slug={slug} tier={post.requiredTier as "paid" | "founding" | null} />
        ) : bodyText ? (
          <div className="article-prose" dangerouslySetInnerHTML={{ __html: bodyText }} />
        ) : post.excerpt ? (
          <p className="text-base font-[var(--font-lato)] text-[#111111] leading-relaxed">{post.excerpt}</p>
        ) : null}

        {/* Downloads CTA for downloads content type */}
        {accessible && post.contentType === "downloads" && (
          <div className="my-8 p-6 bg-[#F3F4F6] border border-[#E5E7EB]">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-2">
              Downloads
            </p>
            <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed">
              Download links are in the article above. Sign in if prompted.
            </p>
          </div>
        )}

        {/* Post-article subscribe CTA for free articles */}
        {accessible && !post.isPaid && bodyText && (
          <div className="my-12 border-t-2 border-b-2 border-[#111111] py-8">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#D72638] mb-3">
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
                className="inline-block px-6 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
                £5/month for full archive
              </Link>
            </div>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <aside className="mt-12 pt-8 border-t-2 border-[#111111]">
            <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#111111] mb-5">
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
