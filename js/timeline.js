/* ==========================================================================
   TIMELINE  (events.html and events-history.html)
   Builds the event roadmap from BR.data.events, then wires up tap-to-open.

   This file is the "how it looks" half; js/data/events.js is the "what it
   says" half. To change an event, edit the data file — not this one.

   ---------------------------------------------------------------------------
   ROLLING 3-MONTH WINDOW

   The Events page shows the 3 most recent months. Anything older is shown
   on events-history.html instead. Nothing is archived by hand — as soon as
   a 4th month of events exists, the oldest one moves to history on its own.

   Both pages load this same file. Which half gets rendered depends purely
   on which mount element the page contains:
       #event-roadmap  -> the 3 most recent months
       #event-history  -> everything older
   ---------------------------------------------------------------------------

   ---------------------------------------------------------------------------
   WAITING FOR THE DATA

   js/data/events.js now fetches from Supabase instead of listing events
   directly, so the data isn't necessarily ready the instant this file runs
   — a network request takes time a hardcoded array never did. Everything
   below is wrapped in render() and only actually runs once
   BR.dataReady.events resolves. If some future page still provides events
   synchronously instead, this falls back to running immediately.
   ---------------------------------------------------------------------------
   ========================================================================== */

(function (BR) {
  "use strict";

  var roadmapMount = document.getElementById("event-roadmap");
  var historyMount = document.getElementById("event-history");
  var mount = roadmapMount || historyMount;
  if (!mount) return;

  var isHistory = !roadmapMount && !!historyMount;

  /* How many months stay on the main Events page before rolling off */
  var MONTHS_SHOWN = 3;

  function render() {
  var events = (BR.data && BR.data.events) || [];

  /* Badge wording per status. Keeping it here rather than in the data means
     nobody can typo "Cancelled" vs "Canceled" into a mismatch.

     Object.create(null) rather than {} so a status typed as "constructor"
     or "toString" can't match a built-in property and return something
     bizarre — an unrecognised status must simply be unrecognised. */
  var STATUS_LABELS = Object.assign(Object.create(null), {
    ongoing: "Ongoing",
    done: "Done",
    rescheduled: "Rescheduled",
    canceled: "Canceled"
  });

  /* --- event_date is now a real date/time, picked from a calendar in the
     admin — not free-typed text. That means no more scanning strings for
     a year and a month name; a plain new Date() does the actual parsing,
     and it's reliable here specifically because event_date always comes
     from a <input type="datetime-local">, not from someone's typing.

     Still returns null for anything genuinely broken (a null date, a
     corrupted value), so bad data sorts to the end instead of crashing. */
  var MONTH_FULL = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var MONTH_ABBR = MONTH_FULL.map(function (name) {
    return name.slice(0, 3);
  });

  function parseEventDate(value) {
    /* new Date(null) silently becomes new Date(0) — the Unix epoch — which
       passes an isNaN() check just fine despite being nonsense here. Reject
       anything falsy before it ever reaches the Date constructor. */
    if (!value) return null;

    var date = new Date(value);
    if (isNaN(date.getTime())) return null;

    return {
      date: date,
      /* One number that sorts correctly across year boundaries */
      key: date.getFullYear() * 12 + date.getMonth(),
      label: MONTH_FULL[date.getMonth()] + " " + date.getFullYear()
    };
  }

  /* Turns a real Date into "Aug 12, 6:00 PM" — hand-formatted rather than
     toLocaleString(), so it looks identical for every visitor regardless
     of their browser's language/region settings, matching the rest of the
     site's fixed English copy. */
  function formatEventDate(date) {
    var hours24 = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours24 >= 12 ? "PM" : "AM";
    var hours12 = hours24 % 12 || 12;
    var minuteText = minutes < 10 ? "0" + minutes : String(minutes);

    return (
      MONTH_ABBR[date.getMonth()] + " " + date.getDate() +
      ", " + hours12 + ":" + minuteText + " " + ampm
    );
  }

  /* --- Group by month, then sort newest first ---
     Object.create(null) makes a plain lookup with no inherited keys, so a
     label like "constructor" can't confuse the check. */
  var groups = [];
  var seen = Object.create(null);

  events.forEach(function (event) {
    var parsed = parseEventDate(event.event_date);
    var label = parsed ? parsed.label : "Undated";

    if (!seen[label]) {
      seen[label] = { month: label, items: [], key: parsed ? parsed.key : null };
      groups.push(seen[label]);
    }

    /* Stashed on the event itself so buildItem() below doesn't have to
       re-parse the same date a second time. */
    event._parsedDate = parsed ? parsed.date : null;
    seen[label].items.push(event);
  });

  /* Newest month first. Unparseable months (key null) go last rather than
     jumping to the top, which is what they'd do if treated as 0. */
  groups.sort(function (a, b) {
    if (a.key === null && b.key === null) return 0;
    if (a.key === null) return 1;
    if (b.key === null) return -1;
    return b.key - a.key;
  });

  /* --- Split: recent months stay on Events, the rest go to History --- */
  var recentGroups = groups.slice(0, MONTHS_SHOWN);
  var olderGroups = groups.slice(MONTHS_SHOWN);
  groups = isHistory ? olderGroups : recentGroups;

  /* Only shown on the Events page, and only once history actually exists —
     a link to an empty archive is worse than no link. */
  var historyLink = document.getElementById("event-history-link");
  if (historyLink && !isHistory && olderGroups.length) {
    historyLink.hidden = false;
  }

  if (!groups.length) {
    mount.appendChild(
      BR.el(
        "p",
        "timeline-empty",
        isHistory ? "No past events yet." : "No events posted yet."
      )
    );
    return;
  }

  /* --- Build one event row --- */
  function buildItem(event) {
    var label = STATUS_LABELS[event.status];

    var item = BR.el("li", "timeline-item");
    /* Drives the dot colour, the badge colour and the strikethrough,
       all from this one attribute (see css/timeline.css).
       An unrecognised status gets no attribute, so it falls back to the
       neutral grey styling rather than breaking. */
    if (label) item.setAttribute("data-status", event.status);

    var dot = BR.el("span", "timeline-dot");
    dot.setAttribute("aria-hidden", "true");

    var entry = BR.el("div", "timeline-entry");
    var dateText = event._parsedDate ? formatEventDate(event._parsedDate) : "Date TBD";
    entry.appendChild(BR.el("span", "timeline-date", dateText));
    entry.appendChild(BR.el("span", "timeline-title", event.title || "Untitled event"));
    entry.appendChild(BR.el("span", "status", label || "Unknown"));

    item.appendChild(dot);
    item.appendChild(entry);
    return item;
  }

  /* --- Render every month group ---
     Everything is assembled in a DocumentFragment first, so the page is
     only touched once at the end instead of on every single row. */
  var fragment = document.createDocumentFragment();

  groups.forEach(function (group) {
    fragment.appendChild(BR.el("h3", "timeline-month", group.month));

    var list = BR.el("ol", "timeline");
    group.items.forEach(function (event) {
      list.appendChild(buildItem(event));
    });

    fragment.appendChild(list);
  });

  mount.appendChild(fragment);
  } // end render()

  if (BR.dataReady && BR.dataReady.events && typeof BR.dataReady.events.then === "function") {
    BR.dataReady.events.then(render);
  } else {
    render();
  }
})(window.BR);
