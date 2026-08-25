/* ==========================================================================
   PRICES  (prices.html)
   Builds every section of the page from BR.data.prices — a class heading
   (Warrior, Rogue, Sorcerer, ...), then that class's categories (Shield,
   Helm, ...) as tappable cards. Tapping one shows that category's items
   (name, price) below the cards, so a member picks the gear slot they
   want instead of scrolling one long list.

   Each row in group.rows is [category, item name, price] — the grouping
   into per-category cards happens here, not in the admin app, which only
   ever deals with a flat list of rows.

   Price data now comes from an async Supabase fetch (see js/data/prices.js),
   so everything below is wrapped in render() and only actually runs once
   BR.dataReady.prices resolves. If some future page still provides prices
   synchronously instead, this falls back to running immediately.
   ========================================================================== */

(function (BR) {
  "use strict";

  var mount = document.getElementById("price-sections");
  if (!mount) return;

  function render() {
  var groups = (BR.data && BR.data.prices) || [];

  if (!groups.length) {
    mount.appendChild(BR.el("p", "timeline-empty", "No prices listed yet."));
    return;
  }

  /* Splits [category, item, price] rows into one array per category,
     keeping the order categories first appear in — nothing alphabetizes
     or reorders what the officer typed. */
  function groupByCategory(rows) {
    var order = [];
    var byCategory = Object.create(null);

    (rows || []).forEach(function (row) {
      var category = row[0] || "Other";
      if (!byCategory[category]) {
        byCategory[category] = [];
        order.push(category);
      }
      byCategory[category].push([row[1] || "", row[2] || ""]);
    });

    return order.map(function (category) {
      return { category: category, items: byCategory[category] };
    });
  }

  /* One tappable card per category, plus a detail area below the cards
     that shows whichever category was last tapped (starting with the
     first one, so the section isn't empty before anyone taps anything). */
  function buildCategoryPicker(categoryGroups) {
    var grid = BR.el("div", "price-category-grid");
    var detail = BR.el("div", "price-category-detail");
    var activeCard = null;

    function showCategory(cat, card) {
      if (activeCard) activeCard.classList.remove("is-active");
      card.classList.add("is-active");
      activeCard = card;

      detail.textContent = "";
      detail.appendChild(BR.el("h3", "price-category", cat.category));
      detail.appendChild(BR.buildTable(["Item", "Price"], cat.items));
    }

    categoryGroups.forEach(function (cat, i) {
      var card = BR.el("button", "price-category-card");
      card.type = "button";
      card.appendChild(BR.el("span", "price-category-card-name", cat.category));
      card.appendChild(
        BR.el("span", "price-category-card-count",
          cat.items.length + " item" + (cat.items.length === 1 ? "" : "s"))
      );
      card.addEventListener("click", function () { showCategory(cat, card); });
      grid.appendChild(card);

      if (i === 0) showCategory(cat, card);
    });

    var wrap = document.createDocumentFragment();
    wrap.appendChild(grid);
    wrap.appendChild(detail);
    return wrap;
  }

  var fragment = document.createDocumentFragment();
  var sections = []; // { id, el } — so the dropdown below can toggle them

  groups.forEach(function (group) {
    var section = BR.buildSection(group.id, group.title || "");
    var categoryGroups = groupByCategory(group.rows);

    if (categoryGroups.length) {
      section.appendChild(buildCategoryPicker(categoryGroups));
    } else {
      section.appendChild(BR.el("p", "timeline-empty", "No prices listed yet."));
    }

    sections.push({ id: group.id, el: section });
    fragment.appendChild(section);
  });

  /* --- Class picker ---
     With 3 classes each listing 10 categories' worth of gear, showing
     all of them stacked at once is a very long scroll. Instead, only one
     class is shown at a time, chosen from a dropdown — everything is
     still in the page (so #warrior links and browser search still find
     it), just hidden rather than removed. A single class (or none) has
     nothing to pick between, so the dropdown only appears when it'd
     actually do something. */
  if (sections.length > 1) {
    var picker = document.createElement("select");
    picker.className = "price-class-select";
    picker.setAttribute("aria-label", "Choose a class");

    sections.forEach(function (s) {
      var option = document.createElement("option");
      option.value = s.id;
      option.textContent = s.el.querySelector("h2")
        ? s.el.querySelector("h2").textContent
        : s.id;
      picker.appendChild(option);
    });

    function showOnly(id) {
      sections.forEach(function (s) {
        s.el.hidden = s.id !== id;
      });
    }

    /* Deep links like prices.html#rogue (from search, or a shared link)
       should open straight to that class instead of always defaulting
       to the first one. */
    var hashId = (window.location.hash || "").slice(1);
    var initial = sections.some(function (s) { return s.id === hashId; })
      ? hashId
      : sections[0].id;

    picker.value = initial;
    showOnly(initial);

    picker.addEventListener("change", function () {
      showOnly(picker.value);
      /* replaceState, not setting location.hash directly — the latter
         also triggers the browser's normal jump-to-anchor scroll, which
         would yank the page down to the (now-visible) section every
         time someone just wants to switch the dropdown. */
      history.replaceState(null, "", "#" + picker.value);
    });

    mount.appendChild(picker);
  }

  mount.appendChild(fragment);
  } // end render()

  if (BR.dataReady && BR.dataReady.prices && typeof BR.dataReady.prices.then === "function") {
    BR.dataReady.prices.then(render);
  } else {
    render();
  }
})(window.BR);
