/* ==========================================================================
   GALLERY  (gallery.html)
   Builds every section of the page from BR.data.gallery. Each section is
   either a grid of images or a grid of video cards, decided by its `type`.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("gallery-sections");
  if (!mount) return;

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
})(window.BR);
