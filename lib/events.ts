/* ==========================================================================
   EVENT GROUPING
   Ported from js/timeline.js. Pure functions, no DOM — which means the
   month-splitting logic can now run on the server and be reasoned about on
   its own, rather than being tangled up with element building.
   ========================================================================== */

import type { GuildEvent, EventStatus } from "./types";

/** How many months stay on the main Events page before rolling off. */
export const MONTHS_SHOWN = 3;

/* Badge wording per status, kept here rather than in the data so nobody can
   typo "Cancelled" vs "Canceled" into a mismatch. A null-prototype object
   so a status of "constructor" or "toString" can't collide with a built-in
   property — an unrecognised status must simply be unrecognised. */
const STATUS_LABELS: Record<string, string> = Object.assign(Object.create(null), {
  ongoing: "Ongoing",
  done: "Done",
  rescheduled: "Rescheduled",
  canceled: "Canceled",
});

export const statusLabel = (status: EventStatus): string | undefined =>
  STATUS_LABELS[status];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR = MONTH_FULL.map((m) => m.slice(0, 3));

type Parsed = { date: Date; key: number; label: string };

/**
 * event_date comes from a calendar input in the admin, never free-typed, so
 * `new Date()` can be trusted to parse it. Returns null for genuinely broken
 * values so bad data sorts to the end instead of crashing.
 */
function parseEventDate(value: string | null): Parsed | null {
  /* new Date(null) silently becomes the Unix epoch, which passes an isNaN
     check despite being nonsense here — reject falsy before constructing. */
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return {
    date,
    /* One number that sorts correctly across year boundaries. */
    key: date.getFullYear() * 12 + date.getMonth(),
    label: `${MONTH_FULL[date.getMonth()]} ${date.getFullYear()}`,
  };
}

/**
 * "Aug 12, 6:00 PM" — hand-formatted rather than toLocaleString(), so it
 * reads identically for every visitor regardless of their browser's
 * language and region, matching the rest of the site's fixed English copy.
 */
export function formatEventDate(date: Date): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  const minuteText = minutes < 10 ? `0${minutes}` : String(minutes);

  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${hours12}:${minuteText} ${ampm}`;
}

export type TimelineEvent = GuildEvent & { parsedDate: Date | null };
export type MonthGroup = { month: string; key: number | null; items: TimelineEvent[] };

/** Groups events by month, newest month first. */
export function groupByMonth(events: GuildEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  /* Null-prototype lookup so a month label like "constructor" can't
     collide with an inherited property. */
  const seen: Record<string, MonthGroup> = Object.create(null);

  for (const event of events) {
    const parsed = parseEventDate(event.event_date);
    const label = parsed ? parsed.label : "Undated";

    if (!seen[label]) {
      seen[label] = { month: label, key: parsed ? parsed.key : null, items: [] };
      groups.push(seen[label]);
    }
    seen[label].items.push({ ...event, parsedDate: parsed ? parsed.date : null });
  }

  /* Newest month first. Unparseable months (key null) go last rather than
     jumping to the top, which is what they'd do if treated as 0. */
  return groups.sort((a, b) => {
    if (a.key === null && b.key === null) return 0;
    if (a.key === null) return 1;
    if (b.key === null) return -1;
    return b.key - a.key;
  });
}

/** Recent months stay on Events; the rest roll off to the History page. */
export function splitByRecency(events: GuildEvent[]) {
  const all = groupByMonth(events);
  return { recent: all.slice(0, MONTHS_SHOWN), older: all.slice(MONTHS_SHOWN) };
}
