/** @format */

import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAnnouncements, mockEvents, mockJobs } from "../../_mock";

interface RailCardProps {
  title: string;
  children: ReactNode;
}

function RailCard({ title, children }: RailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function FeedRightRail() {
  return (
    <div className="space-y-4">
      <RailCard title="Comunicados recentes">
        <div className="space-y-3">
          {mockAnnouncements.slice(0, 2).map((announcement) => (
            <div key={announcement.id} className="space-y-1">
              <p className="text-sm font-medium">{announcement.title}</p>
              <p className="text-xs text-muted-foreground">
                {announcement.date}
              </p>
            </div>
          ))}
        </div>
      </RailCard>

      <RailCard title="Proximos eventos">
        <div className="space-y-3">
          {mockEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="space-y-1">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {event.day} {event.monthShort}
              </p>
            </div>
          ))}
        </div>
      </RailCard>

      <RailCard title="Vagas internas">
        <div className="space-y-3">
          {mockJobs.map((job) => (
            <div key={job.title} className="space-y-1">
              <p className="text-sm font-medium">{job.title}</p>
              <p className="text-xs text-muted-foreground">{job.dept}</p>
            </div>
          ))}
        </div>
      </RailCard>
    </div>
  );
}
