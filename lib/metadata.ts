/* ==========================================================================
   PAGE METADATA HELPER

   Next merges `metadata` shallowly: a page that declares its own
   `openGraph` REPLACES the root layout's openGraph object outright, which
   silently drops the shared og:image — so a link to /events pasted into
   Discord would preview with no picture, while / previewed fine.

   Building the whole block here keeps every page's preview complete.
   ========================================================================== */

import type { Metadata } from "next";

export function pageMetadata({
  title, description, path,
}: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Blood Rose",
      title: `${title} | Blood Rose`,
      description,
      url: path,
      images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}
