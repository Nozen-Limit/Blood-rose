"use client";

/* ==========================================================================
   REVEAL
   Fades an element in as it scrolls into view.

   The static site had a documented footgun here: js/reveal.js scanned for
   .reveal once at load, so anything built later from a Supabase fetch was
   never observed and stayed at opacity 0 forever. That whole class of bug
   is gone — each element registers its own observer on mount, so it cannot
   be missed no matter when it appears.
   ========================================================================== */

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Anchor target, e.g. #classes — kept on this element so in-page links
      land where they did in the static site. */
  id?: string;
  /** Stagger, in ms, so a grid doesn't pop in all at once. */
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

export default function Reveal({ children, className, id, delay = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No IntersectionObserver (very old browsers): show the content rather
       than leaving a page of invisible boxes. */
    if (!("IntersectionObserver" in window)) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect --
         A one-time capability check, not a render loop. Without it a
         browser lacking IntersectionObserver would sit at opacity 0
         forever, which is a blank page rather than a missing animation. */
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setVisible(true);
          observer.unobserve(entry.target); // reveal is one-way
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={`reveal${visible ? " is-visible" : ""}${className ? " " + className : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
