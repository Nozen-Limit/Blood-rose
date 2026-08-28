"use client";

/* ==========================================================================
   BACKGROUND DECOR
   The fixed ambient layer: drifting glow blobs. Rendered once in the root
   layout instead of being pasted into every page.
   ========================================================================== */

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export default function BackgroundDecor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  /* Parallax drift. Kept as a direct style write on each blob rather than
     React state: this runs every animation frame while scrolling, and
     re-rendering the tree that often would be wasteful for something no
     other component needs to know about. */
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const blobs = Array.from(
      root.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    if (!blobs.length) return;

    let ticking = false;
    const run = () => {
      const y = window.scrollY;
      for (const el of blobs) {
        const speed = parseFloat(el.dataset.parallax || "0.2") || 0.2;
        el.style.transform = `translateY(${y * speed}px)`;
      }
      ticking = false;
    };
    const handler = () => {
      if (ticking) return;
      window.requestAnimationFrame(run);
      ticking = true;
    };

    run();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [reduced]);

  return (
    <div className="bg-decor" aria-hidden="true" ref={rootRef}>
      <span className="bg-blob bg-blob-1" data-parallax="0.08" />
      <span className="bg-blob bg-blob-2" data-parallax="0.15" />
      <span className="bg-blob bg-blob-3" data-parallax="0.05" />

    </div>
  );
}
