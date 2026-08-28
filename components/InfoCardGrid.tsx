import type { ReactNode } from "react";

/* A grid of titled cards with a paragraph each — guide builds, mechanics,
   wiki classes. `empty` is the message shown when there's nothing yet. */
export default function InfoCardGrid({
  items, empty, emptyClass = "timeline-empty",
}: {
  items: { id: string; title: string; body: string | null }[];
  empty: string;
  emptyClass?: string;
}): ReactNode {
  if (!items.length) return <p className={emptyClass}>{empty}</p>;

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
