/* ==========================================================================
   FLOATING UI
   The back-to-top button and the sticky mobile Discord bar. Both appear
   once the visitor has scrolled past the hero, so they're driven together.
   ========================================================================== */

(function (BR) {
  "use strict";

  var backToTop = document.getElementById("back-to-top");
  var mobileCta = document.getElementById("mobile-cta");
  var hero = document.getElementById("hero");

  if (!backToTop && !mobileCta) return;

  /* Sub-pages have no #hero, so fall back to a fixed distance */
  var threshold = hero ? hero.offsetHeight * 0.6 : 400;

  BR.onScroll(function () {
    var pastHero = window.scrollY > threshold;
    if (backToTop) backToTop.classList.toggle("is-visible", pastHero);
    if (mobileCta) mobileCta.classList.toggle("is-visible", pastHero);
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        /* Honour reduced motion — a long smooth scroll is exactly the kind
           of movement that setting exists to prevent. */
        behavior: BR.prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }
})(window.BR);
