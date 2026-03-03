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
        { name: t("Excellent"), value: 95 },
        { name: t("Good"), value: 80 },
        { name: t("Satisfactory"), value: 65 },
        { name: t("Poor"), value: 45 },
      ];
    }

    const categoryStats: Record<
      string,
      { totalScore: number; count: number }
    > = {};

    data.forEach((visit) => {
      const category =
        visit.category_text ||
        visit.category ||
        t("Unclassified");

      if (!categoryStats[category]) {
        categoryStats[category] = {
          totalScore: 0,
          count: 0,
        };
      }

      // Calculate score based on percentage or total/max score
      const score =
        visit.percentage !== undefined &&
        visit.percentage !== null
          ? visit.percentage
          : visit.total_score !== undefined &&
              visit.max_possible_score
            ? (visit.total_score /
                visit.max_possible_score) *
              100
            : 0;

      categoryStats[category].totalScore += score;
      categoryStats[category].count += 1;
    });

    return Object.entries(categoryStats).map(
      ([name, stats]) => ({
        name,
        value: Number(
          (stats.totalScore / stats.count).toFixed(2),
        ),
      }),
    );
  }, [data, t]);

  return (
    <Card className="w-full h-full min-h-100">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Average Score by Category")}
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
              label={({ name, value }) =>
                `${name} (${value}%)`
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [
                `${value}%`,
                t("Average Score"),
              ]}
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
