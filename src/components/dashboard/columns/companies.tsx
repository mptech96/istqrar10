"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";

import type { Company } from "@/types/company";

import { format } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export const getColumns = (
  t: _Translator,
): ColumnDef<Company>[] => [
  {
    accessorKey: "name",
    header: t("Name"),
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={
                company.logo ||
                "https://github.com/shadcn.png"
              }
              alt={company.name}
              className="object-cover"
            />
            <AvatarFallback>
              {company.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-medium">
              {company.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {company.email}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "subscription_start",
    header: t("Subscription Start"),
    cell: ({ row }) => {
      const date = row.getValue(
        "subscription_start",
      ) as string;
      return date
        ? format(new Date(date), "dd-MM-yyyy")
        : "-";
    },
  },
  {
    accessorKey: "subscription_end",
    header: t("Subscription End"),
    cell: ({ row }) => {
      const date = row.getValue(
        "subscription_end",
      ) as string;
      return date
        ? format(new Date(date), "dd-MM-yyyy")
        : "-";
    },
  },
  {
    accessorKey: "subscription_status",
    header: t("Subscription Status"),
    cell: ({ row }) => {
      const status = row.getValue(
        "subscription_status",
      ) as string;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "inactive"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status === "active"
            ? t("active")
            : status === "inactive"
              ? t("inactive")
              : t("expired")}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: t("Category"),
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status ? t("Active") : t("Inactive")}
        </span>
      );
    },
  },
];
