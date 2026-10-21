import { getLatestPosts } from "@/lib/sanity";
import Link from "next/link";
import { getMemberSession } from "@/lib/member-session";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Join — Paid Subscription",
  description: "Unlock the full archive. James Holland's complete WW2 writing — every article, every essay, every dispatch. £5/month.",
};

const INCLUSIONS = [
  { label: "Complete archive", detail: "Every article ever written — dating back years" },
  { label: "Subscriber-only essays", detail: "Long-form investigations not published anywhere else" },
  { label: "Monthly Q&A dispatches", detail: "James answers subscriber questions on history and research" },
  { label: "Deep dive series", detail: "Multi-part investigations into specific campaigns and battles" },
  { label: "Early chapters", detail: "First access to material from upcoming books" },
  { label: "Cancel any time", detail: "No lock-in. Cancel from your account in seconds" },
];

export default async function JoinPage() {
  const posts = await getLatestPosts(3);
  const session = await getMemberSession();
  const paidPosts = posts.filter(p => p.isPaid).slice(0, 3);
  const previewPosts = paidPosts.length > 0 ? paidPosts : posts.slice(0, 3);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">

      {/* Hero — dark band */}
      <header className="bg-[#111111] text-white px-10 py-14 mb-16 max-w-[800px]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-4">
          Paid subscription · £5/month
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.1] mb-6 text-balance">
          Unlock the full campaign.
        </h1>
        <p className="text-base font-[var(--font-lato)] text-white/65 leading-relaxed max-w-lg mb-8">
          The free dispatches are just the front line. Paid subscribers get the complete archive,
          exclusive essays, and direct access to James Holland's original research — material
          that doesn't appear anywhere else.
        </p>
        <a href="https://ww2-and-all-that.ghost.io/#/portal/signup"
          className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98] mr-4">
          Start for £5/month
        </a>
        <p className="text-[11px] font-[var(--font-barlow)] text-white/40 tracking-wide mt-4">
          Cancel any time. No contracts.
        </p>
        {session?.tier !== "paid" && (
          <p className="text-[11px] font-[var(--font-barlow)] text-white/40 tracking-wide mt-2">
            Already a subscriber?{" "}
            <Link href="/member/signin" className="text-white/70 hover:text-white transition-colors underline underline-offset-2">
              Sign in to access your account
            </Link>
          </p>
        )}
      </header>

      {/* What's included */}
      <section className="border-t-2 border-[#111111] pt-10 mb-16">
        <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
          What's included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-7 max-w-[720px]">
          {INCLUSIONS.map(item => (
            <div key={item.label} className="flex gap-4">
              <span className="text-[#D72638] font-[var(--font-baskerville)] text-lg mt-0.5 flex-shrink-0">✦</span>
              <div>
                <p className="font-[var(--font-baskerville)] text-base font-bold leading-snug mb-0.5">{item.label}</p>
                <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-l-4 border-[#D72638] pl-8 mb-16 max-w-[640px]">
        <p className="font-[var(--font-baskerville)] text-xl italic leading-relaxed text-[#111111] mb-4">
          "The depth of research James brings to each piece is unlike anything else on WW2.
          The archive alone is worth the subscription — I spent a whole weekend just reading
          back through it."
        </p>
        <p className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF]">
          Paid subscriber since 2023
        </p>
      </section>

      {/* Preview articles (teaser of locked content) */}
      {previewPosts.length > 0 && (
        <section className="border-t-2 border-[#111111] pt-10 mb-16">
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
            Recent subscriber dispatches
          </h2>
          <div className="space-y-6 max-w-[640px]">
            {previewPosts.map(post => (
              <div key={post._id} className="flex gap-4 items-start border-b border-[#E5E7EB] pb-6">
                <div className="flex-shrink-0 w-[72px] h-[48px] overflow-hidden bg-[#F3F4F6]">
                  {post.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-1">
                    Subscriber
                  </p>
                  <p className="font-[var(--font-baskerville)] text-sm font-bold leading-snug text-[#111111]">
                    {post.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t-2 border-[#111111] pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div>
          <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-1">£5 / month</p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280]">Full access. Cancel any time.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://ww2-and-all-that.ghost.io/#/portal/signup"
            className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
            Start subscription
          </a>
          <Link href="/subscribe"
            className="inline-block px-8 py-3 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
            See free plan
          </Link>
        </div>
      </section>

    </div>
  );
}
