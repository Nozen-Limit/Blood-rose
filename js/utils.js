/* ==========================================================================
   UTILS — shared state for every other script.

   MUST load first. The other files read window.BR, so if this one isn't
   above them in the HTML they'll throw.

   Why a global object instead of `import`/`export`? ES modules are blocked
   by the browser's security rules when a page is opened straight from disk
   (the file:// protocol). Since this site is opened by double-clicking
   index.html, modules would break it completely. A shared namespace object
   is the standard way to do this without a build step.
   ========================================================================== */

window.BR = window.BR || {};

(function (BR) {
  "use strict";

  /* Tells CSS that JavaScript is running. animations.css gates the whole
     scroll-reveal system behind this class, so if any script fails the
     content stays visible instead of being stuck invisible. */
  document.documentElement.classList.add("js");

  /* Respects the "reduce motion" accessibility setting in the visitor's OS.
     Read once here so every script agrees on the answer. */
  BR.prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Namespace for content data. Each js/data/*.js file adds to this. */
  BR.data = BR.data || {};

  /* Builds an element. Used by the renderers instead of pasting HTML
     strings together.

     Why not innerHTML? Because the text going in here is content that
     officers type, and later it'll come from a database. textContent puts
     it in as plain text, so a stray < or a pasted <script> shows up as
     characters on the page instead of running as code. */
  BR.el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  };

  /* Runs a function on scroll, but at most once per frame. Scroll events can
     fire hundreds of times a second; requestAnimationFrame caps that to the
     screen's refresh rate so the page stays smooth. */
  BR.onScroll = function (callback) {
    var ticking = false;

    var run = function () {
      callback();
      ticking = false;
    };

    var handler = function () {
      if (!ticking) {
        window.requestAnimationFrame(run);
        ticking = true;
      }
    };

    callback();
    window.addEventListener("scroll", handler, { passive: true });
  };
})(window.BR);
