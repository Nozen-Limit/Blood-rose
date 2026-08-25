/* ==========================================================================
   OFFICER DATA — now live from Supabase, not a hardcoded list.

   This used to be a plain array (see git history for the old version).
   Officers editing their own profile through the admin app write directly
   to the `officers` table; this file's only job now is fetching that
   table and putting it where js/officers.js already expects to find it.

   BR.dataReady.officers is a Promise that resolves once the fetch
   completes. js/officers.js waits for it before rendering, so it never
   runs against an empty BR.data.officers just because the network
   request hasn't finished yet.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};
window.BR.dataReady = window.BR.dataReady || {};

window.BR.dataReady.officers = BR.fetchTable("officers", "sort_order.asc").then(
  function (rows) {
    window.BR.data.officers = rows;
  }
);
