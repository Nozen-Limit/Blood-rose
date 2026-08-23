/* ==========================================================================
   GUIDES  (guides.html)
   Fills the build-card grid and the video grid from BR.data.guides.

   The "Procs & Mechanics" prose on that page is plain HTML and isn't
   touched here.
   ========================================================================== */

(function (BR) {
  "use strict";

  var guides = (BR.data && BR.data.guides) || {};

  /* --- Build cards --- */
  var buildMount = document.getElementById("build-grid");
  if (buildMount) {
    (guides.builds || []).forEach(function (item) {
      buildMount.appendChild(BR.buildInfoCard(item));
    });
  }

  /* --- Video carousel: 3 videos per slide, arrows page between groups --- */
  var videoMount = document.getElementById("guide-videos");
  if (videoMount) {
    videoMount.appendChild(BR.buildVideoCarousel(guides.videos || [], 3));
  }
})(window.BR);
