/* ==========================================================================
   PRICE DATA
   The whole prices.html page is built from this list — headings included.

   ---------------------------------------------------------------------------
   Each block is one section of the page:

     id       Used for the link anchor, e.g. prices.html#basic
              Keep it lowercase with dashes, and keep it matching
              js/search-index.js if that section is listed there.
     title    The heading shown on the page
     columns  Table header labels
     rows     One array per row, in the same order as `columns`

   To add a whole new price category, copy a block. To add a row, copy a
   line inside `rows`.
   ---------------------------------------------------------------------------
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.prices = [

  /* ---------- Replace all of these with your real prices ---------- */

  {
    id: "basic",
    title: "Basic Gear",
    columns: ["Item", "Price"],
    rows: [
      ["Placeholder item 1", "Placeholder price"],
      ["Placeholder item 2", "Placeholder price"],
      ["Placeholder item 3", "Placeholder price"]
    ]
  },

  {
    id: "endgame",
    title: "End-Game Full Gear Sets",
    columns: ["Set", "Price"],
    rows: [
      ["Placeholder set 1", "Placeholder price"],
      ["Placeholder set 2", "Placeholder price"]
    ]
  },

  {
    id: "gold-loot",
    title: "Gold Loot Sets",
    columns: ["Set", "Price"],
    rows: [
      ["Placeholder set 1", "Placeholder price"],
      ["Placeholder set 2", "Placeholder price"]
    ]
  }

];
