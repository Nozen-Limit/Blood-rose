"use client";

/* ==========================================================================
   OFFICER CARD
   The credentials panel opens on hover (desktop), tap (touch) and keyboard
   focus — there's no toggle button. Hover and focus are handled in CSS;
   only the tap toggle needs state.
   ========================================================================== */

import { useState } from "react";
import type { Officer } from "@/lib/types";
import SocialLinks from "./SocialLinks";

/* Grey silhouette drawn inline, so a missing photo still looks deliberate
   and there's no extra file to ship. */
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E" +
  "%3Crect width='100' height='100' fill='%231C1817'/%3E" +
  "%3Ccircle cx='50' cy='38' r='18' fill='%23A39D99'/%3E" +
  "%3Ccircle cx='50' cy='100' r='38' fill='%23A39D99'/%3E%3C/svg%3E";

export default function OfficerCard({
  officer, featured = false,
}: { officer: Officer; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const hasSocials = (officer.socials ?? []).some((s) => s?.platform);

  return (
    <div
      className={`officer-card officer-card-interactive${featured ? " officer-card-featured" : ""}`}
      onClick={(e) => {
        /* Clicks on a link inside are left alone — otherwise tapping
           someone's YouTube link would also collapse the panel out from
           under you. */
        if ((e.target as HTMLElement).closest("a")) return;
        setOpen((v) => !v);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element --
          avatars are arbitrary URLs officers paste in, so next/image's
          domain allowlist would reject them. */}
      <img
        className="officer-avatar"
        src={officer.avatar || PLACEHOLDER_AVATAR}
        alt={
          officer.avatar
            ? `${officer.name}, ${officer.rank}`
            : `Placeholder avatar for ${officer.name || "officer"}`
        }
      />

      <div className="officer-body">
        <p className="officer-name">{officer.name}</p>
        <p className="officer-rank">{officer.rank}</p>

        {/* Always rendered, even when empty, so every card responds to
            hover and tap the same way. */}
        <div className={`officer-details${open ? " is-open" : ""}`}>
          {hasSocials ? (
            <SocialLinks socials={officer.socials} />
          ) : (
            <p className="officer-details-empty">No links added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
