"use client";

import React from "react";
import { useTranslations } from "next-intl";
import StatsCard from "@/components/dashboard/stats-card/stats-card";
import {
  ClipboardCheck,
  TrendingUp,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

interface BranchReportsStatsProps {
  statistics: {
    total_visits: number;
    avg_score: number;
    visits_this_month: number;
  };
  branch_info: {
    compliance_score: string;
  };
}

const BranchReportsStats = ({
  statistics,
  branch_info,
}: BranchReportsStatsProps) => {
  const t = useTranslations();

  const stats = [
    {
      title: statistics?.total_visits?.toString() || "0",
      subtitle: t("Total Visits"),
      icon: (
        <ClipboardCheck className="h-4 w-4 text-blue-500" />
      ),
    },
    {
      title: `${statistics?.avg_score || 0}%`,
      subtitle: t("Overall Score"),
      icon: (
        <TrendingUp className="h-4 w-4 text-orange-500" />
      ),
    },
    {
      title:
        statistics?.visits_this_month?.toString() || "0",
      subtitle: t("Visits This Month"),
      icon: (
        <CalendarDays className="h-4 w-4 text-purple-500" />
      ),
    },
    {
      title: branch_info?.compliance_score || "0.00",
      subtitle: t("Compliance Score"),
      icon: (
        <ShieldCheck className="h-4 w-4 text-green-500" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          subtitle={stat.subtitle}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default BranchReportsStats;
