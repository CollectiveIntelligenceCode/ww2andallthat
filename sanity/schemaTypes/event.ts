import { defineType, defineField } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "date", type: "datetime", validation: r => r.required() }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "ticketUrl", type: "url" }),
    defineField({ name: "isPast", type: "boolean", initialValue: false,
      description: "Mark manually once event has passed" }),
  ],
  orderings: [{ title: "Date, soonest", name: "dateAsc",
    by: [{ field: "date", direction: "asc" }] }],
});
