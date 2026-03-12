"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  isSameDay,
  isSameMonth,
  isSameYear,
  parseISO,
} from "date-fns";
import { useGetVisitsQuery } from "@/services/api/visits";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Visit } from "@/types/visit";

const VisitAreaChart = () => {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<
    "day" | "month" | "year"
  >("day");

  // Calculate date range based on view mode
  const { fromDate, toDate } = useMemo(() => {
    const now = new Date();
    if (viewMode === "day") {
      return {
        fromDate: format(startOfMonth(now), "yyyy-MM-dd"),
        toDate: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    } else if (viewMode === "month") {
      return {
        fromDate: format(startOfYear(now), "yyyy-MM-dd"),
        toDate: format(endOfYear(now), "yyyy-MM-dd"),
      };
    } else {
      // Year view: last 5 years
      return {
        fromDate: format(
          subDays(startOfYear(now), 365 * 4),
          "yyyy-MM-dd",
        ),
        toDate: format(endOfYear(now), "yyyy-MM-dd"),
      };
    }
  }, [viewMode]);

  const query = `from_date=${fromDate}&to_date=${toDate}&page_size=1000`; // Fetch all visits in range
  const { data: visitsResponse, isLoading } =
    useGetVisitsQuery(query);

  const chartData = useMemo(() => {
    if (!visitsResponse?.data) return [];

    const visits = visitsResponse.data;
    const start = parseISO(fromDate);
    const end = parseISO(toDate);

    if (viewMode === "day") {
      const days = eachDayOfInterval({ start, end });
      return days.map((day) => {
        const count = visits.filter((v: Visit) => {
          const dateStr = v.scheduled_date || v.visit_date;
          return dateStr
            ? isSameDay(parseISO(dateStr), day)
            : false;
        }).length;
        return {
          name: format(day, "MMM d"),
          visits: count,
        };
      });
    } else if (viewMode === "month") {
      const months = eachMonthOfInterval({ start, end });
      return months.map((month) => {
        const count = visits.filter((v: Visit) => {
          const dateStr = v.scheduled_date || v.visit_date;
          return dateStr
            ? isSameMonth(parseISO(dateStr), month)
            : false;
        }).length;
        return {
          name: format(month, "MMM yyyy"),
          visits: count,
        };
      });
    } else {
      const years = eachYearOfInterval({ start, end });
      return years.map((year) => {
        const count = visits.filter((v: Visit) => {
          const dateStr = v.scheduled_date || v.visit_date;
          return dateStr
            ? isSameYear(parseISO(dateStr), year)
            : false;
        }).length;
        return {
          name: format(year, "yyyy"),
          visits: count,
        };
      });
    }
  }, [visitsResponse, viewMode, fromDate, toDate]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl font-bold">
            {t("Visits Overview")}
          </CardTitle>
          <CardDescription>
            {t("Total visits tracked over time")}
          </CardDescription>
        </div>
        <Select
          value={viewMode}
          onValueChange={(val: "day" | "month" | "year") =>
            setViewMode(val)
          }
        >
          <SelectTrigger className="w-30">
            <SelectValue placeholder={t("Select View")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">{t("Day")}</SelectItem>
            <SelectItem value="month">
              {t("Month")}
            </SelectItem>
            <SelectItem value="year">
              {t("Year")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-87.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorVisits"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#10b981"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0.1}
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
                axisLine={true}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  color: "#000",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVisits)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitAreaChart;
