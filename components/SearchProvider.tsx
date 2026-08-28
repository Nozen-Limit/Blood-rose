"use client";

/* ==========================================================================
   SEARCH
   The overlay, plus a tiny context so the nav's search button can open it
   without the two components having to be siblings.

   The index is fetched the first time the panel opens and then kept for the
   rest of the visit.
   ========================================================================== */

import Link from "next/link";
import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from "react";
import { searchEntries, type SearchEntry } from "@/lib/search";

type SearchCtx = { open: () => void };
const Ctx = createContext<SearchCtx>({ open: () => {} });

export const useSearch = () => useContext(Ctx);

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** The button that opened the panel, so focus can go back to it on close. */
  const openerRef = useRef<Element | null>(null);

  const open = useCallback(() => {
    openerRef.current = document.activeElement;
    setQuery("");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    /* Send focus back where it came from, so keyboard users aren't dumped
       at the top of the document. */
    (openerRef.current as HTMLElement | null)?.focus?.();
  }, []);

  /* Fetch the index on first open only. */
  useEffect(() => {
    if (!isOpen || index) return;
    let cancelled = false;
    fetch("/api/search-index")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: SearchEntry[]) => { if (!cancelled) setIndex(data); })
      .catch(() => { if (!cancelled) setIndex([]); });
    return () => { cancelled = true; };
  }, [isOpen, index]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const matches = index ? searchEntries(index, query) : [];
  const trimmed = query.trim();

  return (
    <Ctx.Provider value={{ open }}>
      {children}

      <div
        className="search-overlay"
        hidden={!isOpen}
        /* Clicking the dimmed area closes; clicking the panel must not.
           e.target is the deepest element clicked, so this is only true for
           the backdrop itself. */
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="search-panel" role="dialog" aria-modal="true" aria-label="Site search">
          <div className="search-panel-header">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Search the site&hellip;"
              aria-label="Search the site"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="button" className="search-close-btn" aria-label="Close search" onClick={close}>
              &times;
            </button>
          </div>

          <ul className="search-results">
            {trimmed && !matches.length && (
              <li className="search-empty">
                {index === null ? "Searching…" : `No results for "${trimmed}".`}
              </li>
            )}
            {matches.map((item) => (
              <li key={`${item.section}-${item.url}-${item.title}`}>
                {item.url.startsWith("http") ? (
                  <a href={item.url} onClick={close}>
                    {item.title}
                    <span className="search-result-section">{item.section}</span>
                  </a>
                ) : (
                  <Link href={item.url} onClick={close}>
                    {item.title}
                    <span className="search-result-section">{item.section}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Ctx.Provider>
  );
}
