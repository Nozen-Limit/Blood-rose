import { pageMetadata } from "@/lib/metadata";
import { getWiki } from "@/lib/data";
import Reveal from "@/components/Reveal";
import InfoCardGrid from "@/components/InfoCardGrid";

export const metadata = pageMetadata({
  title: "Wiki",
  description:
    "Blood Rose's own quick reference for Arcane Legends — classes, mechanics, and terms.",
  path: "/wiki",
});

export default async function WikiPage() {
  const wiki = await getWiki();

  return (
    <>
      <section className="page-hero">
        <h1>Wiki</h1>
      </section>

      <Reveal as="section" className="section" id="classes">
        <h2>Classes</h2>
        <InfoCardGrid items={wiki.classes} empty="No classes listed yet." />
      </Reveal>

      {/* Prose, not records, so this stays hand-written — same as the
          static site. The copy below is still placeholder text. */}
      <Reveal as="section" className="section" id="mechanics">
        <h2>Mechanics</h2>
        <p>Placeholder explanation of a core game mechanic.</p>
        <p>Placeholder explanation of another core game mechanic.</p>
      </Reveal>
    </>
  );
}
