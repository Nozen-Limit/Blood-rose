/* ==========================================================================
   GALLERY  (gallery.html)
   Builds every section of the page from BR.data.gallery. Each section is
   either a grid of images or a grid of video cards, decided by its `type`.

   Gallery data now loads from Supabase asynchronously (see
   js/data/gallery.js), so everything below is wrapped in render() and only
   actually runs once BR.dataReady.gallery resolves. If some future page
   still provides the gallery synchronously instead, this falls back to
   running immediately.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("gallery-sections");
  if (!mount) return;

  function render() {
  var groups = (BR.data && BR.data.gallery) || [];

  if (!groups.length) {
    mount.appendChild(BR.el("p", "timeline-empty", "Nothing in the gallery yet."));
    return;
  }

  var fragment = document.createDocumentFragment();

  groups.forEach(function (group) {
    var section = BR.buildSection(group.id, group.title || "");
    var items = group.items || [];
    var isVideo = group.type === "videos";

    var grid = BR.el("div", isVideo ? "video-grid" : "image-grid");

    items.forEach(function (item) {
      grid.appendChild(
        isVideo ? BR.buildVideoCard(item) : BR.buildGalleryImage(item)
      );
    });

    section.appendChild(grid);
    fragment.appendChild(section);
  });

  mount.appendChild(fragment);
  } // end render()

  if (BR.dataReady && BR.dataReady.gallery && typeof BR.dataReady.gallery.then === "function") {
    BR.dataReady.gallery.then(render);
  } else {
    render();
  }
})(window.BR);
