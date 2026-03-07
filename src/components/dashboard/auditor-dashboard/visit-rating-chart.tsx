"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetVisitsQuery } from "@/services/api/visits";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Visit } from "@/types/visit";
import { useAppSelector } from "@/lib/store";
import { format, parseISO } from "date-fns";

const VisitRatingChart = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);

  // Fetch visits for the last 30 days or a reasonable range
  // For the auditor dashboard, we'll fetch a larger set and filter if needed,
  // though typically the API should handle auditor filtering if auditor_id is passed.
  const { data: visitsResponse, isLoading } =
    useGetVisitsQuery("page_size=100");

  const chartData = useMemo(() => {
    if (!visitsResponse?.data) return [];

    // Filter visits for the current auditor if applicable
    const auditorVisits = visitsResponse.data.filter(
      (v: Visit) =>
        v.auditor_id === user?.id ||
        (v.auditor && v.auditor.id === user?.id),
    );

    // Sort by date to show a chronological progression
    return auditorVisits
      .map((v: Visit) => ({
        name: v.scheduled_date
          ? format(parseISO(v.scheduled_date), "MMM d")
          : t("Visit"),
        score: v.total_score || v.percentage || 0,
        fullDate: v.scheduled_date || v.visit_date,
      }))
      .sort(
        (
          a: { fullDate: string | undefined },
          b: { fullDate: string | undefined },
        ) => {
          if (!a.fullDate || !b.fullDate) return 0;
          return (
            new Date(a.fullDate).getTime() -
            new Date(b.fullDate).getTime()
          );
        },
      );
  }, [visitsResponse, user, t]);

  // Mock data if no visits exist
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { name: "Week 1", score: 65 },
          { name: "Week 2", score: 45 },
          { name: "Week 3", score: 85 },
          { name: "Week 4", score: 75 },
          { name: "Week 5", score: 95 },
        ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Visit Rating Chart")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorScore"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#10b981"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="50%"
                    stopColor="#f59e0b"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor="#ef4444"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [
                  `${value ?? 0}%`,
                  t("Score"),
                ]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitRatingChart;
