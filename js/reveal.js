/* ==========================================================================
   SCROLL REVEAL
   Fades in anything marked class="reveal" as it enters the viewport.

   Uses IntersectionObserver, which lets the browser tell us when an element
   comes into view instead of us measuring positions on every scroll event.
   It's both simpler and much faster.

   ---------------------------------------------------------------------------
   LATE ARRIVALS
   This file's own scan of `.reveal` only catches elements that already
   exist in the DOM when this script runs. Content built from a Supabase
   fetch (e.g. the guild-master card in js/officers.js) shows up later,
   after that scan already happened — without BR.observeReveal, such an
   element would keep the CSS's default opacity: 0 forever, since nothing
   would ever add .is-visible to it. Any renderer that builds a `.reveal`
   element after page load must call BR.observeReveal(el) on it.
   ---------------------------------------------------------------------------
   ========================================================================== */

(function (BR) {
  "use strict";

  var supportsObserver = "IntersectionObserver" in window;

  /* Older browsers without IntersectionObserver just get the content,
     un-animated, rather than a page of invisible boxes. */
  var observer = supportsObserver
    ? new IntersectionObserver(
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
      )
    : null;

  function observe(el) {
    if (!el) return;
    if (!supportsObserver) {
      el.classList.add("is-visible");
      return;
    }
    observer.observe(el);
  }

  BR.observeReveal = observe;

  document.querySelectorAll(".reveal").forEach(observe);
})(window.BR);
