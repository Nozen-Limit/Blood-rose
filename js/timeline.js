/* ==========================================================================
   TIMELINE  (events.html only)
   Builds the event roadmap from BR.data.events, then wires up tap-to-open.

   This file is the "how it looks" half; js/data/events.js is the "what it
   says" half. To change an event, edit the data file — not this one.

   When the backend arrives, the only line that changes is where `events`
   comes from: instead of reading BR.data.events, it awaits a database
   query. Everything below stays exactly as it is.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("event-roadmap");
  if (!mount) return;

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

  if (!events.length) {
    mount.appendChild(
      BR.el("p", "timeline-empty", "No events posted yet.")
    );
    return;
  }

  /* --- Group by month, keeping the order the data is written in ---
     Object.create(null) makes a plain lookup with no inherited keys, so a
     month named something like "constructor" can't confuse the check. */
  var groups = [];
  var seen = Object.create(null);

  events.forEach(function (event) {
    var month = event.month || "Undated";

    if (!seen[month]) {
      seen[month] = { month: month, items: [] };
      groups.push(seen[month]);
    }

    seen[month].items.push(event);
  });

  /* --- Build one event row --- */
  var idCounter = 0;

  function buildItem(event) {
    idCounter += 1;
    var panelId = "ev-" + idCounter;
    var label = STATUS_LABELS[event.status];

    var item = BR.el("li", "timeline-item");
    /* Drives the dot colour, the badge colour and the strikethrough,
       all from this one attribute (see css/timeline.css).
       An unrecognised status gets no attribute, so it falls back to the
       neutral grey styling rather than breaking. */
    if (label) item.setAttribute("data-status", event.status);

    var dot = BR.el("span", "timeline-dot");
    dot.setAttribute("aria-hidden", "true");

    var button = BR.el("button", "timeline-entry");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panelId);

    button.appendChild(BR.el("span", "timeline-date", event.date || ""));
    button.appendChild(BR.el("span", "timeline-title", event.title || "Untitled event"));
    button.appendChild(BR.el("span", "status", label || "Unknown"));

    var details = BR.el("div", "timeline-details");
    details.id = panelId;
    details.appendChild(
      BR.el("p", null, event.details || "No details yet.")
    );

    /* Desktop hover and keyboard focus are pure CSS; this is only so touch
       users, who can't hover, can open an entry. */
    button.addEventListener("click", function () {
      var isOpen = details.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    item.appendChild(dot);
    item.appendChild(button);
    item.appendChild(details);
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
})(window.BR);
