import { defineType, defineField } from "sanity";

export const quizQuestionSchema = defineType({
  name: "quizQuestion",
  title: "Quiz Question",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: r => r.required() }),
    defineField({ name: "options", type: "array", of: [{ type: "string" }],
      validation: r => r.min(4).max(4) }),
    defineField({ name: "correctIndex", type: "number", description: "0-3" }),
    defineField({ name: "explanation", type: "text", rows: 2 }),
    defineField({ name: "difficulty", type: "number",
      options: { list: [{ value: 1, title: "Easy" }, { value: 2, title: "Medium" }, { value: 3, title: "Hard" }] } }),
    defineField({ name: "era", type: "string",
      options: { list: ["Eastern Front", "Western Front", "Pacific", "North Africa", "Atlantic", "Home Front", "Other"] } }),
    defineField({ name: "relatedPost", type: "reference", to: [{ type: "post" }] }),
  ],
});
