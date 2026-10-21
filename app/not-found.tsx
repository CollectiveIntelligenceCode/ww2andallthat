import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="max-w-[560px]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] mb-4">
          404
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold leading-[1.15] mb-6">
          Dispatch not found.
        </h1>
        <p className="text-base font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-10 max-w-sm">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          Return to the front line.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/"
            className="inline-block px-8 py-3 bg-[#111111] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#D72638] transition-colors active:scale-[0.98]">
            Return to homepage
          </Link>
          <Link href="/articles"
            className="inline-block px-8 py-3 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
            Browse articles
          </Link>
        </div>
        <div className="mt-16 pt-8 border-t border-[#E5E7EB]">
          <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-4">
            Sectors
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/articles", label: "Articles" },
              { href: "/videos", label: "Videos" },
              { href: "/books", label: "Books" },
              { href: "/events", label: "Events" },
              { href: "/about", label: "About" },
              { href: "/subscribe", label: "Subscribe" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] hover:text-[#D72638] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
