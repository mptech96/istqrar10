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
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetVisitsQuery } from "@/services/api/visits";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Visit } from "@/types/visit";

const mockBarData = [
  {
    name: "Branch A",
    Completed: 40,
    Pending: 24,
    Cancelled: 10,
  },
  {
    name: "Branch B",
    Completed: 30,
    Pending: 13,
    Cancelled: 5,
  },
  {
    name: "Branch C",
    Completed: 20,
    Pending: 98,
    Cancelled: 22,
  },
  {
    name: "Branch D",
    Completed: 27,
    Pending: 39,
    Cancelled: 20,
  },
  {
    name: "Branch E",
    Completed: 18,
    Pending: 48,
    Cancelled: 11,
  },
];

const BranchStackedBar = () => {
  const t = useTranslations();
  const { data: visitsResponse, isLoading } =
    useGetVisitsQuery("page_size=100");

  const chartData = useMemo(() => {
    if (
      !visitsResponse?.data ||
      visitsResponse.data.length === 0
    ) {
      return mockBarData.map((item) => ({
        ...item,
        name: t(item.name),
        Completed: item.Completed,
        Pending: item.Pending,
        Cancelled: item.Cancelled,
      }));
    }

    const branches: Record<
      string,
      Record<string, number>
    > = {};
    visitsResponse.data.forEach((visit: Visit) => {
      const branchName =
        visit.branch?.name || t("Unknown Branch");
      const status =
        visit.status_text ||
        visit.status ||
        t("Unknown Status");

      if (!branches[branchName]) {
        branches[branchName] = {};
      }
      branches[branchName][status] =
        (branches[branchName][status] || 0) + 1;
    });

    return Object.entries(branches).map(
      ([name, stats]) => ({
        name,
        ...stats,
      }),
    );
  }, [visitsResponse, t]);

  // Extract all unique statuses for bars
  const statuses = useMemo(() => {
    const set = new Set<string>();
    chartData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name") set.add(key);
      });
    });
    return Array.from(set);
  }, [chartData]);

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  if (isLoading) {
    return (
      <Card className="flex-1 min-w-75">
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
    <Card className="flex-1 min-w-75">
      <CardHeader>
        <CardTitle>{t("Visits per Branch")}</CardTitle>
        <CardDescription>
          {t(
            "Status-wise distribution of visits across different branches",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend iconType="circle" />
              {statuses.map((status, index) => (
                <Bar
                  key={status}
                  dataKey={status}
                  stackId="a"
                  fill={colors[index % colors.length]}
                  radius={[0, 0, 0, 0]}
                  barSize={40}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchStackedBar;
