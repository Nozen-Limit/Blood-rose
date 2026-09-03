import { formatEventDate, statusLabel, type MonthGroup } from "@/lib/events";
import TimelineItem from "./TimelineItem";

/* Month headings and their events. Dates are formatted here, on the server,
   so only strings cross into the client component below. */
export default function Timeline({ groups }: { groups: MonthGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.month}>
          <h3 className="timeline-month">{group.month}</h3>
          <ol className="timeline">
            {group.items.map((event) => (
              <TimelineItem
                key={event.id}
                dateText={event.parsedDate ? formatEventDate(event.parsedDate) : "Date TBD"}
                title={event.title || "Untitled event"}
                status={event.status}
                statusLabel={statusLabel(event.status)}
                details={event.details}
              />
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}
