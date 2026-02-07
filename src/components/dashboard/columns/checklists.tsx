"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Checklist } from "@/types/checklist";
import { Badge } from "@/components/ui/badge";

export const getColumns = (
  t: _Translator,
): ColumnDef<Checklist>[] => [
  {
    accessorKey: "name",
    header: t("Name"),
    cell: ({ row }) => {
      const checklist = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {checklist.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {checklist.code}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "version",
    header: t("Version"),
  },
  {
    accessorKey: "industry_type",
    header: t("Industry Type"),
    cell: ({ row }) => row.getValue("industry_type") || "-",
  },
  {
    accessorKey: "total_score",
    header: t("Total Score"),
  },
  {
    accessorKey: "passing_score",
    header: t("Passing Score"),
  },
  {
    accessorKey: "time_estimate",
    header: t("Time Estimate"),
    cell: ({ row }) => {
      const time = row.original.time_estimate;
      return time ? `${time} ${t("min")}` : "-";
    },
  },
  {
    accessorKey: "is_template",
    header: t("Template"),
    cell: ({ row }) => {
      const isTemplate = row.original.is_template;
      return (
        <Badge variant={isTemplate ? "default" : "outline"}>
          {isTemplate ? t("Yes") : t("No")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: t("Status"),
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? t("Active") : t("Inactive")}
        </span>
      );
    },
  },
];
