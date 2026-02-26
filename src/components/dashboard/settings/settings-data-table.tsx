"use client";

import { ServerDataTable } from "@/components/dashboard/table/server-data-table";
import { getColumns } from "../columns/settings";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useLoader } from "@/hooks/use-loader";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { motion } from "motion/react";
import {
  useGetSettingQuery,
  useGetAllSettingGroupQuery,
} from "@/services/api/setting";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsDataTable = () => {
  const { start, stop } = useLoader();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState<string>("all");
  const pageSize = 10;

  const t = useTranslations();

  const {
    data: paginatedSettings,
    isLoading,
    error,
  } = useGetSettingQuery({
    page,
    per_page: pageSize,
    group: group === "all" ? undefined : group,
    search: search || undefined,
  });

  const { data: groupsData } = useGetAllSettingGroupQuery(
    {},
  );

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }

    if (error) {
      toast.error(t("Failed to fetch settings"));
    }
  }, [isLoading, error, start, stop, t]);

  const columns = getColumns(t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-4"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("List of Settings")}
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full md:w-64">
                <Input
                  placeholder={t("Search settings")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={group}
                  onValueChange={(val) => {
                    setGroup(val);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("All Groups")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("All Groups")}
                    </SelectItem>
                    {groupsData?.data?.map((g: string) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedSettings?.data?.length === 0 ? (
            <p className="text-center text-md text-muted-foreground p-4">
              {t("No settings found")}
            </p>
          ) : (
            <ServerDataTable
              columns={columns}
              data={paginatedSettings?.data || []}
              pageCount={
                paginatedSettings?.meta?.last_page || 1
              }
              page={
                paginatedSettings?.meta?.current_page || 1
              }
              setPage={setPage}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsDataTable;
