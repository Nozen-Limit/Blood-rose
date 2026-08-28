/* ==========================================================================
   SEARCH INDEX ENDPOINT
   Builds the full searchable index — every event, officer, price row, guide,
   gallery item and wiki class — on the server, in one place.

   This replaces js/search-sources.js. Crucially it also replaces the reason
   the static site loaded all eight data tables on every page view: the
   search panel now fetches this once, on first open, and pages themselves
   fetch only what they render.
   ========================================================================== */

import { NextResponse } from "next/server";
import { SECTION_ENTRIES, type SearchEntry } from "@/lib/search";
import {
  getEvents, getOfficers, getPrices, getGuides, getGallery, getWiki,
} from "@/lib/data";

/** Joins whatever it's given into one keyword string, skipping empties. */
const words = (...parts: unknown[]) => parts.filter(Boolean).join(" ");

export async function GET() {
  const [events, officers, prices, guides, gallery, wiki] = await Promise.all([
    getEvents(), getOfficers(), getPrices(), getGuides(), getGallery(), getWiki(),
  ]);

  const entries: SearchEntry[] = [];
  const add = (title: string, section: string, url: string, keywords = "") => {
    if (!title) return;
    entries.push({ title: String(title), section, url, keywords });
  };

  for (const item of events) {
    add(item.title, "Events", "/events#roadmap",
      words(item.event_date, item.status, item.details));
  }

  for (const item of officers) {
    const detailText = (item.details ?? [])
      .map((row) => words(row.label, row.value))
      .join(" ");
    add(item.name, "Officers", "/#officers", words(item.rank, item.note, detailText));
  }

  /* One entry per price row, linking to its own class section. Each row is
     [category, item name, price]. */
  for (const group of prices) {
    for (const row of group.rows ?? []) {
      add(row[1], "Prices", `/prices#${group.id}`, words(group.title, row[0], row[2]));
    }
  }

  for (const item of guides.builds) add(item.title, "Guides", "/guides#builds", item.body ?? "");
  for (const item of guides.videos) add(item.title, "Guides", "/guides#videos", "video guide youtube");
  for (const item of guides.mechanics) {
    add(item.title, "Guides", "/guides#procs", words("proc mechanic", item.body));
  }

  for (const group of gallery) {
    for (const item of group.items ?? []) {
      const label =
        ("title" in item ? item.title : undefined) ??
        ("caption" in item ? item.caption : undefined);
      /* Skip empty image placeholders — nothing useful to find yet. */
      if (!label || label === "Image placeholder") continue;
      add(label, "Gallery", `/gallery#${group.id}`, words(group.title, group.type));
    }
  }

  for (const item of wiki.classes) add(item.title, "Wiki", "/wiki#classes", item.body ?? "");

  /* Section entries first so a search for "prices" still surfaces the page
     itself alongside the individual items on it. */
  return NextResponse.json([...SECTION_ENTRIES, ...entries]);
}
