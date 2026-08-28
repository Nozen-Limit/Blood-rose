import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { getEvents } from "@/lib/data";
import { splitByRecency } from "@/lib/events";
import Reveal from "@/components/Reveal";
import Timeline from "@/components/Timeline";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Current and upcoming Blood Rose events, plus our weekly recurring schedule.",
  path: "/events",
});

export default async function EventsPage() {
  const events = await getEvents();
  const { recent, older } = splitByRecency(events);

  return (
    <>
      <section className="page-hero">
        <h1>Events</h1>
      </section>

      <Reveal as="section" className="section" id="roadmap">
        <h2>Event Roadmap</h2>

        {recent.length ? (
          <Timeline groups={recent} />
        ) : (
          <p className="timeline-empty">No events posted yet.</p>
        )}

        {/* Only shown once history actually exists — a link to an empty
            archive is worse than no link. */}
        {older.length > 0 && (
          <p className="timeline-history-link">
            <Link href="/events/history">View past events &rarr;</Link>
          </p>
        )}
      </Reveal>
    </>
  );
}
