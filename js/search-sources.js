/* ==========================================================================
   SEARCH SOURCES
   Turns the real content in js/data/*.js into searchable entries and adds
   them to the list from js/search-index.js.

   Why this exists: search-index.js only lists SECTIONS ("Video Guides",
   "Prices"). This file indexes what's actually IN those sections — every
   event, officer, video, price row, class and glossary term — so searching
   for a specific thing finds the thing, not just the page it lives on.

   It reads whatever data files happen to be loaded, so adding a new kind of
   content means adding one block here and nothing else.

   Must load AFTER search-index.js and all js/data/*.js, and BEFORE search.js.
   ========================================================================== */

(function (BR) {
  "use strict";

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

  /* --- Prices: one entry per row, linking to its own section --- */
  (data.prices || []).forEach(function (group) {
    (group.rows || []).forEach(function (row) {
      add(row[0], "Prices", "prices.html#" + group.id,
        words(group.title, row.join(" ")));
    });
  });

  /* --- Guides: build cards and videos --- */
  if (data.guides) {
    (data.guides.builds || []).forEach(function (item) {
      add(item.title, "Guides", "guides.html#builds", item.body);
    });
    (data.guides.videos || []).forEach(function (item) {
      add(item.title, "Guides", "guides.html#videos", "video guide youtube");
    });
  }

  /* --- Gallery: video titles and image captions --- */
  (data.gallery || []).forEach(function (group) {
    (group.items || []).forEach(function (item) {
      var label = item.title || item.caption || item.alt;
      /* Skip empty image placeholders — nothing useful to find yet */
      if (!label || label === "Image placeholder") return;
      add(label, "Gallery", "gallery.html#" + group.id,
        words(group.title, group.type));
    });
  });

  /* --- Wiki: class cards and glossary terms --- */
  if (data.wiki) {
    (data.wiki.classes || []).forEach(function (item) {
      add(item.title, "Wiki", "wiki.html#classes", item.body);
    });
    ((data.wiki.glossary && data.wiki.glossary.rows) || []).forEach(function (row) {
      add(row[0], "Wiki", "wiki.html#glossary", row.join(" "));
    });
  }

  /* Append to the hand-written section entries rather than replacing them —
     searching "prices" should still find the Prices page itself. */
  BR.searchIndex = (BR.searchIndex || []).concat(entries);
})(window.BR);
