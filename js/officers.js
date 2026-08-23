/* ==========================================================================
   OFFICERS  (index.html)
   Builds the officer cards from BR.data.officers.

   The Guild Master is pulled out of the list and rendered in their own
   wider card above the grid, no matter where they sit in the data.

   There's no "More Info" button — the panel opens on hover (desktop),
   on tapping the card (touch), and on keyboard focus. See css/cards.css.

   To change who's listed, edit js/data/officers.js — not this file.
   ========================================================================== */

(function (BR) {
  "use strict";

  var featuredMount = document.getElementById("guild-master");
  var gridMount = document.getElementById("officer-grid");
  if (!featuredMount && !gridMount) return;

  var officers = (BR.data && BR.data.officers) || [];

  /* Grey silhouette drawn inline, so a missing photo still looks deliberate
     and there's no extra file to ship. */
  var PLACEHOLDER_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E" +
    "%3Crect width='100' height='100' fill='%231C1817'/%3E" +
    "%3Ccircle cx='50' cy='38' r='18' fill='%23A39D99'/%3E" +
    "%3Ccircle cx='50' cy='100' r='38' fill='%23A39D99'/%3E%3C/svg%3E";

  function isGuildMaster(officer) {
    return String(officer.rank || "").trim().toLowerCase() === "guild master";
  }

  function buildCard(officer, featured) {
    var card = BR.el("div", "officer-card");
    /* Only the featured card gets the scroll-reveal fade. Cards inside the
       carousel are parked off-screen in a clipped track, so the reveal
       observer would treat them as "not visible" and could leave them
       stuck at zero opacity even after you page to them. */
    if (featured) card.classList.add("reveal", "officer-card-featured");

    /* --- Avatar --- */
    var avatar = document.createElement("img");
    avatar.className = "officer-avatar";
    avatar.src = officer.avatar || PLACEHOLDER_AVATAR;
    avatar.alt = officer.avatar
      ? officer.name + ", " + officer.rank
      : "Placeholder avatar for " + (officer.name || "officer");
    card.appendChild(avatar);

    /* Everything except the avatar, so the featured card can lay them out
       side by side while the normal cards stay stacked. */
    var body = BR.el("div", "officer-body");
    body.appendChild(BR.el("p", "officer-name", officer.name || ""));
    body.appendChild(BR.el("p", "officer-rank", officer.rank || ""));
    body.appendChild(BR.el("p", "officer-note", officer.note || ""));

    /* --- Panel: credentials and social links ---
       Always built, even when empty, so every card responds to hover and
       tap. An officer with nothing filled in yet shows a short placeholder
       rather than opening a blank box. */
    var details = officer.details || [];
    var socialList = BR.buildSocialLinks(officer.socials);
    var panel = BR.el("div", "officer-details");

    details.forEach(function (row) {
      var p = BR.el("p");
      p.appendChild(BR.el("strong", null, row.label + ":"));
      p.appendChild(document.createTextNode(" " + (row.value || "")));
      panel.appendChild(p);
    });

    if (socialList) panel.appendChild(socialList);

    if (!details.length && !socialList) {
      panel.appendChild(
        BR.el("p", "officer-details-empty", "No details added yet.")
      );
    }

    body.appendChild(panel);
    card.classList.add("officer-card-interactive");

    /* Touch devices can't hover, so tapping the card opens it. Clicks on
       a link inside are left alone — otherwise tapping someone's YouTube
       link would also collapse the panel out from under you. */
    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      panel.classList.toggle("is-open");
    });

    card.appendChild(body);
    return card;
  }

  /* --- Split the Guild Master out from everyone else ---
     Only the first one counts, so a stray second "Guild Master" in the data
     is shown as a normal officer rather than silently creating two. */
  var guildMaster = null;
  var rest = [];

  officers.forEach(function (officer) {
    if (!guildMaster && isGuildMaster(officer)) {
      guildMaster = officer;
    } else {
      rest.push(officer);
    }
  });

  if (featuredMount && guildMaster) {
    featuredMount.appendChild(buildCard(guildMaster, true));
  }

  if (gridMount) {
    if (!officers.length) {
      gridMount.appendChild(BR.el("p", "timeline-empty", "No officers listed yet."));
      return;
    }

    /* Five per page. With a roster this long a plain grid would be a very
       tall wall of cards, so they're paged through instead. */
    var cards = rest.map(function (officer) {
      return buildCard(officer, false);
    });

    gridMount.appendChild(
      BR.buildCarousel(cards, 5, "officer-carousel-grid", "officers")
    );
  }
})(window.BR);
