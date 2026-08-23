/* ==========================================================================
   SHARED RENDERERS
   Builders used by more than one page: tables, info cards, video cards and
   gallery images.

   Must load after utils.js (it uses BR.el) and before any page renderer.

   Everything here builds elements with textContent rather than pasting HTML
   strings. When this content eventually comes from a database that officers
   type into, that's what stops a stray < or a pasted <script> from running
   as code.
   ========================================================================== */

(function (BR) {
  "use strict";

  /* --- A data table, wrapped so it can scroll sideways on phones ---
     columns: ["Item", "Price"]
     rows:    [["Sword", "500k"], ...]                                    */
  BR.buildTable = function (columns, rows) {
    var wrap = BR.el("div", "table-wrap");
    var table = BR.el("table", "data-table");
    var thead = BR.el("thead");
    var headRow = BR.el("tr");

    columns.forEach(function (label) {
      headRow.appendChild(BR.el("th", null, label));
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = BR.el("tbody");

    rows.forEach(function (cells) {
      var tr = BR.el("tr");
      cells.forEach(function (value) {
        tr.appendChild(BR.el("td", null, value));
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  };

  /* --- A titled card with a paragraph. Used for goals-style grids:
         guide builds and wiki class summaries.                          */
  BR.buildInfoCard = function (item) {
    var card = BR.el("div", "goal-card reveal");
    card.appendChild(BR.el("h3", null, item.title || ""));
    card.appendChild(BR.el("p", null, item.body || ""));
    return card;
  };

  /* --- A video card ---
     Renders a real YouTube embed if `youtubeId` is set, otherwise the
     dashed placeholder box. So dropping in a video later means adding one
     field to the data, not editing markup.                              */
  BR.buildVideoCard = function (item) {
    var card = BR.el("div", "video-card");

    if (item.youtubeId) {
      var frame = document.createElement("iframe");
      frame.className = "video-embed";
      frame.src = "https://www.youtube.com/embed/" + item.youtubeId;
      frame.title = item.title || "Video";
      frame.loading = "lazy";
      frame.allowFullscreen = true;
      frame.setAttribute("frameborder", "0");
      card.appendChild(frame);
    } else {
      var box = BR.el("div", "video-placeholder", "Video placeholder");
      box.setAttribute("aria-hidden", "true");
      card.appendChild(box);
    }

    card.appendChild(BR.el("p", "video-title", item.title || "Untitled"));

    if (item.url) {
      var link = BR.el("a", null, "Watch on YouTube");
      link.href = item.url;
      link.target = "_blank";
      /* noopener stops the opened tab from being able to script this one */
      link.rel = "noopener";
      card.appendChild(link);
    }

    return card;
  };

  /* --- A gallery image ---
     Falls back to the dashed placeholder until a real `src` is supplied. */
  BR.buildGalleryImage = function (item) {
    if (!item.src) {
      var box = BR.el("div", "image-placeholder", item.caption || "Image placeholder");
      box.setAttribute("aria-hidden", "true");
      return box;
    }

    var img = document.createElement("img");
    img.className = "gallery-img";
    img.src = item.src;
    /* alt describes the picture for screen readers and shows if the file
       is missing — never leave it empty on content images. */
    img.alt = item.alt || item.caption || "";
    img.loading = "lazy";
    return img;
  };

  /* --- A grid carousel for videos ---
     A CAROUSEL is the whole widget: a track that slides sideways, moved by
     tap ARROWS. Each SLIDE is one screen's worth of content.

     `groupSize` controls what's on each slide:
       1 (default) — one video per slide, one at a time
       3           — each slide is a GRID of up to 3 videos, and the arrows
                     page between groups of 3 instead of single videos

     Inside each slide, the group re-uses the site's existing responsive
     .video-grid (1 column on phones, 2 on tablets, 3 on desktop — see
     content.css) — so "3 at a time" means 3 videos advance together, not
     that exactly 3 are always on screen at once on every device.

     These SVGs are fixed strings written by us, never user data, so
     innerHTML here carries none of the risk it would with real content. */
  var ARROW_LEFT_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" ' +
    'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_RIGHT_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" ' +
    'stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Splits a flat list into groups of `size` — e.g. chunk([a,b,c,d,e], 3)
     gives [[a,b,c],[d,e]]. This is what turns "9 videos" into "3 slides
     of 3". */
  function chunk(list, size) {
    var groups = [];
    for (var i = 0; i < list.length; i += size) {
      groups.push(list.slice(i, i + size));
    }
    return groups;
  }

  /* Generic grid carousel. Takes ALREADY-BUILT elements, so it doesn't care
     whether they're videos, officer cards, or anything added later.

       cards      array of DOM elements
       groupSize  how many go on each slide
       gridClass  the grid class used inside each slide (video-grid,
                  officer-grid, ...) so each content type keeps its own
                  column sizing
       noun       used in the arrow labels, e.g. "videos" / "officers" */
  BR.buildCarousel = function (cards, groupSize, gridClass, noun) {
    if (!cards.length) return null;

    groupSize = groupSize || 1;
    noun = noun || "items";
    var groups = chunk(cards, groupSize);

    var wrap = BR.el("div", "carousel");
    var viewport = BR.el("div", "carousel-viewport");
    var track = BR.el("div", "carousel-track");

    var slides = groups.map(function (group) {
      var slide = BR.el("div", "carousel-slide");
      var grid = BR.el("div", gridClass);

      group.forEach(function (card) {
        grid.appendChild(card);
      });

      slide.appendChild(grid);
      track.appendChild(slide);
      return slide;
    });

    viewport.appendChild(track);

    var prevBtn = BR.el("button", "carousel-arrow carousel-prev");
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Previous " + noun);
    prevBtn.innerHTML = ARROW_LEFT_SVG;

    var nextBtn = BR.el("button", "carousel-arrow carousel-next");
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Next " + noun);
    nextBtn.innerHTML = ARROW_RIGHT_SVG;

    var counter = BR.el("p", "carousel-counter");
    counter.setAttribute("aria-live", "polite");

    var index = 0;
    var totalSlides = groups.length;

    function update() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      counter.textContent = "Page " + (index + 1) + " / " + totalSlides;

      /* `inert` removes the off-screen slides from the tab order and from
         screen readers, so keyboard/AT users can't land on something that
         isn't visible. Supported in current Chrome/Edge/Safari/Firefox. */
      slides.forEach(function (slide, i) {
        if (i === index) {
          slide.removeAttribute("inert");
        } else {
          slide.setAttribute("inert", "");
        }
      });
    }

    prevBtn.addEventListener("click", function () {
      index = (index - 1 + totalSlides) % totalSlides; // wraps to the last slide
      update();
    });

    nextBtn.addEventListener("click", function () {
      index = (index + 1) % totalSlides; // wraps back to the first slide
      update();
    });

    /* Everything already fits on one slide — nothing to page through */
    if (totalSlides <= 1) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      counter.style.display = "none";
    }

    update();

    wrap.appendChild(viewport);
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);
    wrap.appendChild(counter);
    return wrap;
  };

  /* Videos, wrapped in the generic carousel above */
  BR.buildVideoCarousel = function (items, groupSize) {
    if (!items.length) {
      return BR.el("p", "timeline-empty", "No videos yet.");
    }
    return BR.buildCarousel(
      items.map(BR.buildVideoCard),
      groupSize,
      "video-grid",
      "videos"
    );
  };

  /* --- Social links ---
     Simplified, geometric icons drawn inline rather than pulled from an
     icon library — no external requests, and they inherit the site's colour
     automatically via currentColor. They're recognisable shapes, not exact
     brand logos, which is why every one is paired with a text label too.

     Each entry may be a real link (has `url`) or just a handle to read
     (no `url`) — Discord usernames usually aren't linkable, so those
     render as plain text instead of a dead link. */
  var SOCIAL_ICONS = {
    discord:
      '<rect x="3" y="6" width="18" height="12" rx="6"/>' +
      '<circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/>' +
      '<circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    youtube:
      '<rect x="2" y="5" width="20" height="14" rx="4"/>' +
      '<path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none"/>',
    facebook:
      '<path d="M14.5 8.5H16V5.8h-1.9c-2 0-3.1 1.2-3.1 3.2v1.6H9v2.7h2v7.1h2.8v-7.1h2l.4-2.7h-2.4V9.4c0-.6.3-.9.7-.9z" fill="currentColor" stroke="none"/>',
    instagram:
      '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
    tiktok:
      '<path d="M12 4v10.5a3 3 0 1 1-2.6-3"/>' +
      '<path d="M12 4c.4 2.6 2.4 4.2 5 4.3"/>',
    twitch:
      '<path d="M4 3h16v11l-4 4h-3.5L9 21v-3H4z"/>' +
      '<path d="M11 8v4M15.5 8v4"/>',
    x:
      '<path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/>',
    link:
      '<path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1 1"/>' +
      '<path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'
  };

  var SOCIAL_NAMES = {
    discord: "Discord",
    youtube: "YouTube",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    twitch: "Twitch",
    x: "X",
    link: "Website"
  };

  /* Parses a fixed SVG string into a real element. Going through a <div>
     lets the normal HTML parser handle the SVG namespace correctly — doing
     createElement("svg") by hand produces an element the browser won't
     render. The markup is ours, never user input, so this is safe. */
  function svgIcon(platform) {
    var inner = SOCIAL_ICONS[platform] || SOCIAL_ICONS.link;
    var holder = document.createElement("div");
    holder.innerHTML =
      '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" ' +
      'fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>";
    return holder.firstElementChild;
  }

  BR.buildSocialLinks = function (socials) {
    if (!socials || !socials.length) return null;

    var list = BR.el("ul", "social-links");

    socials.forEach(function (item) {
      if (!item || !item.platform) return;

      var label = item.label || SOCIAL_NAMES[item.platform] || item.platform;
      var li = BR.el("li");
      var node;

      if (item.url) {
        node = BR.el("a", "social-link");
        node.href = item.url;
        node.target = "_blank";
        /* noopener stops the opened tab from being able to script this one */
        node.rel = "noopener";
      } else {
        /* No URL — show the handle as text rather than a link that goes
           nowhere. Still gets the icon so it reads consistently. */
        node = BR.el("span", "social-link social-link-static");
      }

      node.appendChild(svgIcon(item.platform));
      node.appendChild(BR.el("span", "social-label", label));
      li.appendChild(node);
      list.appendChild(li);
    });

    return list.children.length ? list : null;
  };

  /* --- Convenience: build a <section> shell with a heading ---
     Used by the pages whose whole sections come from data.              */
  BR.buildSection = function (id, heading) {
    var section = BR.el("section", "section reveal");
    if (id) section.id = id;
    section.appendChild(BR.el("h2", null, heading));
    return section;
  };
})(window.BR);
