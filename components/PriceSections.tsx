"use client";

/* ==========================================================================
   PRICES
   Two levels of picking, both ported from js/prices.js:

   1. A class dropdown, because three classes each listing ten categories
      of gear is a very long scroll. Only one class shows at a time.
      Sections are hidden, not unmounted, so #rogue deep links and the
      browser's own find-on-page still reach them.

   2. Inside a class, one tappable card per gear category, with the chosen
      category's table below the cards.
   ========================================================================== */

import { useEffect, useState } from "react";
import type { PriceSection, PriceRow } from "@/lib/types";
import DataTable from "./DataTable";

type CategoryGroup = { category: string; items: string[][] };

/* Splits [category, item, price] rows into one group per category, keeping
   the order categories first appear in — nothing alphabetises or reorders
   what the officer typed. */
function groupByCategory(rows: PriceRow[] = []): CategoryGroup[] {
  const order: string[] = [];
  const byCategory = new Map<string, string[][]>();

  for (const row of rows) {
    const category = row[0] || "Other";
    if (!byCategory.has(category)) {
      byCategory.set(category, []);
      order.push(category);
    }
    byCategory.get(category)!.push([row[1] || "", row[2] || ""]);
  }

  return order.map((category) => ({ category, items: byCategory.get(category)! }));
}

function CategoryPicker({ groups }: { groups: CategoryGroup[] }) {
  /* Starts on the first category so the section isn't empty before anyone
     taps anything. */
  const [active, setActive] = useState(0);
  const current = groups[active];

  return (
    <>
      <div className="price-category-grid">
        {groups.map((cat, i) => (
          <button
            type="button"
            key={cat.category}
            className={`price-category-card${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="price-category-card-name">{cat.category}</span>
            <span className="price-category-card-count">
              {cat.items.length} item{cat.items.length === 1 ? "" : "s"}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="price-category-detail">
          <h3 className="price-category">{current.category}</h3>
          <DataTable columns={["Item", "Price"]} rows={current.items} />
        </div>
      )}
    </>
  );
}

export default function PriceSections({ sections }: { sections: PriceSection[] }) {
  const [shown, setShown] = useState(sections[0]?.id ?? "");

  /* Deep links like /prices#rogue — from search or a shared link — should
     open straight to that class rather than defaulting to the first.
     Read after mount, since the server never sees the fragment.

     The hashchange listener is not redundant: going from /prices to
     /prices#rogue is a SAME-document navigation, so nothing remounts and a
     mount-only effect would never fire. That is the exact path taken when
     someone already on this page picks "Rogue Prices" out of search. */
  useEffect(() => {
    const applyHash = () => {
      const hashId = window.location.hash.slice(1);
      if (hashId && sections.some((s) => s.id === hashId)) setShown(hashId);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [sections]);

  if (!sections.length) {
    return <p className="timeline-empty">No prices listed yet.</p>;
  }

  return (
    <>
      {/* A single class has nothing to pick between, so the dropdown only
          appears when it would actually do something. */}
      {sections.length > 1 && (
        <select
          className="price-class-select"
          aria-label="Choose a class"
          value={shown}
          onChange={(e) => {
            setShown(e.target.value);
            /* replaceState rather than setting location.hash: the latter
               also triggers the browser's jump-to-anchor scroll, yanking
               the page down every time someone changes the dropdown. */
            history.replaceState(null, "", `#${e.target.value}`);
          }}
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.title || s.id}</option>
          ))}
        </select>
      )}

      {sections.map((section) => {
        const groups = groupByCategory(section.rows);
        return (
          /* Deliberately no scroll-reveal here: these sections are hidden
             and shown by the dropdown, and a hidden element never
             intersects the viewport, so a reveal observer could leave a
             just-switched-to class stuck at opacity 0. */
          <section
            className="section"
            id={section.id}
            key={section.id}
            hidden={sections.length > 1 && section.id !== shown}
          >
            <h2>{section.title}</h2>
            {groups.length ? (
              <CategoryPicker groups={groups} />
            ) : (
              <p className="timeline-empty">No prices listed yet.</p>
            )}
          </section>
        );
      })}
    </>
  );
}
