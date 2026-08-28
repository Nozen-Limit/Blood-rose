"use client";

/* ==========================================================================
   SHARED CLIENT HOOKS
   Ports the two cross-cutting helpers from the static site's js/utils.js:
   the reduced-motion flag and the rAF-throttled scroll listener.
   ========================================================================== */

import { useEffect, useSyncExternalStore } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * The visitor's "reduce motion" OS setting.
 *
 * useSyncExternalStore rather than useState + useEffect: this is exactly
 * "subscribe to something outside React". The server snapshot is false
 * because the server cannot know the preference — so the server and the
 * first client render agree, and React swaps in the real value without a
 * hydration mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}

/**
 * Runs `callback` on scroll, at most once per animation frame. Scroll events
 * can fire hundreds of times a second; this caps that to the screen's
 * refresh rate. Fires once immediately so state is correct on load.
 */
export function useOnScroll(callback: () => void) {
  useEffect(() => {
    let ticking = false;

    const run = () => {
      callback();
      ticking = false;
    };

    const handler = () => {
      if (ticking) return;
      window.requestAnimationFrame(run);
      ticking = true;
    };

    callback();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  });
}
