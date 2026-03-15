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
import { User } from "@/types/user";
import { Switch } from "@/components/ui/switch";

export const getColumns = (
  t: _Translator,
  handlers: {
    onActivate: (branchId: number) => void;
    onDeactivate: (branchId: number) => void;
  },
  user: User,
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
      const inspector = row.original;
      const status = !!inspector.status;
      return (
        <div className="flex items-center gap-4">
          {(user?.role === "super_admin" ||
            user?.role === "admin") && (
            <Switch
              checked={status}
              onCheckedChange={(checked) => {
                if (checked) {
                  handlers.onActivate(inspector.id);
                } else {
                  handlers.onDeactivate(inspector.id);
                }
              }}
            />
          )}
          <span
            className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
              status
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status ? t("Active") : t("Inactive")}
          </span>
        </div>
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
