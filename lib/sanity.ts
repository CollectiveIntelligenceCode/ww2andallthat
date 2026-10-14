import { createClient } from "next-sanity";
import type { Post, Video, Book, SanityEvent } from "./types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function getFeaturedPost(): Promise<Post | null> {
  const featured = await sanityClient.fetch<Post | null>(
    `*[_type == "post" && featured == true] | order(publishedAt desc) [0] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`
  );
  if (featured) return featured;
  return sanityClient.fetch<Post | null>(
    `*[_type == "post"] | order(publishedAt desc) [0] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`
  );
}

export async function getLatestPosts(limit = 12): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug] [0] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`,
    { slug }
  );
}

export async function getRelatedPosts(tags: string[], excludeId: string): Promise<Post[]> {
  return sanityClient.fetch(
    `*[_type == "post" && _id != $excludeId && count((tags)[@ in $tags]) > 0] | order(publishedAt desc) [0...3] {
      _id, title, slug, publishedAt, excerpt, isPaid, tags
    }`,
    { tags, excludeId }
  );
}

export async function getLatestVideos(limit = 12): Promise<Video[]> {
  return sanityClient.fetch(
    `*[_type == "video"] | order(publishedAt desc) [0...${limit}] {
      _id, title, slug, youtubeId, publishedAt, description, thumbnailUrl, tags
    }`
  );
}

export async function getBooks(): Promise<Book[]> {
  return sanityClient.fetch(
    `*[_type == "book"] | order(releaseDate desc) {
      _id, title, slug, cover { asset->{ url } }, excerpt, releaseDate, buyLinkAmazon, buyLinkSigned
    }`
  );
}

export async function getEvents(): Promise<SanityEvent[]> {
  return sanityClient.fetch(
    `*[_type == "event"] | order(date asc) {
      _id, title, slug, date, location, description, ticketUrl, isPast
    }`
  );
}
