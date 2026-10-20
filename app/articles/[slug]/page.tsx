import { getPostBySlug, getLatestPosts, getRelatedPosts } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 1800;

export async function generateStaticParams() {
  const posts = await getLatestPosts(100);
  return posts.map(p => ({ slug: p.slug.current }));
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

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.tags, post._id);
  const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="max-w-[680px] mx-auto">
        <Link href="/articles" className="text-xs text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors mb-8 inline-block">
          ← Articles
        </Link>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <p className="text-xs tracking-[0.15em] uppercase text-[#1A1A18]/40">{date}</p>
            {post.excerpt && (
              <p className="text-xs text-[#1A1A18]/30">{readingTime(post.excerpt)}</p>
            )}
          </div>
          <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.15] mb-4 text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-[#1A1A18]/60 leading-relaxed first-letter:text-5xl first-letter:font-[var(--font-playfair)] first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.isPaid ? (
          <div className="border border-black/10 p-6 my-8 bg-[#1A1A18]/[0.03]">
            <p className="text-sm text-[#1A1A18]/70 mb-4 leading-relaxed">
              This article is for paid subscribers. Subscribe on Substack for £5/month to access the full piece and complete archive.
            </p>
            <a href={post.substackUrl ?? "https://james1940.substack.com/subscribe"}
              target="_blank" rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-[#1A1A18] text-[#FAFAF8] text-sm font-medium hover:bg-[#1A1A18]/80 transition-colors">
              Subscribe to read
            </a>
          </div>
        ) : post.substackUrl ? (
          <div className="my-8 border-t border-b border-black/[0.08] py-6">
            <p className="text-sm text-[#1A1A18]/50 mb-3">Read the full post on Substack:</p>
            <a href={post.substackUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium underline underline-offset-2 hover:opacity-60 transition-opacity">
              Open on Substack →
            </a>
          </div>
        ) : null}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-[#1A1A18]/[0.06] text-[#1A1A18]/50 rounded-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <aside className="mt-12 pt-8 border-t border-black/[0.08]">
            <p className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-5">Related</p>
            <div className="flex flex-col gap-4">
              {related.map(r => (
                <Link key={r._id} href={`/articles/${r.slug.current}`}
                  className="group flex flex-col gap-1">
                  <span className="text-sm font-[var(--font-playfair)] font-semibold group-hover:opacity-70 transition-opacity">
                    {r.title}
                  </span>
                  <span className="text-xs text-[#1A1A18]/40">
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
