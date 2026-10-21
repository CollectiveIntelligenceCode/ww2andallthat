import FreeSubscribeForm from "./FreeSubscribeForm";
import Link from "next/link";

export default function SubscribeBand() {
  return (
    <section className="bg-[#111111] py-16 px-6 my-16">
      <div className="max-w-[600px] mx-auto text-center">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-white/40 mb-4">
          James Holland · WW2 &amp; All That
        </p>
        <h2 className="font-[var(--font-baskerville)] text-2xl md:text-3xl text-white font-bold leading-snug mb-4">
          Get new dispatches in your inbox.
        </h2>
        <p className="text-sm font-[var(--font-lato)] text-white/55 leading-relaxed mb-8 max-w-md mx-auto">
          Free subscribers get every article the moment it publishes. Paid subscribers unlock
          the full archive and exclusive essays. £5/month — cancel any time.
        </p>
        <FreeSubscribeForm dark placeholder="Your email address" buttonLabel="Subscribe free" />
        <p className="text-white/30 text-[10px] font-[var(--font-barlow)] tracking-widest uppercase mt-6">or</p>
        <Link href="/join"
          className="inline-block mt-4 px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
          Go paid — £5/month
        </Link>
      </div>
    </section>
  );
}
