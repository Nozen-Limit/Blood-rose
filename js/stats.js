/* ==========================================================================
   HERO STATS  (index.html)
   Builds the stat strip from BR.data.stats, then counts the numbers up.

   A value that's a number animates; anything else (like a year written as
   text) is printed as-is.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("stat-strip");
  if (!mount) return;

  var stats = (BR.data && BR.data.stats) || [];
  if (!stats.length) return;

  var DURATION = 1200; // milliseconds

  function countUp(el, target) {
    var start = null;

    /* requestAnimationFrame hands us a timestamp each frame. Working out
       progress from elapsed time, rather than adding a fixed amount per
       frame, keeps the animation the same length on every device. */
    function step(timestamp) {
      if (start === null) start = timestamp;

      var progress = Math.min((timestamp - start) / DURATION, 1);
      el.textContent = Math.round(progress * target);

      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  var fragment = document.createDocumentFragment();

  stats.forEach(function (stat) {
    var item = BR.el("div", "stat-item");
    var isNumber = typeof stat.value === "number" && isFinite(stat.value);

    /* Start numbers at 0 so there's something sensible on screen for the
       split second before the animation begins. */
    var value = BR.el("span", "stat-value", isNumber ? "0" : String(stat.value));

    item.appendChild(value);
    item.appendChild(BR.el("span", "stat-label", stat.label || ""));
    fragment.appendChild(item);

    if (!isNumber) return;

    if (BR.prefersReducedMotion) {
      value.textContent = stat.value;
    } else {
      countUp(value, stat.value);
    }
  });

  mount.appendChild(fragment);
})(window.BR);
