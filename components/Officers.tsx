"use client";

/* ==========================================================================
   OFFICERS
   The Guild Master is pulled out of the list and shown in their own wider
   card above the grid, no matter where they sit in the data. Everyone else
   goes into a carousel, five per page — with a roster this long a plain
   grid would be a very tall wall of cards.
   ========================================================================== */

import type { Officer } from "@/lib/types";
import Carousel from "./Carousel";
import OfficerCard from "./OfficerCard";
import Reveal from "./Reveal";

const isGuildMaster = (o: Officer) =>
  (o.rank ?? "").trim().toLowerCase() === "guild master";

export default function Officers({ officers }: { officers: Officer[] }) {
  if (!officers.length) {
    return <p className="timeline-empty">No officers listed yet.</p>;
  }

  /* Only the first Guild Master counts, so a stray second one in the data
     shows as a normal officer rather than silently creating two. */
  const guildMaster = officers.find(isGuildMaster);
  const rest = officers.filter((o) => o !== guildMaster);

  return (
    <>
      {guildMaster && (
        <div id="guild-master">
          <Reveal>
            <OfficerCard officer={guildMaster} featured />
          </Reveal>
        </div>
      )}

      <div id="officer-grid">
        {/* Cards inside the carousel deliberately get no scroll-reveal:
            they're parked off-screen in a clipped track, so the observer
            would treat them as never visible and could leave them stuck
            at opacity 0 even after you page to them. */}
        <Carousel
          items={rest.map((o) => <OfficerCard key={o.id} officer={o} />)}
          groupSize={5}
          gridClass="officer-carousel-grid"
          noun="officers"
        />
      </div>
    </>
  );
}
