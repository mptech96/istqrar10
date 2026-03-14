"use client";
import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Visit } from "@/types/visit";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bot, Play, SquarePen, Trash } from "lucide-react";
import VisitModel from "@/components/models/visit-model";
import LocatingBranchAuditor from "@/components/models/locating-branch-auditor";
import { User } from "@/types/user";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "default";
    case "scheduled":
      return "secondary";
    case "in_progress":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export const getColumns = (
  t: _Translator,
  handlers: {
    onStartVisit: (visit: Visit) => void;
    onEdit: (visit: Visit) => void;
    onDelete: (visit: Visit) => void;
    onStartQuestionnaire?: (visit: Visit) => void;
    onShowReport: (visit: Visit) => void;
    onShowAIAnalysis: (visit: Visit) => void;
  },
  user: User,
): ColumnDef<Visit>[] => [
  {
    accessorKey: "branch",
    header: t("Branch"),
    cell: ({ row }) => {
      const branch_id = row.original.branch_id;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{branch_id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "auditor",
    header: t("Auditor"),
    cell: ({ row }) => {
      const auditor_id = row.original.auditor_id;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{auditor_id}</span>
          {/*  <span className="text-xs text-muted-foreground">
            {auditor?.email || ""}
          </span> */}
        </div>
      );
    },
  },
  {
    accessorKey: "scheduled_date",
    header: t("Scheduled Date"),
    cell: ({ row }) => {
      const date = row.original.scheduled_date;
      const time = row.original.scheduled_time;
      return (
        <div className="flex flex-col">
          <span>
            {date
              ? format(new Date(date), "dd-MM-yyyy")
              : "-"}
          </span>
          <span className="text-xs text-muted-foreground">
            {time || ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusText = row.original.status_text;
      return (
        <Badge variant={getStatusVariant(status)}>
          {statusText || t(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_score",
    header: t("Score"),
    cell: ({ row }) => {
      const score = row.original.total_score;
      const percentage = row.original.percentage;
      const category = row.original.category;
      if (!score && score !== 0) return "-";
      return (
        <div className="flex flex-col">
          <span className="font-medium">{percentage}%</span>
          <span className="text-xs text-muted-foreground">
            {t("Category")}: {category}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "estimated_duration",
    header: t("Duration"),
    cell: ({ row }) => {
      const duration = row.original.estimated_duration;
      return duration ? `${duration} ${t("min")}` : "-";
    },
  },
  {
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const visit = row.original;

      return (
        <div className="flex gap-2">
          {((user && user.role === "super_admin") ||
            user?.role === "admin" ||
            user?.role === "auditor") && (
            <LocatingBranchAuditor
              visit={visit}
              userRole={user.role}
            />
          )}
          {visit.status !== "in_progress" &&
            user &&
            user?.role === "auditor" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlers.onStartVisit(visit)}
                disabled={visit.status === "in_progress"}
                className={
                  visit.status === "in_progress"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              >
                {t("Start Visit")}
                <Play />
              </Button>
            )}
          {visit.status === "in_progress" &&
            user &&
            user?.role === "auditor" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlers.onStartQuestionnaire?.(visit)
                }
              >
                {t("Show Questionnaire")}
                <Play />
              </Button>
            )}
          {(user && user.role === "admin") ||
            (user?.role === "super_admin" && (
              <>
                <VisitModel visit={visit} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handlers.onDelete(visit)}
                >
                  <Trash />
                </Button>
              </>
            ))}
          {user &&
            user?.role === "branch_manager" &&
            visit.status === "completed" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlers.onShowReport(visit)
                  }
                >
                  {t("Show Report")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handlers.onShowAIAnalysis(visit)
                  }
                >
                  <Bot />
                  {t("AI Analysis")}
                </Button>
              </>
            )}
        </div>
      );
    },
  },
];
