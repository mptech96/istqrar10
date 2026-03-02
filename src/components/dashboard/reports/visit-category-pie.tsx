"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Visit } from "@/types/visit";

interface VisitCategoryPieChartProps {
  data: Visit[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de02",
  "#d0ed57",
];

const VisitCategoryPieChart = ({
  data,
}: VisitCategoryPieChartProps) => {
  const t = useTranslations();

  const chartData = useMemo(() => {
    // Mock data fallback if no real data is provided
    if (!data || data.length === 0) {
      return [
        { name: t("Excellent"), value: 40 },
        { name: t("Good"), value: 30 },
        { name: t("Satisfactory"), value: 20 },
        { name: t("Poor"), value: 10 },
      ];
    }

    const counts: Record<string, number> = {};
    data.forEach((visit) => {
      const category =
        visit.category ||
        visit.category_text ||
        t("Unclassified");
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data, t]);

  return (
    <Card className="w-full h-full min-h-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Visits by Category")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VisitCategoryPieChart;
