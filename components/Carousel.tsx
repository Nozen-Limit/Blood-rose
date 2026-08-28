"use client";

/* ==========================================================================
   CAROUSEL
   A track that slides sideways, moved by tap arrows. Each SLIDE holds one
   screen's worth of content.

   `groupSize` controls what's on each slide:
     1  — one item per slide
     3  — each slide is a grid of up to 3, and the arrows page between
          groups of 3 rather than single items

   Inside each slide the group re-uses the site's existing responsive grids
   (1 column on phones, more on wider screens — see content.css), so
   "3 at a time" means 3 advance together, not that exactly 3 are always
   on screen at every width.

   Takes already-rendered children, so it doesn't care whether they're
   videos, officer cards, or anything added later.
   ========================================================================== */

import { useState, type ReactNode } from "react";

/** chunk([a,b,c,d,e], 3) → [[a,b,c],[d,e]] — turns 9 videos into 3 slides of 3. */
function chunk<T>(list: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < list.length; i += size) groups.push(list.slice(i, i + size));
  return groups;
}

type Props = {
  items: ReactNode[];
  groupSize?: number;
  gridClass: string;
  /** Used in the arrow labels, e.g. "videos" / "officers". */
  noun?: string;
};

export default function Carousel({ items, groupSize = 1, gridClass, noun = "items" }: Props) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const groups = chunk(items, groupSize);
  const total = groups.length;
  /* Everything already fits on one slide — nothing to page through. */
  const paged = total > 1;

  return (
    <div className="carousel">
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {groups.map((group, i) => (
            <div
              key={i}
              className="carousel-slide"
              /* `inert` takes off-screen slides out of the tab order and
                 away from screen readers, so keyboard and AT users can't
                 land on something that isn't visible. */
              {...(i === index ? {} : { inert: "" as unknown as boolean })}
            >
              <div className={gridClass}>{group}</div>
            </div>
          ))}
        </div>
      </div>

      {paged && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-prev"
            aria-label={`Previous ${noun}`}
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="carousel-arrow carousel-next"
            aria-label={`Next ${noun}`}
            onClick={() => setIndex((i) => (i + 1) % total)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <p className="carousel-counter" aria-live="polite">
            Page {index + 1} / {total}
          </p>
        </>
      )}
    </div>
  );
}
