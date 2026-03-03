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
import { Visit } from "@/types/visit";

interface UpcomingVisitsTableProps {
  visits: Visit[];
}

const UpcomingVisitsTable = ({
  visits,
}: UpcomingVisitsTableProps) => {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const columns: ColumnDef<Visit>[] = [
    {
      accessorKey: "branch.name",
      header: t("Branch"),
      cell: ({ row }) =>
        row.original.branch?.name || t("Unknown"),
    },
    {
      accessorKey: "scheduled_date",
      header: t("Scheduled Date"),
    },
    {
      accessorKey: "scheduled_time",
      header: t("Scheduled Time"),
    },
    {
      accessorKey: "checklist.name",
      header: t("Checklist"),
      cell: ({ row }) =>
        row.original.checklist?.name || t("Unknown"),
    },
    {
      accessorKey: "status",
      header: t("Status"),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.status_text || row.original.status}
        </Badge>
      ),
    },
  ];

  // Client-side pagination
  const paginatedData = visits.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const pageCount = Math.ceil(visits.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Upcoming Visits")}
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

export default UpcomingVisitsTable;
