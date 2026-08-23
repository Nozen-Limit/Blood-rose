/* ==========================================================================
   GALLERY DATA
   The whole gallery.html page is built from this list — headings included.

   ---------------------------------------------------------------------------
   Each block is one section:

     id     Link anchor, e.g. gallery.html#funny
     title  Heading on the page
     type   "images" or "videos"
     items  What goes in it

   IMAGES
     { src: "images/gvg-win.jpg", alt: "Blood Rose after the GvG final" }
     Leave `src` empty to keep the dashed placeholder box.
     Always write `alt` — it describes the picture for anyone using a
     screen reader, and shows if the file goes missing.

   VIDEOS
     { title: "...", youtubeId: "dQw4w9WgXcQ" }   embeds the player
     { title: "...", url: "https://youtu.be/..." } plain link
     Neither one set = placeholder box.
   ---------------------------------------------------------------------------
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.gallery = [

  /* ---------- Replace with your real media ---------- */

  {
    id: "activities",
    title: "Guild Activities",
    type: "images",
    items: [
      { src: "", alt: "", caption: "Image placeholder" },
      { src: "", alt: "", caption: "Image placeholder" },
      { src: "", alt: "", caption: "Image placeholder" },
      { src: "", alt: "", caption: "Image placeholder" }
    ]
  },

  {
    id: "funny",
    title: "Funny Videos",
    type: "videos",
    items: [
      { title: "Placeholder funny moment title", url: "" },
      { title: "Placeholder funny moment title", url: "" }
    ]
  },

  {
    id: "serious",
    title: "Serious Videos",
    type: "videos",
    items: [
      { title: "Placeholder GvG highlight title", url: "" },
      { title: "Placeholder GvG highlight title", url: "" }
    ]
  }

];
