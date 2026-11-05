import type { Metadata } from "next";
import "./globals.css";
import "./wireframe.css";

export const metadata: Metadata = {
  title: { default: "WW2 & All That", template: "%s | WW2 & All That" },
  description: "History, analysis, and storytelling about World War Two by James Holland.",
  metadataBase: new URL("https://ww2andallthat.com"),
  robots: { index: false, follow: false },
  alternates: { types: { "application/rss+xml": "https://ww2andallthat.com/feed.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
