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
} from "@/services/api/inspectors";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import { User } from "@/types/user";

const InspectorsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const user = useAppSelector((state) => state.auth.user);
  const query = `page=${page}&page_size=${pageSize}${search ? `&search=${search}` : ""}`;

  const t = useTranslations();
  const {
    data: paginatedInspectors,
    isLoading,
    error,
  } = useGetInspectorsQuery(query);

  const [activateUser, { isLoading: activateLoading }] =
    useActivateUserMutation();
  const [deactivateUser, { isLoading: deactivateLoading }] =
    useDeactivateUserMutation();

  const activateCompanyHandler = async (userId: number) => {
    try {
      const res = await activateUser(userId);
      toast.success(t("User activated successfully"));
    } catch (error) {
      toast.error(t("Failed to activate user"));
    }
  };
  const deactivateCompanyHandler = async (
    userId: number,
  ) => {
    try {
      const res = await deactivateUser(userId);
      toast.success(t("User deactivated successfully"));
    } catch (error) {
      toast.error(t("Failed to deactivate company"));
    }
  };

  useEffect(() => {
    if (isLoading || activateLoading || deactivateLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch inspectors"));
    }
  }, [
    isLoading,
    error,
    start,
    stop,
    t,
    activateLoading,
    deactivateLoading,
  ]);

  const columns = getColumns(
    t,
    {
      onActivate: activateCompanyHandler,
      onDeactivate: deactivateCompanyHandler,
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
    </motion.div>
  );
};

export default InspectorsDataTable;
