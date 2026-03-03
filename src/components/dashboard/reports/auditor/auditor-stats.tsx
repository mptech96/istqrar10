import React from "react";
import StatsCard from "@/components/dashboard/stats-card/stats-card";
import { useTranslations } from "next-intl";
import {
  Calendar,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react";
import { AuditorReport } from "@/types/report";

interface AuditorStatsProps {
  statistics: AuditorReport["statistics"];
}

const AuditorStats = ({
  statistics,
}: AuditorStatsProps) => {
  const t = useTranslations();

  const statsList = [
    {
      title: statistics?.total_visits || 0,
      subtitle: t("Total Visits"),
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
    },
    {
      title: statistics?.completed_visits || 0,
      subtitle: t("Completed Visits"),
      icon: (
        <CheckCircle className="h-6 w-6 text-emerald-500" />
      ),
    },
    {
      title: statistics?.in_progress_visits || 0,
      subtitle: t("In Progress Visits"),
      icon: <Clock className="h-6 w-6 text-amber-500" />,
    },
    {
      title: `${statistics?.avg_score || 0}%`,
      subtitle: t("Average Score"),
      icon: <Trophy className="h-6 w-6 text-violet-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsList.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title.toString()}
          subtitle={stat.subtitle}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default AuditorStats;
