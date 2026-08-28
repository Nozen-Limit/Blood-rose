import type { ReactNode } from "react";

/* A grid of titled cards with a paragraph each — guide builds and mechanics. */
export default function InfoCardGrid({
  items, empty,
}: {
  items: { id: string; title: string; body: string | null }[];
  /** Shown when there's nothing yet. Phrase it as "No X yet." — naming what
      is absent reads as a finished site with an empty section, whereas a
      promise like "coming soon" reads as an unfinished one. */
  empty: string;
}): ReactNode {
  if (!items.length) return <p className="timeline-empty">{empty}</p>;

  return (
    <div className="goal-grid">
      {items.map((item) => (
        <div className="goal-card" key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.body ?? ""}</p>
        </div>
      ))}
    </div>
  );
}
