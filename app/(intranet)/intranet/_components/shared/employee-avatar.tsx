/** @format */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { avatarColors } from "../../_mock";

interface EmployeeAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackColor?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

function getAvatarColor(name: string) {
  const total = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[total % avatarColors.length];
}

export function EmployeeAvatar({
  name,
  imageUrl,
  className,
  fallbackColor,
}: EmployeeAvatarProps) {
  return (
    <Avatar className={cn("size-9", className)}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback
        className="text-primary-foreground"
        style={{ backgroundColor: fallbackColor ?? getAvatarColor(name) }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
