import { getBooks } from "@/lib/sanity";

export const revalidate = 3600;
export const metadata = { title: "Books" };

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">Bibliography</p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Books</h1>
      </header>
      {books.length === 0 ? (
        <p className="text-sm text-[#1A1A18]/40">Books coming soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map(book => (
            <article key={book._id}>
              {book.cover?.asset?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.cover.asset.url} alt={book.title}
                  className="w-full aspect-[2/3] object-cover mb-3 shadow-sm" />
              )}
              <h2 className="font-[var(--font-playfair)] text-base font-semibold leading-snug mb-2">{book.title}</h2>
              {book.excerpt && (
                <p className="text-xs text-[#1A1A18]/55 leading-relaxed line-clamp-3 mb-3">{book.excerpt}</p>
              )}
              <div className="flex flex-col gap-1.5">
                {book.buyLinkAmazon && (
                  <a href={book.buyLinkAmazon} target="_blank" rel="noopener noreferrer"
                    className="text-xs underline underline-offset-2 hover:opacity-60 transition-opacity">Buy on Amazon</a>
                )}
                {book.buyLinkSigned && (
                  <a href={book.buyLinkSigned} target="_blank" rel="noopener noreferrer"
                    className="text-xs underline underline-offset-2 hover:opacity-60 transition-opacity">Signed copy</a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
