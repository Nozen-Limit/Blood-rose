/* ==========================================================================
   WIKI  (wiki.html)
   Fills the class-card grid from BR.data.wiki.

   The "Mechanics" prose on that page is plain HTML and isn't touched here.
   Glossary was removed from the public site — js/data/wiki.js still fetches
   glossary rows (kind='glossary' entries stay manageable in the admin app),
   this file just no longer displays them.

   Wiki data now loads from Supabase asynchronously (see js/data/wiki.js),
   so everything below is wrapped in render() and only actually runs once
   BR.dataReady.wiki resolves. If some future page still provides wiki data
   synchronously instead, this falls back to running immediately.
   ========================================================================== */

(function (BR) {
  "use strict";

  function render() {
  var wiki = (BR.data && BR.data.wiki) || {};

  /* --- Class cards --- */
  var classMount = document.getElementById("class-grid");
  if (classMount) {
    var classes = wiki.classes || [];
    if (classes.length) {
      classes.forEach(function (item) {
        classMount.appendChild(BR.buildInfoCard(item));
      });
    } else {
      classMount.appendChild(BR.el("p", "timeline-empty", "No classes listed yet."));
    }
  }

  } // end render()

  if (BR.dataReady && BR.dataReady.wiki && typeof BR.dataReady.wiki.then === "function") {
    BR.dataReady.wiki.then(render);
  } else {
    render();
  }
})(window.BR);
