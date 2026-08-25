/* ==========================================================================
   GUIDES  (guides.html)
   Fills the build-card grid, the video grid, and the Procs & Mechanics
   grid from BR.data.guides. All three are real records now — none of
   this page is hand-written prose any more.

   Guide data now loads from Supabase asynchronously (see
   js/data/guides.js), so everything below is wrapped in render() and only
   actually runs once BR.dataReady.guides resolves. If some future page
   still provides guides synchronously instead, this falls back to running
   immediately.
   ========================================================================== */

(function (BR) {
  "use strict";

  function render() {
  var guides = (BR.data && BR.data.guides) || {};

  /* --- Build cards --- */
  var buildMount = document.getElementById("build-grid");
  if (buildMount) {
    var builds = guides.builds || [];
    if (builds.length) {
      builds.forEach(function (item) {
        buildMount.appendChild(BR.buildInfoCard(item));
      });
    } else {
      buildMount.appendChild(BR.el("p", "guides-empty", "To be placed soon."));
    }
  }

  /* --- Video carousel: 3 videos per slide, arrows page between groups --- */
  var videoMount = document.getElementById("guide-videos");
  if (videoMount) {
    videoMount.appendChild(BR.buildVideoCarousel(guides.videos || [], 3));
  }

  /* --- Procs & Mechanics cards --- */
  var procsMount = document.getElementById("procs-grid");
  if (procsMount) {
    var mechanics = guides.mechanics || [];
    if (mechanics.length) {
      mechanics.forEach(function (item) {
        procsMount.appendChild(BR.buildInfoCard(item));
      });
    } else {
      procsMount.appendChild(BR.el("p", "guides-empty", "To be placed soon."));
    }
  }
  } // end render()

  if (BR.dataReady && BR.dataReady.guides && typeof BR.dataReady.guides.then === "function") {
    BR.dataReady.guides.then(render);
  } else {
    render();
  }
})(window.BR);
