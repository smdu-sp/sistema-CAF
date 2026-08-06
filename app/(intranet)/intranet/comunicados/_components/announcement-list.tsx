import { mockAnnouncements } from "../../_mock";
import { AnnouncementCard } from "./announcement-card";

export function AnnouncementList() {
  return (
    <div className="grid gap-4">
      {mockAnnouncements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
        />
      ))}
    </div>
  );
}