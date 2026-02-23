"use client";
import StatsSection from "@/components/common/stats-section/stats";
import { StatsCardProps } from "@/types/stats-card-props";
import React from "react";
import {
  Calendar,
  CircleCheckBig,
  Clock,
  Star,
  Store,
  TrendingUp,
  User,
  User2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetBranchStatsQuery } from "@/services/api/branches";
import { useAppSelector } from "@/lib/store";

const BranchStats = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);
  const { data: branchStats, isLoading } =
    useGetBranchStatsQuery(String(user?.branch_id));

  console.log("branchStats", branchStats);

  const statsConfig: StatsCardProps[] = [
    {
      title: "10",
      subtitle: t("Total users"),
      icon: <User2 />,
      Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "",
        badgeIcon: <User />,
      },
    },
    {
      title: "4",
      subtitle: t("Completed visits"),
      icon: <CircleCheckBig />,
      Badge: {
        variant: "secondary",
        className: "bg-cyan-500/10 text-cyan-700",
        badgeTitle: "",
        badgeIcon: <CircleCheckBig />,
      },
    },
    {
      title: "2",
      subtitle: t("Pending visits"),
      icon: <Clock />,
      Badge: {
        variant: "secondary",
        className: "bg-amber-500/10 text-amber-700",
        badgeTitle: "+2",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: "4",
      subtitle: t("Average visit rating"),
      icon: <Star />,
      Badge: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-700",
        badgeTitle: "2%",
        badgeIcon: <TrendingUp />,
      },
    },
  ];

  return <StatsSection statsConfig={statsConfig} />;
};

export default BranchStats;
