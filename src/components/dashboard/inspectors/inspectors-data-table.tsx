"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/inspectors";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { useGetInspectorsQuery } from "@/services/api/inspectors";

const InspectorsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const query = `page=${page}&page_size=${pageSize}`;

  const t = useTranslations();
  const {
    data: paginatedInspectors,
    isLoading,
    error,
  } = useGetInspectorsQuery(query);

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch inspectors"));
    }
  }, [isLoading, error, start, stop, t]);

  const columns = getColumns(t);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 5 * 0.1 }}
      className="mt-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("List of Inspectors")}
          </CardTitle>
        </CardHeader>
        {paginatedInspectors?.data.length === 0 && (
          <p className="text-center text-md text-muted-foreground p-4">
            {t("No inspectors found")}
          </p>
        )}
        {paginatedInspectors?.data.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedInspectors?.data || []}
            pageCount={
              paginatedInspectors?.meta.last_page || 1
            }
            page={
              paginatedInspectors?.meta.current_page || 1
            }
            setPage={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default InspectorsDataTable;
