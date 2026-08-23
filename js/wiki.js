/* ==========================================================================
   WIKI  (wiki.html)
   Fills the class-card grid and the glossary table from BR.data.wiki.

   The "Mechanics" prose on that page is plain HTML and isn't touched here.
   ========================================================================== */

(function (BR) {
  "use strict";

  var wiki = (BR.data && BR.data.wiki) || {};

  /* --- Class cards --- */
  var classMount = document.getElementById("class-grid");
  if (classMount) {
    (wiki.classes || []).forEach(function (item) {
      classMount.appendChild(BR.buildInfoCard(item));
    });
  }

  /* --- Glossary table --- */
  var glossaryMount = document.getElementById("glossary-table");
  if (glossaryMount && wiki.glossary) {
    glossaryMount.appendChild(
      BR.buildTable(wiki.glossary.columns || [], wiki.glossary.rows || [])
    );
  }
})(window.BR);
