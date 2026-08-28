import { formatEventDate, statusLabel, type MonthGroup } from "@/lib/events";

/* One month heading followed by its events. Rendered on the server — none
   of this needs to be interactive. */
export default function Timeline({ groups }: { groups: MonthGroup[] }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.month}>
          <h3 className="timeline-month">{group.month}</h3>
          <ol className="timeline">
            {group.items.map((event) => {
              const label = statusLabel(event.status);
              return (
                <li
                  className="timeline-item"
                  key={event.id}
                  /* Drives the dot colour, badge colour and strikethrough
                     from this one attribute (see timeline.css). An
                     unrecognised status gets no attribute and falls back
                     to neutral styling rather than breaking. */
                  {...(label ? { "data-status": event.status } : {})}
                >
                  <span className="timeline-dot" aria-hidden="true" />
                  <div className="timeline-entry">
                    <span className="timeline-date">
                      {event.parsedDate ? formatEventDate(event.parsedDate) : "Date TBD"}
                    </span>
                    <span className="timeline-title">{event.title || "Untitled event"}</span>
                    <span className="status">{label || "Unknown"}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </>
  );
}
