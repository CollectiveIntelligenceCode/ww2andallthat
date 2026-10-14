import { defineType, defineField } from "sanity";

export const bookSchema = defineType({
  name: "book",
  title: "Book",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({ name: "excerpt", type: "text", rows: 4 }),
    defineField({ name: "releaseDate", type: "date" }),
    defineField({ name: "buyLinkAmazon", type: "url" }),
    defineField({ name: "buyLinkSigned", type: "url", description: "Direct signed copy link if available" }),
  ],
  orderings: [{ title: "Release date, newest", name: "releaseDateDesc",
    by: [{ field: "releaseDate", direction: "desc" }] }],
});
