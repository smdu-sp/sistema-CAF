/** @format */

import { BriefcaseBusiness, DoorOpen, Mail, Phone } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";
import { IntranetProfile } from "../../_types/intranet";

interface ProfileHeaderProps {
  profile: IntranetProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <EmployeeAvatar
            name={profile.name}
            imageUrl={profile.imageUrl}
            className="size-20"
          />

          <div className="min-w-0 space-y-1">
            <CardTitle className="text-2xl leading-tight">
              {profile.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Cargo</p>
              <p className="text-muted-foreground">{profile.role}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">E-mail</p>
              <p className="break-all text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Ramal</p>
              <p className="text-muted-foreground">{profile.extension}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DoorOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Sala</p>
              <p className="text-muted-foreground">{profile.room}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
