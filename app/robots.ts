import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/unlock", "/member/", "/profile", "/progress", "/welcome"],
      },
    ],
    sitemap: "https://ww2andallthat.com/sitemap.xml",
  };
}
