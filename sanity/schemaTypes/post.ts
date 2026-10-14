import { defineType, defineField } from "sanity";

export const postSchema = defineType({
  name: "post",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "publishedAt", type: "datetime", validation: r => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "substackUrl", type: "url" }),
    defineField({ name: "isPaid", type: "boolean", initialValue: false }),
    defineField({
      name: "featured", type: "boolean", initialValue: false,
      description: "Pin as homepage hero. Never overwritten by RSS sync.",
    }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "coverImage", type: "url", description: "Auto-populated from RSS" }),
  ],
  orderings: [{ title: "Published, newest", name: "publishedAtDesc",
    by: [{ field: "publishedAt", direction: "desc" }] }],
});
