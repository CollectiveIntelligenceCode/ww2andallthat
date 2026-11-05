import { getLatestPosts } from "@/lib/sanity";
import Link from "next/link";
import { getMemberSession } from "@/lib/member-session";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Join — Subscribe",
  description: "Join James Holland's WW2 & All That. Free dispatches, paid archive access, or become a Founding Member.",
};

const PAID_INCLUSIONS = [
  { label: "Complete archive", detail: "Every article ever written — dating back years" },
  { label: "Subscriber-only essays", detail: "Long-form investigations not published anywhere else" },
  { label: "Monthly Q&A dispatches", detail: "James answers subscriber questions on history and research" },
  { label: "Deep dive series", detail: "Multi-part investigations into specific campaigns and battles" },
  { label: "Early chapters", detail: "First access to material from upcoming books" },
  { label: "Cancel any time", detail: "No lock-in. Cancel from your account in seconds" },
];

const FOUNDING_EXTRAS = [
  { label: "Founding Member badge", detail: "Recognised on your profile for life" },
  { label: "Founding-only dispatches", detail: "Raw research notes and correspondence James shares only with Founding Members" },
  { label: "Direct access", detail: "Submit questions directly — James reads every one" },
  { label: `Limited to ${SITE_CONFIG.foundingCapacity}`, detail: "Once these places are gone, this tier closes permanently" },
];

export default async function JoinPage() {
  const posts = await getLatestPosts(3);
  const session = await getMemberSession();
  const previewPosts = posts.slice(0, 3);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">

      {/* Hero */}
      <header className="bg-[#111111] text-white px-10 py-14 mb-16 max-w-[800px]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-4">
          Membership
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.1] mb-6 text-balance">
          Unlock the full campaign.
        </h1>
        <p className="text-base font-[var(--font-lato)] text-white/65 leading-relaxed max-w-lg mb-8">
          Free dispatches cover the front line. Paid subscribers get the complete archive,
          exclusive essays, and direct access to James Holland's original research.
          Founding Members get everything — and a permanent place in the record.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={SITE_CONFIG.ghostPortalPaid} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
            Start for £5/month
          </Link>
          <Link href={SITE_CONFIG.ghostPortalFounding} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3 border border-white/30 text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:border-white hover:bg-white/10 transition-colors active:scale-[0.98]">
            Founding Member — £250/year
          </Link>
        </div>
        {!session && (
          <p className="text-[11px] font-[var(--font-barlow)] text-white/40 tracking-wide mt-5">
            Already a member?{" "}
            <Link href="/member/signin" className="text-white/70 hover:text-white transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        )}
      </header>

      {/* Paid subscription */}
      <section className="border-t-2 border-[#111111] pt-10 mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="font-[var(--font-baskerville)] text-2xl font-bold">Paid subscriber</h2>
          <span className="font-[var(--font-baskerville)] text-2xl font-bold text-[#D72638]">£5/month</span>
          <span className="text-sm font-[var(--font-lato)] text-[#9CA3AF]">or £50/year</span>
        </div>
        <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-8 max-w-lg">
          Full archive access plus subscriber-only writing. The backbone of the publication.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-7 max-w-[720px] mb-8">
          {PAID_INCLUSIONS.map(item => (
            <div key={item.label} className="flex gap-4">
              <span className="text-[#D72638] font-[var(--font-baskerville)] text-lg mt-0.5 flex-shrink-0">✦</span>
              <div>
                <p className="font-[var(--font-baskerville)] text-base font-bold leading-snug mb-0.5">{item.label}</p>
                <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href={SITE_CONFIG.ghostPortalPaid} target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
          Start paid subscription
        </Link>
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

      {/* Founding member */}
      <section className="bg-[#111111] text-white px-10 py-12 mb-16 max-w-[800px] relative">
        <span className="absolute -top-3 left-8 bg-[#D72638] text-white text-[9px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase px-2 py-0.5">
          Limited · {SITE_CONFIG.foundingCapacity} places
        </span>
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-white/40 mb-2">
          Founding member
        </p>
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-[var(--font-baskerville)] text-2xl font-bold">£250</span>
          <span className="text-sm font-[var(--font-lato)] text-white/40">per year · founding rate</span>
        </div>
        <p className="text-sm font-[var(--font-lato)] text-white/60 mb-8 max-w-lg">
          Everything in the paid subscription, plus a permanent place in the history of this publication.
          Once these places are filled, this tier closes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mb-8">
          {FOUNDING_EXTRAS.map(item => (
            <div key={item.label} className="flex gap-4">
              <span className="text-[#D72638] font-[var(--font-baskerville)] text-lg mt-0.5 flex-shrink-0">✦</span>
              <div>
                <p className="font-[var(--font-baskerville)] text-base font-bold leading-snug mb-0.5">{item.label}</p>
                <p className="text-sm font-[var(--font-lato)] text-white/50 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href={SITE_CONFIG.ghostPortalFounding} target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-[#111111] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] hover:text-white transition-colors active:scale-[0.98]">
          Become a Founding Member
        </Link>
      </section>

      {/* Preview articles */}
      {previewPosts.length > 0 && (
        <section className="border-t-2 border-[#111111] pt-10 mb-16">
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-8">
            Recent dispatches
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
                    {post.isPaid ? "Subscriber" : "Free"}
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
          <p className="font-[var(--font-baskerville)] text-2xl font-bold mb-1">Start free</p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280]">Upgrade any time.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={SITE_CONFIG.ghostPortalSignup} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
            Subscribe free
          </Link>
          <Link href="/subscribe"
            className="inline-block px-8 py-3 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
            Compare all plans
          </Link>
        </div>
      </section>

    </div>
  );
}
