export type MemberTier = "founding" | "paid" | "free";

export type ContentType =
  | "flagship" | "film" | "midweek" | "lessons" | "series"
  | "live" | "downloads" | "gallery" | "photo-essay" | "document" | "audio" | "quiz"
  | "article";

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  substackUrl?: string;
  /** true if any paid subscription required (backwards compat) */
  isPaid: boolean;
  /** null = public, "free" = any member, "paid" = paid+, "founding" = founding only */
  requiredTier?: MemberTier | null;
  featured: boolean;
  tags: string[];
  contentType?: ContentType;
  coverImage?: string;
  body?: string;
  readingTime?: number;
}

export interface Video {
  _id: string;
  title: string;
  slug: { current: string };
  youtubeId: string;
  publishedAt?: string;
  description?: string;
  thumbnailUrl?: string;
  tags: string[];
}

export interface Book {
  _id: string;
  title: string;
  slug: { current: string };
  cover?: { asset: { url: string } };
  excerpt?: string;
  releaseDate?: string;
  buyLinkAmazon?: string;
  buyLinkSigned?: string;
}

export interface SanityEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  location?: string;
  description?: string;
  ticketUrl?: string;
  isPast: boolean;
}
