"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { useTranslations } from "next-intl";
import { AuditorReport } from "@/types/report";

interface AuditorMonthlyChartProps {
  data: AuditorReport["visits_by_month"];
}

const AuditorMonthlyChart = ({
  data,
}: AuditorMonthlyChartProps) => {
  const t = useTranslations();

  // Format data for Recharts
  const chartData = data.map((item) => ({
    name: item.month,
    visits: item.count,
    score: parseFloat(item.avg_percentage),
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("Monthly Visits Trend")}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={true}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
            />
            <Bar
              yAxisId="left"
              dataKey="visits"
              name={t("Visits Count")}
              fill="#E4E9F2"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="score"
              name={t("Average Score")}
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AuditorMonthlyChart;
