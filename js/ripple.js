/* ==========================================================================
   BUTTON RIPPLE
   Expands a circle from wherever the button was clicked. Purely decorative
   feedback, so it's skipped entirely under reduced motion.
   ========================================================================== */

(function (BR) {
  "use strict";

  if (BR.prefersReducedMotion) return;

  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      /* Sized to the button's longest edge so the circle always covers it */
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement("span");

      ripple.className = "ripple";
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      /* e.clientX/Y are viewport coordinates; subtracting the button's own
         position converts them to a position inside the button. Then shift
         by half the width so the circle is centred on the click. */
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      btn.appendChild(ripple);

      /* Clean up after the CSS animation finishes, otherwise every click
         leaves another dead span in the DOM forever. */
      ripple.addEventListener("animationend", function () {
        ripple.remove();
      });
    });
  });
})(window.BR);
