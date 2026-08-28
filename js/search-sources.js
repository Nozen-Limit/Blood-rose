/* ==========================================================================
   SEARCH SOURCES
   Turns the real content in js/data/*.js into searchable entries and adds
   them to the list from js/search-index.js.

   Why this exists: search-index.js only lists SECTIONS ("Video Guides",
   "Guides"). This file indexes what's actually IN those sections — every
   event, officer, video and guide — so searching
   for a specific thing finds the thing, not just the page it lives on.

   It reads whatever data files happen to be loaded, so adding a new kind of
   content means adding one block here and nothing else.

   Must load AFTER search-index.js and all js/data/*.js, and BEFORE search.js.

   ---------------------------------------------------------------------------
   WAITING FOR THE DATA
   Every js/data/*.js file now fetches from Supabase instead of listing
   content directly, so BR.data.events / .officers / etc. are empty at the
   instant this script's top-level code runs — the network requests are
   still in flight. Building entries immediately would silently index
   nothing for any of it, forever (BR.searchIndex is a plain array, not
   something that gets rebuilt later). Everything below waits on every
   promise in BR.dataReady first.
   ---------------------------------------------------------------------------
   ========================================================================== */

(function (BR) {
  "use strict";

  var dataReady = BR.dataReady || {};

  Promise.all(
    Object.keys(dataReady).map(function (key) { return dataReady[key]; })
  ).then(buildEntries);

  function buildEntries() {
  var data = BR.data || {};
  var entries = [];

  /* Joins whatever it's given into one keyword string, skipping empties */
  function words() {
    return Array.prototype.slice
      .call(arguments)
      .filter(Boolean)
      .join(" ");
  }

  function add(title, section, url, keywords) {
    if (!title) return;
    entries.push({
      title: String(title),
      section: section,
      url: url,
      keywords: keywords || ""
    });
  }

  /* --- Events --- */
  (data.events || []).forEach(function (item) {
    add(item.title, "Events", "events.html#roadmap",
      words(item.date, item.month, item.status, item.details));
  });

  /* --- Officers --- */
  (data.officers || []).forEach(function (item) {
    var detailText = (item.details || [])
      .map(function (row) { return words(row.label, row.value); })
      .join(" ");
    add(item.name, "Officers", "index.html#officers",
      words(item.rank, item.note, detailText));
  });

  /* --- Guides: build cards, videos, and procs/mechanics --- */
  if (data.guides) {
    (data.guides.builds || []).forEach(function (item) {
      add(item.title, "Guides", "guides.html#builds", item.body);
    });
    (data.guides.videos || []).forEach(function (item) {
      add(item.title, "Guides", "guides.html#videos", "video guide youtube");
    });
    (data.guides.mechanics || []).forEach(function (item) {
      add(item.title, "Guides", "guides.html#procs", words("proc mechanic", item.body));
    });
  }

  /* --- Gallery: video titles and image captions --- */
  (data.gallery || []).forEach(function (group) {
    (group.items || []).forEach(function (item) {
      var label = item.title || item.caption;
      /* Skip empty image placeholders — nothing useful to find yet */
      if (!label || label === "Image placeholder") return;
      add(label, "Gallery", "gallery.html#" + group.id,
        words(group.title, group.type));
    });
  });

  /* Append to the hand-written section entries rather than replacing them —
     searching "guides" should still find the Guides page itself. */
  BR.searchIndex = (BR.searchIndex || []).concat(entries);
  } // end buildEntries()
})(window.BR);
