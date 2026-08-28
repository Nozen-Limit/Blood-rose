import { pageMetadata } from "@/lib/metadata";
import { getGallery } from "@/lib/data";
import type { GalleryImage as GalleryImageType, GalleryVideo } from "@/lib/types";
import Reveal from "@/components/Reveal";
import VideoCard from "@/components/VideoCard";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Screenshots and clips from Blood Rose guild activities, funny moments, and serious highlights.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const groups = await getGallery();

  return (
    <>
      <section className="page-hero">
        <h1>Gallery</h1>
      </section>

      {!groups.length && (
        <div className="section">
          <p className="timeline-empty">Nothing in the gallery yet.</p>
        </div>
      )}

      {groups.map((group) => {
        const isVideo = group.type === "videos";
        return (
          <Reveal as="section" className="section" id={group.id} key={group.id}>
            <h2>{group.title}</h2>
            {isVideo ? (
              <div className="video-grid">
                {(group.items ?? []).map((item, i) => (
                  <VideoCard key={i} item={item as GalleryVideo} />
                ))}
              </div>
            ) : (
              /* Photos get their own client component so they can be tapped
                 open at full size — see GalleryGrid. */
              <GalleryGrid items={(group.items ?? []) as GalleryImageType[]} />
            )}
          </Reveal>
        );
      })}
    </>
  );
}
