"use client";

/* ==========================================================================
   NAV
   One component replacing the ~55 lines of identical nav markup that were
   pasted into all seven HTML pages.

   The mobile menu was a CSS checkbox hack in the static site, chosen so it
   worked with zero JavaScript. Here it is React state — this component is
   already a client component for the scroll shadow, so the checkbox trick
   buys nothing, and real state is far easier to follow. The CSS selectors
   it relied on (.nav-toggle:checked ~ .nav-links) are replaced by an
   is-open class, added to nav.css.
   ========================================================================== */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DISCORD_INVITE, NAV_LINKS } from "@/lib/site";
import { useOnScroll } from "@/lib/hooks";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useOnScroll(() => setScrolled(window.scrollY > 40));

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <nav className="nav" aria-label="Primary">
        <Link href="/" className="nav-brand">
          <svg className="nav-emblem" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <g transform="translate(16 13.5)">
              <g fill="#8f141d">
                {[36, 108, 180, 252, 324].map((deg) => (
                  <path key={deg} d="M0 -1C-5.5 -3 -5 -10 0 -11.5C5 -10 5.5 -3 0 -1Z" transform={`rotate(${deg})`} />
                ))}
              </g>
              <g fill="var(--red-bright)">
                {[0, 72, 144, 216, 288].map((deg) => (
                  <path key={deg} d="M0 -1C-5.5 -3 -5 -9.5 0 -11C5 -9.5 5.5 -3 0 -1Z" transform={`rotate(${deg})`} />
                ))}
              </g>
              <circle r="5.4" fill="var(--red-bright)" />
            </g>
            <path d="M16 20.5C16 23.5 15 26.5 12.8 28.5 12.3 25.5 13.4 22.5 16 20.5Z" fill="#7a1520" />
            <path d="M16 20.5C16 23.5 17 26.5 19.2 28.5 19.7 25.5 18.6 22.5 16 20.5Z" fill="#93192a" />
          </svg>
          Blood&nbsp;Rose
        </Link>

        <div className="nav-right">
          <button
            type="button"
            className="nav-toggle-label"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul id="nav-links" className={`nav-links${open ? " is-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? "is-current" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={DISCORD_INVITE} className="nav-cta" onClick={() => setOpen(false)}>
                Discord
              </a>
            </li>
          </ul>

          <SearchButton />
        </div>
      </nav>
    </header>
  );
}

/* Split out so the overlay's open state lives with the overlay itself
   rather than being threaded through the whole nav. */
import { useSearch } from "./SearchProvider";

function SearchButton() {
  const { open } = useSearch();
  return (
    <button type="button" className="nav-search-btn" aria-label="Search the site" onClick={open}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
