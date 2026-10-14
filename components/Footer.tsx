import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.08] mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-[var(--font-playfair)] text-base font-semibold text-[#1A1A18] mb-2">
            WW2 &amp; All That
          </p>
          <p className="text-sm text-[#1A1A18]/50 max-w-xs">
            History, analysis, and storytelling by James Holland.
          </p>
        </div>
        <div className="flex gap-12 text-sm text-[#1A1A18]/60">
          <div className="flex flex-col gap-2">
            <Link href="/articles" className="hover:text-[#1A1A18] transition-colors">Articles</Link>
            <Link href="/videos" className="hover:text-[#1A1A18] transition-colors">Videos</Link>
            <Link href="/books" className="hover:text-[#1A1A18] transition-colors">Books</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/events" className="hover:text-[#1A1A18] transition-colors">Events</Link>
            <a href="https://james1940.substack.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#1A1A18] transition-colors">Substack</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
