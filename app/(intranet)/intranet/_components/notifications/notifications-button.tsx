/** @format */

"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockNotifications } from "../../_mock";
import { NotificationItemData } from "./notification-item";
import { NotificationsPopover } from "./notifications-popover";

interface NotificationsButtonProps {
  notifications?: readonly NotificationItemData[];
}

export function NotificationsButton({
  notifications = mockNotifications,
}: NotificationsButtonProps) {
  const unreadCount = notifications.filter((notification) => !notification.read)
    .length;

  return (
    <NotificationsPopover notifications={notifications}>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="relative rounded-full"
        aria-label="Abrir notificacoes"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </Button>
    </NotificationsPopover>
  );
}
