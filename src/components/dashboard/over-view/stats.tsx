"use client";

import StatsSection from "@/components/common/stats-section/stats";
import { StatsCardProps } from "@/types/stats-card-props";
import {
  Store,
  TrendingUp,
  CircleCheckBig,
  Calendar,
  Users,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetSuperAdminStatsQuery } from "@/services/api/stats";
import { useAppSelector } from "@/lib/store";

const OverViewStats = () => {
  const t = useTranslations();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetSuperAdminStatsQuery(
    {},
  );
  console.log(data);
  if (user?.role !== "super_admin") {
    return null;
  }
  const statsConfig: StatsCardProps[] = [
    {
      title: data?.statistics?.total_companies,
      subtitle: t("Total Registered Companies"),
      icon: <Store />,
      Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "+6",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: data?.statistics?.total_visits,
      subtitle: t("Total daily visits"),
      icon: <Calendar />,
      Badge: {
        variant: "secondary",
        className: "bg-gray-100 text-gray-700",
        badgeTitle: "",
        badgeIcon: <CircleCheckBig />,
      },
    },
    {
      title: data?.statistics?.total_auditors,
      subtitle: t("inspectors"),
      icon: <Users />,
      Badge: {
        variant: "secondary",
        className: "bg-cyan-500/10 text-cyan-700",
        badgeTitle: "+2",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: data?.statistics?.avg_percentage,
      subtitle: t("Average rating"),
      icon: <Star />,
      Badge: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-700",
        badgeTitle: "2%",
        badgeIcon: <TrendingUp />,
      },
    },
  ];

  return (
    <div className="">
      <StatsSection statsConfig={statsConfig} />
    </div>
  );
};

export default OverViewStats;
