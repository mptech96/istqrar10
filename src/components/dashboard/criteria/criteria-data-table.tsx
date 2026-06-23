"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/criteria";
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
  useGetCriteriaQuery,
  useDeleteCriteriaMutation,
} from "@/services/api/criteria";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { useAppSelector } from "@/lib/store";
import { User } from "@/types/user";
import { Input } from "@/components/ui/input";

const CriteriaDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { user } = useAppSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryParams = new URLSearchParams();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
  queryParams.set("page", page.toString());
  queryParams.set("page_size", pageSize.toString());
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort);
  queryParams.set("sort_order", sortOrder);
  if (filter) queryParams.set("filter", filter);

  const query = queryParams.toString();

  const t = useTranslations();

  const {
    data: paginatedCriteria,
    isLoading,
  } = useGetCriteriaQuery(query);

  const [deleteCriteria, { isLoading: isDeleting }] =
    useDeleteCriteriaMutation();

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
      await deleteCriteria(deleteId).unwrap();
      toast.success(t("Criteria deleted successfully"));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(t("Failed to delete criteria"));
    }
  };

  const columns = getColumns(
    t,
    {
      onEdit: () => {
        // Handle edit
      },
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
            {t("List of Criteria")}
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
        {paginatedCriteria?.data?.length === 0 && (
          <p className="text-center text-md text-muted-foreground p-4">
            {t("No criteria found")}
          </p>
        )}
        {paginatedCriteria?.data?.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedCriteria?.data || []}
            pageCount={
              paginatedCriteria?.meta?.last_page || 1
            }
            page={
              paginatedCriteria?.meta?.current_page || 1
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

export default CriteriaDataTable;
