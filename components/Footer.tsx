import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#111111] mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-[var(--font-baskerville)] text-base font-bold text-[#111111] mb-2">
            WW2 &amp; All That
          </p>
          <p className="text-sm font-[var(--font-lato)] text-[#6B7280] max-w-xs leading-relaxed">
            History, analysis, and storytelling by James Holland.
          </p>
        </div>
        <div className="flex gap-12 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280]">
          <div className="flex flex-col gap-2.5">
            <Link href="/articles" className="hover:text-[#D72638] transition-colors">Articles</Link>
            <Link href="/videos" className="hover:text-[#D72638] transition-colors">Videos</Link>
            <Link href="/books" className="hover:text-[#D72638] transition-colors">Books</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/events" className="hover:text-[#D72638] transition-colors">Events</Link>
            <a href="https://james1940.substack.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#D72638] transition-colors">Substack</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/subscribe" className="hover:text-[#D72638] transition-colors">Subscribe free</Link>
            <Link href="/join" className="hover:text-[#D72638] transition-colors">Join paid</Link>
            <Link href="/progress" className="hover:text-[#D72638] transition-colors">My campaign</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <p className="text-[10px] font-[var(--font-barlow)] tracking-wide text-[#9CA3AF]">
            © {new Date().getFullYear()} James Holland WW2 Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}
