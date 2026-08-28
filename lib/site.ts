/* ==========================================================================
   SITE CONSTANTS
   The Discord invite appeared in four places per page across seven HTML
   files in the static site — twenty-eight copies to keep in sync. One
   constant now.
   ========================================================================== */

export const DISCORD_INVITE = "https://discord.gg/PbFs4eXEv4";

/* The canonical hostname. Used as metadataBase, so it resolves the og:image
   path and every page's og:url — get it wrong and Discord previews point at
   somewhere the guild doesn't actually live. www, not the apex, because
   Vercel is configured to 308-redirect bloodrose.site -> www.bloodrose.site. */
export const SITE_URL = "https://www.bloodrose.site";

export const NAV_LINKS = [
  { href: "/",        label: "Home" },
  { href: "/events",  label: "Events" },
  { href: "/guides",  label: "Guides" },
  { href: "/gallery", label: "Gallery" },
] as const;
