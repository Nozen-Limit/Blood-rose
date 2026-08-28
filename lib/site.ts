/* ==========================================================================
   SITE CONSTANTS
   The Discord invite appeared in four places per page across seven HTML
   files in the static site — twenty-eight copies to keep in sync. One
   constant now.
   ========================================================================== */

export const DISCORD_INVITE = "https://discord.gg/PbFs4eXEv4";

export const SITE_URL = "https://blood-rose-five.vercel.app";

export const NAV_LINKS = [
  { href: "/",        label: "Home" },
  { href: "/events",  label: "Events" },
  { href: "/guides",  label: "Guides" },
  { href: "/prices",  label: "Prices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/wiki",    label: "Wiki" },
] as const;
