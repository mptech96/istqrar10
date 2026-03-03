"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Visit } from "@/types/visit";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface FlexPieChartProps {
  data: Visit[];
  className?: string;
}

const COLORS = [
  "#0ea5e9", // Sky 500
  "#10b981", // Emerald 500
  "#f59e0b", // Amber 500
  "#ef4444", // Red 500
  "#8b5cf6", // Violet 500
  "#ec4899", // Pink 500
  "#f97316", // Orange 500
  "#06b6d4", // Cyan 500
];

const FlexPieChart = ({
  data,
  className,
}: FlexPieChartProps) => {
  const t = useTranslations();

  const { chartData, totalAcrossAll } = useMemo(() => {
    const aggregation: Record<string, number> = {};

    const sourceData =
      data && data.length > 0
        ? data
        : [
            { category: t("c"), total_score: 450 },
            { category: t("a"), total_score: 300 },
            { category: t("b"), total_score: 150 },
            { category: t("d"), total_score: 100 },
          ];

    sourceData.forEach((visit: any) => {
      const category =
        visit.category ||
        visit.category_text ||
        t("Unclassified");
      const score = Number(visit.total_score) || 0;
      aggregation[category] =
        (aggregation[category] || 0) + score;
    });

    const entries = Object.entries(aggregation).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    const total = entries.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );

    return { chartData: entries, totalAcrossAll: total };
  }, [data, t]);

  return (
    <Card
      className={cn("w-full h-full min-h-100", className)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Total Score by Category")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-75 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
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
                value,
                t("Total Score"),
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

        {/* Center label for Total Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {t("Total")}
          </span>
          <span className="text-xl font-black text-slate-800">
            {totalAcrossAll}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlexPieChart;
