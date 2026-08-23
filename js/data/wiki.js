/* ==========================================================================
   WIKI DATA
   Feeds the class cards and the glossary table on wiki.html.

   The "Mechanics" writing on that page is prose, not records, so it stays
   in wiki.html as normal HTML.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.wiki = {

  /* ---------- Replace with real class summaries ---------- */
  classes: [
    { title: "Warrior", body: "Placeholder summary of the class and its role." },
    { title: "Rogue", body: "Placeholder summary of the class and its role." },
    { title: "Sorcerer", body: "Placeholder summary of the class and its role." }
  ],

  /* ---------- Replace with real terms. One array per row. ---------- */
  glossary: {
    columns: ["Term", "Meaning"],
    rows: [
      ["Placeholder term 1", "Placeholder meaning"],
      ["Placeholder term 2", "Placeholder meaning"],
      ["Placeholder term 3", "Placeholder meaning"]
    ]
  }

};
