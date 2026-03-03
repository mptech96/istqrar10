"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "@/types/ticket";

interface BranchTicketsTableProps {
  tickets: Ticket[];
}

const BranchTicketsTable = ({
  tickets,
}: BranchTicketsTableProps) => {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "ticket_number",
      header: t("Ticket Number"),
      cell: ({ row }) => (
        <span className="font-medium ">
          {row.original.ticket_number}
        </span>
      ),
    },
    {
      accessorKey: "subject",
      header: t("Subject"),
    },
    {
      accessorKey: "ticket_type_text",
      header: t("Type"),
      cell: ({ row }) =>
        row.original.ticket_type_text ||
        row.original.ticket_type,
    },
    {
      accessorKey: "priority",
      header: t("Priority"),
      cell: ({ row }) => {
        const priority = row.original.priority;
        const text = row.original.priority_text || priority;
        let className = "bg-green-100 text-green-700";

        if (
          priority === "high" ||
          priority === "critical"
        ) {
          className = "bg-red-100 text-red-700";
        } else if (priority === "medium") {
          className = "bg-orange-100 text-orange-700";
        }

        return (
          <Badge variant="secondary" className={className}>
            {text}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => (
        <Badge variant="outline" className="">
          {row.original.status_text || row.original.status}
        </Badge>
      ),
    },
  ];

  // Client-side pagination for the tickets array
  const paginatedData = tickets.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const pageCount = Math.ceil(tickets.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold ">
          {t("Open Tickets")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServerDataTable
          columns={columns}
          data={paginatedData}
          pageCount={pageCount}
          page={page}
          setPage={setPage}
        />
      </CardContent>
    </Card>
  );
};

export default BranchTicketsTable;
