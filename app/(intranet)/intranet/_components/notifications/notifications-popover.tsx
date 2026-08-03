/** @format */

"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockNotifications } from "../../_mock";
import {
  NotificationItem,
  NotificationItemData,
} from "./notification-item";

interface NotificationsPopoverProps {
  children: ReactNode;
  notifications?: readonly NotificationItemData[];
  onMarkAllRead?: () => void;
}

export function NotificationsPopover({
  children,
  notifications = mockNotifications,
  onMarkAllRead,
}: NotificationsPopoverProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0">Notificacoes</DropdownMenuLabel>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={onMarkAllRead}
          >
            Marcar como lidas
          </Button>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="max-h-80">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
