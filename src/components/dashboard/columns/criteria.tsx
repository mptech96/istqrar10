"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Criteria } from "@/types/criteria";
import { Badge } from "@/components/ui/badge";

export const getColumns = (
  t: _Translator,
): ColumnDef<Criteria>[] => [
  {
    accessorKey: "name",
    header: t("Name"),
    cell: ({ row }) => {
      const criteria = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {criteria.name}
          </span>
          {criteria.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {criteria.description}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: t("Category"),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "weight",
    header: t("Weight"),
    cell: ({ row }) => `${row.getValue("weight")}%`,
  },
  {
    accessorKey: "ranges",
    header: t("Ranges"),
    cell: ({ row }) => {
      const ranges = row.original.ranges || [];
      return (
        <div className="flex gap-1">
          {ranges.slice(0, 3).map((range, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: range.color }}
              title={range.name}
            />
          ))}
          {ranges.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{ranges.length - 3}
            </span>
          )}
        </div>
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
