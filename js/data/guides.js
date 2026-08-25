/* ==========================================================================
   GUIDE DATA — now live from Supabase, not a hardcoded list.

   This used to be a plain object (see git history for the old version).
   Officers editing guides through the admin app write directly to the
   `guide_items` table, one row per build, video, or procs/mechanics
   entry, distinguished by `kind`; this file's only job now is fetching
   that table, splitting it into the { builds, videos, mechanics } shape
   js/guides.js expects, and putting it where js/guides.js expects to
   find it. "Procs & Mechanics" used to be hand-written prose fixed in
   guides.html — it's real records now too, same as builds and videos.

   The DB column is `youtube_id` (snake_case) but BR.buildVideoCard reads
   `youtubeId` (camelCase) — mapped below when building the videos array.

   BR.dataReady.guides is a Promise that resolves once the fetch
   completes. js/guides.js waits for it before rendering, so it never
   runs against an empty BR.data.guides just because the network request
   hasn't finished yet.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};
window.BR.dataReady = window.BR.dataReady || {};

window.BR.dataReady.guides = BR.fetchTable("guide_items", "sort_order.asc").then(
  function (rows) {
    window.BR.data.guides = {
      builds: rows.filter(function (r) { return r.kind === "build"; }),
      videos: rows.filter(function (r) { return r.kind === "video"; }).map(
        function (r) {
          return {
            title: r.title,
            youtubeId: r.youtube_id || undefined,
            url: r.url || undefined
          };
        }
      ),
      mechanics: rows.filter(function (r) { return r.kind === "mechanic"; })
    };
  }
);
