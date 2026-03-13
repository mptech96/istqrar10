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
import { motion } from "motion/react";
import StatsCard from "../stats-card/stats-card";

import RatingPie from "./rating-pie";
import VisitRadialBar from "./visit-radial-bar";

const BranchStats = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);
  const { data: branchStats, isLoading } =
    useGetBranchStatsQuery(String(user?.branch_id));

  const statsConfig: StatsCardProps[] = [
    {
      title: "2",
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
      title: branchStats?.statistics?.total_visits || 5,
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
      title:
        branchStats?.statistics?.open_tickets.length || 3,
      subtitle: t("Pending tickets"),
      icon: <Clock />,
      Badge: {
        variant: "secondary",
        className: "bg-amber-500/10 text-amber-700",
        badgeTitle: "+2",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: branchStats?.statistics?.avg_score || 4.3,
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
              Badge={stat.Badge}
            />
          </motion.div>
        ))}
      </div>
      <div className="">
        <RatingPie />
      </div>
      <VisitRadialBar />
    </div>
  );
};

export default BranchStats;
