/* ==========================================================================
   SCROLL REVEAL
   Fades in anything marked class="reveal" as it enters the viewport.

   Uses IntersectionObserver, which lets the browser tell us when an element
   comes into view instead of us measuring positions on every scroll event.
   It's both simpler and much faster.
   ========================================================================== */

(function () {
  "use strict";

  var revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  /* Older browsers without IntersectionObserver just get the content,
     un-animated, rather than a page of invisible boxes. */
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        /* Reveal is one-way, so stop watching this element. Keeps the
           observer's work shrinking as the visitor scrolls. */
        observer.unobserve(entry.target);
      });
    },
    {
      // Fire once 15% of the element is showing
      threshold: 0.15,
      // ...and only after it's 40px past the bottom edge, so it doesn't
      // animate while still half off-screen
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
