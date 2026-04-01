import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationBillProps {
  unreadCount?: number;
}

const NotificationBill: React.FC<NotificationBillProps> = ({ unreadCount = 0 }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full p-0 text-[10px] ring-2 ring-background"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBill;
