/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/visits";
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
import {
  useGetVisitsQuery,
  useStartVisitMutation,
  useEditVisitMutation,
  useDeleteVisitMutation,
} from "@/services/api/visits";
import { Visit } from "@/types/visit";
import { useRouter } from "@/i18n/navigation";

const VisitsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  const query = `page=${page}&page_size=${pageSize}`;

  const t = useTranslations();

  const [startVisit, { isLoading: isStartingVisit }] =
    useStartVisitMutation();
  const [editVisit] = useEditVisitMutation();
  const [deleteVisit] = useDeleteVisitMutation();
  const {
    data: paginatedVisits,
    isLoading,
    error,
  } = useGetVisitsQuery(query);

  useEffect(() => {
    if (isLoading || isStartingVisit) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch visits"));
    }
  }, [isLoading, error, start, stop, t, isStartingVisit]);

  // Handle start visit action
  const handleStartVisit = async (visit: Visit) => {
    try {
      const res = await startVisit(visit.id).unwrap();
      if (res.data.status === "in_progress") {
        toast.success(t("Visit started successfully"));
        router.push(
          `/dashboard/visits/${visit.id}/question-list`,
        );
      } else {
        throw new Error(t("Failed to start visit"));
      }
    } catch (error: any) {
      toast.error(
        error.message || t("Failed to start visit"),
      );
    }
  };
  const handleStartQuestionnaire = async (visit: Visit) => {
    router.push(
      `/dashboard/visits/${visit.id}/question-list`,
    );
  };
  const handleEdit = (visit: Visit) => {
    // Handle edit action
    console.log(visit);
  };

  const handleDelete = (visit: Visit) => {
    // Handle delete action
    console.log(visit);
  };

  const columns = getColumns(t, {
    onStartVisit: handleStartVisit,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onStartQuestionnaire: handleStartQuestionnaire,
  });

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
            {t("List of Visits")}
          </CardTitle>
        </CardHeader>
        {paginatedVisits?.data?.length === 0 && (
          <p className="text-center text-md text-muted-foreground p-4">
            {t("No visits found")}
          </p>
        )}
        {paginatedVisits?.data?.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedVisits?.data || []}
            pageCount={
              paginatedVisits?.meta?.last_page || 1
            }
            page={paginatedVisits?.meta?.current_page || 1}
            setPage={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default VisitsDataTable;
