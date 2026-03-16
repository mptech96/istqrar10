"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Checklist } from "@/types/checklist";
import { Badge } from "@/components/ui/badge";
import ChecklistModel from "@/components/models/checklist-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { User } from "@/types/user";

export const getColumns = (
  t: _Translator,
  handlers: {
    onDelete?: (checklistId: number) => void;
  },
  user: User,
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
  {
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const checklist = row.original;
      return (
        <div className="flex items-center gap-2">
          <ChecklistModel checklist={checklist} />
          {user?.role === "super_admin" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlers.onDelete?.(checklist.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
