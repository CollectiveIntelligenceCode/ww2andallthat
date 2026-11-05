import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/videos", destination: "/articles", permanent: false },
      { source: "/podcast", destination: "/articles", permanent: false },
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
