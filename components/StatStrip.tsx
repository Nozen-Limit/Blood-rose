"use client";

/* ==========================================================================
   HERO STATS
   Counts numeric values up on load; anything that isn't a plain number
   (like "70+" or a year written as text) is printed as-is.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/hooks";

const DURATION = 1200;

/** Animates 0 -> target. Only ever rendered when there is something to animate. */
function CountUp({ target }: { target: number }) {
  const [shown, setShown] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    let start: number | null = null;
    /* Working out progress from elapsed time, rather than adding a fixed
       amount per frame, keeps the animation the same length on every
       device regardless of refresh rate. */
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / DURATION, 1);
      setShown(Math.round(progress * target));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  return <span className="stat-value">{shown}</span>;
}

/* Deciding what to render happens here rather than inside CountUp's effect:
   a value that isn't a number, or a visitor who asked for reduced motion,
   simply renders the final text and never mounts the animation at all. */
function StatValue({ value }: { value: string }) {
  const reduced = usePrefersReducedMotion();
  const target = Number(value);
  const isNumber = value.trim() !== "" && Number.isFinite(target);

  if (!isNumber) return <span className="stat-value">{value}</span>;
  if (reduced) return <span className="stat-value">{target}</span>;
  return <CountUp target={target} />;
}

export default function StatStrip({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  return (
    <div className="stat-strip">
      {stats.map((stat) => (
        <div className="stat-item" key={stat.id}>
          <StatValue value={stat.value} />
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
