"use client";
import React, { useEffect, useState } from "react";
import { Checklist } from "@/types/checklist";
import ChecklistCard from "./checklist-card/checklist-card";
import { ChecklistConditions } from "./checklist-conditions";
import { useLoader } from "@/hooks/use-loader";
import { useTranslations } from "next-intl";
import { useGetChecklistsQuery } from "@/services/api/checklists";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const ChecklistOverview = () => {
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
  const [selectedChecklist, setSelectedChecklist] =
    useState<Checklist | null>(null);
  return (
    <section className="space-y-6 flex flex-col w-full">
      <div className="flex w-full md:w-80">
        <Input
          placeholder={t("Search by checklist name")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset page on new search
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {paginatedChecklists?.data?.map(
          (item: Checklist) => (
            <div
              key={item.id}
              onClick={() => setSelectedChecklist(item)}
              className={`cursor-pointer transition-all rounded-xl ${
                selectedChecklist?.id === item.id
                  ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-background"
                  : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 dark:hover:ring-offset-background"
              }`}
            >
              <ChecklistCard checklist={item} />
            </div>
          ),
        )}
      </div>

      {selectedChecklist && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            {selectedChecklist.name}
          </h3>
          <ChecklistConditions
            checklist={selectedChecklist}
          />
        </div>
      )}
    </section>
  );
};

export default ChecklistOverview;
