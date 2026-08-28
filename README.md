# Blood Rose — public site

The guild's public website, in Next.js. Replaces the previous seven
hand-maintained HTML files (see `../bloodrose/`).

Content comes from the same Supabase tables the admin panel
(`../bloodrose-admin/`) writes to, so officers edit the site there and
changes appear here within seconds — no redeploy.

## Running it

```
npm install
npm run dev        # http://localhost:3000
```

Needs a `.env.local` with the same two values the admin panel uses:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The anon key is the publishable one and is safe in a browser. What actually
protects the data is the Row Level Security policy in
`../bloodrose-admin/schema.sql` — public read, writes only for signed-in
officers.

## Layout

```
app/
  layout.tsx        the shared shell: nav, footer, search, background
  page.tsx          home — hero, story, goals, officers
  events/           roadmap, and history/ for months that rolled off
  guides/  prices/  gallery/  wiki/
  api/search-index/ builds the site-wide search index server-side
  styles/           the stylesheet, ported unchanged from the old site
components/         shared UI
lib/
  data.ts           every Supabase read
  types.ts          mirrors schema.sql — update together
  events.ts         month grouping for the timeline
  search.ts         index entries + scoring
  site.ts           Discord invite, nav links, site URL
```

## Things worth knowing

- **`lib/types.ts` mirrors `schema.sql`.** Rename a column in the database
  and update it here; the build then points at every place that needs
  changing, instead of a section quietly rendering blank.
- **Pages are `force-dynamic`** (set in `app/layout.tsx`). That's what keeps
  the admin panel's "changes go live in a few seconds" promise. Switching to
  ISR would make pages faster but content staler.
- **Styling is plain CSS, not Tailwind**, unlike the admin panel. It was
  ported as-is from the old site and is organised one file per component
  with all colours in `styles/tokens.css`.
- **The search index is fetched once, lazily**, the first time someone opens
  the search panel — not on every page load.
