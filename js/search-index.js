/* ==========================================================================
   SEARCH INDEX — the data the search box looks through.

   Kept separate from search.js on purpose: this is the file you'll edit
   often (every time you add a page or section), while the search logic
   next door should rarely change. Data and behaviour in separate files.

   There's no server, so nothing crawls the site automatically — this list
   IS the search. Add an entry whenever you add a section.

   title    — what the visitor sees
   section  — which page it lives on, shown as the small red label
   url      — where the result links to; "page.html#id" jumps to that section
   keywords — extra words that should match, never displayed

   ---------------------------------------------------------------------------
   ONLY HOMEPAGE SECTIONS ARE LISTED RIGHT NOW.

   Events, Guides, Prices, Gallery and Wiki are under development on the
   live site, so their entries are commented out below rather than deleted.
   A search result that leads to an empty "Under Development" page is worse
   than no result at all.

   WHEN A PAGE GOES LIVE: uncomment its block here, and add its data file
   back to that page's script list (see the comment in index.html).
   ---------------------------------------------------------------------------
   ========================================================================== */

window.BR = window.BR || {};

window.BR.searchIndex = [
  { title: "Our Story", section: "Home", url: "index.html#story", keywords: "history founded guild about" },
  { title: "Our Goals", section: "Home", url: "index.html#goals", keywords: "goals mission gvg elite roster community" },
  { title: "Officers", section: "Home", url: "index.html#officers", keywords: "officers guild master ranks staff" },

  // Replace this URL with the real Discord invite when you have it
  { title: "Join our Discord", section: "Discord", url: "https://discord.gg/PbFs4eXEv4", keywords: "discord invite join chat link" }

  /* ---------- Restore these as each page goes live ----------

  { title: "Event Roadmap", section: "Events", url: "events.html#roadmap", keywords: "events roadmap timeline schedule dates recruiting gvg ongoing done rescheduled canceled" },

  { title: "What to Build", section: "Guides", url: "guides.html#builds", keywords: "build gear class warrior rogue sorcerer" },
  { title: "Procs & Mechanics", section: "Guides", url: "guides.html#procs", keywords: "proc mechanics how to proc" },
  { title: "Video Guides", section: "Guides", url: "guides.html#videos", keywords: "youtube video tutorial how to" },

  { title: "Basic Gear Prices", section: "Prices", url: "prices.html#basic", keywords: "price basic gear cost gold" },
  { title: "End-Game Gear Prices", section: "Prices", url: "prices.html#endgame", keywords: "price endgame full gear set cost" },
  { title: "Gold Loot Set Prices", section: "Prices", url: "prices.html#gold-loot", keywords: "gold loot set price cost" },

  { title: "Guild Activities", section: "Gallery", url: "gallery.html#activities", keywords: "photos pictures screenshots guild activity" },
  { title: "Funny Videos", section: "Gallery", url: "gallery.html#funny", keywords: "funny videos guild clips" },
  { title: "Serious Videos", section: "Gallery", url: "gallery.html#serious", keywords: "serious videos guild highlights" },

  { title: "Classes", section: "Wiki", url: "wiki.html#classes", keywords: "warrior rogue sorcerer class reference" },
  { title: "Mechanics", section: "Wiki", url: "wiki.html#mechanics", keywords: "mechanics game systems reference" },
  { title: "Glossary", section: "Wiki", url: "wiki.html#glossary", keywords: "glossary terms definitions abbreviations" }

  ---------------------------------------------------------- */
];
