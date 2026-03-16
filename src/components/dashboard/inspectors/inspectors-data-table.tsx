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
import {
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetInspectorsQuery,
  useDeleteUserMutation,
} from "@/services/api/inspectors";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import { User } from "@/types/user";

const InspectorsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const query = `page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ""}`;

  const t = useTranslations();
  const {
    data: paginatedInspectors,
    isLoading,
  } = useGetInspectorsQuery(query);

  const [activateUser, { isLoading: activateLoading }] =
    useActivateUserMutation();
  const [deactivateUser, { isLoading: deactivateLoading }] =
    useDeactivateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const activateCompanyHandler = async (userId: number) => {
    try {
      await activateUser(userId).unwrap();
      toast.success(t("User activated successfully"));
    } catch {
      toast.error(t("Failed to activate user"));
    }
  };
  const deactivateCompanyHandler = async (
    userId: number,
  ) => {
    try {
      await deactivateUser(userId).unwrap();
      toast.success(t("User deactivated successfully"));
    } catch {
      toast.error(t("Failed to deactivate company"));
    }
  };

  useEffect(() => {
    if (isLoading || activateLoading || deactivateLoading || isDeleting) {
      start();
    } else {
      stop();
    }
  }, [
    isLoading,
    start,
    stop,
    activateLoading,
    deactivateLoading,
    isDeleting,
  ]);

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      toast.success(t("User deleted successfully"));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch {
      toast.error(t("Failed to delete user"));
    }
  };

  const columns = getColumns(
    t,
    {
      onActivate: activateCompanyHandler,
      onDeactivate: deactivateCompanyHandler,
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("List of Users")}
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
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
};

export default InspectorsDataTable;
