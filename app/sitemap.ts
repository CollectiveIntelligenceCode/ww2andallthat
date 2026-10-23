import { MetadataRoute } from "next";
import { getLatestPosts } from "@/lib/sanity";

const BASE = "https://ww2andallthat.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/podcast`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/books`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getLatestPosts(200);
    articleRoutes = posts.map(p => ({
      url: `${BASE}/articles/${p.slug.current}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // RSS unreachable during build — articles will be indexed by Google on crawl
  }

  return [...staticRoutes, ...articleRoutes];
}
