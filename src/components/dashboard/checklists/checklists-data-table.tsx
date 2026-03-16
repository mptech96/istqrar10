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
import {
  useGetChecklistsQuery,
  useDeleteChecklistMutation,
} from "@/services/api/checklists";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { useAppSelector } from "@/lib/store";
import { User } from "@/types/user";

const ChecklistsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { user } = useAppSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const query = `page=${page}&page_size=${pageSize}`;

  const t = useTranslations();
  const {
    data: paginatedChecklists,
    isLoading,
  } = useGetChecklistsQuery(query);

  const [deleteChecklist, { isLoading: isDeleting }] =
    useDeleteChecklistMutation();

  useEffect(() => {
    if (isLoading || isDeleting) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop, isDeleting]);

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteChecklist(deleteId).unwrap();
      toast.success(t("Checklist deleted successfully"));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(t("Failed to delete checklist"));
    }
  };

  const columns = getColumns(
    t,
    {
      onDelete: handleDelete,
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
          <CardTitle className="text-lg">
            {t("List of Checklists")}
          </CardTitle>
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
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default ChecklistsDataTable;
