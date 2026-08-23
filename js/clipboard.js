/* ==========================================================================
   COPY LINK
   Copies the Discord invite to the clipboard so people on phones don't have
   to long-press and fiddle with a text selection.

   The link itself lives in the HTML as data-copy-text, so changing the
   invite never means editing JavaScript.
   ========================================================================== */

(function () {
  "use strict";

  var btn = document.querySelector(".copy-link-btn");
  if (!btn) return;

  var label = btn.querySelector(".copy-link-label");
  var defaultLabel = label ? label.textContent : "";

  function showCopied() {
    btn.classList.add("is-copied");
    if (label) label.textContent = "Copied!";

    setTimeout(function () {
      btn.classList.remove("is-copied");
      if (label) label.textContent = defaultLabel;
    }, 1500);
  }

  /* Older browsers, and any page not served over https, don't get the
     modern clipboard API — this falls back to the old trick of selecting
     text from a hidden textarea. Worth keeping since opening the site from
     a local file counts as one of those cases. */
  function fallbackCopy(text) {
    var temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();

    try {
      document.execCommand("copy");
      showCopied();
    } catch (err) {
      /* Clipboard genuinely unavailable — leave the label alone rather
         than claiming a copy that didn't happen. */
    }

    document.body.removeChild(temp);
  }

  btn.addEventListener("click", function () {
    var text = btn.getAttribute("data-copy-text") || "";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  });
})();
