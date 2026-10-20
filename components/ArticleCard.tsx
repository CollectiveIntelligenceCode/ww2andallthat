import Link from "next/link";
import type { Post } from "@/lib/types";

function CategoryLabel({ isPaid }: { isPaid: boolean }) {
  return (
    <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
      {isPaid ? "Subscriber" : "Analysis"}
    </span>
  );
}

export default function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (featured) {
    return (
      <article className="border-b border-[#E5E7EB] pb-10 mb-10">
        <div className={`grid gap-8 items-start ${post.coverImage ? "md:grid-cols-[1fr_400px]" : ""}`}>
          {post.coverImage && (
            <div className="relative aspect-video overflow-hidden bg-[#111111]/5 order-2 md:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
            </div>
          )}
          <div className={post.coverImage ? "order-1 md:order-2" : ""}>
            <CategoryLabel isPaid={post.isPaid} />
            <h1 className="font-[var(--font-baskerville)] text-3xl md:text-[2.25rem] font-bold leading-[1.15] mt-2 mb-4 text-balance">
              <Link href={`/articles/${post.slug.current}`} className="article-title-link">
                {post.title}
              </Link>
            </h1>
            {post.excerpt && (
              <p className="text-base text-[#4B5563] leading-relaxed mb-5 max-w-lg font-[var(--font-lato)]">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-[11px] font-[var(--font-barlow)] tracking-wide uppercase text-[#9CA3AF]">
              <span>{date}</span>
              <span>James Holland</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border-b border-[#E5E7EB] pb-5 mb-5 group">
      <div className="flex gap-4">
        {post.coverImage && (
          <div className="flex-shrink-0 w-[88px] h-[60px] overflow-hidden bg-[#111111]/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <CategoryLabel isPaid={post.isPaid} />
            <span className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">{date}</span>
          </div>
          <h2 className="font-[var(--font-baskerville)] text-[1rem] font-bold leading-snug mb-1.5">
            <Link href={`/articles/${post.slug.current}`} className="article-title-link">
              {post.title}
            </Link>
          </h2>
          {post.excerpt && (
            <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 font-[var(--font-lato)]">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
