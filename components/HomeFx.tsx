"use client";

/* ==========================================================================
   HOME FX  (landing page only)
   Drifting ember particles on a canvas, and rose petals falling the length
   of the page. Purely decorative; both are skipped entirely when the
   visitor has reduced motion turned on.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Particle = {
  x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number;
};

export default function HomeFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0, h = 0, particles: Particle[] = [], raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      w = canvas.width = innerWidth * DPR;
      h = canvas.height = innerHeight * DPR;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
    };

    const makeParticle = (): Particle => ({
      x: Math.random() * w,
      y: h + Math.random() * h * 0.3,
      r: (Math.random() * 1.8 + 0.5) * DPR,
      vy: -(Math.random() * 0.5 + 0.15) * DPR,
      vx: (Math.random() - 0.5) * 0.25 * DPR,
      a: Math.random() * 0.5 + 0.1,
      tw: Math.random() * Math.PI,
    });

    const init = () => {
      const n = Math.min(70, Math.floor(innerWidth / 22));
      particles = Array.from({ length: n }, makeParticle);
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.02;
        const flicker = (Math.sin(p.tw) + 1) / 2;
        if (p.y < -10) Object.assign(p, makeParticle(), { y: h + 10 });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,49,59,${p.a * flicker * 0.9})`;
        ctx.shadowBlur = 8 * DPR;
        ctx.shadowColor = "rgba(224,49,59,.6)";
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => { cancelAnimationFrame(raf); size(); init(); loop(); };

    size(); init(); loop();
    window.addEventListener("resize", onResize);

    /* Cancelling the frame on unmount matters here — without it the loop
       keeps running after navigating to another page. */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  /* Petals are generated after mount, not during render, and that placement
     matters: Math.random() during render runs once on the server and again
     on the client with different results, so every petal would mismatch at
     hydration. Generating them in an effect means the server sends none and
     the client adds them — correct for something purely decorative.
     Randomised once and then held, so re-renders don't teleport a petal
     mid-fall. */
  const [petals, setPetals] = useState<
    { left: string; width: string; height: string; opacity: number;
      fall: string; delay: string; spin: string }[]
  >([]);

  useEffect(() => {
    if (reduced) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect --
       Deliberate: this is the standard way to render client-only random
       content. Generating during render instead would mismatch at
       hydration, and it runs once for purely decorative elements. */
    setPetals(
      Array.from({ length: 14 }, () => {
        const size = 6 + Math.random() * 12;
        return {
          left: `${Math.random() * 100}vw`,
          width: `${size}px`,
          height: `${size * 1.45}px`,
          opacity: Number((0.07 + Math.random() * 0.15).toFixed(2)),
          fall: `${10 + Math.random() * 11}s`,
          delay: `${-Math.random() * 20}s`,
          spin: `${3 + Math.random() * 4}s`,
        };
      })
    );
  }, [reduced]);

  return (
    <>
      <canvas id="embers" aria-hidden="true" ref={canvasRef} />
      {!reduced && petals.length > 0 && (
        <div className="petal-field" aria-hidden="true">
          {petals.map((p, i) => (
            <div
              className="pf-petal"
              key={i}
              style={{
                left: p.left, width: p.width, height: p.height,
                opacity: p.opacity,
                animationDuration: p.fall, animationDelay: p.delay,
              }}
            >
              <div className="pf-in" style={{ animationDuration: p.spin }} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
