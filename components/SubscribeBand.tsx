export default function SubscribeBand() {
  return (
    <section className="bg-[#111111] py-16 px-6 my-16">
      <div className="max-w-[600px] mx-auto text-center">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-white/40 mb-4">
          James Holland · Substack
        </p>
        <h2 className="font-[var(--font-baskerville)] text-2xl md:text-3xl text-white font-bold leading-snug mb-4">
          Go deeper. Subscribe for the full archive.
        </h2>
        <p className="text-sm font-[var(--font-lato)] text-white/55 leading-relaxed mb-8 max-w-md mx-auto">
          Paid subscribers get every article, the full back catalogue, and exclusive essays.
          £5/month — cancel any time.
        </p>
        <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
          Subscribe on Substack
        </a>
      </div>
    </section>
  );
}
