import { describe, it, expect } from "vitest";
import { extractYoutubeId, normaliseSubstackItem } from "../lib/rss";

describe("extractYoutubeId", () => {
  it("extracts ID from watch URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("extracts ID from youtu.be short URL", () => {
    expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });
  it("returns null for non-YouTube URL", () => {
    expect(extractYoutubeId("https://example.com/video")).toBeNull();
  });
});

describe("normaliseSubstackItem", () => {
  it("extracts slug from Substack post URL", () => {
    const result = normaliseSubstackItem({
      title: "The Fall of Berlin",
      link: "https://james1940.substack.com/p/the-fall-of-berlin",
      pubDate: "Mon, 01 Jan 2024 10:00:00 GMT",
      contentSnippet: "An excerpt here.",
    });
    expect(result.slug).toBe("the-fall-of-berlin");
    expect(result.title).toBe("The Fall of Berlin");
    expect(result.isPaid).toBe(false);
  });
});
