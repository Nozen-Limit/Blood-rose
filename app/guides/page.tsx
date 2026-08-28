import { pageMetadata } from "@/lib/metadata";
import { getGuides } from "@/lib/data";
import Reveal from "@/components/Reveal";
import Carousel from "@/components/Carousel";
import VideoCard from "@/components/VideoCard";
import InfoCardGrid from "@/components/InfoCardGrid";

export const metadata = pageMetadata({
  title: "Guides",
  description:
    "Build guides, proc explanations, and video tutorials for Arcane Legends, curated by Blood Rose.",
  path: "/guides",
});

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <>
      <Reveal as="section" className="section" id="videos">
        <h2>Video Guides</h2>
        {guides.videos.length ? (
          /* Three per slide: the arrows page between groups of three
             rather than one video at a time. */
          <Carousel
            items={guides.videos.map((v, i) => <VideoCard key={i} item={v} />)}
            groupSize={3}
            gridClass="video-grid"
            noun="videos"
          />
        ) : (
          <p className="timeline-empty">No videos yet.</p>
        )}
      </Reveal>

      <Reveal as="section" className="section" id="builds">
        <h2>What to Build</h2>
        <InfoCardGrid items={guides.builds} empty="No build guides yet." />
      </Reveal>

      <Reveal as="section" className="section" id="procs">
        <h2>Procs &amp; Mechanics</h2>
        <InfoCardGrid items={guides.mechanics} empty="No procs or mechanics yet." />
      </Reveal>
    </>
  );
}
