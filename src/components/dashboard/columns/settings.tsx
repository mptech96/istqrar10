"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { SmartSetting, SettingType } from "@/types/setting";
import { Badge } from "@/components/ui/badge";
import SettingModel from "@/components/models/setting-model";

export const getColumns = (
  t: _Translator,
): ColumnDef<SmartSetting<SettingType>>[] => [
  {
    accessorKey: "key",
    header: t("Key"),
    cell: ({ row }) => {
      const setting = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{setting.key}</span>
          <span className="text-xs text-muted-foreground">
            {setting.group}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "label",
    header: t("Label"),
  },
  {
    accessorKey: "formatted_value",
    header: t("Value"),
    cell: ({ row }) => {
      const value = row.original.formatted_value;
      if (typeof value === "boolean") {
        return (
          <Badge variant={value ? "default" : "outline"}>
            {value ? t("Yes") : t("No")}
          </Badge>
        );
      }
      return (
        <span className="max-w-[200px] truncate block">
          {String(value)}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: t("Type"),
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {t(row.getValue("type") as string)}
      </Badge>
    ),
  },
  {
    accessorKey: "is_public",
    header: t("Public"),
    cell: ({ row }) => {
      const isPublic = row.original.is_public;
      return (
        <Badge variant={isPublic ? "default" : "secondary"}>
          {isPublic ? t("Public") : t("Private")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const setting = row.original;
      return <SettingModel setting={setting} />;
    },
  },
];
