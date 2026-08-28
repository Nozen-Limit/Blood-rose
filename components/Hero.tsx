"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Stat } from "@/lib/types";
import { DISCORD_INVITE } from "@/lib/site";
import StatStrip from "./StatStrip";

export default function Hero({ stats }: { stats: Stat[] }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  /* The image is server-rendered, so it often finishes downloading before
     React hydrates and attaches onLoad — in which case that event already
     fired and never fires again, leaving the hero permanently at opacity 0.
     Checking .complete on mount covers that race; onLoad below still covers
     the case where it's genuinely still in flight. */
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Decorative: alt="" on purpose. The guild name and tagline below
          already say everything, so a screen reader gains nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element --
          a full-bleed CSS-positioned background, not a content image;
          next/image's layout wrapper fights the object-position and
          drift animation this relies on. */}
      <img
        ref={imgRef}
        className={`hero-bg${loaded ? " is-loaded" : ""}`}
        src="/images/hero-rose.webp"
        alt=""
        onLoad={() => setLoaded(true)}
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-bottom">
        <span className="eyebrow">Arcane Legends &middot; Guild</span>

        <h1 className="hero-title">
          {/* The gradient lives on these spans, not the h1 — they're
              inline-block and paint their own boxes, so a background-clip
              gradient on the parent never reaches them and the words
              render as invisible transparent text. */}
          <span className="hero-word">Blood</span>{" "}
          <span className="hero-word">Rose</span>
        </h1>

        <div className="hero-copy">
          <p className="tagline">Rising together</p>
          <StatStrip stats={stats} />
          <a href={DISCORD_INVITE} className="btn-pill">
            Join our Discord
            <span className="btn-pill-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <Link href="/#story" className="scroll-cue" aria-label="Scroll to Our Story">
        <span className="mouse" aria-hidden="true" />
        Scroll
      </Link>
    </section>
  );
}
