import type { GalleryImage as GalleryImageType } from "@/lib/types";

/* `caption` does double duty as the visible subtitle and the alt text,
   rather than asking officers for two fields that say the same thing. */
export default function GalleryImage({ item }: { item: GalleryImageType }) {
  if (!item.src) {
    return <div className="image-placeholder" aria-hidden="true">Image placeholder</div>;
  }

  return (
    <figure className="gallery-item">
      {/* eslint-disable-next-line @next/next/no-img-element --
          these are arbitrary URLs officers paste in from Supabase storage or
          elsewhere, so next/image's domain allowlist would reject them. */}
      <img className="gallery-img" src={item.src} alt={item.caption || ""} loading="lazy" />
      {item.caption && <figcaption className="gallery-caption">{item.caption}</figcaption>}
    </figure>
  );
}
