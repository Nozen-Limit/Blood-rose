/* ==========================================================================
   ROOT LAYOUT
   The shared shell. In the static site this markup — head, nav, search
   overlay, background decoration, footer, floating buttons, script list —
   was duplicated across all seven HTML files, about 1,480 copied lines. It
   lives here once.
   ========================================================================== */

import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingUi from "@/components/FloatingUi";
import BackgroundDecor from "@/components/BackgroundDecor";
import SearchProvider from "@/components/SearchProvider";
import { SITE_URL } from "@/lib/site";

/* Self-hosted by Next at build time rather than fetched from Google on
   every visit — same two faces, one less third-party round trip. */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-loaded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-loaded",
  display: "swap",
});

/* metadataBase lets every page give og:image a relative path and have it
   resolved to an absolute URL, which is what Discord and friends require. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Blood Rose | Arcane Legends Guild",
    template: "%s | Blood Rose",
  },
  description:
    "Blood Rose is a guild in Arcane Legends. Join our Discord, meet our officers, and see what we're about.",
  openGraph: {
    type: "website",
    siteName: "Blood Rose",
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%230a0607'/%3E%3Cpath d='M16 6c-4 5-7 9-7 13a7 7 0 0 0 14 0c0-4-3-8-7-13z' fill='%23e0313b'/%3E%3C/svg%3E",
  },
};

/* theme-color is what tints the accent bar on a Discord embed. */
export const viewport = { themeColor: "#e0313b" };

/* Every page reads live content that officers edit through the admin panel,
   which promises changes appear "within a few seconds". Rendering on each
   request keeps that promise; prerendering at build time would freeze the
   content until the next deploy. Declared here so it applies to every route
   and Next doesn't attempt static generation it will only have to abandon. */
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* "js" is not decorative: animations.css gates the entire scroll-reveal
       system behind `.js .reveal`, a class the old site's utils.js added at
       runtime so the content stayed visible if scripts never ran. React
       cannot render at all without JS, so it is safe to set statically —
       but without it every fade-in silently stops working. */
    <html lang="en" className={`js ${cinzel.variable} ${inter.variable}`}>
      <body>
        <SearchProvider>
          <BackgroundDecor />
          <Nav />
          <main>{children}</main>
          <Footer />
          <FloatingUi />
        </SearchProvider>
      </body>
    </html>
  );
}
