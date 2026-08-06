/** @format */

import { CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntranetEvent } from "../../_types/intranet";

interface EventCardProps {
  event: IntranetEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-base font-bold leading-none">{event.day}</span>
            <span className="text-[10px] font-semibold leading-none">
              {event.monthShort}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span className="text-xs font-medium">Evento</span>
            </div>
            <CardTitle className="leading-snug">{event.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{event.desc}</p>
      </CardContent>
    </Card>
  );
}
