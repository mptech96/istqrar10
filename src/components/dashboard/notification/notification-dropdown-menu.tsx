"use client";
import React, { useState, useMemo } from "react";
import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
  useDeleteNotificationMutation,
} from "@/services/api/notifications";
import { useTranslations } from "next-intl";
import {
  CheckCheck,
  Trash2,
  ChevronLeft,
  Inbox,
  Loader2,
  Calendar,
  Info,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

const NotificationDropdownMenu = () => {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "read"
  >("all");
  const [
    selectedNotificationId,
    setSelectedNotificationId,
  ] = useState<number | null>(null);

  const { data, isLoading, isFetching } =
    useGetNotificationsQuery("", {
      pollingInterval: 60000, // Poll every minute
    });

  const [readNotification] = useReadNotificationMutation();
  const [readAllNotifications] =
    useReadAllNotificationsMutation();
  const [deleteNotification] =
    useDeleteNotificationMutation();

  const notifications = useMemo(
    () => data?.data || [],
    [data],
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread")
      return notifications.filter((n) => !n.read_at);
    if (activeFilter === "read")
      return notifications.filter((n) => n.read_at);
    return notifications;
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter(
    (n) => !n.read_at,
  ).length;

  const handleNotificationClick = async (
    notification: Notification,
  ) => {
    if (!notification.read_at) {
      await readNotification(notification.id);
    }

    if (selectedNotificationId === notification.id) {
      setSelectedNotificationId(null);
    } else {
      setSelectedNotificationId(notification.id);
    }
  };

  const handleMarkAllRead = async () => {
    await readAllNotifications();
  };

  const handleDelete = async (
    e: React.MouseEvent,
    id: number,
  ) => {
    e.stopPropagation();
    await deleteNotification(id);
    if (selectedNotificationId === id)
      setSelectedNotificationId(null);
  };

  const selectedNotification = notifications.find(
    (n) => n.id === selectedNotificationId,
  );

  // Detail View Component
  if (selectedNotification) {
    const entity = selectedNotification.entity;
    return (
      <div className="flex flex-col h-[450px]">
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setSelectedNotificationId(null)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4",
                locale === "ar" ? "rotate-180" : "",
              )}
            />
            <span className="mx-1">
              {t("back_to_list")}
            </span>
          </Button>
          <h2 className="text-sm font-semibold truncate max-w-[200px]">
            {t("notification_details")}
          </h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base leading-tight">
                {selectedNotification.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(
                  selectedNotification.created_at,
                ).toLocaleString(locale)}
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
              {selectedNotification.body}
            </div>

            {entity && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {t("Related Information")}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {entity.request_type_text && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">
                        {t("Type")}
                      </span>
                      <span className="font-medium text-primary">
                        {entity.request_type_text}
                      </span>
                    </div>
                  )}
                  {entity.status_text && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">
                        {t("Status")}
                      </span>
                      <Badge
                        variant="outline"
                        className="w-fit scale-90 origin-left"
                      >
                        {entity.status_text}
                      </Badge>
                    </div>
                  )}
                  {entity.customer_name && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">
                        {t("customer_name")}
                      </span>
                      <span className="font-medium">
                        {entity.customer_name}
                      </span>
                    </div>
                  )}
                  {entity.company_name && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground">
                        {t("Company")}
                      </span>
                      <span className="font-medium text-primary">
                        {entity.company_name}
                      </span>
                    </div>
                  )}
                  {entity.package_name && (
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-muted-foreground">
                        {t("package_name")}
                      </span>
                      <span className="font-medium py-1 px-2 bg-primary/10 rounded border border-primary/20 text-primary w-fit">
                        {entity.package_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedNotification.url && (
              <Button
                variant="outline"
                className="w-full mt-4 gap-2"
                asChild
              >
                <a href={selectedNotification.url}>
                  <FileText className="h-4 w-4" />
                  {t("show_details")}
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="p-3 border-t bg-muted/20 flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) =>
              handleDelete(e, selectedNotification.id)
            }
            className="text-xs h-8 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            {t("delete_notification")}
          </Button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="flex flex-col w-full max-w-[400px] h-[500px]">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight">
            {t("notifications")}
          </h2>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="rounded-full px-2 py-0 h-5"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary h-8 px-2 hover:bg-primary/10"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-3.5 w-3.5 mr-1" />
          {t("mark_all_as_read")}
        </Button>
      </div>

      <div className="px-4 py-2 border-b bg-muted/30 flex gap-2 overflow-x-auto no-scrollbar">
        {["all", "unread", "read"].map((f) => (
          <Button
            key={f}
            variant={
              activeFilter === f ? "default" : "ghost"
            }
            size="sm"
            className={cn(
              "h-7 px-3 text-[11px] rounded-full capitalize",
              activeFilter === f
                ? "shadow-sm"
                : "text-muted-foreground hover:bg-muted",
            )}
            onClick={() =>
              setActiveFilter(
                f as "all" | "unread" | "read",
              )
            }
          >
            {t(f)}
          </Button>
        ))}
      </div>

      <div className="flex-1 w-full overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs">{t("Loading")}</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border/50">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "relative p-4 flex gap-3 cursor-pointer transition-all hover:bg-accent group",
                  !notification.read_at && "bg-primary/5",
                )}
                onClick={() =>
                  handleNotificationClick(notification)
                }
              >
                {!notification.read_at && (
                  <span className="absolute start-2 top-6 w-2 h-2 rounded-full bg-primary" />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <p
                      className={cn(
                        "text-sm line-clamp-1 ps-3",
                        !notification.read_at
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground",
                      )}
                    >
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                      {formatDistanceToNow(
                        new Date(notification.created_at),
                        {
                          addSuffix: true,
                          locale: dateLocale,
                        },
                      )}
                    </span>
                  </div>
                  <p className="text-xs w-[90%] text-muted-foreground line-clamp-2 leading-relaxed ">
                    {notification.body}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive absolute end-2 bottom-4 transition-all"
                  onClick={(e) =>
                    handleDelete(e, notification.id)
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-base">
              {t(
                activeFilter === "all"
                  ? "no_notifications"
                  : "no_" + activeFilter + "_notifications",
              )}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 px-6">
              {activeFilter === "unread"
                ? t("no_unread_notifications")
                : ""}
            </p>
          </div>
        )}
      </div>

      {isFetching && !isLoading && (
        <div className="absolute bottom-2 right-2 p-1 bg-background border rounded-md shadow-sm">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default NotificationDropdownMenu;
