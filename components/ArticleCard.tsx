import Link from "next/link";
import type { Post } from "@/lib/types";

export default function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (featured) {
    return (
      <article className="border-b border-black/[0.08] pb-10 mb-10">
        <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A18]/40 mb-3">{date}</p>
        <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-semibold leading-tight mb-4">
          <Link href={`/articles/${post.slug.current}`} className="hover:opacity-70 transition-opacity">
            {post.title}
          </Link>
        </h1>
        {post.excerpt && (
          <p className="text-base text-[#1A1A18]/65 leading-relaxed max-w-2xl mb-5">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4">
          <Link href={`/articles/${post.slug.current}`}
            className="text-sm font-medium underline underline-offset-2 hover:opacity-60 transition-opacity">
            Read article
          </Link>
          {post.isPaid && (
            <span className="text-xs px-2 py-0.5 bg-[#1A1A18]/[0.07] text-[#1A1A18]/50 rounded-sm">Paid</span>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="border-b border-black/[0.06] pb-5 mb-5">
      <p className="text-xs text-[#1A1A18]/35 mb-1.5">{date}</p>
      <h2 className="font-[var(--font-playfair)] text-lg font-semibold leading-snug mb-2">
        <Link href={`/articles/${post.slug.current}`} className="hover:opacity-70 transition-opacity">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="text-sm text-[#1A1A18]/55 leading-relaxed line-clamp-2">{post.excerpt}</p>
      )}
    </article>
  );
}
