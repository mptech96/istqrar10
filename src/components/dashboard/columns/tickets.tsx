"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { Ticket } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import TicketModel from "@/components/models/ticket-model";

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "critical":
      return "destructive";
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "closed":
      return "default";
    case "resolved":
      return "default";
    case "in_progress":
      return "secondary";
    case "open":
      return "outline";
    default:
      return "outline";
  }
};

export const getColumns = (
  t: _Translator,
  currentUser: User | null,
  handlers: {
    onEdit: (ticket: Ticket) => void;
    onAssign: (ticket: Ticket) => void;
    onSolve: (ticket: Ticket) => void;
    onClose: (ticket: Ticket) => void;
    onDelete: (ticket: Ticket) => void;
  },
): ColumnDef<Ticket>[] => [
  {
    accessorKey: "ticket_number",
    header: t("Ticket #"),
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {row.original.ticket_number}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: t("Subject"),
    cell: ({ row }) => (
      <div className="max-w-50">
        <span className="font-medium line-clamp-1">
          {row.original.subject}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "ticket_type",
    header: t("Type"),
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.ticket_type_text ||
          t(row.original.ticket_type)}
      </Badge>
    ),
  },
  {
    accessorKey: "priority",
    header: t("Priority"),
    cell: ({ row }) => (
      <Badge
        variant={getPriorityVariant(row.original.priority)}
      >
        {row.original.priority_text ||
          t(row.original.priority)}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: t("Status"),
    cell: ({ row }) => (
      <Badge
        variant={getStatusVariant(row.original.status)}
      >
        {row.original.status_text || t(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "assigned_to_user",
    header: t("Assigned To"),
    cell: ({ row }) =>
      row.original.assigned_to_user?.name || "-",
  },
  {
    accessorKey: "created_at",
    header: t("Created"),
    cell: ({ row }) => {
      const date = row.original.created_at;
      return date
        ? format(new Date(date), "dd-MM-yyyy")
        : "-";
    },
  },
  {
    id: "actions",
    header: t("Actions"),
    cell: ({ row }) => {
      const ticket = row.original;
      const isAdmin =
        currentUser?.role === "admin" ||
        currentUser?.role === "super_admin";
      const isCreator =
        currentUser?.id === ticket.created_by;

      return (
        <div className="flex gap-1 flex-wrap">
          {/* Creator can edit their own open tickets */}
          {isCreator && ticket.status === "open" && (
            <TicketModel ticket={ticket} />
          )}

          {/* Admin actions */}
          {isAdmin && (
            <>
              {!ticket.assigned_to &&
                ticket.status !== "closed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlers.onAssign(ticket)
                    }
                  >
                    {t("Assign")}
                  </Button>
                )}
              {ticket.status !== "resolved" &&
                ticket.status !== "closed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlers.onSolve(ticket)}
                  >
                    {t("Solve")}
                  </Button>
                )}
              {ticket.status !== "closed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlers.onClose(ticket)}
                >
                  {t("Close")}
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handlers.onDelete(ticket)}
              >
                {t("Delete")}
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];
