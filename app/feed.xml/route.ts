import { getLatestPosts } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const SITE_URL = "https://ww2andallthat.com";

export async function GET() {
  const posts = await getLatestPosts(50);
  // Only include public (non-paywalled) posts in the RSS feed
  const publicPosts = posts.filter(p => !p.isPaid);

  const items = publicPosts
    .map(post => {
      const pubDate = new Date(post.publishedAt).toUTCString();
      const link = `${SITE_URL}/articles/${post.slug.current}`;
      const desc = post.excerpt
        ? `<![CDATA[${post.excerpt}]]>`
        : "";
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>hq@ww2andallthat.com (James Holland)</author>
      ${desc ? `<description>${desc}</description>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>WW2 &amp; All That</title>
    <link>${SITE_URL}</link>
    <description>James Holland's weekly dispatches on World War Two — analysis, narrative, and original research.</description>
    <language>en-GB</language>
    <managingEditor>hq@ww2andallthat.com (James Holland)</managingEditor>
    <webMaster>hq@ww2andallthat.com (James Holland)</webMaster>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
