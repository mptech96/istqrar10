"use client";
import {
  useActivateCompanyMutation,
  useDeactivateCompanyMutation,
  useGetCompaniesQuery,
} from "@/services/api/companies";
import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/companies";
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
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/lib/store";
import { User } from "@/types/user";

const CompaniesDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const [
    activateCompany,
    { isLoading: activateCompanyLoading },
  ] = useActivateCompanyMutation();
  const [
    deactivateCompany,
    { isLoading: deactivateCompanyLoading },
  ] = useDeactivateCompanyMutation();

  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("page_size", pageSize.toString());
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort);
  queryParams.set("sort_order", sortOrder);
  if (filter) queryParams.set("filter", filter);

  const query = queryParams.toString();

  const t = useTranslations();
  const {
    data: paginatedCompanies,
    isLoading,
    error,
  } = useGetCompaniesQuery(query);

  useEffect(() => {
    if (
      isLoading ||
      activateCompanyLoading ||
      deactivateCompanyLoading
    ) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch companies"));
    }
  }, [isLoading, error, start, stop, t]);
  const activateCompanyHandler = async (
    companyId: number,
  ) => {
    try {
      const res = await activateCompany(companyId);
      toast.success(t("Company activated successfully"));
    } catch (error) {
      toast.error(t("Failed to activate company"));
    }
  };
  const deactivateCompanyHandler = async (
    companyId: number,
  ) => {
    try {
      const res = await deactivateCompany(companyId);
      toast.success(t("Company deactivated successfully"));
    } catch (error) {
      toast.error(t("Failed to deactivate company"));
    }
  };
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
      transition={{ delay: 5 * 0.1 }} // Optional: stagger animation
      className="mt-6"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("List of Companies")}
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
        {paginatedCompanies?.data.length === 0 && (
          <p className="text-center text-md text-muted-foreground">
            {t("No companies found")}
          </p>
        )}
        {paginatedCompanies?.data.length > 0 && (
          <ServerDataTable
            columns={columns}
            data={paginatedCompanies?.data || []}
            pageCount={
              paginatedCompanies?.meta.last_page || 1
            }
            page={
              paginatedCompanies?.meta.current_page || 1
            }
            setPage={setPage}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default CompaniesDataTable;
