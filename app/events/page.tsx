import { getEvents } from "@/lib/sanity";
import type { SanityEvent } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Events" };

function EventRow({ event }: { event: SanityEvent }) {
  const date = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const time = new Date(event.date).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });
  return (
    <article className={`py-7 border-b border-[#E5E7EB] ${event.isPast ? "opacity-50" : ""}`}>
      <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widets uppercase text-[#D72638] mb-1.5">
        {date} · {time}
      </p>
      <h2 className="font-[var(--font-baskerville)] text-xl font-bold mb-1.5">{event.title}</h2>
      {event.location && (
        <p className="text-sm font-[var(--font-barlow)] tracking-wide text-[#6B7280] mb-2">
          {event.location}
        </p>
      )}
      {event.description && (
        <p className="text-sm font-[var(--font-lato)] text-[#4B5563] leading-relaxed mb-4 max-w-lg">
          {event.description}
        </p>
      )}
      {event.ticketUrl && !event.isPast && (
        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block px-5 py-2 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase bg-[#111111] text-white hover:bg-[#D72638] transition-colors active:scale-[0.98]">
          Get tickets →
        </a>
      )}
      {event.isPast && (
        <p className="text-[10px] font-[var(--font-barlow)] tracking-widest uppercase text-[#9CA3AF]">
          Past event
        </p>
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
      <header className="mb-10 pb-4 border-b-2 border-[#111111]">
        <p className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-2">
          Appearances
        </p>
        <h1 className="font-[var(--font-baskerville)] text-4xl font-bold">Events</h1>
      </header>

      <div className="max-w-[680px]">
        {upcoming.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#111111] mb-0 pb-2 border-b border-[#E5E7EB]">
              Upcoming
            </h2>
            {upcoming.map(e => <EventRow key={e._id} event={e} />)}
          </section>
        ) : (
          <div className="border border-[#E5E7EB] p-8 mb-12">
            <p className="font-[var(--font-baskerville)] text-lg font-bold mb-2">No events currently scheduled</p>
            <p className="text-sm font-[var(--font-lato)] text-[#6B7280] mb-4">
              Subscribe to be notified when new events are announced.
            </p>
            <a href="https://james1940.substack.com/subscribe" target="_blank" rel="noopener noreferrer"
              className="inline-block px-5 py-2 text-[11px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase bg-[#111111] text-white hover:bg-[#D72638] transition-colors active:scale-[0.98]">
              Subscribe for updates
            </a>
          </div>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="text-[10px] font-[var(--font-barlow)] font-semibold tracking-widest uppercase text-[#9CA3AF] mb-0 pb-2 border-b border-[#E5E7EB]">
              Past events
            </h2>
            {past.map(e => <EventRow key={e._id} event={e} />)}
          </section>
        )}
      </div>
    </div>
  );
}
