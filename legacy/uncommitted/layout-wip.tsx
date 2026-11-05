import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "WW2 & All That", template: "%s | WW2 & All That" },
  description: "History, analysis, and storytelling about World War Two by James Holland.",
  metadataBase: new URL("https://ww2andallthat.com"),
  openGraph: {
    type: "website",
    siteName: "WW2 & All That",
    title: "WW2 & All That",
    description: "History, analysis, and storytelling about World War Two by James Holland.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@JamesHolland1940",
    creator: "@JamesHolland1940",
  },
  alternates: {
    types: { "application/rss+xml": "https://ww2andallthat.com/feed.xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
