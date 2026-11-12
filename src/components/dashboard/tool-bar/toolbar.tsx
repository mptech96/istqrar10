"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import UserAvatar from "@/components/dashboard/user-avatar/user-avatar";
import LangSwitcher from "@/components/common/lang/lang-switcher";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationBill from "@/components/dashboard/notification/notification-bill";
import NotificationDropdownMenu from "@/components/dashboard/notification/notification-dropdown-menu";
import { useGetNotificationsQuery } from "@/services/api/notifications";
import { GlobalVisitTimer } from "@/components/dashboard/visits/global-visit-timer";

const ToolBar = () => {
  const { data } = useGetNotificationsQuery("", {
    pollingInterval: 60000,
  });

  const unreadCount = data?.data?.filter((n) => !n.read_at).length || 0;

  return (
    <div className="flex justify-between align-center py-2 mt-2">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="flex h-full align-center" />
        <GlobalVisitTimer />
      </div>
      <div className="flex gap-4 items-center">
        <div className="cursor-pointer text-sm flex items-center">
          <AnimatedThemeToggler />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <NotificationBill unreadCount={unreadCount} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 md:w-96 p-0 mr-4" align="end">
            <NotificationDropdownMenu />
          </PopoverContent>
        </Popover>

        <div>
          <LangSwitcher />
        </div>
        <UserAvatar />
      </div>
    </div>
  );
};

export default ToolBar;
