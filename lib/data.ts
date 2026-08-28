/* ==========================================================================
   DATA ACCESS
   Replaces the eight files in the static site's js/data/. Those each fired
   their own browser fetch on every page, so every page paid for all eight
   tables whether it showed them or not. Here each page asks only for what
   it renders, on the server, in one round trip.

   Freshness: reads are deliberately uncached (`no-store`). The admin
   dashboard promises officers that "changes go live within a few seconds",
   and caching these would quietly break that promise. These are small
   queries against a handful of rows.
   ========================================================================== */

import type {
  Officer, GuildEvent, PriceSection, GuideItem, GallerySection,
  WikiItem, Stat, Testimonial, Guides, Wiki
} from "./types";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Reads every row of a public table via PostgREST.
 *
 * Returns [] rather than throwing when something goes wrong: one failing
 * table should leave its own section empty, not blank the whole page. The
 * error is logged so it still shows up in Vercel's runtime logs.
 */
async function fetchTable<T>(table: string, orderBy = "sort_order.asc"): Promise<T[]> {
  if (!URL_BASE || !ANON_KEY) {
    console.error(`Supabase env vars missing; "${table}" returned empty.`);
    return [];
  }

  try {
    const res = await fetch(
      `${URL_BASE}/rest/v1/${table}?select=*&order=${orderBy}`,
      {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`${table}: ${res.status}`);
    return (await res.json()) as T[];
  } catch (err) {
    console.error("Supabase fetch failed:", err);
    return [];
  }
}

export const getOfficers     = () => fetchTable<Officer>("officers");
export const getEvents       = () => fetchTable<GuildEvent>("events");
export const getPrices       = () => fetchTable<PriceSection>("price_sections");
export const getGallery      = () => fetchTable<GallerySection>("gallery_sections");
export const getStats        = () => fetchTable<Stat>("stats");
export const getTestimonials = () => fetchTable<Testimonial>("testimonials");

/** Guides arrive as one table split by `kind` — same shape js/data/guides.js built. */
export async function getGuides(): Promise<Guides> {
  const rows = await fetchTable<GuideItem>("guide_items");
  return {
    builds: rows.filter((r) => r.kind === "build"),
    videos: rows
      .filter((r) => r.kind === "video")
      .map((r) => ({
        title: r.title,
        youtubeId: r.youtube_id ?? undefined,
        url: r.url ?? undefined,
      })),
    mechanics: rows.filter((r) => r.kind === "mechanic"),
  };
}

/** Wiki likewise: class cards, plus glossary rows flattened to table cells. */
export async function getWiki(): Promise<Wiki> {
  const rows = await fetchTable<WikiItem>("wiki_items");
  return {
    classes: rows.filter((r) => r.kind === "class"),
    glossary: {
      columns: ["Term", "Meaning"],
      rows: rows
        .filter((r) => r.kind === "glossary")
        .map((r) => [r.title, r.body ?? ""]),
    },
  };
}
