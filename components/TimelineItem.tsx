"use client";

/* ==========================================================================
   TIMELINE ITEM
   One event row. Tapping it opens the details blurb underneath.

   Opening works three ways, which is what timeline.css was already written
   for: hover on desktop (guarded by @media (hover: hover) so a stray tap on
   a phone can't leave a row stuck open), tap, and keyboard focus via
   :focus-within. The entry is a real <button>, so the keyboard path needs
   no extra code — and .timeline-entry already carried button styling
   (width, text-align, cursor) from the original static site.
   ========================================================================== */

import { useState } from "react";

export default function TimelineItem({
  dateText, title, status, statusLabel, details,
}: {
  dateText: string;
  title: string;
  status: string;
  statusLabel?: string;
  details: string | null;
}) {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(details && details.trim());

  const inner = (
    <>
      <span className="timeline-date">{dateText}</span>
      <span className="timeline-title">{title}</span>
      <span className="status">{statusLabel || "Unknown"}</span>
    </>
  );

  return (
    <li
      className="timeline-item"
      /* Drives the dot colour, badge colour and strikethrough from this one
         attribute (see timeline.css). An unrecognised status gets no
         attribute and falls back to neutral styling rather than breaking. */
      {...(statusLabel ? { "data-status": status } : {})}
    >
      <span className="timeline-dot" aria-hidden="true" />

      {hasDetails ? (
        <button
          type="button"
          className="timeline-entry"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {inner}
        </button>
      ) : (
        /* Nothing to open, so it isn't a control — and it shouldn't claim to
           be one with a pointer cursor. */
        <div className="timeline-entry" style={{ cursor: "default" }}>
          {inner}
        </div>
      )}

      {hasDetails && (
        <div className={`timeline-details${open ? " is-open" : ""}`}>
          {details!
            .split(/\n{2,}/)
            .map((para, i) => <p key={i}>{para.trim()}</p>)}
        </div>
      )}
    </li>
  );
}
