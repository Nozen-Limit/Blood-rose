/* ==========================================================================
   PARALLAX
   Drifts the background glow blobs at a fraction of the scroll speed, which
   is what makes them read as "further away" than the content.

   Each element declares its own speed in the HTML via data-parallax, so you
   can retune the effect without touching this file.
   ========================================================================== */

(function (BR) {
  "use strict";

  var els = document.querySelectorAll("[data-parallax]");

  /* Nothing to animate, or the visitor asked for reduced motion — in which
     case don't even attach the scroll listener. */
  if (!els.length || BR.prefersReducedMotion) return;

  BR.onScroll(function () {
    var scrollY = window.scrollY;

    els.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
      /* transform (not top/margin) so the browser can move these on the GPU
         without recalculating the page layout on every frame. */
      el.style.transform = "translateY(" + scrollY * speed + "px)";
    });
  });
})(window.BR);
