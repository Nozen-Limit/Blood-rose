/* ==========================================================================
   WIKI DATA — now live from Supabase, not a hardcoded list.

   This used to be a plain object with `classes` and `glossary` arrays (see
   git history for the old version). Officers editing classes and glossary
   terms through the admin app write directly to the `wiki_items` table,
   one row per class or term, distinguished by `kind`. This file's only
   job now is fetching that table, reshaping it into the
   { classes, glossary } shape js/wiki.js already expects, and putting it
   where js/wiki.js already expects to find it.

   The "Mechanics" writing on wiki.html is prose, not records, so it stays
   in wiki.html as normal HTML and isn't touched here.

   BR.dataReady.wiki is a Promise that resolves once the fetch completes.
   js/wiki.js waits for it before rendering, so it never runs against an
   empty BR.data.wiki just because the network request hasn't finished
   yet.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};
window.BR.dataReady = window.BR.dataReady || {};

window.BR.dataReady.wiki = BR.fetchTable("wiki_items", "sort_order.asc").then(
  function (rows) {
    window.BR.data.wiki = {
      classes: rows.filter(function (r) { return r.kind === "class"; }),
      glossary: {
        columns: ["Term", "Meaning"],
        rows: rows
          .filter(function (r) { return r.kind === "glossary"; })
          .map(function (r) { return [r.title, r.body || ""]; })
      }
    };
  }
);
