"use client";

/* ==========================================================================
   BACKGROUND DECOR
   The fixed ambient layer: drifting glow blobs, the blood drip band under
   the nav, and the falling drops with their splats. Rendered once in the
   root layout instead of being pasted into all seven pages.
   ========================================================================== */

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const DRIP_PATH =
  "M0,0 L1440,0 L1440,15 C1410,15 1400,60 1380,60 C1360,60 1355,25 1335,25 " +
  "C1300,25 1290,100 1260,100 C1235,100 1230,40 1205,40 C1175,40 1165,80 1135,80 " +
  "C1105,80 1100,20 1070,20 C1040,20 1030,70 1000,70 C970,70 965,30 935,30 " +
  "C900,30 890,110 860,110 C835,110 830,45 805,45 C770,45 760,85 730,85 " +
  "C700,85 695,25 665,25 C630,25 620,95 590,95 C560,95 555,40 525,40 " +
  "C490,40 480,75 450,75 C420,75 415,20 385,20 C350,20 340,90 310,90 " +
  "C280,90 275,35 245,35 C210,35 200,70 170,70 C140,70 135,15 105,15 " +
  "C75,15 65,50 35,50 C20,50 5,20 0,20 Z";

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

      <svg className="bg-drip" viewBox="0 0 1440 130" preserveAspectRatio="none">
        <path d={DRIP_PATH} fill="var(--red)" />
      </svg>

      <span className="bg-drop bg-drop-1" />
      <span className="bg-drop bg-drop-2" />
      <span className="bg-drop bg-drop-3" />

      <span className="bg-splat bg-splat-1" />
      <span className="bg-splat bg-splat-2" />
      <span className="bg-splat bg-splat-3" />
    </div>
  );
}
