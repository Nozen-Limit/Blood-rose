import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { getEvents } from "@/lib/data";
import { splitByRecency } from "@/lib/events";
import Reveal from "@/components/Reveal";
import Timeline from "@/components/Timeline";

export const metadata = pageMetadata({
  title: "Event History",
  description:
    "Past Blood Rose guild events, archived automatically as newer months roll in.",
  path: "/events/history",
});

export default async function EventHistoryPage() {
  const events = await getEvents();
  /* Same split as the Events page; this shows the other half. Nothing is
     archived by hand — months roll in here on their own. */
  const { older } = splitByRecency(events);

  return (
    <>
      <section className="page-hero">
        <h1>Event History</h1>
      </section>

      <Reveal as="section" className="section" id="history">
        <h2>Past Events</h2>

        {older.length ? (
          <Timeline groups={older} />
        ) : (
          <p className="timeline-empty">No past events yet.</p>
        )}

        <p className="timeline-history-link">
          <Link href="/events">&larr; Back to current events</Link>
        </p>
      </Reveal>
    </>
  );
}
