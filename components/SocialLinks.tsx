/* ==========================================================================
   SOCIAL LINKS
   Simplified, geometric icons drawn inline rather than pulled from an icon
   library — no external requests, and they inherit the site's colour via
   currentColor. They're recognisable shapes, not exact brand logos, which
   is why every one is paired with a text label.

   An entry may be a real link (has `url`) or just a handle to read
   (no `url`) — Discord usernames usually aren't linkable, so those render
   as plain text rather than a dead link.
   ========================================================================== */

import type { ReactNode } from "react";
import type { OfficerSocial } from "@/lib/types";

const ICONS: Record<string, ReactNode> = {
  discord: (<>
    <rect x="3" y="6" width="18" height="12" rx="6" />
    <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </>),
  youtube: (<>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
  </>),
  facebook: (
    <path d="M14.5 8.5H16V5.8h-1.9c-2 0-3.1 1.2-3.1 3.2v1.6H9v2.7h2v7.1h2.8v-7.1h2l.4-2.7h-2.4V9.4c0-.6.3-.9.7-.9z" fill="currentColor" stroke="none" />
  ),
  instagram: (<>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </>),
  tiktok: (<>
    <path d="M12 4v10.5a3 3 0 1 1-2.6-3" />
    <path d="M12 4c.4 2.6 2.4 4.2 5 4.3" />
  </>),
  twitch: (<>
    <path d="M4 3h16v11l-4 4h-3.5L9 21v-3H4z" />
    <path d="M11 8v4M15.5 8v4" />
  </>),
  x: <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />,
  link: (<>
    <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
    <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1-1" />
  </>),
};

const NAMES: Record<string, string> = {
  discord: "Discord", youtube: "YouTube", facebook: "Facebook",
  instagram: "Instagram", tiktok: "TikTok", twitch: "Twitch",
  x: "X", link: "Website",
};

function Icon({ platform }: { platform: string }) {
  return (
    <svg
      className="social-icon" viewBox="0 0 24 24" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
    >
      {ICONS[platform] ?? ICONS.link}
    </svg>
  );
}

export default function SocialLinks({ socials }: { socials: OfficerSocial[] }) {
  const usable = (socials ?? []).filter((s) => s?.platform);
  if (!usable.length) return null;

  return (
    <ul className="social-links">
      {usable.map((item, i) => {
        const platform = item.platform!;
        const label = item.label || NAMES[platform] || platform;
        const inner = (<><Icon platform={platform} /><span className="social-label">{label}</span></>);

        return (
          <li key={`${platform}-${i}`}>
            {item.url ? (
              <a className="social-link" href={item.url} target="_blank" rel="noopener">
                {inner}
              </a>
            ) : (
              <span className="social-link social-link-static">{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
