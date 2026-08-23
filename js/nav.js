/* ==========================================================================
   NAV
   Header shadow on scroll, closing the mobile menu after a tap, and marking
   which page the visitor is currently on.
   ========================================================================== */

(function (BR) {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.getElementById("nav-toggle");
  /* Excludes the Discord button — it leaves the site, so it never counts as
     the "current page" and doesn't need the underline treatment. */
  var navLinks = document.querySelectorAll(".nav-links a:not(.nav-cta)");

  /* --- Drop a shadow under the header once the page has scrolled --- */
  if (header) {
    BR.onScroll(function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    });
  }

  /* --- Close the mobile dropdown after tapping a link ---
     The menu is a CSS checkbox hack, so "closing" it means unchecking the
     box. Without this the menu stays open over the new page. */
  if (navToggle) {
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.checked = false;
      });
    });
  }

  /* --- Highlight the current page ---
     location.pathname is the full path; the last segment is the filename.
     Opening the folder itself gives an empty segment, so fall back to
     index.html. */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href").split("#")[0];
    if (linkPage === currentPage) {
      link.classList.add("is-current");
    }
  });
})(window.BR);
