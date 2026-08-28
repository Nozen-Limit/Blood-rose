/* ==========================================================================
   SEARCH INDEX + SCORING
   Ported from js/search-index.js, js/search-sources.js and the matching
   half of js/search.js.

   The static site loaded all eight data tables on every single page purely
   so search could index them from anywhere. Here the index is built on the
   server and fetched once, lazily, the first time someone opens the search
   panel — so a visitor who never searches never pays for it at all.
   ========================================================================== */

import { DISCORD_INVITE } from "./site";

export type SearchEntry = {
  title: string;
  section: string;
  url: string;
  keywords: string;
};

/** The hand-written section entries: searching "prices" finds the page itself. */
export const SECTION_ENTRIES: SearchEntry[] = [
  { title: "Our Story", section: "Home", url: "/#story", keywords: "history founded guild about" },
  { title: "Our Goals", section: "Home", url: "/#goals", keywords: "goals mission gvg elite roster community" },
  { title: "Officers", section: "Home", url: "/#officers", keywords: "officers guild master ranks staff" },

  { title: "Event Roadmap", section: "Events", url: "/events#roadmap", keywords: "events roadmap timeline schedule dates recruiting gvg ongoing done rescheduled canceled" },
  { title: "Event History", section: "Events", url: "/events/history", keywords: "past previous old events archive history" },

  { title: "What to Build", section: "Guides", url: "/guides#builds", keywords: "build gear class warrior rogue sorcerer" },
  { title: "Procs & Mechanics", section: "Guides", url: "/guides#procs", keywords: "proc mechanics how to proc" },
  { title: "Video Guides", section: "Guides", url: "/guides#videos", keywords: "youtube video tutorial how to" },

  { title: "Warrior Prices", section: "Prices", url: "/prices#warrior", keywords: "price warrior shield blade chain gear cost" },
  { title: "Rogue Prices", section: "Prices", url: "/prices#rogue", keywords: "price rogue daggers bow chakram gear cost" },
  { title: "Sorcerer Prices", section: "Prices", url: "/prices#sorcerer", keywords: "price sorcerer gun staff orb gear cost" },

  { title: "Guild Activities", section: "Gallery", url: "/gallery#activities", keywords: "photos pictures screenshots guild activity" },
  { title: "Funny Videos", section: "Gallery", url: "/gallery#funny", keywords: "funny videos guild clips" },
  { title: "Serious Videos", section: "Gallery", url: "/gallery#serious", keywords: "serious videos guild highlights" },

  { title: "Classes", section: "Wiki", url: "/wiki#classes", keywords: "warrior rogue sorcerer class reference" },
  { title: "Mechanics", section: "Wiki", url: "/wiki#mechanics", keywords: "mechanics game systems reference" },

  { title: "Join our Discord", section: "Discord", url: DISCORD_INVITE, keywords: "discord invite join chat link" },
];

/* ------------------------------------------------------------------------
   Matching

   Splits the query into words and requires each to appear SOMEWHERE in the
   entry, in any order — the equivalent of chaining LIKE %word% AND LIKE
   %word% in SQL. An earlier version matched the whole phrase as one chunk,
   so "best builds for war" could never match "Best Build for Warrior".
   ------------------------------------------------------------------------ */

/** Filler words, ignored so they can't sink an otherwise good match. */
const STOP_WORDS = new Set(
  "a an and are as at be by for from in is it of on or the to with".split(" ")
);

export const MAX_RESULTS = 12;

const normalize = (text: unknown) => String(text ?? "").toLowerCase();

/** Splits text into bare words, dropping punctuation and symbols. */
const tokenize = (text: unknown) =>
  normalize(text).split(/[^a-z0-9]+/).filter(Boolean);

/** Does one search word appear in this text? */
function hasToken(haystack: string, haystackWords: string[], token: string) {
  /* Plain substring — the %like% part. Covers "war" inside "warrior". */
  if (haystack.includes(token)) return true;

  /* The reverse: the typed word is LONGER than the stored one, e.g. typing
     "builds" when the content says "build". Only for words of 3+ chars, so
     short fragments can't match half the site. */
  return haystackWords.some((word) => word.length >= 3 && token.startsWith(word));
}

/** 0 means no match; higher is better, so results can be ranked. */
function scoreItem(item: SearchEntry, tokens: string[], rawQuery: string) {
  const title = normalize(item.title);
  const haystack = `${title} ${normalize(item.section)} ${normalize(item.keywords)}`;
  const titleWords = tokenize(title);
  const haystackWords = tokenize(haystack);
  let score = 0;

  /* The exact phrase typed, found verbatim — the strongest signal. */
  if (title.includes(rawQuery)) score += 50;
  else if (haystack.includes(rawQuery)) score += 20;

  for (const token of tokens) {
    if (!hasToken(haystack, haystackWords, token)) return 0; // every word must appear
    /* A hit in the title counts for more than one buried in keywords. */
    score += hasToken(title, titleWords, token) ? 6 : 2;
  }

  return score;
}

export function searchEntries(index: SearchEntry[], raw: string): SearchEntry[] {
  const query = normalize(raw.trim());
  if (!query) return [];

  let tokens = tokenize(query).filter((t) => !STOP_WORDS.has(t));
  /* If someone types only filler words ("the", "of"), fall back to the raw
     words so the search still does something sensible. */
  if (!tokens.length) tokens = tokenize(query);
  if (!tokens.length) return [];

  return index
    .map((item) => ({ item, score: scoreItem(item, tokens, query) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((row) => row.item);
}
