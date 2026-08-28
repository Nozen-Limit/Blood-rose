"use client";

/* ==========================================================================
   GALLERY GRID + LIGHTBOX
   The thumbnails are cropped to 4:3 by object-fit: cover, so the grid stays
   tidy — but that means the grid never shows the whole picture. Tapping one
   opens it full size, uncropped, with arrows to move through the rest of
   that section.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage as GalleryImageType } from "@/lib/types";

export default function GalleryGrid({ items }: { items: GalleryImageType[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* Only real photos open. A placeholder has nothing bigger to show, so it
     stays a plain div rather than a button that does nothing. */
  const openable = items.map((it) => Boolean(it.src));

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const total = items.length;
        /* Walk in `delta` steps until landing on something openable, so
           placeholders mixed into a section are skipped rather than opening
           an empty frame. Bounded by total to avoid looping forever if a
           section somehow holds no real photos. */
        for (let i = 1; i <= total; i++) {
          const next = (current + delta * i + total * total) % total;
          if (openable[next]) return next;
        }
        return current;
      });
    },
    [items.length, openable]
  );

  return (
    <>
      <div className="image-grid">
        {items.map((item, i) =>
          item.src ? (
            <figure className="gallery-item" key={i}>
              <button
                type="button"
                className="gallery-open"
                onClick={() => setOpenIndex(i)}
                aria-label={
                  item.caption ? `View larger: ${item.caption}` : "View larger image"
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element --
                    arbitrary URLs officers paste in, so next/image's domain
                    allowlist would reject them. */}
                <img className="gallery-img" src={item.src} alt={item.caption || ""} loading="lazy" />
              </button>
              {item.caption && <figcaption className="gallery-caption">{item.caption}</figcaption>}
            </figure>
          ) : (
            <div className="image-placeholder" aria-hidden="true" key={i}>
              Image placeholder
            </div>
          )
        )}
      </div>

      {openIndex !== null && (
        <Lightbox
          item={items[openIndex]}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          showArrows={openable.filter(Boolean).length > 1}
        />
      )}
    </>
  );
}

function Lightbox({
  item, onClose, onPrev, onNext, showArrows,
}: {
  item: GalleryImageType;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  showArrows: boolean;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  /* Keyboard: Escape closes, arrows move. Registered on document so it works
     wherever focus happens to be inside the dialog. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && showArrows) onPrev();
      else if (e.key === "ArrowRight" && showArrows) onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, showArrows]);

  /* Stop the page behind from scrolling while the overlay is up — otherwise
     flicking on a phone scrolls the gallery underneath the photo. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  useEffect(() => { closeRef.current?.focus(); }, []);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || "Enlarged image"}
      /* Backdrop closes; the figure inside must not. e.target is the deepest
         element clicked, so this is only true for the backdrop itself. */
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
        &times;
      </button>

      {showArrows && (
        <button type="button" className="lightbox-arrow lightbox-prev" aria-label="Previous image" onClick={onPrev}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <figure className="lightbox-figure">
        {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
        <img className="lightbox-img" src={item.src} alt={item.caption || ""} />
        {item.caption && <figcaption className="lightbox-caption">{item.caption}</figcaption>}
      </figure>

      {showArrows && (
        <button type="button" className="lightbox-arrow lightbox-next" aria-label="Next image" onClick={onNext}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
