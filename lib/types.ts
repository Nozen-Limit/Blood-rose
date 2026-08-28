/* ==========================================================================
   DATABASE TYPES
   These mirror bloodrose-admin/schema.sql exactly. The admin app writes
   these same eight tables, so if a column is ever renamed there, fixing
   this file is what surfaces every place the public site needs updating —
   as a build error rather than a silently blank section.
   ========================================================================== */

export type OfficerRank = "Guild Master" | "Officer";
export type EventStatus = "ongoing" | "done" | "rescheduled" | "canceled";

/** officers.details — [{ label, value }] */
export type OfficerDetail = { label: string; value: string };

/** officers.socials — [{ platform, label, url }] */
export type OfficerSocial = {
  platform?: string;
  label?: string;
  url?: string;
};

export type Officer = {
  id: string;
  name: string;
  rank: OfficerRank;
  note: string | null;
  avatar: string | null;
  details: OfficerDetail[];
  socials: OfficerSocial[];
  sort_order: number;
};

export type GuildEvent = {
  id: string;
  event_date: string;
  title: string;
  status: EventStatus;
  details: string | null;
  sort_order: number;
};

/** price_sections.rows — [category, item, price] tuples */
export type PriceRow = [string, string, string];

export type PriceSection = {
  id: string;
  title: string;
  columns: string[];
  rows: PriceRow[];
  sort_order: number;
};

export type GuideKind = "build" | "video" | "mechanic";

export type GuideItem = {
  id: string;
  kind: GuideKind;
  title: string;
  body: string | null;
  youtube_id: string | null;
  url: string | null;
  sort_order: number;
};

export type GalleryImage = { src: string; alt?: string; caption?: string };
export type GalleryVideo = { title: string; youtubeId?: string; url?: string };

export type GallerySection = {
  id: string;
  title: string;
  type: "images" | "videos";
  items: GalleryImage[] | GalleryVideo[];
  sort_order: number;
};

export type WikiItem = {
  id: string;
  kind: "class" | "glossary";
  title: string;
  body: string | null;
  sort_order: number;
};

export type Stat = { id: string; value: string; label: string; sort_order: number };
export type Testimonial = { id: string; quote: string; name: string; sort_order: number };

/* --- Shapes the renderers actually consume ------------------------------ */

export type Guides = {
  builds: GuideItem[];
  videos: { title: string; youtubeId?: string; url?: string }[];
  mechanics: GuideItem[];
};

export type Wiki = {
  classes: WikiItem[];
  glossary: { columns: string[]; rows: string[][] };
};
