/* ==========================================================================
   GALLERY DATA — now live from Supabase, not a hardcoded list.

   This used to be a plain array (see git history for the old version).
   Officers editing the gallery through the admin app write directly to
   the `gallery_sections` table; this file's only job now is fetching
   that table and putting it where js/gallery.js already expects to find
   it.

   BR.dataReady.gallery is a Promise that resolves once the fetch
   completes. js/gallery.js waits for it before rendering, so it never
   runs against an empty BR.data.gallery just because the network request
   hasn't finished yet.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};
window.BR.dataReady = window.BR.dataReady || {};

window.BR.dataReady.gallery = BR.fetchTable("gallery_sections", "sort_order.asc").then(
  function (rows) {
    window.BR.data.gallery = rows;
  }
);
