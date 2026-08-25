/* ==========================================================================
   HERO STATS DATA — now live from Supabase, not a hardcoded list.

   This used to be a plain array (see git history for the old version).
   Officers editing stats through the admin app write directly to the
   `stats` table; this file's only job now is fetching that table and
   putting it where js/stats.js already expects to find it.

   BR.dataReady.stats is a Promise that resolves once the fetch completes.
   js/stats.js waits for it before rendering, so it never runs against an
   empty BR.data.stats just because the network request hasn't finished
   yet.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};
window.BR.dataReady = window.BR.dataReady || {};

window.BR.dataReady.stats = BR.fetchTable("stats", "sort_order.asc").then(
  function (rows) {
    window.BR.data.stats = rows;
  }
);
