import { defineType, defineField } from "sanity";

export const videoSchema = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "youtubeId", type: "string", validation: r => r.required() }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "thumbnailUrl", type: "url" }),
    defineField({
      name: "tags", type: "array", of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Era/theatre tags e.g. 'Eastern Front', 'Pacific', 'North Africa'",
    }),
  ],
  orderings: [{ title: "Published, newest", name: "publishedAtDesc",
    by: [{ field: "publishedAt", direction: "desc" }] }],
});
