import { getBooks } from "@/lib/sanity";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Books" };

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">Bibliography</p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Books</h1>
      </header>
      {books.length === 0 ? (
        <p className="text-sm font-[var(--font-lato)] text-[#9CA3AF]">Books coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {books.map(book => (
            <article key={book._id} className="group">
              <div className="aspect-[2/3] overflow-hidden bg-[#F3F4F6] mb-4">
                {book.cover?.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={book.cover.asset.url} alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-end p-4 bg-[#111111]">
                    <span className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-white/40">
                      James Holland
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#D72638]">
                {book.releaseDate ? new Date(book.releaseDate).getFullYear() : ""}
              </span>
              <h2 className="font-[var(--font-baskerville)] text-base font-bold leading-snug mt-1 mb-2">
                {book.title}
              </h2>
              {book.excerpt && (
                <p className="text-xs font-[var(--font-lato)] text-[#6B7280] leading-relaxed line-clamp-3 mb-3">
                  {book.excerpt}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {book.buyLinkAmazon && (
                  <a href={book.buyLinkAmazon} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] hover:text-[#D72638] transition-colors">
                    Buy on Amazon →
                  </a>
                )}
                {book.buyLinkSigned && (
                  <a href={book.buyLinkSigned} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] hover:text-[#D72638] transition-colors">
                    Signed copy →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
