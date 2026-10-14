import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { postSchema, videoSchema, bookSchema, eventSchema, episodeSchema, quizQuestionSchema } from "./schemaTypes";

export default defineConfig({
  name: "ww2andallthat",
  title: "WW2 & All That",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: [postSchema, videoSchema, bookSchema, eventSchema, episodeSchema, quizQuestionSchema] },
});
