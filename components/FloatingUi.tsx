"use client";

/* ==========================================================================
   FLOATING UI
   Back-to-top button and the phone-only sticky Discord bar. Both appear
   once the visitor is past the hero, so they share one scroll listener.
   ========================================================================== */

import { useState } from "react";
import { useDiscordInvite } from "./SiteSettings";
import { useOnScroll, usePrefersReducedMotion } from "@/lib/hooks";

export default function FloatingUi() {
  const discordInvite = useDiscordInvite();
  const [past, setPast] = useState(false);
  const reduced = usePrefersReducedMotion();

  useOnScroll(() => {
    /* Sub-pages have no hero, so fall back to a fixed distance — same rule
       the static site's floating-ui.js used. */
    const hero = document.getElementById("hero");
    const threshold = hero ? hero.offsetHeight * 0.6 : 400;
    setPast(window.scrollY > threshold);
  });

  const shown = past ? " is-visible" : "";

  return (
    <>
      <button
        type="button"
        className={`back-to-top${shown}`}
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
        }
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`mobile-cta${shown}`}>
        <a href={discordInvite} className="btn btn-primary mobile-cta-btn">
          Join our Discord
        </a>
      </div>
    </>
  );
}
