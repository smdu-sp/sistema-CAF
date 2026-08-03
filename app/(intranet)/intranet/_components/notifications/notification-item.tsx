/** @format */

import { cn } from "@/lib/utils";

export interface NotificationItemData {
  id: number | string;
  text: string;
  time: string;
  read?: boolean;
  dot?: string;
}

interface NotificationItemProps {
  notification: NotificationItemData;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 border-b px-4 py-3 last:border-b-0",
        !notification.read && "bg-muted/40",
      )}
    >
      <span
        className="mt-1.5 size-2 shrink-0 rounded-full"
        style={{ backgroundColor: notification.dot ?? "#9497A1" }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{notification.text}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {notification.time}
        </p>
      </div>
    </div>
  );
}
