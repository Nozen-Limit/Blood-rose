/* ==========================================================================
   EVENT DATA
   The event roadmap on events.html is built from this list.
   js/timeline.js turns it into the HTML — you never touch the HTML.

   ---------------------------------------------------------------------------
   TO ADD AN EVENT
   Copy one block, change the words between the quotes, done. Keep the
   comma at the end of each block.

     month    Heading it appears under. Events sharing a month group
              together, in the order they appear here.
     date     Whatever you want shown. "Aug 9", "Aug 18-20", "Every Sunday".
     title    Name of the event.
     status   ongoing | done | rescheduled | canceled
              Nothing else works — anything unrecognised shows as plain grey.
     details  Shown when someone hovers or taps the entry.

   Newest month goes at the top.
   No ids to manage — the code generates those.
   ---------------------------------------------------------------------------

   Later, when the site has a database, this file gets replaced by a single
   fetch. Nothing else about the events page changes.
   ========================================================================== */

window.BR = window.BR || {};
window.BR.data = window.BR.data || {};

window.BR.data.events = [

  /* ---------- Replace all of these with your real events ---------- */

  {
    month: "August 2026",
    date: "Aug 18–20",
    title: "Guild War Season",
    status: "ongoing",
    details: "Placeholder details — what the event is, who can join, and what the rewards are."
  },
  {
    month: "August 2026",
    date: "Aug 9",
    title: "Elite Dungeon Marathon",
    status: "done",
    details: "Placeholder details — how it went, who showed up, who won."
  },

  {
    month: "July 2026",
    date: "Jul 26",
    title: "Recruitment Push",
    status: "done",
    details: "Placeholder details — how many members joined, and how it was run."
  },
  {
    month: "July 2026",
    date: "Jul 14",
    title: "Guild Tournament",
    status: "canceled",
    details: "Placeholder details — why it was called off, and whether it's coming back."
  },
  {
    month: "July 2026",
    date: "Jul 6–7",
    title: "Recruitment Event",
    status: "done",
    details: "Placeholder details — what happened over the two days."
  },

  {
    month: "June 2026",
    date: "Jun 21",
    title: "Gold Loot Farm Night",
    status: "rescheduled",
    details: "Placeholder details — the original date, the new date, and why it moved."
  },
  {
    month: "June 2026",
    date: "Jun 5",
    title: "Guild Anniversary Party",
    status: "done",
    details: "Placeholder details — what was handed out and who turned up."
  }

];
