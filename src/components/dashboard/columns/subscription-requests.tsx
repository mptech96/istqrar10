import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator } from "next-intl";
import { SubscriptionRequest } from "@/types/plans";

export const getColumns = (t: _Translator): ColumnDef<SubscriptionRequest>[] => [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "package_name",
    header: t("Package Name"),
  },
  {
    accessorKey: "customer_name",
    header: t("Customer Name"),
  },
  {
    accessorKey: "company_name",
    header: t("Company Name"),
  },
  {
    accessorKey: "phone",
    header: t("Phone"),
  },
  {
    accessorKey: "email",
    header: t("Email"),
  },
  {
    accessorKey: "status_text",
    header: t("Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusText = row.original.status_text;
      
      let badgeColor = "bg-gray-100 text-gray-700";
      if (status === "new") badgeColor = "bg-blue-100 text-blue-700";
      if (status === "processing") badgeColor = "bg-yellow-100 text-yellow-700";
      if (status === "completed") badgeColor = "bg-green-100 text-green-700";
      if (status === "cancelled") badgeColor = "bg-red-100 text-red-700";

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
          {statusText}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: t("Date"),
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString();
    },
  },
];
