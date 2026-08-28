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
   ========================================================================== */

window.BR = window.BR || {};

window.BR.searchIndex = [
  { title: "Our Story", section: "Home", url: "index.html#story", keywords: "history founded guild about" },
  { title: "Our Goals", section: "Home", url: "index.html#goals", keywords: "goals mission gvg elite roster community" },
  { title: "Officers", section: "Home", url: "index.html#officers", keywords: "officers guild master ranks staff" },

  { title: "Event Roadmap", section: "Events", url: "events.html#roadmap", keywords: "events roadmap timeline schedule dates recruiting gvg ongoing done rescheduled canceled" },
  { title: "Event History", section: "Events", url: "events-history.html", keywords: "past previous old events archive history" },

  { title: "What to Build", section: "Guides", url: "guides.html#builds", keywords: "build gear class warrior rogue sorcerer" },
  { title: "Procs & Mechanics", section: "Guides", url: "guides.html#procs", keywords: "proc mechanics how to proc" },
  { title: "Video Guides", section: "Guides", url: "guides.html#videos", keywords: "youtube video tutorial how to" },

  { title: "Guild Activities", section: "Gallery", url: "gallery.html#activities", keywords: "photos pictures screenshots guild activity" },
  { title: "Funny Videos", section: "Gallery", url: "gallery.html#funny", keywords: "funny videos guild clips" },
  { title: "Serious Videos", section: "Gallery", url: "gallery.html#serious", keywords: "serious videos guild highlights" },

  // Replace this URL with the real Discord invite when you have it
  { title: "Join our Discord", section: "Discord", url: "https://discord.gg/PbFs4eXEv4", keywords: "discord invite join chat link" }
];
