# Blood Rose — site guide

A plain HTML/CSS/JS site. No frameworks, no build step, no installing anything.
Open `index.html` in a browser and it runs.

## Layout of the project

```
bloodrose/
├── index.html      Home — story, goals, officers
├── events.html     Event roadmap
├── guides.html     Builds, procs, video guides
├── prices.html     Gear price tables
├── gallery.html    Photos and videos
├── wiki.html       Classes, mechanics, glossary
├── css/            One file per component
└── js/             One file per feature
```

### css/

| File | Owns |
|---|---|
| `main.css` | **Entry point.** No styles — just imports the rest in order. |
| `tokens.css` | Every colour and shared size. **Retheme the site from here.** |
| `base.css` | Element defaults: body, links, headings, focus outlines |
| `background.css` | Fixed glow blobs + blood drip band |
| `nav.css` | Header, nav, hamburger menu |
| `search.css` | Search overlay |
| `hero.css` | Homepage hero, stat strip, sub-page headers |
| `testimonial.css` | Rotating member quotes |
| `cards.css` | Goal cards, officer cards |
| `timeline.css` | Event roadmap |
| `content.css` | Tables, video grids, image grids |
| `buttons.css` | Buttons + click ripple |
| `footer.css` | Footer, back-to-top, sticky mobile bar |
| `animations.css` | Scroll-reveal |

### js/

`utils.js` must load first — it creates the shared `BR` object.
`search-index.js` must load before `search.js`.
Everything else is independent.

| File | Does |
|---|---|
| `utils.js` | Shared state (reduced-motion flag, scroll helper) |
| `nav.js` | Header shadow, closes mobile menu, marks current page |
| `search-index.js` | **The list of searchable pages — edit this to add entries** |
| `search.js` | Search overlay behaviour |
| `reveal.js` | Fade-in on scroll |
| `parallax.js` | Background blob drift |
| `stats.js` | Hero number count-up |
| `testimonials.js` | Quote rotation |
| `officers.js` | Officer "More Info" toggles |
| `clipboard.js` | Copy Discord link |
| `floating-ui.js` | Back-to-top + sticky mobile bar |
| `ripple.js` | Button click ripple |
| `render.js` | Shared builders: tables, cards, video/image tiles |
| `timeline.js` | Builds the event roadmap + tap-to-open |
| `officers.js` | Builds officer cards + "More Info" toggles |
| `prices.js` `gallery.js` `guides.js` `wiki.js` | Build their page's content |

### js/data/ — the files you actually edit

All page content lives here. **You should almost never need to open an
HTML file to change content.**

| File | Feeds |
|---|---|
| `data/events.js` | Event roadmap |
| `data/officers.js` | Officer cards |
| `data/stats.js` | Hero numbers |
| `data/testimonials.js` | Rotating quotes |
| `data/prices.js` | All price tables |
| `data/guides.js` | Build cards + video guides |
| `data/gallery.js` | Photos + videos |
| `data/wiki.js` | Class cards + glossary |

Still plain HTML on purpose (prose, not records): the guild story, the
goals cards, the "Procs & Mechanics" and "Mechanics" writing.

---

## How to update things

### Change a colour anywhere on the site

Edit `css/tokens.css`. Nothing else. Every file reads from it.

```css
--red-bright: #E24B4A;   /* buttons, links, badges */
```

### Add or edit an event

Edit `js/data/events.js`. **Don't touch `events.html`** — the page builds
itself from this list.

```js
{
  month: "August 2026",
  date: "Aug 18–20",
  title: "Guild War Season",
  status: "ongoing",          // ongoing | done | rescheduled | canceled
  details: "Sign up in Discord by the 17th."
},
```

Copy a block, change the words between the quotes, keep the trailing comma.
Events sharing a `month` group together; newest month at the top.

No ids to manage — the code generates them.

If you typo the status, that entry falls back to plain grey instead of
breaking the page.

### Replace placeholder text

Search `js/data/` for `Placeholder` — that's nearly all of it.
For the prose sections (story, goals, mechanics) search the HTML for
`Replace`; every placeholder has a comment saying what goes there.

### Change officers, prices, guides, wiki, stats or quotes

Open the matching file in `js/data/`. Same idea every time: a list of
blocks, copy one, change the words between the quotes, keep the comma.

### Add a photo or video

Edit `js/data/gallery.js` (or `js/data/guides.js` for guide videos).

**Photo** — fill in `src`, and always write `alt`:

```js
{ src: "images/gvg-win.jpg", alt: "Blood Rose after winning the GvG final" }
```

An empty `src` keeps the dashed placeholder box, so you can leave slots
ready and fill them in later.

**Video** — `youtubeId` is the code after `v=` in a YouTube URL:

```js
{ title: "How to proc Glaive", youtubeId: "dQw4w9WgXcQ" }
```

That embeds the player. Use `url:` instead for a plain link. With neither,
you get a placeholder box.

### Make something findable in search

Add a line to `js/search-index.js`:

```js
{ title: "Gold Loot Set Prices", section: "Prices",
  url: "prices.html#gold-loot",
  keywords: "gold loot set price cost" },
```

There's no server, so nothing indexes the site automatically — **this list
IS the search.** If it's not here, it can't be found.

For `url` to jump to a section, that section needs a matching `id` in the
HTML (`<section id="gold-loot">`).

### Add a whole new page

1. Copy the closest existing page (e.g. `prices.html`) and rename it
2. Change the `<title>` and the `<h1>`
3. Replace the content between `<main>` and `</main>`
4. Add a nav link **in all six pages** (see the known limitation below)
5. Add its sections to `js/search-index.js`
6. If it has list content, add `js/data/yourpage.js` and a renderer, and
   load them in that page's script block

### Script order (if you add scripts)

The block at the bottom of each page is ordered deliberately:

1. `utils.js` — creates the shared `BR` object
2. `render.js` — shared builders
3. `data/*.js` — before the renderer that reads it
4. renderers — build content into the page
5. everything else — these **scan** the finished page, so they must be
   last. `reveal.js` especially: it only animates elements that exist when
   it runs, so anything generated after it would stay invisible forever.

### Add a new component

1. Make `css/yourthing.css`
2. Add `@import url("yourthing.css");` to `css/main.css`
3. If it needs behaviour, make `js/yourthing.js` and add a `<script>` tag
   at the bottom of the pages that use it

---

## Known limitation

**The header, nav, and footer are copy-pasted into all six pages.**
Changing a nav link means editing six files.

Plain HTML has no "include this file" feature — that needs a build step.
The alternative is injecting the header/footer with JavaScript, which fixes
the duplication but means the nav disappears entirely if JS fails. For now
duplication is the safer trade.

---

## Rules worth keeping

- **Never hardcode a colour** outside `tokens.css`.
- **Design for a 380px phone first**, then widen. Most members are on mobile.
- **Don't rely on hover alone** — phones can't hover. Anything hoverable
  must also work on tap.
- **Don't rely on colour alone** to convey meaning. Canceled events are
  struck through as well as recoloured, so colourblind readers get it too.
- **Every image needs `alt` text** describing what it shows.
- **Test by shrinking the browser window** to phone width before publishing.
