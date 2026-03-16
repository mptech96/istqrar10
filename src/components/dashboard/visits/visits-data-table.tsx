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
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { User } from "@/types/user";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";

const VisitsDataTable = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user,
  );
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const query = `page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ""}`;

  const t = useTranslations();

  const [startVisit, { isLoading: isStartingVisit }] =
    useStartVisitMutation();
  const [editVisit] = useEditVisitMutation();
  const [deleteVisit, { isLoading: isDeleting }] = useDeleteVisitMutation();
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
    if (!navigator.geolocation) {
      toast.error(
        t("Geolocation is not supported by your browser"),
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await startVisit({
            id: visit.id,
            data: {
              start_latitude: position.coords.latitude,
              start_longitude: position.coords.longitude,
            },
          }).unwrap();
          if (res.data.status === "in_progress") {
            toast.success(t("Visit started successfully"));
            router.push(
              `/dashboard/visits/${visit.id}/question-list`,
            );
          } else {
            throw new Error(res.message);
          }
        } catch (error: any) {
          toast.error(
            error.data?.message ||
              t("Failed to start visit"),
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error(
          t(
            "Please enable location access to start the visit",
          ),
        );
      },
      { enableHighAccuracy: true },
    );
  };
  const handleStartQuestionnaire = async (visit: Visit) => {
    router.push(
      `/dashboard/visits/${visit.id}/question-list`,
    );
  };
  const handleEdit = (visit: Visit) => {
    // Handle edit action
  };

  const handleDelete = (visit: Visit) => {
    setDeleteId(visit.id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteVisit(String(deleteId)).unwrap();
      toast.success(t("Visit deleted successfully"));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch {
      toast.error(t("Failed to delete visit"));
    }
  };
  const handleShowReport = (visit: Visit) => {
    // Handle show report action
    router.push(
      `/dashboard/visits/${visit.id}/visit-report`,
    );
  };
  const handleShowAIAnalysis = (visit: Visit) => {
    // Handle show report action
    router.push(
      `/dashboard/visits/${visit.id}/ai-analysis`,
    );
  };
  const columns = getColumns(
    t,
    {
      onStartVisit: handleStartVisit,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onStartQuestionnaire: handleStartQuestionnaire,
      onShowReport: handleShowReport,
      onShowAIAnalysis: handleShowAIAnalysis,
    },
    user as User,
  );

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
              {t("List of Visits")}
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
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default VisitsDataTable;
