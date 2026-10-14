export default function SubscribeBand() {
  return (
    <section className="bg-[#1A1A18] py-14 px-6 my-16">
      <div className="max-w-[640px] mx-auto text-center">
        <p className="text-xs tracking-[0.18em] uppercase text-white/40 mb-4">Substack · James Holland</p>
        <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl text-white font-semibold leading-snug mb-4">
          Go deeper. Subscribe for the full archive.
        </h2>
        <p className="text-sm text-white/55 leading-relaxed mb-8 max-w-md mx-auto">
          Paid subscribers get every article, the full back catalogue, and exclusive essays.
          £5/month — cancel any time.
        </p>
        <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-[#1A1A18] text-sm font-medium hover:bg-white/90 transition-colors">
          Subscribe on Substack
        </a>
      </div>
    </section>
  );
}
