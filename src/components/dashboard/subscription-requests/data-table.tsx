"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/subscription-requests";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { useGetServiceRequestsQuery } from "@/services/api/plans";
import { Input } from "@/components/ui/input";

export default function SubscriptionRequestsDataTable() {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort] = useState("created_at");
  const [sortOrder] = useState("desc");

  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("page_size", pageSize.toString());
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort);
  queryParams.set("sort_order", sortOrder);

  const query = queryParams.toString();
  const t = useTranslations();

  const {
    data: paginatedRequests,
    isLoading,
    error,
  } = useGetServiceRequestsQuery(query);

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch subscription requests"));
    }
  }, [isLoading, error, start, stop, t]);

  const columns = getColumns(t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("Subscription Requests")}
            </CardTitle>
            <div className="flex w-full md:w-64">
              <Input
                placeholder={t("Search")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        {!isLoading && paginatedRequests?.data?.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            {t("No subscription requests found")}
          </div>
        )}
        {paginatedRequests?.data?.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedRequests.data}
            pageCount={paginatedRequests.meta.last_page || 1}
            page={paginatedRequests.meta.current_page || 1}
            setPage={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
}
