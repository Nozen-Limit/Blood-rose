/* ==========================================================================
   PRICES  (prices.html)
   Builds every section of the page — heading and table — from
   BR.data.prices. Add a category there and a new section appears here.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("price-sections");
  if (!mount) return;

  var groups = (BR.data && BR.data.prices) || [];

  if (!groups.length) {
    mount.appendChild(BR.el("p", "timeline-empty", "No prices listed yet."));
    return;
  }

  var fragment = document.createDocumentFragment();

  groups.forEach(function (group) {
    var section = BR.buildSection(group.id, group.title || "");
    section.appendChild(
      BR.buildTable(group.columns || [], group.rows || [])
    );
    fragment.appendChild(section);
  });

  mount.appendChild(fragment);
})(window.BR);
