/* ==========================================================================
   SUPABASE CLIENT (public site)
   Talks to Supabase using plain fetch() instead of the @supabase/supabase-js
   library — the public site has no build step, so pulling in a whole
   library (or a CDN script) for what's really just "GET this URL with two
   headers" isn't worth it. The admin app (a separate Next.js project) uses
   the real library instead, since it also needs auth, which this doesn't.

   Must load before any js/data/*.js file that fetches from a table.

   SECURITY NOTE: the key below is the "publishable" key, deliberately safe
   to expose in a browser — it grants no special access on its own. Actual
   protection is the Row Level Security policy in schema.sql ("public read,
   only logged-in officers write"), enforced by Supabase itself, not by
   keeping this key secret.
   ========================================================================== */

window.BR = window.BR || {};

window.BR.supabase = {
  url: "https://omsjemvouxyzadqphlft.supabase.co",
  anonKey: "sb_publishable_s2WpudIxzp9YIbMIIltckQ_mr_NsNkj"
};

/* Fetches every row from a public table.
     table    e.g. "events"
     orderBy  e.g. "sort_order.asc" — optional, passed straight to
              PostgREST's own ?order= syntax

   Returns a Promise resolving to an array of rows, or [] if the request
   fails — a broken network shouldn't crash the whole page, just show an
   empty section. */
window.BR.fetchTable = function (table, orderBy) {
  var url = BR.supabase.url + "/rest/v1/" + table + "?select=*";
  if (orderBy) url += "&order=" + orderBy;

  return fetch(url, {
    headers: {
      apikey: BR.supabase.anonKey,
      Authorization: "Bearer " + BR.supabase.anonKey
    }
  })
    .then(function (res) {
      if (!res.ok) throw new Error(table + ": " + res.status);
      return res.json();
    })
    .catch(function (err) {
      console.error("Supabase fetch failed:", err);
      return [];
    });
};
