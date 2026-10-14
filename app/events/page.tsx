import { getEvents } from "@/lib/sanity";
import type { SanityEvent } from "@/lib/types";

export const revalidate = 3600;
export const metadata = { title: "Events" };

function EventRow({ event }: { event: SanityEvent }) {
  const date = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return (
    <article className={`py-6 border-b border-black/[0.08] ${event.isPast ? "opacity-50" : ""}`}>
      <p className="text-xs tracking-[0.12em] uppercase text-[#1A1A18]/40 mb-1">{date}</p>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold mb-1">{event.title}</h2>
      {event.location && <p className="text-sm text-[#1A1A18]/55 mb-2">{event.location}</p>}
      {event.description && (
        <p className="text-sm text-[#1A1A18]/65 leading-relaxed mb-3 max-w-lg">{event.description}</p>
      )}
      {event.ticketUrl && !event.isPast && (
        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm font-medium underline underline-offset-2 hover:opacity-60 transition-opacity">
          Get tickets →
        </a>
      )}
    </article>
  );
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter(e => !e.isPast);
  const past = events.filter(e => e.isPast);
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <header className="mb-10 pb-6 border-b border-black/[0.08]">
        <p className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-2">Appearances</p>
        <h1 className="font-[var(--font-playfair)] text-4xl font-semibold">Events</h1>
      </header>
      {upcoming.length > 0
        ? <section className="mb-12">{upcoming.map(e => <EventRow key={e._id} event={e} />)}</section>
        : <p className="text-sm text-[#1A1A18]/40 mb-12">No upcoming events scheduled.</p>}
      {past.length > 0 && (
        <section>
          <h2 className="text-xs tracking-[0.18em] uppercase text-[#1A1A18]/40 mb-0">Past events</h2>
          {past.map(e => <EventRow key={e._id} event={e} />)}
        </section>
      )}
    </div>
  );
}
