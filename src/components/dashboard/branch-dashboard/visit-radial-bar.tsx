"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
  LegendPayload,
  DefaultLegendContentProps,
} from "recharts";

interface CustomSectorProps {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  payload: {
    name: string;
    value: number;
  };
}
import { useGetBranchStatsQuery } from "@/services/api/branches";
import { useAppSelector } from "@/lib/store";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

// --- Context & Types ---

type SelectedLabelState = {
  selectedLabel: string | undefined;
  setSelectedLabel: (label: string | undefined) => void;
};

const SelectedLabelContext =
  createContext<SelectedLabelState>({
    selectedLabel: undefined,
    setSelectedLabel: () => {},
  });

// --- Sub-components ---

const CustomSector = (props: CustomSectorProps) => {
  const { selectedLabel, setSelectedLabel } = useContext(
    SelectedLabelContext,
  );
  const isSelected =
    props.payload.name === selectedLabel ||
    selectedLabel == null;

  return (
    <Sector
      {...props}
      onClick={() => setSelectedLabel(props.payload.name)}
      fill={props.fill}
      fillOpacity={isSelected ? 1 : 0.2}
      className="cursor-pointer transition-opacity duration-300 ease-in-out"
    />
  );
};

const LegendItem = ({
  entry,
}: {
  entry: LegendPayload;
}) => {
  const { selectedLabel, setSelectedLabel } = useContext(
    SelectedLabelContext,
  );
  const label = entry.value;
  const isSelected =
    selectedLabel === label || selectedLabel == null;

  return (
    <li
      onClick={() => setSelectedLabel(label)}
      className="flex items-center gap-2 cursor-pointer transition-opacity duration-300 ease-in-out py-1 hover:bg-slate-50 rounded-md px-2"
      style={{
        opacity: isSelected ? 1 : 0.3,
      }}
    >
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: entry.color }}
      />
      <span
        className="text-[11px] font-medium truncate"
        style={{
          color: isSelected ? "inherit" : "#94a3b8",
        }}
      >
        {label}
      </span>
    </li>
  );
};

const LegendContent = ({
  payload,
}: DefaultLegendContentProps) => {
  return (
    <ul className="flex flex-col gap-1 ml-4 overflow-y-auto max-h-62.5">
      {payload?.map((entry, index) => (
        <LegendItem key={`item-${index}`} entry={entry} />
      ))}
    </ul>
  );
};

// --- Main Component ---

const mockRadialData = [
  { name: "Health & Safety", value: 85, fill: "#3b82f6" },
  { name: "Cleanliness", value: 72, fill: "#10b981" },
  { name: "Maintenance", value: 65, fill: "#f59e0b" },
  { name: "Service Quality", value: 90, fill: "#ef4444" },
  { name: "Compliance", value: 78, fill: "#6366f1" },
];

import { skipToken } from "@reduxjs/toolkit/query";

const VisitRadialBar = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);

  const branchId =
    user?.branch_id &&
    String(user?.branch_id) !== "undefined"
      ? Number(user.branch_id)
      : skipToken;

  const { data: branchStats, isLoading } =
    useGetBranchStatsQuery(branchId);

  const [selectedLabel, setSelectedLabel] = useState<
    string | undefined
  >(undefined);

  const providerValue = useMemo(
    () => ({
      selectedLabel: selectedLabel,
      setSelectedLabel: (newLabel: string | undefined) =>
        setSelectedLabel((curr) =>
          curr === newLabel ? undefined : newLabel,
        ),
    }),
    [selectedLabel],
  );

  const chartData = useMemo(() => {
    if (!branchStats?.statistics?.checklist_breakdown) {
      return mockRadialData.map((item) => ({
        ...item,
        name: t(item.name),
      }));
    }

    return branchStats.statistics.checklist_breakdown.map(
      (
        item: { name: string; score?: number },
        index: number,
      ) => ({
        name: item.name,
        value: item.score || 0,
        fill: [
          "#3b82f6",
          "#10b981",
          "#6b7280",
          "#ef4444",
          "#6366f1",
        ][index % 5],
      }),
    );
  }, [branchStats, t]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-75">
          <Skeleton className="h-56 w-56 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <SelectedLabelContext.Provider value={providerValue}>
      <Card className="h-full min-h-100">
        <CardHeader>
          <CardTitle>{t("Checklist Results")}</CardTitle>
          <CardDescription>
            {t(
              "Average performance scores by checklist category",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="15%"
                outerRadius="95%"
                barSize={20}
                data={chartData}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={CustomSector as any}
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
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={<LegendContent />}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </SelectedLabelContext.Provider>
  );
};

export default VisitRadialBar;
