import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Branch } from "@/types/branch";
import BranchModel from "@/components/models/branch-model";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/user";

export const getColumns = (
  t: _Translator,
  handlers: {
    onActivate: (branchId: number) => void;
    onDeactivate: (branchId: number) => void;
    onDelete?: (branchId: number) => void;
  },
  user: User,
): ColumnDef<Branch>[] => [
  {
    accessorKey: "name",
    header: t("Name"),
    cell: ({ row }) => {
      const branch = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{branch.name}</span>
          <span className="text-xs text-muted-foreground">
            {branch.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: t("Phone"),
  },
  {
    accessorKey: "city",
    header: t("City"),
  },
  {
    accessorKey: "category",
    header: t("Category"),
  },
  {
    accessorKey: "compliance_score",
    header: t("Compliance Score"),
    cell: ({ row }) => {
      const score = row.getValue("compliance_score");
      return score !== undefined ? `${score}%` : "-";
    },
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const branch = row.original;
      const status = !!branch.status;
      return (
        <div className="flex items-center gap-4">
          {(user?.role === "super_admin" ||
            user?.role === "admin") && (
            <Switch
              checked={status}
              onCheckedChange={(checked) => {
                if (checked) {
                  handlers.onActivate(branch.id);
                } else {
                  handlers.onDeactivate(branch.id);
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
      const branch = row.original;
      return (
        <div className="flex items-center gap-2">
          <BranchModel branch={branch} />
          {user?.role === "super_admin" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlers.onDelete?.(branch.id)}
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
