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
      ["/prices.html", "/prices"],
      ["/gallery.html", "/gallery"],
      ["/wiki.html", "/wiki"],
    ];

    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
