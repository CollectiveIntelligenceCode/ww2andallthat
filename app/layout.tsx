import type { Metadata } from "next";
import { Libre_Baskerville, Barlow_Condensed, Lato } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RankUpToast from "@/components/RankUpToast";
import "./globals.css";

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "WW2 & All That", template: "%s | WW2 & All That" },
  description: "History, analysis, and storytelling about World War Two by James Holland.",
  metadataBase: new URL("https://ww2andallthat.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baskerville.variable} ${barlowCondensed.variable} ${lato.variable}`}>
      <body className="bg-white text-[#111111] font-[var(--font-lato),system-ui,sans-serif] antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <RankUpToast />
      </body>
    </html>
  );
}
