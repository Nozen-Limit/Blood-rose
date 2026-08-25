/* ==========================================================================
   TESTIMONIALS  (index.html)
   Builds the quote list from BR.data.testimonials, then cycles them.

   All quotes are rendered at once and stacked by CSS; this only moves the
   .is-active class along. The fade itself is a CSS transition.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("testimonials");
  if (!mount) return;

  function render() {
  var quotes = (BR.data && BR.data.testimonials) || [];
  if (!quotes.length) return;

  var INTERVAL = 5000; // milliseconds

  quotes.forEach(function (item, index) {
    var block = BR.el("blockquote", "testimonial-quote");
    /* First one starts visible */
    if (index === 0) block.classList.add("is-active");

    block.appendChild(BR.el("p", null, '"' + (item.quote || "") + '"'));
    block.appendChild(BR.el("cite", null, "— " + (item.name || "")));
    mount.appendChild(block);
  });

  /* A single quote has nothing to rotate to */
  if (quotes.length < 2) return;

  var nodes = mount.querySelectorAll(".testimonial-quote");
  var activeIndex = 0;

  setInterval(function () {
    nodes[activeIndex].classList.remove("is-active");
    /* Modulo wraps back to the first quote after the last */
    activeIndex = (activeIndex + 1) % nodes.length;
    nodes[activeIndex].classList.add("is-active");
  }, INTERVAL);
  } // end render()

  if (BR.dataReady && BR.dataReady.testimonials && typeof BR.dataReady.testimonials.then === "function") {
    BR.dataReady.testimonials.then(render);
  } else {
    render();
  }
})(window.BR);
