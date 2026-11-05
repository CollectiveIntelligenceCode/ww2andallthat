import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About James Holland",
  description: "James Holland is a bestselling historian and author specialising in the Second World War. Learn about his books, podcast, and research.",
  openGraph: {
    title: "About James Holland",
    description: "Bestselling historian. Author. Podcast host. James Holland writes about World War Two with the authority of original research and the clarity of great narrative.",
  },
};

const BOOKS = [
  { title: "Normandy '44", year: "2019", note: "Major reassessment of D-Day and the battle for France" },
  { title: "Sicily '43", year: "2020", note: "The Allied invasion — the largest amphibious operation of the war" },
  { title: "Brothers in Arms", year: "2021", note: "The Sherwood Rangers Yeomanry — from the desert to the Rhine" },
  { title: "Italy's Sorrow", year: "2008", note: "The forgotten final year of the Italian campaign" },
  { title: "Dam Busters", year: "2012", note: "617 Squadron and the most famous raid of the war" },
  { title: "Fortress Malta", year: "2003", note: "Malta's two-year siege under Axis bombardment" },
  { title: "The War in the West Vol. 1 & 2", year: "2015–17", note: "A monumental account of the Western theatre" },
  { title: "The Rise of Germany", year: "2015", note: "Part one of The War in the West" },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">

      {/* Header */}
      <header className="mb-12 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Historian · Author · Broadcaster
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl md:text-5xl font-bold">James Holland</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Bio */}
        <div className="lg:col-span-2">
          <div className="article-prose">
            <p>
              James Holland is one of Britain&rsquo;s leading historians of the Second World War,
              known for his ability to combine original archival research with vivid narrative history.
              His work has reshaped how the conflict is understood — moving beyond received wisdom
              to examine the war&rsquo;s industrial, logistical, and human dimensions in full.
            </p>
            <p>
              Over two decades of research, Holland has interviewed hundreds of veterans across
              multiple theatres and worked in archives in Britain, the United States, Germany,
              Italy, and beyond. His books consistently reach the bestseller lists and have been
              translated into numerous languages.
            </p>

            <h2>The podcast</h2>
            <p>
              <em>WW2 & All That</em> began as a conversation between James Holland and comedian
              and historian Al Murray. It has since grown into one of the most listened-to history
              podcasts in the UK, combining rigorous scholarship with wit and accessibility. New
              episodes are released weekly, with a growing archive of deep dives into specific
              campaigns, battles, weapons, and individuals.
            </p>
            <p>
              Articles published here expand on themes from the podcast and go beyond what a
              single episode can cover — longer investigations, original analysis, and material
              drawn directly from ongoing research.
            </p>

            <h2>Chalke Valley History Festival</h2>
            <p>
              James Holland is the co-founder and co-director of the{" "}
              <a href="https://www.chalkevalleyhistoryfestival.co.uk" target="_blank" rel="noopener noreferrer">
                Chalke Valley History Festival
              </a>
              , held annually in Wiltshire. It has become one of the most celebrated history events
              in the UK, bringing together historians, writers, and a public passionate about the past.
            </p>

            <h2>The newsletter</h2>
            <p>
              Free articles are published here in full, every week. A paid subscription unlocks
              the complete archive — every article and essay ever written, subscriber-only
              deep dives, and early access to material from new books.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/subscribe"
              className="inline-block px-6 py-2.5 bg-[#D72638] text-white text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase hover:bg-[#B91C2C] transition-colors active:scale-[0.98]">
              Subscribe to the newsletter
            </Link>
            <Link href="/articles"
              className="inline-block px-6 py-2.5 border border-[#E5E7EB] text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#6B7280] hover:border-[#111111] hover:text-[#111111] transition-colors">
              Read the articles
            </Link>
          </div>
        </div>

        {/* Sidebar — books */}
        <aside>
          <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-6 pb-2 border-b-2 border-[#111111]">
            Selected books
          </h2>
          <div className="space-y-5">
            {BOOKS.map(b => (
              <div key={b.title} className="border-b border-[#F3F4F6] pb-5">
                <p className="font-[var(--font-baskerville)] text-base font-bold leading-snug mb-0.5">
                  {b.title}
                </p>
                <p className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-[#D72638] mb-1">
                  {b.year}
                </p>
                <p className="text-xs font-[var(--font-lato)] text-[#6B7280] leading-relaxed">
                  {b.note}
                </p>
              </div>
            ))}
          </div>
          <Link href="/books"
            className="mt-6 inline-block text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] hover:text-[#D72638] transition-colors">
            Full bibliography →
          </Link>
        </aside>
      </div>
    </div>
  );
}
