"use client";
import React, { useMemo } from "react";
import { useGetBranchVisitsQuery } from "@/services/api/visits";
import { useAppSelector } from "@/lib/store";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RatingCategory {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const RatingPie = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);
  const branchId = user?.branch_id;

  const { data: visits, isLoading } =
    useGetBranchVisitsQuery(String(branchId), {
      skip: !branchId,
    });

  const ratingData = useMemo(() => {
    // If loading or no data, return mock data
    if (
      isLoading ||
      !visits?.data ||
      visits?.data.length === 0
    ) {
      return [
        {
          label: t("a"),
          count: 12,
          percentage: 40,
          color: "#10b981",
        },
        {
          label: t("b"),
          count: 9,
          percentage: 30,
          color: "#3b82f6",
        },
        {
          label: t("c"),
          count: 6,
          percentage: 20,
          color: "#eab308",
        },
        {
          label: t("d"),
          count: 3,
          percentage: 10,
          color: "#ef4444",
        },
      ];
    }

    // Process real data
    const categories: Record<
      string,
      { count: number; color: string }
    > = {
      Excellent: { count: 0, color: "#10b981" },
      Good: { count: 0, color: "#3b82f6" },
      Satisfactory: { count: 0, color: "#eab308" },
      Poor: { count: 0, color: "#ef4444" },
    };

    visits.data?.forEach((visit: any) => {
      const p = visit.percentage || 0;
      if (p >= 90) categories.Excellent.count++;
      else if (p >= 75) categories.Good.count++;
      else if (p >= 50) categories.Satisfactory.count++;
      else categories.Poor.count++;
    });

    const total = visits.length;
    return Object.entries(categories)
      .map(([label, data]) => ({
        label: t(label),
        count: data.count,
        percentage:
          total > 0 ? (data.count / total) * 100 : 0,
        color: data.color,
      }))
      .filter((cat) => cat.count > 0 || !visits); // Keep all if no real visits to show mock behavior or empty state
  }, [visits, isLoading, t]);

  // Generate conic gradient string
  const gradientString = useMemo(() => {
    let currentPercentage = 0;
    const slices = ratingData.map((data) => {
      const start = currentPercentage;
      currentPercentage += data.percentage;
      return `${data.color} ${start}% ${currentPercentage}%`;
    });

    // Fallback if empty
    if (slices.length === 0) return "#e2e8f0 0% 100%";

    return slices.join(", ");
  }, [ratingData]);

  if (isLoading) {
    return (
      <Skeleton className="h-[300px] w-full rounded-xl" />
    );
  }

  return (
    <Card className="h-full bg-linear-to-br from-coralRed/5 to-cyan-500/5 transition-all hover:shadow-md border-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold tracking-tight">
          {t("Branch Rating Distribution")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-around gap-10 py-4">
          {/* Pie Chart Container */}
          <div className="relative flex-shrink-0 group">
            <div
              className="w-48 h-48 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-105"
              style={{
                background: `conic-gradient(${gradientString})`,
              }}
            >
              {/* Inner hole for Donut effect */}
              <div className="w-32 h-32 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {visits?.length || 30}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                    {t("Total Visits")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 w-full md:w-64">
            {ratingData.map((data, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: data.color }}
                  />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {data.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {data.count}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 min-w-[40px] text-center">
                    {Math.round(data.percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingPie;
