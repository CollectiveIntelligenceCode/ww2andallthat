import { defineType, defineField } from "sanity";

export const episodeSchema = defineType({
  name: "episode",
  title: "Podcast Episode",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "audioUrl", type: "url" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "duration", type: "string", description: "e.g. 45:22" }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
});
