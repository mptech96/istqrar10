"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Inspectors } from "@/types/inspectors";
import InspectorModel from "@/components/models/inspector-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export const getColumns = (
  t: _Translator,
): ColumnDef<Inspectors>[] => [
  {
    accessorKey: "name",
    header: t("Name"),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={
                user.personal_photo ||
                "https://github.com/shadcn.png"
              }
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: t("Phone"),
  },
  {
    accessorKey: "role",
    header: t("Role"),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return t(role) || role;
    },
  },
  {
    accessorKey: "department",
    header: t("Department"),
    cell: ({ row }) => row.getValue("department") || "-",
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 1
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === 1 ? t("Active") : t("Inactive")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const inspector = row.original;
      return (
        <div className="flex items-center gap-2">
          <InspectorModel inspector={inspector} />
          <Button variant="outline" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
