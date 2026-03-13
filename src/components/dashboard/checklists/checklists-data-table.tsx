"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/checklists";
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
import { useGetChecklistsQuery } from "@/services/api/checklists";
import { Input } from "@/components/ui/input";
const ChecklistsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const query = `page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ""}`;

  const t = useTranslations();
  const {
    data: paginatedChecklists,
    isLoading,
    error,
  } = useGetChecklistsQuery(query);

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch checklists"));
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("List of Checklists")}
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
        {paginatedChecklists?.data?.length === 0 && (
          <p className="text-center text-md text-muted-foreground p-4">
            {t("No checklists found")}
          </p>
        )}
        {paginatedChecklists?.data?.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedChecklists?.data || []}
            pageCount={
              paginatedChecklists?.meta?.last_page || 1
            }
            page={
              paginatedChecklists?.meta?.current_page || 1
            }
            setPage={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default ChecklistsDataTable;
