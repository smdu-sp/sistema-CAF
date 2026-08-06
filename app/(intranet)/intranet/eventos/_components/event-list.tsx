/** @format */

import { mockEvents } from "../../_mock";
import { IntranetEvent } from "../../_types/intranet";
import { EventCard } from "./event-card";

interface EventListProps {
  events?: readonly IntranetEvent[];
}

export function EventList({ events = mockEvents }: EventListProps) {
  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
