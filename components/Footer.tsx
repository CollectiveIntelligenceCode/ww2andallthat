import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#111111] mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-xs">
          <p className="font-[var(--font-baskerville)] text-base font-bold text-[#111111] mb-2">
            WW2 &amp; All That
          </p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] leading-relaxed mb-4">
            History, analysis, and storytelling by James Holland.
            Read every article in full — free, on this site.
          </p>
          <Link href="/subscribe"
            className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638] hover:text-[#B91C2C] transition-colors">
            Subscribe free →
          </Link>
        </div>
        <div className="flex flex-wrap gap-12 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280]">
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] text-[#9CA3AF] mb-1">Read</p>
            <Link href="/articles" className="hover:text-[#D72638] transition-colors">Articles</Link>
            <Link href="/videos" className="hover:text-[#D72638] transition-colors">Videos</Link>
            <Link href="/books" className="hover:text-[#D72638] transition-colors">Books</Link>
            <Link href="/events" className="hover:text-[#D72638] transition-colors">Events</Link>
            <Link href="/search" className="hover:text-[#D72638] transition-colors">Search</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] text-[#9CA3AF] mb-1">Subscribe</p>
            <Link href="/subscribe" className="hover:text-[#D72638] transition-colors">Subscribe free</Link>
            <Link href="/join" className="hover:text-[#D72638] transition-colors">Join paid</Link>
            <Link href="/profile" className="hover:text-[#D72638] transition-colors">My record</Link>
            <Link href="/progress" className="hover:text-[#D72638] transition-colors">Campaign</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] text-[#9CA3AF] mb-1">About</p>
            <Link href="/about" className="hover:text-[#D72638] transition-colors">About James</Link>
            <a href="https://james1940.substack.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#D72638] transition-colors">Substack</a>
            <a href="https://www.chalkevalleyhistoryfestival.co.uk" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#D72638] transition-colors">Chalke Valley</a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
            © {new Date().getFullYear()} James Holland WW2 Ltd
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF] hover:text-[#D72638] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF] hover:text-[#D72638] transition-colors">
              Terms of Use
            </Link>
            <Link href="/cookies" className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF] hover:text-[#D72638] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
