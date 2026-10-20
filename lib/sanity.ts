import { createClient } from "next-sanity";
import { unstable_cache } from "next/cache";
import type { Post, Video, Book, SanityEvent } from "./types";
import { fetchSubstackFeed, fetchYoutubeFeed } from "./rss";
import { SEED_BOOKS, SEED_EVENTS } from "./seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder";

export const sanityClient = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const isSanityReady = projectId !== "placeholder";

const SUBSTACK_FEED = "https://james1940.substack.com/feed";
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? "UCNZ6VMrmina1IkAZ9VkXJPQ";

// Cache live Substack RSS for 1 hour
const getLiveSubstackPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const items = await fetchSubstackFeed(SUBSTACK_FEED);
    return items.map((item, i) => ({
      _id: `substack-${item.slug}`,
      title: item.title,
      slug: { current: item.slug },
      publishedAt: item.publishedAt,
      excerpt: item.excerpt,
      substackUrl: item.substackUrl,
      coverImage: item.coverImage,
      isPaid: item.isPaid,
      featured: i === 0,
      tags: item.tags,
    }));
  },
  ["substack-posts"],
  { revalidate: 3600 }
);

// Cache live YouTube RSS for 1 hour
const getLiveYoutubeVideos = unstable_cache(
  async (): Promise<Video[]> => {
    const items = await fetchYoutubeFeed(YOUTUBE_CHANNEL_ID);
    return items.map(item => ({
      _id: `yt-${item.youtubeId}`,
      title: item.title,
      slug: { current: item.slug },
      youtubeId: item.youtubeId,
      publishedAt: item.publishedAt,
      description: item.description,
      thumbnailUrl: item.thumbnailUrl,
      tags: item.tags,
    }));
  },
  ["youtube-videos"],
  { revalidate: 3600 }
);

export async function getFeaturedPost(): Promise<Post | null> {
  if (!isSanityReady) {
    const posts = await getLiveSubstackPosts();
    return posts[0] ?? null;
  }
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
  if (!isSanityReady) {
    const posts = await getLiveSubstackPosts();
    return posts.slice(0, limit);
  }
  return sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSanityReady) {
    const posts = await getLiveSubstackPosts();
    return posts.find(p => p.slug.current === slug) ?? null;
  }
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug] [0] {
      _id, title, slug, publishedAt, excerpt, substackUrl, isPaid, featured, tags, coverImage
    }`,
    { slug }
  );
}

export async function getRelatedPosts(tags: string[], excludeId: string): Promise<Post[]> {
  if (!isSanityReady) {
    const posts = await getLiveSubstackPosts();
    return posts.filter(p => p._id !== excludeId).slice(0, 3);
  }
  return sanityClient.fetch(
    `*[_type == "post" && _id != $excludeId && count((tags)[@ in $tags]) > 0] | order(publishedAt desc) [0...3] {
      _id, title, slug, publishedAt, excerpt, isPaid, tags
    }`,
    { tags, excludeId }
  );
}

export async function getLatestVideos(limit = 12): Promise<Video[]> {
  if (!isSanityReady) {
    const videos = await getLiveYoutubeVideos();
    return videos.slice(0, limit);
  }
  return sanityClient.fetch(
    `*[_type == "video"] | order(publishedAt desc) [0...${limit}] {
      _id, title, slug, youtubeId, publishedAt, description, thumbnailUrl, tags
    }`
  );
}

export async function getBooks(): Promise<Book[]> {
  if (!isSanityReady) return SEED_BOOKS;
  return sanityClient.fetch(
    `*[_type == "book"] | order(releaseDate desc) {
      _id, title, slug, cover { asset->{ url } }, excerpt, releaseDate, buyLinkAmazon, buyLinkSigned
    }`
  );
}

export async function getEvents(): Promise<SanityEvent[]> {
  if (!isSanityReady) return SEED_EVENTS;
  return sanityClient.fetch(
    `*[_type == "event"] | order(date asc) {
      _id, title, slug, date, location, description, ticketUrl, isPast
    }`
  );
}
