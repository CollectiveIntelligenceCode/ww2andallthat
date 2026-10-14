export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  substackUrl?: string;
  isPaid: boolean;
  featured: boolean;
  tags: string[];
  coverImage?: string;
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
