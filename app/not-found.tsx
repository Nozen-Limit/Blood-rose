import Link from "next/link";

/* Next renders this automatically for any URL that matches no route, inside
   the same root layout as every other page — so the nav, footer and theme
   already apply; this only needed to stop falling back to Next's own bare
   black-on-white default. Worth having: old links, typos, and crawlers hit
   this before anyone notices while the site runs unattended.

   No Discord button here — the footer already has one on every page, and
   a second one right above it just duplicated it. */
export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <h1>Page not found</h1>
      </section>

      <div className="section" style={{ textAlign: "center" }}>
        <p>
          That page doesn&apos;t exist — it may have moved, or the link was
          typed wrong.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
          Back to home
        </Link>
      </div>
    </>
  );
}
