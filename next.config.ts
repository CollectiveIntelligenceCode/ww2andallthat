import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old Ghost-era routes, kept working for existing links and emails.
      { source: "/articles/:slug", destination: "/essays/:slug", permanent: true },
      { source: "/articles", destination: "/essays", permanent: true },
      { source: "/videos", destination: "/films", permanent: false },
      { source: "/podcast", destination: "/essays", permanent: false },
      { source: "/join", destination: "/membership", permanent: false },
      { source: "/subscribe", destination: "/sign-in", permanent: false },
      { source: "/profile", destination: "/account", permanent: false },
      { source: "/progress", destination: "/account/badges", permanent: false },
      { source: "/events", destination: "/live", permanent: false },
    ];
  },
  outputFileTracingIncludes: { "/**": ["./lib/wireframes/pages/**"] },
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
