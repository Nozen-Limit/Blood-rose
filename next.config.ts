import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The old site's pages were literal files — /prices.html, /wiki.html and
     so on — and those URLs are already pasted around the guild's Discord.
     Next serves clean paths instead, so every old URL is redirected to its
     new home rather than 404ing. Permanent (308), since these moved for
     good. */
  async redirects() {
    const moved: [string, string][] = [
      ["/index.html", "/"],
      ["/events.html", "/events"],
      ["/events-history.html", "/events/history"],
      ["/guides.html", "/guides"],
      /* Prices and Wiki were removed — the game has no API to keep them
         accurate by hand. Old links are still pasted around Discord, so
         they land on the homepage instead of a bare 404. */
      ["/prices.html", "/"],
      ["/prices", "/"],
      ["/gallery.html", "/gallery"],
      ["/wiki.html", "/"],
      ["/wiki", "/"],
    ];

    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
