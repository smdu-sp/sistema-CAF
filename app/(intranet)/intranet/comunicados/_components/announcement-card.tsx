import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; 
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
import { IntranetAnnouncement } from "../../_types/intranet";

interface AnnouncementCardProps {
  announcement: IntranetAnnouncement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Megaphone className="size-4 text-primary" />
           <h1 className="font-semibold text-sm ">Comunicado Oficial</h1>
           <Badge variant="secondary">{announcement.date}</Badge>
        </div>
        <div className="">
          <CardTitle className="font-bold text-xl">{announcement.title}</CardTitle>
        </div>
      <Separator></Separator>
      </CardHeader>


      <CardContent>
        <p className="text-md text-muted-foreground font-semibold">
          {announcement.text}
        </p>
      </CardContent>
    </Card>
  );
}