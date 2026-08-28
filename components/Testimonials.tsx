"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/hooks";

const INTERVAL = 5000;

export default function Testimonials({ quotes }: { quotes: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    /* A single quote has nothing to rotate to. Auto-rotation is also
       motion the "reduce motion" setting covers — content changing under
       you unprompted is exactly what that preference is asking to avoid,
       so it stays on the first quote. */
    if (quotes.length < 2 || reduced) return;

    const id = setInterval(
      () => setActive((i) => (i + 1) % quotes.length),
      INTERVAL
    );
    return () => clearInterval(id);
  }, [quotes.length, reduced]);

  if (!quotes.length) return null;

  return (
    <div className="testimonial" aria-live="polite">
      {quotes.map((item, i) => (
        <blockquote
          className={`testimonial-quote${i === active ? " is-active" : ""}`}
          key={item.id}
        >
          <p>&quot;{item.quote}&quot;</p>
          <cite>&mdash; {item.name}</cite>
        </blockquote>
      ))}
    </div>
  );
}
